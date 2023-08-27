import { component$ } from "@builder.io/qwik";
import { H1, H5 } from "~/components/ui/typography";

export default component$(() => {
  return (
      <div class="text-center py-12">
        <H1>Admin dashboard</H1>
        <H5>
          You are logged as an admin user! You can manage your data from here
          securely
        </H5>
      </div>
  );
});
