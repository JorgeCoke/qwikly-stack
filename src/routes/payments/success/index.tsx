import { component$ } from "@builder.io/qwik";
import { H0, H1, H3 } from "~/components/ui/typography";

export default component$(() => {
  return (
    <section class="container flex flex-col items-center gap-8 pt-16 md:max-w-3xl">
      <H0>Success!</H0>
      <H1>Payment successful</H1>
      <H3>Thank you for your purchase!</H3>
    </section>
  );
});
