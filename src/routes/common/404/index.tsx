import { component$ } from "@builder.io/qwik";
import { H0, H1, H3 } from "~/components/ui/typography";

export default component$(() => {
  return (
    <section class="container flex flex-col items-center gap-8 pt-16 md:max-w-3xl">
      <H0>404 - Not found Error</H0>
      <H1>Oops... Something went wrong...</H1>
      <H3>We are not able to find the resource requested</H3>
    </section>
  );
});
