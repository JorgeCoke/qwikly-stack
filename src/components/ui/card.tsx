import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

type CardProps = {
  class?: string;
};

export const Card = component$<CardProps>((props) => {
  return (
    <div
      class={twMerge(
        " rounded-md border border-white/[.1] bg-slate-950 px-3 py-2",
        props.class
      )}
    >
      <Slot />
    </div>
  );
});
