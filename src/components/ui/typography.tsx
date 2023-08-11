import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

export type TypographyProps = {
  class?: string;
};

export const H0 = component$<TypographyProps>((props: any) => {
  return (
    <h1
      class={twMerge(
        "pb-2 text-5xl font-semibold text-slate-900 dark:text-slate-100 md:text-6xl lg:text-7xl",
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
        "pb-2 text-3xl font-semibold text-slate-900 dark:text-slate-100 md:text-5xl",
        props.class
      )}
    >
      <Slot />
    </h1>
  );
});

export const H2 = component$<TypographyProps>((props: any) => {
  return (
    <h2
      class={twMerge(
        "pb-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl",
        props.class
      )}
    >
      <Slot />
    </h2>
  );
});

export const H3 = component$<TypographyProps>((props: any) => {
  return (
    <h3
      class={twMerge(
        "pb-1 text-xl font-medium text-slate-900 dark:text-slate-100 sm:text-2xl",
        props.class
      )}
    >
      <Slot />
    </h3>
  );
});

export const H5 = component$<TypographyProps>((props: any) => {
  return (
    <h5
      class={twMerge("text-lg text-slate-500 dark:text-slate-400", props.class)}
    >
      <Slot />
    </h5>
  );
});

export const Gradient = component$<TypographyProps>((props: any) => {
  return (
    <span
      class={twMerge(
        "bg-gradient-to-tr from-blue-600 to-violet-400 bg-clip-text text-transparent",
        props.class
      )}
    >
      <Slot />
    </span>
  );
});
