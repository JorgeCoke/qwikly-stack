import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";
import LucidePlus from "~/components/icons/lucide-plus";
import LucideTrash from "~/components/icons/lucide-trash";
import { AnchorButton, Button } from "~/components/ui/buttons";
import { Table, TableCell, TableHead, TableRow } from "~/components/ui/table";
import { H1, H5 } from "~/components/ui/typography";
import { db } from "~/lib/db/drizzle";
import { users } from "~/lib/db/schema";
import { auth } from "~/lib/lucia-auth";
import { ToastType, withToast } from "~/lib/toast";
import { useSession } from "../layout";

export const useUsers = routeLoader$(async () => {
  return await db.select().from(users).all();
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

// TODO: Add filtering, sorting and pagination
export default component$(() => {
  const users = useUsers();
  const deleteUser = useDeleteUser();
  const session = useSession();
  const nav = useNavigate();

  return (
    <section class="container">
      <H1 class="flex justify-between pt-4">
        <span>Users</span>
        <AnchorButton
          href="/users/create"
          class="flex items-center gap-2"
          aria-label="Create user button"
        >
          <LucidePlus class="h-4 w-4" /> Create user
        </AnchorButton>
      </H1>
      <Table>
        <thead>
          <tr>
            <TableHead>ID #</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead></TableHead>
          </tr>
        </thead>
        <tbody>
          {users.value.map((e) => (
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
          {users.value.length === 0 && (
            <TableRow>
              <TableCell>
                <H5>No users found</H5>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
    </section>
  );
});
