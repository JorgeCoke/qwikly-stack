import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { sql } from "drizzle-orm";
import LucideTrash from "~/components/icons/lucide-trash";
import { Button } from "~/components/ui/buttons";
import type { CrudCookies } from "~/components/ui/crud";
import { Crud } from "~/components/ui/crud";
import { TableCell, TableRow } from "~/components/ui/table";
import { db } from "~/lib/db/drizzle";
import { users } from "~/lib/db/schema";
import { auth } from "~/lib/lucia-auth";
import { ToastType, withToast } from "~/lib/toast";
import { useSession } from "../layout";

export const useUsersCrudCookies = routeLoader$(async (event) => {
  const crudCookies: CrudCookies = event.cookie.get("/users")?.json() || {
    limit: 5,
    offset: 0,
  };
  return crudCookies;
});

export const useUsers = routeLoader$(async (event) => {
  const crudCookies = await event.resolveValue(useUsersCrudCookies);
  const items = await db
    .select()
    .from(users)
    .limit(crudCookies.limit)
    .offset(crudCookies.offset)
    .all();
  const { count } = await db
    .select({ count: sql<number>`count(id)`.mapWith(Number) })
    .from(users)
    .get();
  return { items, count };
});

export const useDeleteUser = routeAction$(
  async (input, event) => {
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();
    if (session?.user.userId === input.id) {
      withToast(event, ToastType.error, "You can not delete yourself!");
      return event.fail(419, {});
    }
    await auth.deleteUser(input.id);
  },
  zod$({
    id: z.string(),
  })
);

// TODO: Add filtering and sorting
export default component$(() => {
  const users = useUsers();
  const crudCookies = useUsersCrudCookies();
  const deleteUser = useDeleteUser();
  const session = useSession();
  const nav = useNavigate();

  return (
    <section class="container">
      <Crud
        title="Users"
        url="/users"
        headers={["ID #", "Email", "Name", "Role", ""]}
        items={users.value.items}
        count={users.value.count}
        createButton="Create User"
        crudCookies={crudCookies.value}
      >
        {users.value.items.map((e) => (
          <TableRow
            key={e.id}
            onClick$={async () => {
              await nav(`/users/${e.id}`);
            }}
          >
            <TableCell>{e.id}</TableCell>
            <TableCell>{e.email}</TableCell>
            <TableCell>{e.name}</TableCell>
            <TableCell>{e.role}</TableCell>
            <TableCell>
              {session.value?.user.userId !== e.id && (
                <Button
                  aria-label="Delete user button"
                  color="danger"
                  onClick$={(event: any) => {
                    event.stopPropagation();
                    deleteUser.submit({ id: e.id! });
                  }}
                >
                  <LucideTrash class="h-3 w-3" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </Crud>
    </section>
  );
});
