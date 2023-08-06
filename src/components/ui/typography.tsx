import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

export type TypographyProps = {
  class?: string;
};

export const H0 = component$<TypographyProps>((props: any) => {
  return (
    <h1
      class={twMerge(
        "pb-2 text-4xl font-bold text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl lg:text-7xl",
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
        "pb-2 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl",
        props.class
      )}
    >
      <Slot />
    </h1>
  );
});

export const H2 = component$<TypographyProps>((props: any) => {
  return (
    <h1
      class={twMerge(
        "pb-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl",
        props.class
      )}
    >
      <Slot />
    </h1>
  );
});

export const H3 = component$<TypographyProps>((props: any) => {
  return (
    <h1
      class={twMerge(
        "pb-1 text-xl font-medium text-slate-900 dark:text-slate-100 sm:text-2xl",
        props.class
      )}
    >
      <Slot />
    </h1>
  );
});

export const H5 = component$<TypographyProps>((props: any) => {
  return (
    <h1
      class={twMerge("text-lg text-slate-500 dark:text-slate-400", props.class)}
    >
      <Slot />
    </h1>
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
