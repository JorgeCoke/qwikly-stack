import { Slot, component$, useSignal } from "@builder.io/qwik";
import { z } from "@builder.io/qwik-city";
import { formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { CrudCookiesOptions } from "~/lib/utils";
import {
  useResetCrudCookies,
  useSetCrudCookies,
  useSetCrudOrderBy,
} from "~/routes/layout";
import LucideArrowDownNarrowWide from "../icons/lucide-arrow-down-narrow-wide";
import LucideArrowUpNarrowWide from "../icons/lucide-arrow-up-narrow-wide";
import LucidePlus from "../icons/lucide-plus";
import LucideRefreshCcw from "../icons/lucide-refresh-ccw";
import { AnchorButton, Button } from "./buttons";
import { Input, SearchInput } from "./form";
import { Table, TableHead } from "./table";

export type CrudCookies = {
  limit: number;
  offset: number;
  orderBy: string;
  search: string;
};

type CrudProps = {
  title?: string;
  url: string; // Used as cookieKey
  headers: { label?: string; columnName?: string }[];
  createButton?: string;
  items: { id: string }[];
  count: number;
  crudCookies: CrudCookies;
  searchInput?: boolean;
};

export const Search_Schema = z.object({
  cookieKey: z.string(),
  search: z.string().nullable(),
});
export type Search_Type = z.infer<typeof Search_Schema>;

export const useSearch_FormAction = formAction$<Search_Type>(
  async (input, event) => {
    const crudCookies: CrudCookies | undefined = event.cookie
      .get(input.cookieKey)
      ?.json();
    if (crudCookies) {
      crudCookies.search = input.search || "";
      crudCookies.offset = 0;
      event.cookie.set(input.cookieKey, crudCookies, CrudCookiesOptions);
    }
  },
  zodForm$(Search_Schema)
);

export const Crud = component$<CrudProps>((props) => {
  const resetCrudCookies = useResetCrudCookies();
  const setCrudOrderBy = useSetCrudOrderBy();

  const [Search_Form, { Form, Field }] = useForm<Search_Type>({
    loader: useSignal({ cookieKey: props.url, search: "" }),
    action: useSearch_FormAction(),
    validate: zodForm$(Search_Schema),
  });

  return (
    <Table>
      <caption>
        <div class="flex items-center gap-4 pb-3">
          <div class="flex items-center gap-3">
            {props.title && (
              <span class=" text-3xl font-bold dark:text-white">
                {props.title}
              </span>
            )}
            {props.searchInput && (
              <Form>
                <Field name="cookieKey">
                  {(field, _props) => (
                    <Input
                      {..._props}
                      type="hidden"
                      value={props.url}
                      error={field.error}
                    />
                  )}
                </Field>
                <Field name="search">
                  {(field, props) => (
                    <SearchInput
                      {...props}
                      placeholder="Search..."
                      type="text"
                      value={field.value}
                      error={field.error}
                    />
                  )}
                </Field>
              </Form>
            )}
            <Button
              disabled={resetCrudCookies.isRunning}
              onClick$={() => {
                if (Search_Form.internal.fields.search) {
                  Search_Form.internal.fields.search.value = "";
                }
                resetCrudCookies.submit({ cookieKey: props.url });
              }}
            >
              <LucideRefreshCcw class="h-4 w-4" />
            </Button>
            {props.createButton && (
              <AnchorButton
                href={`${props.url}/new`}
                class="flex items-center gap-2 leading-4"
                aria-label="Create user button"
              >
                <LucidePlus class="h-4 w-4" />
                {props.createButton}
              </AnchorButton>
            )}
          </div>
        </div>
      </caption>
      <thead>
        <tr>
          {props.headers.map((e) => (
            <TableHead
              key={e.label}
              onClick$={() => {
                if (e.columnName && e.label) {
                  const columnName = props.crudCookies.orderBy.split(",")[0];
                  const sort = props.crudCookies.orderBy.split(",")[1];
                  setCrudOrderBy.submit({
                    cookieKey: props.url,
                    columnName: e.columnName,
                    sort:
                      !columnName || columnName !== e.columnName
                        ? "asc"
                        : sort === "asc"
                        ? "desc"
                        : null,
                  });
                }
              }}
            >
              <p class="flex items-center gap-2">
                {e.label}
                {props.crudCookies.orderBy === `${e.columnName},asc` && (
                  <LucideArrowDownNarrowWide class="h-4 w-4" />
                )}
                {props.crudCookies.orderBy === `${e.columnName},desc` && (
                  <LucideArrowUpNarrowWide class="h-4 w-4" />
                )}
              </p>
            </TableHead>
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
          type="button"
          variant="ghost"
          onClick$={() =>
            setCrudCookies.submit({
              limit: props.limit,
              offset: props.limit * (page - 1),
              cookieKey: props.cookieKey,
            })
          }
          key={page}
          class={
            currentPage === page ? "h-10 w-10 bg-white dark:bg-slate-800" : ""
          }
        >
          {page}
        </Button>
      ))}
    </div>
  );
});
