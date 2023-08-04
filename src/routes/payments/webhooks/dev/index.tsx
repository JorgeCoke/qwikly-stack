import type { RequestHandler } from "@builder.io/qwik-city";
import type Stripe from "stripe";
import { stripe } from "~/lib/stripe";
import { webhookHandler } from "../handler";

export const onPost: RequestHandler = async (event) => {
  const body = await event.request.body
    ?.getReader()
    .read()
    .then((res) => (res.value ? Buffer.from(res.value).toString() : null));

  let stripeEvent: Stripe.Event | null = null;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body!,
      event.request.headers.get("stripe-signature")!,
      event.env.get("STRIPE_WEBHOOK_SECRET")!
    );
    const result = await webhookHandler(stripeEvent);
    event.json(200, result);
  } catch (err) {
    throw event.error(400, "Webhook signature verification failed");
  }
};
