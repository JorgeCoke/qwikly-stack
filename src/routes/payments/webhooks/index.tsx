import type { RequestHandler } from "@builder.io/qwik-city";
import type Stripe from "stripe";
import { db } from "~/lib/db/kysely";
import { StripeEventType, UserRole } from "~/lib/db/schema";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
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

export const onPost: RequestHandler = async (event) => {
  // Get raw body and signatures
  const body = await event.request.body
    ?.getReader()
    .read()
    .then((res) => (res.value ? Buffer.from(res.value).toString() : null));
  const signature = event.request.headers.get("stripe-signature");
  if (!signature || !body) {
    throw event.error(404, "Body and signature headers are required");
  }

  // Create a Stripe.Event
  let stripeEvent: Stripe.Event | null = null;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      event.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    throw event.error(400, "Webhook signature verification failed");
  }

  console.log(`Received stripeEvent ${stripeEvent.type}`);

  // Handle Stripe.Event
  switch (stripeEvent.type) {
    case "checkout.session.completed":
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;

      // Save only completed checkouts
      if (session.status === "complete") {
        // Check if session has user email
        if (!customerEmail) {
          throw event.error(400, "Customer email not defined");
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
        }
        if (!user) {
          throw event.error(400, "user not found or could not be created");
        }

        // Get product (lineItem) from stripe (allowed only one by one)
        const lineItems = (
          await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["line_items"],
          })
        ).line_items?.data;
        if (!lineItems || lineItems.length !== 1 || !lineItems[0].price?.id) {
          throw event.error(400, "line_items.length must be 1");
        }
        const item = lineItems[0];
        if (!item.price?.id) {
          throw event.error(400, "line_item price not found");
        }
        const product = await db
          .selectFrom("stripe_product")
          .selectAll()
          .where("price_id", "is", item.price.id)
          .executeTakeFirst();
        if (!product) {
          throw event.error(400, "product not found");
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
          throw event.error(400, err?.message || "Internal server error");
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
        throw event.error(400, err?.message || "Internal server error");
      }
      break;
    default:
      throw event.error(400, `Unhandled event type ${stripeEvent.type}`);
  }
  event.json(200, { message: "ok" });
};
