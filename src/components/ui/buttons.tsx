import { Slot, component$ } from "@builder.io/qwik";
import type { JSX } from "@builder.io/qwik/jsx-runtime";
import { cn } from "~/lib/utils";

type Color = "primary" | "danger";
type Variant = "default" | "outline" | "ghost";
type Size = "default" | "wide";

type ButtonProps = {
  variant?: Variant;
  color?: Color;
  disabled?: boolean;
  size?: Size;
  class?: string;
};

const mergeStyles = (props: ButtonProps): string => {
  props = {
    variant: "default",
    color: "primary",
    disabled: false,
    size: "default",
    class: "",
    ...props,
  };

  const colors: { [key in Color]: { [key in Variant]: string } } = {
    primary: {
      default:
        "dark:text-black text-white dark:bg-slate-200 bg-slate-800 dark:hover:bg-slate-400 hover:bg-slate-700 border border-transparent",
      outline:
        "dark:text-slate-200 text-slate-800 bg-transparent dark:hover:bg-slate-800 hover:bg-slate-300 border dark:border-slate-400 border-slate-800",
      ghost:
        "bg-transparent text-black dark:text-white border-transparent hover:bg-slate-300 dark:hover:bg-slate-800",
    },
    danger: {
      default:
        "bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white dark:text-white",
      outline:
        "dark:text-red-500 text-red-500 bg-transparent dark:hover:bg-red-950 hover:bg-red-100 border dark:border-red-500 border-red-500",
      ghost:
        "bg-transparent text-red-500 dark:text-red-500 border-transparent hover:bg-red-100 dark:hover:bg-red-950",
    },
  };

  return cn(
    "inline-block rounded-md p-2 text-sm font-semibold transition-all leading-4 whitespace-nowrap flex justify-center items-center gap-2",
    props.disabled && "opacity-50 pointer-events-none",
    props.size === "wide" && "px-6 py-2",
    colors[props.color!][props.variant!],
    props.class,
  );
};

export const Button = component$<ButtonProps & JSX.IntrinsicElements["button"]>(
  (props) => {
    return (
      <button {...props} class={mergeStyles(props)}>
        <Slot />
      </button>
    );
  },
);

export const AnchorButton = component$<
  ButtonProps & JSX.IntrinsicElements["a"] & { href: string }
>((props) => {
  return (
    <a {...props} class={mergeStyles(props)}>
      <Slot />
    </a>
  );
});
