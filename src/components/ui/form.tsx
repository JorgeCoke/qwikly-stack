/* eslint-disable qwik/valid-lexical-scope */
import { Slot, component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { JSX } from "@builder.io/qwik/jsx-runtime";
import { cn } from "~/lib/utils";
import LucideChevronsUpDown from "../icons/lucide-chevrons-up-down";
import LucideSearch from "../icons/lucide-search";
import { Button } from "./buttons";

type LabelProps = {
  label: string;
  required?: boolean;
  name?: string;
};
const Label = component$<LabelProps>((props) => (
  <label for={props.name} class="text-slate-900 dark:text-slate-100">
    {props.label}
    {props.required && <span class="text-red-500">&nbsp;*</span>}
  </label>
));

type DescriptionProps = {
  description: string;
  name?: string;
};
const Description = component$<DescriptionProps>((props) => (
  <p class="text-sm text-slate-600 dark:text-slate-400">
    <label for={props.name}>{props.description}</label>
  </p>
));

type ErrorProps = {
  error: string;
};
const Error = component$<ErrorProps>((props) => (
  <p class="text-sm text-red-500">{props.error}</p>
));

const GenericInputClass = (props: {
  type?: JSX.IntrinsicElements["input"]["type"];
  disabled?: boolean;
}) =>
  cn(
    "inline-flex w-full flex-col gap-1 py-2",
    props.type === "hidden" && "hidden",
    props.disabled && "opacity-40",
  );

const InputWrapper = component$<
  GenericInputProps & { disabled?: boolean; name?: string; required?: boolean }
>((props) => (
  <div class={GenericInputClass(props)}>
    {props.label && (
      <Label name={props.name} label={props.label} required={props.required} />
    )}
    <Slot />
    {props.description && (
      <Description name={props.name} description={props.description} />
    )}
    {props.error && <Error error={props.error} />}
  </div>
));

type GenericInputProps = {
  label?: string;
  description?: string;
  error?: string;
};
export const Input = component$<
  GenericInputProps & JSX.IntrinsicElements["input"]
>((props) => {
  return (
    <InputWrapper {...props}>
      <input
        {...(props as JSX.IntrinsicElements["input"])}
        class="grow rounded-md bg-slate-50 p-2 leading-4 text-slate-800 ring-1 ring-inset ring-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
      />
    </InputWrapper>
  );
});

type SelectProps = {
  options: { label: string; value: string }[];
} & GenericInputProps;
export const Select = component$<SelectProps & JSX.IntrinsicElements["select"]>(
  (props) => {
    return (
      <InputWrapper {...props}>
        <div class="flex">
          <select
            {...props}
            class="block w-full appearance-none rounded-md rounded-r-none bg-slate-50 p-2 leading-4 text-slate-800 ring-1 ring-inset ring-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800 "
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
          <Button class="pointer-events-none rounded-l-none">
            <LucideChevronsUpDown class="h-4 w-4" />
          </Button>
        </div>
      </InputWrapper>
    );
  },
);

export const SearchInput = component$<
  GenericInputProps & Omit<JSX.IntrinsicElements["input"], "type">
>((props) => {
  return (
    <InputWrapper {...props}>
      <div class="flex">
        <input
          {...(props as JSX.IntrinsicElements["input"])}
          type="text"
          class="grow rounded-md rounded-r-none bg-slate-50 px-2 leading-4 text-slate-800 ring-1 ring-inset ring-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
        />
        <Button class="rounded-l-none">
          <LucideSearch class="h-4 w-4" />
        </Button>
      </div>
    </InputWrapper>
  );
});

export const Checkbox = component$<
  GenericInputProps &
    Omit<JSX.IntrinsicElements["input"], "type" | "value"> & {
      value: boolean | undefined;
    }
>((props) => {
  return (
    <div class={GenericInputClass(props)}>
      <div class="flex gap-3">
        <input
          {...(props as JSX.IntrinsicElements["input"])}
          class="mt-0.5 shrink-0 rounded-md border-gray-200 bg-white p-2 leading-4 text-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800"
          id={props.name}
          type="checkbox"
          checked={props.value}
        />
        <div>
          {props.label && (
            <Label
              name={props.name}
              label={props.label}
              required={props.required}
            />
          )}
          {props.description && (
            <Description name={props.name} description={props.description} />
          )}
        </div>
      </div>
      {props.error && <Error error={props.error} />}
    </div>
  );
});

export const Datepicker = component$<
  GenericInputProps &
    Omit<JSX.IntrinsicElements["input"], "type" | "value"> & {
      type: "date" | "datetime-local";
      value: Date | undefined;
    }
>(({ value, ...props }) => {
  const timezoneFixed = useSignal(false);
  const localeValue = useSignal(
    props.type === "date"
      ? value?.toISOString().split("T")[0]
      : value?.toISOString().substring(0, 16),
  );

  useTask$(({ track }) => {
    track(() => value);
    if (!timezoneFixed.value) {
      const localDate = value ? new Date(value) : undefined;

      if (localDate) {
        localDate.setMinutes(
          localDate.getMinutes() - localDate.getTimezoneOffset(),
        );
      }
      localeValue.value =
        props.type === "date"
          ? localDate?.toISOString().split("T")[0]
          : localDate?.toISOString().substring(0, 16);
      timezoneFixed.value = true;
    }
  });

  return (
    <InputWrapper {...props}>
      <input
        {...(props as JSX.IntrinsicElements["input"])}
        class="grow rounded-md bg-slate-50 p-2 leading-4 text-slate-800 ring-1 ring-inset ring-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
        value={localeValue.value}
      />
    </InputWrapper>
  );
});

export const toLocaleDate = (date: Date | null | undefined) => {
  if (!date) {
    return undefined;
  }
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split("T")[0];
};

export const toLocaleDateTime = (date: Date | null | undefined) => {
  if (!date) {
    return undefined;
  }
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().substring(0, 16);
};
