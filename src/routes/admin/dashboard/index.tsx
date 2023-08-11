import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui/card";
import { H1, H5 } from "~/components/ui/typography";

export default component$(() => {
  return (
    <section class="container flex flex-col items-center pt-4">
      <Card class="w-full grow space-y-8 py-12 text-center">
        <H1>Admin dashboard</H1>
        <H5>
          You are logged as an admin user! You can manage your data from here
          securely
        </H5>
      </Card>
    </section>
  );
});
