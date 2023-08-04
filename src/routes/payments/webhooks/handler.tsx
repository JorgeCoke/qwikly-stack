import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { signJwt } from "~/lib/crypto";
import { db } from "~/lib/db/drizzle";
import {
  StripeEventType,
  UserRole,
  stripeEvents,
  stripeProducts,
  users,
} from "~/lib/db/schema";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { sendSetPasswordEmail } from "~/lib/mail/mailer";
import { stripe } from "~/lib/stripe";

async function getProductAndUser(priceId: string, customerId: string) {
  const product = await db
    .select()
    .from(stripeProducts)
    .where(eq(stripeProducts.priceId, priceId))
    .get();
  if (!product) {
    throw new Error("product not found");
  }
  const customer = (await stripe.customers.retrieve(
    customerId
  )) as Stripe.Response<Stripe.Customer>;
  if (!customer.email) {
    throw new Error("customer not found");
  }
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, customer.email))
    .get();
  if (!user) {
    throw new Error("user not found");
  }
  return { product, user };
}

export const webhookHandler = async (stripeEvent: Stripe.Event) => {
  console.log(`Received stripeEvent: ${stripeEvent.type}`);

  // Handle Stripe.Event
  switch (stripeEvent.type) {
    case "checkout.session.completed":
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;

      // Save only completed checkouts
      if (session.status === "complete") {
        // Check if session has user email
        if (!customerEmail) {
          throw new Error("Customer email not defined");
        }

        let user = await db
          .select()
          .from(users)
          .where(eq(users.email, customerEmail))
          .get();

        if (!user) {
          await auth.createUser({
            key: {
              providerId: CREDENTIALS_PROVIDER_ID,
              providerUserId: customerEmail,
              password: null,
            },
            attributes: {
              email: customerEmail,
              name: null,
              role: UserRole.Admin,
            },
          });
          user = await db
            .select()
            .from(users)
            .where(eq(users.email, customerEmail))
            .get();
          const token = await signJwt({ email: customerEmail }, 24 * 60 * 60);
          sendSetPasswordEmail(
            { to: customerEmail },
            { url: `${process.env.ORIGIN}auth/set-password?token=${token}` }
          );
        }
        if (!user) {
          throw new Error("user not found or could not be created");
        }

        // Get product (lineItem) from stripe (allowed only one by one)
        const lineItems = (
          await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["line_items"],
          })
        ).line_items?.data;
        if (!lineItems || lineItems.length !== 1 || !lineItems[0].price?.id) {
          throw new Error("line_items.length must be 1");
        }
        const item = lineItems[0];
        if (!item.price?.id) {
          throw new Error("line_item price not found");
        }
        const product = await db
          .select()
          .from(stripeProducts)
          .where(eq(stripeProducts.priceId, item.price.id))
          .get();
        if (!product) {
          throw new Error("product not found");
        }

        await db
          .insert(stripeEvents)
          .values({
            id: session.id,
            type: session.subscription
              ? StripeEventType.CheckoutSubscription
              : StripeEventType.CheckoutProduct,
            stripeProductId: product.id,
            userId: user.id,
          })
          .run();
      }

      break;
    case "customer.subscription.updated":
      const subscriptionUpdated = stripeEvent.data
        .object as Stripe.Subscription;
      if (subscriptionUpdated.status === "active") {
        const priceId = subscriptionUpdated.items.data[0]?.price.id;
        const customerId = subscriptionUpdated.customer as string;
        try {
          const { product, user } = await getProductAndUser(
            priceId,
            customerId
          );
          await db
            .insert(stripeEvents)
            .values({
              id: subscriptionUpdated.id,
              type: StripeEventType.SubscriptionUpdated,
              stripeProductId: product.id,
              userId: user.id,
            })
            .run();
        } catch (err: any) {
          throw new Error(err?.message || "Internal server error");
        }
      }
      break;
    case "customer.subscription.deleted":
      const subscriptionDeleted = stripeEvent.data
        .object as Stripe.Subscription;
      const priceId = subscriptionDeleted.items.data[0]?.price.id;
      const customerId = subscriptionDeleted.customer as string;
      try {
        const { product, user } = await getProductAndUser(priceId, customerId);
        await db
          .insert(stripeEvents)
          .values({
            id: `${subscriptionDeleted.id}_DELETED`,
            type: StripeEventType.SubscriptionDeleted,
            stripeProductId: product.id,
            userId: user.id,
          })
          .run();
      } catch (err: any) {
        throw new Error(err?.message || "Internal server error");
      }
      break;
    default:
      throw new Error(`Unhandled event type ${stripeEvent.type}`);
  }
  return { message: "ok" };
};
