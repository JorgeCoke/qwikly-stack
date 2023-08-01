import { component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

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
        <label class="text-slate-100">
          {props.label}
          {props.required && <span class="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <input
        {...props}
        class="rounded-md bg-slate-950 px-3 py-2 text-slate-200 ring-1 ring-inset ring-slate-800 "
      />
      {props.description && (
        <p class=" text-sm text-slate-400">{props.description}</p>
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

export const Select = component$<FormProps>((props: any) => {
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
        <label class="text-slate-100">
          {props.label}
          {props.required && <span class="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <select
        {...props}
        class="block w-full rounded-md bg-slate-950 px-3 py-2 text-slate-200 ring-1 ring-inset ring-slate-800 "
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
