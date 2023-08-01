import { component$ } from "@builder.io/qwik";
import { H0, H1, H3 } from "~/components/ui/typography";

export default component$(() => {
  return (
    <section class="container flex flex-col items-center gap-8 pt-16 md:max-w-3xl">
      <H0>Error!</H0>
      <H1>Something went wrong with the payment...</H1>
      <H3>No charge has been made, please try again</H3>
    </section>
  );
});
