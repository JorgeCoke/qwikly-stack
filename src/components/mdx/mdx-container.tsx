import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import styles from "./styles.css?inline";

export const MdxContainer = component$(() => {
  useStyles$(styles);

  return (
    <article class="container py-12 text-black dark:text-white">
      <Slot />
    </article>
  );
});
