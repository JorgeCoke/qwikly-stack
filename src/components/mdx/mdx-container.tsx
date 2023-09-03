import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";
import styles from "./styles.css?inline";

type ContainerProps = {
  class?: string;
};

export const MdxContainer = component$<ContainerProps>((props) => {
  useStyles$(styles);

  return (
    <article
      class={cn("container py-12 text-black dark:text-white", props.class)}
    >
      <Slot />
    </article>
  );
});
