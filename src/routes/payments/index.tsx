import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";
import type Stripe from "stripe";
import { Button } from "~/components/ui/buttons";
import { Card } from "~/components/ui/card";
import { Gradient, H0, H1, H2, H3 } from "~/components/ui/typography";
import { db } from "~/lib/db/kysely";
import type { StripeProduct } from "~/lib/db/schema";
import { StripeEventType } from "~/lib/db/schema";
import { auth } from "~/lib/lucia-auth";
import { stripe } from "~/lib/stripe";
import { ToastType, withToast } from "~/lib/toast";

export const useProducts = routeLoader$(async (event) => {
  const getProductPricesFromStripe = async () =>
    await stripe.prices
      .list({
        active: true,
        limit: 100,
        expand: ["data.product"],
        type: "one_time",
      })
      .then((res) =>
        res.data.filter((e) => (e.product as Stripe.Product).active)
      );

  let productPricesFromStripe = await getProductPricesFromStripe();
  // TODO: Do not create Prices/Products here
  if (productPricesFromStripe.length === 0) {
    await stripe.prices.create({
      currency: "EUR",
      unit_amount: 1000,
      product_data: {
        name: "Example Product",
        metadata: { description: "Foo bar metadata description..." },
      },
    });
    productPricesFromStripe = await getProductPricesFromStripe();
  }
  // end TODO:
  for (const productPriceFromStripe of productPricesFromStripe) {
    const product = await db
      .selectFrom("stripe_product")
      .selectAll()
      .where("id", "is", (productPriceFromStripe.product as Stripe.Product).id)
      .executeTakeFirst();
    if (!product) {
      await db
        .insertInto("stripe_product")
        .values({
          id: (productPriceFromStripe.product as Stripe.Product).id,
          amount: productPriceFromStripe.unit_amount || 99999,
          currency: productPriceFromStripe.currency,
          price_id: productPriceFromStripe.id,
          name: (productPriceFromStripe.product as Stripe.Product).name,
          metadata: JSON.stringify(
            (productPriceFromStripe.product as Stripe.Product).metadata
          ),
        })
        .execute();
    }
  }
  return await db
    .selectFrom("stripe_product")
    .selectAll()
    .where("recurring", "is", null)
    .execute();
});

export const useSubscriptions = routeLoader$(async (event) => {
  const getSubscriptionsPricesFromStripe = async () =>
    await stripe.prices
      .list({
        active: true,
        limit: 100,
        expand: ["data.product"],
        type: "recurring",
      })
      .then((res) =>
        res.data.filter((e) => (e.product as Stripe.Product).active)
      );

  let subscriptionPricesFromStripe = await getSubscriptionsPricesFromStripe();
  // TODO: Do not create Prices/Subscriptions here
  if (subscriptionPricesFromStripe.length === 0) {
    await stripe.prices.create({
      currency: "EUR",
      unit_amount: 99,
      recurring: {
        interval: "month",
      },
      product_data: {
        name: "Example Subscription",
        metadata: { description: "Foo bar metadata description..." },
      },
    });
    subscriptionPricesFromStripe = await getSubscriptionsPricesFromStripe();
  }
  // end TODO:
  for (const subscriptionPriceFromStripe of subscriptionPricesFromStripe) {
    const subscription = await db
      .selectFrom("stripe_product")
      .selectAll()
      .where(
        "id",
        "is",
        (subscriptionPriceFromStripe.product as Stripe.Product).id
      )
      .executeTakeFirst();
    if (!subscription) {
      await db
        .insertInto("stripe_product")
        .values({
          id: (subscriptionPriceFromStripe.product as Stripe.Product).id,
          amount: subscriptionPriceFromStripe.unit_amount || 99999,
          currency: subscriptionPriceFromStripe.currency,
          price_id: subscriptionPriceFromStripe.id,
          name: (subscriptionPriceFromStripe.product as Stripe.Product).name,
          metadata: JSON.stringify(
            (subscriptionPriceFromStripe.product as Stripe.Product).metadata
          ),
          recurring: JSON.stringify(subscriptionPriceFromStripe.recurring),
        })
        .execute();
    }
  }
  return await db
    .selectFrom("stripe_product")
    .selectAll()
    .where("recurring", "is not", null)
    .execute();
});

