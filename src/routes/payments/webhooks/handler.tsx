import type Stripe from "stripe";
import { signJwt } from "~/lib/crypto";
import { db } from "~/lib/db/kysely";
import { StripeEventType, UserRole } from "~/lib/db/schema";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { sendSetPasswordEmail } from "~/lib/mail/mailer";
import { stripe } from "~/lib/stripe";

async function getProductAndUser(priceId: string, customerId: string) {
  const product = await db
    .selectFrom("stripe_product")
    .selectAll()
    .where("price_id", "is", priceId)
    .executeTakeFirst();
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
    .selectFrom("user")
    .selectAll()
    .where("email", "is", customer.email)
    .executeTakeFirst();
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
          .selectFrom("user")
          .selectAll()
          .where("user.email", "is", customerEmail)
          .executeTakeFirst();
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
            .selectFrom("user")
            .selectAll()
            .where("user.email", "is", customerEmail)
            .executeTakeFirst();
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
          .selectFrom("stripe_product")
          .selectAll()
          .where("price_id", "is", item.price.id)
          .executeTakeFirst();
        if (!product) {
          throw new Error("product not found");
        }

        await db
          .insertInto("stripe_event")
          .values({
            id: session.id,
            type: session.subscription
              ? StripeEventType.CheckoutSubscription
              : StripeEventType.CheckoutProduct,
            stripe_product_id: product.id,
            user_id: user.id,
          })
          .execute();
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
            .insertInto("stripe_event")
            .values({
              id: subscriptionUpdated.id,
              type: StripeEventType.SubscriptionUpdated,
              stripe_product_id: product.id,
              user_id: user.id,
            })
            .execute();
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
          .insertInto("stripe_event")
          .values({
            id: `${subscriptionDeleted.id}_DELETED`,
            type: StripeEventType.SubscriptionDeleted,
            stripe_product_id: product.id,
            user_id: user.id,
          })
          .execute();
      } catch (err: any) {
        throw new Error(err?.message || "Internal server error");
      }
      break;
    default:
      throw new Error(`Unhandled event type ${stripeEvent.type}`);
  }
  return { message: "ok" };
};
