import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { asc, desc, eq, getTableColumns, like, or, sql } from "drizzle-orm";
import LucideTrash from "~/components/icons/lucide-trash";
import { Button } from "~/components/ui/buttons";
import type { CrudCookies } from "~/components/ui/crud";
import { Crud } from "~/components/ui/crud";
import { TableCell, TableRow } from "~/components/ui/table";
import { db } from "~/lib/db/drizzle";
import { users } from "~/lib/db/schema";
import { auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";
import { CrudCookiesOptions } from "~/lib/utils";
import { useSession } from "../../../layout";

export const useUsersCrudCookies = routeLoader$(async (event) => {
  const crudCookies = event.cookie
    .get(Router.admin.dashboard.users.index)
    ?.json();
  if (!crudCookies) {
    const defaultCrudCookies: CrudCookies = {
      limit: 10,
      offset: 0,
      orderBy: "id,asc",
      search: "",
    };
    event.cookie.set(
      Router.admin.dashboard.users.index,
      defaultCrudCookies,
      CrudCookiesOptions,
    );
  }
  const response = event.cookie
    .get(Router.admin.dashboard.users.index)
    ?.json() as CrudCookies;
  return response;
});

export const useCrudUsers = routeLoader$(async (event) => {
  const crudCookies = await event.resolveValue(useUsersCrudCookies);
  let itemsQuery = db
    .select()
    .from(users)
    .limit(crudCookies.limit)
    .offset(crudCookies.offset);
  let countQuery = db
    .select({ count: sql<number>`count(id)`.mapWith(Number) })
    .from(users);

  if (crudCookies.orderBy) {
    const columns = getTableColumns(users);
    const columnName = crudCookies.orderBy.split(
      ",",
    )[0] as keyof typeof columns;
    const sort = crudCookies.orderBy.split(",")[1] as "asc" | "desc";
    itemsQuery = itemsQuery.orderBy(
      sort === "asc" ? asc(columns[columnName]) : desc(columns[columnName]),
    );
  }

  if (crudCookies.search) {
    const query = or(
      like(users.id, `%${crudCookies.search}%`),
      like(users.email, `%${crudCookies.search}%`),
      like(users.name, `%${crudCookies.search}%`),
    );
    itemsQuery = itemsQuery.where(query);
    countQuery = countQuery.where(query);
  }

  return {
    items: await itemsQuery.all(),
    count: (await countQuery.get()?.count) || 0,
    crudCookies,
  };
});

export const useDeleteUser = routeAction$(
  async (input, event) => {
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();
    if (session?.user.userId === input.id) {
      withToast(event, ToastType.error, "You can not delete yourself!");
      return event.fail(419, {});
    }
    const admin = await db
      .select()
      .from(users)
      .where(eq(users.email, process.env.ADMIN_USER!))
      .get();
    if (admin?.id === input.id) {
      withToast(event, ToastType.error, "You can not delete an admin user!");
      return event.fail(419, {});
    }
    await auth.deleteUser(input.id);
  },
  zod$({
    id: z.string(),
  }),
);

// TODO: Add filtering
// TODO: Add types to columnName with const columns = getTableColumns(users);
export default component$(() => {
  const crudUsers = useCrudUsers();
  const deleteUser = useDeleteUser();
  const session = useSession();
  const nav = useNavigate();

  return (
    <Crud
      title="Users"
      url={Router.admin.dashboard.users.index}
      headers={[
        { label: "ID #", columnName: "id" },
        { label: "Email", columnName: "email" },
        { label: "Name", columnName: "name" },
        { label: "Role", columnName: "role" },
        {},
      ]}
      items={crudUsers.value.items}
      count={crudUsers.value.count}
      createButton="Create User"
      crudCookies={crudUsers.value.crudCookies}
      searchInput={true}
    >
      {crudUsers.value.items.map((e) => (
        <TableRow
          key={e.id}
          onClick$={async () => {
            await nav(`${Router.admin.dashboard.users.id}/${e.id}`);
          }}
        >
          <TableCell>{e.id}</TableCell>
          <TableCell>{e.email}</TableCell>
          <TableCell>{e.name}</TableCell>
          <TableCell>{e.role}</TableCell>
          <TableCell>
            <Button
              aria-label="Delete user button"
              color="danger"
              disabled={
                deleteUser.isRunning || session.value?.user.userId === e.id
              }
              onClick$={(event: any) => {
                event.stopPropagation();
                deleteUser.submit({ id: e.id! });
              }}
            >
              <LucideTrash class="h-3 w-3" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </Crud>
  );
});
