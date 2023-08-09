import { component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";
import LucideSearch from "../icons/lucide-search";
import { Button } from "./buttons";

// TODO: add Types & HtmlInputPropTypes
type FormProps = {
  label?: string;
  description?: string;
} & any;

export const Input = component$<FormProps>((props: any) => {
  const classes = [];
  if (props.type === "hidden") {
    classes.push("hidden");
  }
  if (props.disabled) {
    classes.push("opacity-50");
  }

  return (
    <div class={twMerge("inline-flex w-full flex-col gap-1 py-2", ...classes)}>
      {props.label && (
        <label class="text-slate-900 dark:text-slate-100">
          {props.label}
          {props.required && <span class="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <input
        {...props}
        class="grow rounded-md bg-white p-2 leading-4 text-slate-800 ring-1 ring-inset ring-slate-300 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800"
      />
      {props.description && (
        <p class=" text-sm text-slate-600 dark:text-slate-400">
          {props.description}
        </p>
      )}
      {props.error && <p class="text-sm text-red-500">{props.error}</p>}
    </div>
  );
});

type SelectProps = {
  label?: string;
  description?: string;
  options: { label: string; value: string }[];
} & any;

export const Select = component$<SelectProps>((props: any) => {
  const classes = [];
  if (props.type === "hidden") {
    classes.push("hidden");
  }
  if (props.disabled) {
    classes.push("opacity-50");
  }

  return (
    <div class={twMerge("inline-flex w-full flex-col gap-1 py-2", ...classes)}>
      {props.label && (
        <label class="text-slate-900 dark:text-slate-100">
          {props.label}
          {props.required && <span class="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <select
        {...props}
        class="block w-full rounded-md bg-white p-2 leading-4 text-slate-800 ring-1 ring-inset ring-slate-300 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800 "
      >
        {props.options.map((e: { label: string; value: string }) => (
          <option
            key={e.value}
            value={e.value}
            selected={props.value === e.value}
          >
            {e.label}
          </option>
        ))}
      </select>
      {props.description && (
        <p class=" text-sm text-slate-400">{props.description}</p>
      )}
      {props.error && <p class="text-sm text-red-500">{props.error}</p>}
    </div>
  );
});

export const SearchInput = component$<FormProps>((props: any) => {
  const classes = [];
  if (props.type === "hidden") {
    classes.push("hidden");
  }
  if (props.disabled) {
    classes.push("opacity-50");
  }

  return (
    <div class={twMerge("inline-flex w-full flex-col gap-1 py-2", ...classes)}>
      {props.label && (
        <label class="text-slate-900 dark:text-slate-100">
          {props.label}
          {props.required && <span class="text-red-500">&nbsp;*</span>}
        </label>
      )}

      <div class="flex">
        <input
          {...props}
          class="grow rounded-md rounded-r-none bg-white px-2 leading-4 text-slate-800 ring-1 ring-inset ring-slate-300 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800"
        />
        <Button class="rounded-l-none">
          <LucideSearch class="h-4 w-4" />
        </Button>
      </div>
      {props.description && (
        <p class=" text-sm text-slate-600 dark:text-slate-400">
          {props.description}
        </p>
      )}
      {props.error && <p class="text-sm text-red-500">{props.error}</p>}
    </div>
  );
});
