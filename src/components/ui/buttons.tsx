import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

// TODO: add Types & HtmlButtonPropTypes
type ButtonProps = {
  variant?: "default" | "outline";
  color?: "primary" | "danger";
} & any;

const mergeButtonStyles = (props: any): string => {
  const variants: any = {
    default:
      "text-black bg-slate-200 hover:bg-slate-400 border border-transparent",
    outline:
      "text-slate-200 bg-transparent hover:bg-slate-800 border border-slate-400",
  };

  const colors: any = {
    primary: "",
    danger:
      props.variant === "outline"
        ? "text-red-500 border-red-500"
        : "bg-red-500 hover:bg-red-600 text-white",
  };

  return twMerge(
    "inline-block rounded-md px-3 py-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-slate-950",
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
