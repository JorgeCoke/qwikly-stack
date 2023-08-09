import { component$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { desc, eq, inArray } from "drizzle-orm";
import { AnchorButton, Button } from "~/components/ui/buttons";
import { Table, TableCell, TableHead, TableRow } from "~/components/ui/table";
import { Gradient, H1, H2, H5 } from "~/components/ui/typography";
import { db } from "~/lib/db/drizzle";
import { StripeEventType, stripeEvents, stripeProducts } from "~/lib/db/schema";
import { auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { stripe } from "~/lib/stripe";
import { ToastType, withToast } from "~/lib/toast";
import { useSendSetPasswordEmail, useSession } from "~/routes/layout";

export const useCancelSubscription = routeAction$(async (input, event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session?.user.userId) {
    throw event.redirect(302, Router.index);
  }

  const customers = await stripe.customers.list({
    email: session.user.email!,
    limit: 99,
  });

  for (const customer of customers.data) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 99,
    });
    for (const subscription of subscriptions.data) {
      await stripe.subscriptions.cancel(subscription.id);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 2000)); // NOTE: Wait two seconds to receive Stripe Event in time
  withToast(event, ToastType.success, "Subscription cancelled succesfully!");
});

export const useStripeEventsFromSession = routeLoader$(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session?.user.userId) {
    throw event.redirect(302, Router.index);
  }

  return await db
    .select()
    .from(stripeEvents)
    .where(eq(stripeEvents.userId, session.user.userId))
    .orderBy(desc(stripeEvents.createdAt))
    .innerJoin(
      stripeProducts,
      eq(stripeEvents.stripeProductId, stripeProducts.id)
    )
    .all();
});

export const useCurrentSubscription = routeLoader$(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session?.user.userId) {
    throw event.redirect(302, Router.index);
  }
  return await db
    .select()
    .from(stripeEvents)
    .where(eq(stripeEvents.userId, session.user.userId))
    .where(
      inArray(stripeEvents.type, [
        StripeEventType.SubscriptionDeleted,
        StripeEventType.SubscriptionUpdated,
      ])
    )
    .orderBy(desc(stripeEvents.createdAt))
    .innerJoin(
      stripeProducts,
      eq(stripeEvents.stripeProductId, stripeProducts.id)
    )
    .get();
});

export default component$(() => {
  const session = useSession();
  const currentSubscription = useCurrentSubscription();
  const cancelSubscription = useCancelSubscription();
  const sendSetPasswordEmail = useSendSetPasswordEmail();

  return (
    <section class="container mx-auto flex max-w-4xl flex-col py-6">
      <H1>My profile</H1>
      <H2>
        <Gradient class="font-light">{session.value?.user.email}</Gradient>
      </H2>
      <BillingTable />
      <p class="flex items-center gap-4 text-black dark:text-white">
        Current Subscription:{" "}
        {currentSubscription.value?.stripe_event.type ===
        StripeEventType.SubscriptionUpdated
          ? currentSubscription.value?.stripe_product.name
          : "none"}
        <Button
          aria-label="Cancel subscription button"
          disabled={
            currentSubscription.value?.stripe_event.type !==
              StripeEventType.SubscriptionUpdated ||
            cancelSubscription.isRunning
          }
          variant="outline"
          onClick$={() => cancelSubscription.submit()}
        >
          Cancel
        </Button>
      </p>
      <div class="flex gap-4 pt-6">
        <Button
          aria-label="Reset password button"
          size="wide"
          disabled={sendSetPasswordEmail.isRunning}
          onClick$={() => sendSetPasswordEmail.submit({ email: null })}
        >
          Reset Password
        </Button>
        <AnchorButton
          href={Router.auth.logOut}
          size="wide"
          color="danger"
          aria-label="Logout button"
        >
          Log Out
        </AnchorButton>
      </div>
    </section>
  );
});

const BillingTable = component$(() => {
  const stripeEventsFromSession = useStripeEventsFromSession();
  return (
    <Table>
      <thead>
        <tr>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
        </tr>
      </thead>
      <tbody>
        {stripeEventsFromSession.value.map((e) => (
          <TableRow key={e.stripe_event.id}>
            <TableCell>{e.stripe_event.type}</TableCell>
            <TableCell>{e.stripe_product.name}</TableCell>
            <TableCell>
              {[
                StripeEventType.CheckoutProduct,
                StripeEventType.CheckoutSubscription,
              ].includes(e.stripe_event.type)
                ? `${e.stripe_product.amount / 100} ${
                    e.stripe_product.currency
                  }`
                : null}
            </TableCell>
            <TableCell>{e.stripe_event.createdAt.toLocaleString()}</TableCell>
          </TableRow>
        ))}
        {stripeEventsFromSession.value.length === 0 && (
          <TableRow>
            <TableCell>
              <H5>No billing data found</H5>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        )}
      </tbody>
    </Table>
  );
});
