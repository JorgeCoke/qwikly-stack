import type { PropFunction } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

export const Table = component$(() => {
  return (
    <table class="my-4 min-w-full divide-y divide-slate-700 rounded-md bg-slate-950 shadow">
      <Slot />
    </table>
  );
});

export type TableHeadProps = {
  class?: string;
};
export const TableHead = component$<TableHeadProps>((props) => {
  return (
    <th
      scope="col"
      class={twMerge(
        "px-6 py-3 text-left text-xs font-bold uppercase text-slate-400",
        props.class
      )}
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
        " odd:bg-slate-800 even:bg-slate-700 hover:bg-slate-600",
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
        "whitespace-nowrap px-6 py-4 text-sm text-slate-200",
        props.class
      )}
    >
      <Slot />
    </td>
  );
});
