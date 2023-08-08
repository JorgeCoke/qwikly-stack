import type { PropFunction } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

export const Table = component$(() => {
  return (
    <table class="my-4 min-w-full table-fixed divide-y divide-slate-300 rounded-md bg-slate-200 shadow dark:divide-slate-700 dark:bg-slate-950">
      <Slot />
    </table>
  );
});

export type TableHeadProps = {
  class?: string;
  onClick$?: PropFunction<() => void>;
};
export const TableHead = component$<TableHeadProps>((props) => {
  return (
    <th
      scope="col"
      class={twMerge(
        "px-3 py-3 text-left text-xs font-bold uppercase text-slate-800 dark:text-slate-400",
        props.onClick$ ? "cursor-pointer" : "",
        props.class
      )}
      onClick$={props.onClick$}
    >
      <Slot />
    </th>
  );
});

export type TableRowProps = {
  class?: string;
  onClick$?: PropFunction<() => void>;
};
export const TableRow = component$<TableRowProps>((props) => {
  return (
    <tr
      class={twMerge(
        " odd:bg-slate-50 even:bg-slate-100 hover:bg-white dark:odd:bg-slate-800 dark:even:bg-slate-700 dark:hover:bg-slate-600",
        props.onClick$ ? "cursor-pointer" : "",
        props.class
      )}
      onClick$={props.onClick$}
    >
      <Slot />
    </tr>
  );
});

export type TableCellProps = {
  class?: string;
};
export const TableCell = component$<TableCellProps>((props) => {
  return (
    <td
      scope="col"
      class={twMerge(
        "whitespace-nowrap px-3 py-3 text-sm text-slate-900 dark:text-slate-200",
        props.class
      )}
    >
      <Slot />
    </td>
  );
});
