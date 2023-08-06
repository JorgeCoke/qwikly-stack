import type { PropFunction } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

type CardProps = {
  class?: string;
  onClick$?: PropFunction<() => void>;
};

export const Card = component$<CardProps>((props) => {
  return (
    <div
      class={twMerge(
        "rounded-md border border-black/[.1] bg-white px-3 py-2 dark:border-white/[.1] dark:bg-slate-950",
        props.onClick$ ? "cursor-pointer" : "",
        props.class
      )}
      onClick$={props.onClick$}
    >
      <Slot />
    </div>
  );
});
