import type { PropFunction } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export type TableProps = {
  class?: string;
};
export const Table = component$<TableProps>((props) => {
  return (
    <table
      class={cn(
        "min-w-full table-auto rounded-md bg-slate-200 shadow dark:bg-slate-900",
        props.class,
      )}
    >
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
      class={cn(
        "px-3 py-3 text-left text-xs font-bold uppercase text-slate-800 dark:text-slate-400",
        props.onClick$ && "cursor-pointer",
        props.class,
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
      class={cn(
        " odd:bg-slate-50 even:bg-slate-100 hover:bg-white dark:odd:bg-slate-800 dark:even:bg-slate-700 dark:hover:bg-slate-600",
        props.onClick$ && "cursor-pointer",
        props.class,
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
      class={cn(
        "whitespace-nowrap px-3 py-3 text-sm text-slate-900 dark:text-slate-200",
        props.class,
      )}
    >
      <Slot />
    </td>
  );
});
