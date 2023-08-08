import { Slot, component$ } from "@builder.io/qwik";
import { useResetCrudCookies, useSetCrudCookies } from "~/routes/layout";
import LucidePlus from "../icons/lucide-plus";
import LucideRefreshCcw from "../icons/lucide-refresh-ccw";
import { AnchorButton, Button } from "./buttons";
import { Table, TableHead } from "./table";

export type CrudCookies = {
  limit: number;
  offset: number;
};

type CrudProps = {
  title?: string;
  url: string; // Used as cookieKey
  headers: string[];
  createButton?: string;
  items: { id: string }[];
  count: number;
  crudCookies: CrudCookies;
};
export const Crud = component$<CrudProps>((props) => {
  const resetCrudCookies = useResetCrudCookies();

  return (
    <Table>
      <caption>
        <div class="flex items-center justify-between pb-3">
          <div class="flex items-center gap-3">
            <Button
              disabled={resetCrudCookies.isRunning}
              onClick$={() => resetCrudCookies.submit({ cookieKey: props.url })}
            >
              <LucideRefreshCcw class="h-4 w-4" />
            </Button>
            {props.title && (
              <span class=" text-3xl font-bold dark:text-white">
                {props.title}
              </span>
            )}
          </div>
          {props.createButton && (
            <AnchorButton
              href={`${props.url}/new`}
              class="flex items-center gap-2"
              aria-label="Create user button"
            >
              <LucidePlus class="h-4 w-4" /> {props.createButton}
            </AnchorButton>
          )}
        </div>
      </caption>
      <thead>
        <tr>
          {props.headers.map((e) => (
            <TableHead key={e}>{e}</TableHead>
          ))}
        </tr>
      </thead>
      <tbody>
        <Slot />
        {props.items.length === 0 && (
          <tr>
            <td
              colSpan={props.headers.length}
              class="bg-slate-50 px-3 py-3 dark:bg-slate-800 dark:text-white"
            >
              <p>No data available</p>
            </td>
          </tr>
        )}
      </tbody>
      {props.crudCookies.limit && (
        <tfoot>
          <tr>
            <td colSpan={props.headers.length} class="px-3 py-3">
              <Pagination
                count={props.count}
                limit={props.crudCookies.limit}
                offset={props.crudCookies.offset}
                cookieKey={props.url}
              />
            </td>
          </tr>
        </tfoot>
      )}
    </Table>
  );
});

type PaginationProps = {
  count: number;
  limit: number;
  offset: number;
  cookieKey: string;
};
const Pagination = component$<PaginationProps>((props) => {
  const setCrudCookies = useSetCrudCookies();

  const pages = Array.from(
    { length: Math.ceil(props.count / props.limit) },
    (_, i) => i + 1
  );
  const currentPage = Math.round(props.offset / props.limit) + 1;

  return (
    <div class="flex items-center justify-center space-x-2">
      {pages.map((page) => (
        <Button
          variant="ghost"
          onClick$={() =>
            setCrudCookies.submit({
              limit: props.limit,
              offset: props.limit * (page - 1),
              cookieKey: props.cookieKey,
            })
          }
          key={page}
          class={currentPage === page ? "bg-white dark:bg-slate-800" : ""}
        >
          {page}
        </Button>
      ))}
    </div>
  );
});
