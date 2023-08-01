import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { LuPlus, LuTrash } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/buttons";
import { H1 } from "~/components/ui/typography";
import { db } from "~/lib/db/kysely";
import { auth } from "~/lib/lucia-auth";
import { useSession } from "../layout";

export const useUsers = routeLoader$(async () => {
  return await db.selectFrom("user").selectAll().execute();
});

export const useDeleteUser = routeAction$(
  async (data, event) => {
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();
    if (session?.user.userId === data.id) {
      return event.fail(419, {
        message: "You can not delete yoursefl!",
      });
    }
    await auth.deleteUser(data.id);
  },
  zod$({
    id: z.string(),
  })
);

export default component$(() => {
  const users = useUsers();
  const deleteUser = useDeleteUser();
  const nav = useNavigate();
  const session = useSession();

  return (
    <section class="container">
      <H1 class="flex justify-between pt-4">
        <span>Users</span>
        <Button>
          <a href="/users/create" class="flex items-center">
            <LuPlus class="h-4 w-4" />
            &nbsp;Create user
          </a>
        </Button>
      </H1>
      <table class="my-4 min-w-full divide-y divide-slate-700 rounded-md bg-slate-950 shadow">
        <thead>
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-bold uppercase text-slate-400"
            >
              ID #
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-bold uppercase text-slate-400"
            >
              Email
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-bold uppercase text-slate-400"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-bold uppercase text-slate-400"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.value.map((e) => (
            <tr
              key={e.id}
              class="cursor-pointer odd:bg-slate-800 even:bg-slate-700 hover:bg-slate-600"
              onClick$={async () => {
                await nav(`/users/${e.id}`);
              }}
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-200">
                {e.id}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-200">
                {e.email}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-200">
                {e.name}
              </td>
              <td class="px-6 text-right">
                {session.value?.user.userId !== e.id && (
                  <Button
                    color="danger"
                    onClick$={(event: any) => {
                      event.stopPropagation();
                      deleteUser.submit({ id: e.id! });
                    }}
                  >
                    <LuTrash />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
});