export const useBuyProduct = routeAction$(
  async (input, event) => {
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();

    // Get price
    const prices = await stripe.prices.list();
    const price = prices.data.find((e) => e.id === input.priceId);
    if (!price) {
      withToast(event, ToastType.error, "Can not load price from Stripe");
      return event.fail(400, {});
    }

    // If it is a subscription, check if user has any other subscription first
    if (price.type === "recurring" && session?.user) {
      const currentSubscription = await db
        .selectFrom("stripe_event")
        .selectAll()
        .where("stripe_event.user_id", "is", session.user.userId)
        .where("type", "in", [
          StripeEventType.SubscriptionDeleted,
          StripeEventType.SubscriptionUpdated,
        ])
        .orderBy("stripe_event.created_at", "desc")
        .executeTakeFirst();
      if (
        currentSubscription &&
        currentSubscription.type === StripeEventType.SubscriptionUpdated
      ) {
        withToast(
          event,
          ToastType.error,
          "You have already a subscription in progress, please, cancel it in your profile page and try again"
        );
        return event.fail(409, {});
      }
    }
    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: price.type === "one_time" ? "payment" : "subscription",
      payment_method_types: ["card"],
      customer_email: session?.user.email || undefined, // Link user.email if user is already registered
      cancel_url: `${event.env.get("ORIGIN")}/payments/error`,
      success_url: `${event.env.get("ORIGIN")}/payments/success`,
      line_items: [
        {
          price: price.id,
          quantity: 1,
          adjustable_quantity: {
            enabled: false,
          },
        },
      ],
    });
    if (!stripeSession.url) {
      withToast(event, ToastType.error, "User has not email linked");
      return event.fail(400, {});
    }
    return { url: stripeSession.url };
  },
  zod$({
    priceId: z.string(),
  })
);

export default component$(() => {
  const products = useProducts();
  const subscriptions = useSubscriptions();
  const buyProduct = useBuyProduct();
  const nav = useNavigate();

  return (
    <section class="container flex flex-col gap-6 py-6">
      <H0 class="text-center">Pricing</H0>
      <H1 class="text-center">
        Simple pricing. <Gradient>No hidden fees</Gradient>, no surprises
      </H1>
      <H2>One time payments</H2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        {products.value.map((e) => (
          <Card key={e.id} class="p-4">
            <Price product={e} />
            {e.metadata && (
              <p class="py-4 text-white">
                {JSON.parse(e.metadata).description}
              </p>
            )}
            <Button
              onClick$={() =>
                buyProduct
                  .submit({ priceId: e.price_id })
                  .then((res) => nav(res.value.url))
                  .catch((err) => {
                    alert(err);
                  })
              }
            >
              Buy
            </Button>
          </Card>
        ))}
      </div>
      <H2>Subscriptions</H2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        {subscriptions.value.map((e) => (
          <Card key={e.id} class="p-4">
            <Price product={e} />
            {e.metadata && (
              <p class="py-4 text-white">
                {JSON.parse(e.metadata).description}
              </p>
            )}
            <Button
              onClick$={() =>
                buyProduct
                  .submit({ priceId: e.price_id })
                  .then((res) => nav(res.value.url))
                  .catch((err) => {
                    alert(err);
                  })
              }
            >
              Buy
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
});

type PriceProps = {
  product: StripeProduct;
};
export const Price = component$<PriceProps>((props) => {
  const currencySymbol = props.product.currency === "eur" ? "€" : "$";

  return (
    <H3 class="text-white">
      {props.product.name}
      <Gradient class="pl-4 font-light">
        {props.product.amount / 100} {currencySymbol}{" "}
        {props.product.recurring &&
          `/ ${JSON.parse(props.product.recurring).interval}`}
      </Gradient>
    </H3>
  );
});
