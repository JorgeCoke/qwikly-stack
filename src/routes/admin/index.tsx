import { component$ } from "@builder.io/qwik";
import { AnchorButton } from "~/components/ui/buttons";
import { Gradient, H0, H5 } from "~/components/ui/typography";
import { Router } from "~/lib/router";

export default component$(() => {
  return (
    <section class="container  py-12">
      <div class="relative z-10 mx-auto max-w-[85rem] space-y-10 py-12">
        <div class="mx-auto max-w-3xl pt-12 text-center">
          <H0>
            This is your <Gradient>ADMIN</Gradient> landing page
          </H0>
        </div>

        <div class="mx-auto max-w-3xl text-center">
          <H5>
            Think it as a secure sub-application to manage all your data, under
            a controlled environment, securely
          </H5>
        </div>

        <div class="text-center">
          <AnchorButton
            aria-label="GetStarted button"
            class=" rounded-full bg-gradient-to-tl from-blue-600 to-violet-600 px-6 py-3  font-bold  text-white shadow-lg hover:shadow-blue-700/50  dark:text-white "
            href={Router.admin.access}
          >
            ACCESS ADMIN PANEL
          </AnchorButton>
        </div>
      </div>
    </section>
  );
});
