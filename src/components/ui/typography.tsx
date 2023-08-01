import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

type TypographyProps = {
  class?: string;
};

export const H0 = component$<TypographyProps>((props: any) => {
  return (
    <h1
      class={twMerge(
        "py-2 text-4xl font-bold text-slate-100 sm:text-5xl md:text-6xl lg:text-7xl",
        props.class
      )}
    >
      <Slot />
    </h1>
  );
});

export const H1 = component$<TypographyProps>((props: any) => {
  return (
    <h1
      class={twMerge(
        "py-2 text-3xl font-bold text-slate-100 sm:text-4xl",
        props.class
      )}
    >
      <Slot />
    </h1>
  );
});
