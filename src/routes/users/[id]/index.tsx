import { component$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { eq } from "drizzle-orm";
import LucideChevronsLeft from "~/components/icons/lucide-chevrons-left";
import { AnchorButton, Button } from "~/components/ui/buttons";
import { Input, Select } from "~/components/ui/form";
import { H1 } from "~/components/ui/typography";
import { db } from "~/lib/db/drizzle";
import { UserRole, users } from "~/lib/db/schema";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const UpdateUser_Schema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().nullable(),
  password: z.string().optional(),
  role: z.nativeEnum(UserRole),
});
type UpdateUser_Type = z.infer<typeof UpdateUser_Schema>;

export const useUpdateUser_FormLoader = routeLoader$<
  InitialValues<UpdateUser_Type>
>(async (req) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, req.params.id))
    .get();

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: "",
    role: user.role,
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
    await auth.deleteUser(input.id);
    withToast(event, ToastType.success, "User deleted!");
    throw event.redirect(302, Router.users.index);
  },
  zod$({
    id: z.string(),
  })
);

export const useUpdateUser_FormAction = formAction$<UpdateUser_Type>(
  async (input, event) => {
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();
    if (!session) {
      throw event.redirect(302, Router[401]);
    }
    await db
      .update(users)
      .set({ name: input.name, role: input.role })
      .where(eq(users.id, input.id))
      .run();
    const userEmail = await db
      .select()
      .from(users)
      .where(eq(users.id, input.id))
      .get();
    if (input.password) {
      await auth.updateKeyPassword(
        CREDENTIALS_PROVIDER_ID,
        userEmail.email,
        input.password
      );
    }
    withToast(event, ToastType.success, "User updated!");
    throw event.redirect(302, Router.users.index);
  },
  zodForm$(UpdateUser_Schema)
);

export default component$(() => {
  const [UpdateUser_Form, { Form, Field }] = useForm<UpdateUser_Type>({
    loader: useUpdateUser_FormLoader(),
    action: useUpdateUser_FormAction(),
    validate: zodForm$(UpdateUser_Schema),
  });
  const deleteUser = useDeleteUser();

  return (
    <section class="container flex w-96 flex-col items-center py-4">
      <H1 class="flex w-full grow items-center gap-4">
        <AnchorButton href={Router.users.index} aria-label="Go back button">
          <LucideChevronsLeft class="h-4 w-4" />
        </AnchorButton>
        Update user:
      </H1>
      <Form>
        <Field name="id">
          {(field, props) => (
            <Input {...props} type="hidden" value={field.value} />
          )}
        </Field>
        <Field name="email">
          {(field, props) => (
            <Input
              {...props}
              label="Email"
              required
              disabled
              value={field.value}
              error={field.error}
            />
          )}
        </Field>
        <Field name="name">
          {(field, props) => (
            <Input
              {...props}
              label="Name"
              value={field.value}
              error={field.error}
            />
          )}
        </Field>
        <Field name="role">
          {(field, props) => (
            <Select
              {...props}
              label="Role"
              value={field.value}
              error={field.error}
              options={[
                { label: "Admin", value: UserRole.Admin },
                { label: "User", value: UserRole.User },
              ]}
            />
          )}
        </Field>
        <Field name="password">
          {(field, props) => (
            <Input
              {...props}
              label="Password"
              type="password"
              description="You can set up a new password here"
              value={field.value}
              error={field.error}
            />
          )}
        </Field>
        <div class="mt-2 flex gap-4">
          <Button type="submit" aria-label="Update user button">
            Update user
          </Button>
          <Button
            type="button"
            aria-label="Delete user button"
            color="danger"
            disabled={deleteUser.isRunning}
            onClick$={() =>
              deleteUser.submit({
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                id: UpdateUser_Form.internal.fields.id?.value!,
              })
            }
          >
            Delete user
          </Button>
        </div>
      </Form>
    </section>
  );
});
