import { component$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { AnchorButton, Button } from "~/components/ui/buttons";
import { Table, TableCell, TableHead, TableRow } from "~/components/ui/table";
import { Gradient, H1, H2 } from "~/components/ui/typography";
import { db } from "~/lib/db/kysely";
import { StripeEventType } from "~/lib/db/schema";
import { auth } from "~/lib/lucia-auth";
import { stripe } from "~/lib/stripe";
import { ToastType, withToast } from "~/lib/toast";
import { useSendSetPasswordEmail, useSession } from "~/routes/layout";

export const useCancelSubscription = routeAction$(async (input, event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session?.user.userId) {
    throw event.redirect(302, "/");
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
  withToast(event, ToastType.success, "Subscription cancelled succesfully!");
});

export const useStripeEventsFromSession = routeLoader$(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session?.user.userId) {
    throw event.redirect(302, "/");
  }

  return await db
    .selectFrom("stripe_event")
    .innerJoin(
      "stripe_product",
      "stripe_product.id",
      "stripe_event.stripe_product_id"
    )
    .selectAll("stripe_event")
    .select([
      "stripe_product.name",
      "stripe_product.amount",
      "stripe_product.currency",
    ])
    .where("stripe_event.user_id", "is", session.user.userId)
    .orderBy("created_at", "desc")
    .execute();
});

export const useCurrentSubscription = routeLoader$(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session?.user.userId) {
    throw event.redirect(302, "/");
  }
  return await db
    .selectFrom("stripe_event")
    .innerJoin(
      "stripe_product",
      "stripe_product.id",
      "stripe_event.stripe_product_id"
    )
    .selectAll()
    .where("stripe_event.user_id", "is", session.user.userId)
    .where("type", "in", [
      StripeEventType.SubscriptionDeleted,
      StripeEventType.SubscriptionUpdated,
    ])
    .orderBy("created_at", "desc")
    .executeTakeFirst();
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
      <p class="flex items-center gap-4 text-white">
        Current Subscription:{" "}
        {currentSubscription.value?.type === StripeEventType.SubscriptionUpdated
          ? currentSubscription.value.name
          : "none"}
        <Button
          aria-label="Cancel subscription button"
          disabled={
            currentSubscription.value?.type !==
            StripeEventType.SubscriptionUpdated
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
          onClick$={() => sendSetPasswordEmail.submit({ email: null })}
        >
          Reset Password
        </Button>
        <AnchorButton
          href="/auth/log-out"
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
          <TableRow key={e.id}>
            <TableCell>{e.type}</TableCell>
            <TableCell>{e.name}</TableCell>
            <TableCell>
              {[
                StripeEventType.CheckoutProduct,
                StripeEventType.CheckoutSubscription,
              ].includes(e.type)
                ? `${e.amount / 100} ${e.currency}`
                : null}
            </TableCell>
            <TableCell>{e.created_at.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
});
