import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

// TODO: add Types & HtmlButtonPropTypes
// TODO: improve styles
type ButtonProps = {
  variant?: "default" | "outline";
  color?: "primary" | "danger";
} & any;

const mergeButtonStyles = (props: any): string => {
  const variants: any = {
    default:
      "dark:text-black text-white dark:bg-slate-200 bg-slate-800 dark:hover:bg-slate-400 hover:bg-slate-700 border border-transparent",
    outline:
      "dark:text-slate-200 text-slate-800 bg-transparent dark:hover:bg-slate-800 hover:bg-slate-300 border dark:border-slate-400 border-slate-800",
    ghost: "bg-transparent text-black dark:text-white border-transparent",
  };

  const colors: any = {
    primary: "",
    danger:
      props.variant === "outline"
        ? "text-red-500 border-red-500 dark:text-red-500 dark:border-red-500"
        : "bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white dark:text-white",
  };

  const classes = [
    "inline-block rounded-md px-3 py-2 text-sm font-semibold transition-all",
  ];
  if (props.disabled) {
    classes.push("opacity-50");
  }

  return twMerge(
    ...classes,
    variants[props.variant || "default"],
    colors[props.color || "primary"],
    props.class
  );
};

export const Button = component$<ButtonProps>((props) => {
  return (
    <button {...props} class={mergeButtonStyles(props)}>
      <Slot />
    </button>
  );
});

export const AnchorButton = component$<ButtonProps>((props) => {
  return (
    <a {...props} class={mergeButtonStyles(props)}>
      <Slot />
    </a>
  );
});
