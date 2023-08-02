import { Slot, component$ } from "@builder.io/qwik";

// TODO: Styles are not working
export const MdxContainer = component$(() => {
  return (
    <section class="container text-white">
      <Slot />
    </section>
  );
});
