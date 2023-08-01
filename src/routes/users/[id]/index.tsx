import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { LuChevronsLeft } from "@qwikest/icons/lucide";
import { AnchorButton, Button } from "~/components/ui/buttons";
import { Input } from "~/components/ui/form";
import { H1 } from "~/components/ui/typography";
import { db } from "~/lib/db/kysely";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { ToastType, redirectWithToast } from "~/lib/toast";

export const UpdateUser_Schema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().nullable(),
  password: z.string().optional(),
});
type UpdateUser_Type = z.infer<typeof UpdateUser_Schema>;

export const useUpdateUser_FormLoader = routeLoader$<
  InitialValues<UpdateUser_Type>
>(async (req) => {
  const user = await db
    .selectFrom("user")
    .where("user.id", "=", req.params.id)
    .selectAll()
    .executeTakeFirstOrThrow();
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: "",
  };
});

export const useUpdateUser_FormAction = formAction$<UpdateUser_Type>(
  async (input, event) => {
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();
    if (!session) {
      throw event.redirect(302, "/401");
    }
    await db
      .updateTable("user")
      .where("user.id", "=", input.id)
      .set({ name: input.name })
      .executeTakeFirstOrThrow();
    const userEmail = await db
      .selectFrom("user")
      .where("user.id", "=", input.id)
      .select(["user.email"])
      .executeTakeFirstOrThrow();
    if (input.password) {
      await auth.updateKeyPassword(
        CREDENTIALS_PROVIDER_ID,
        userEmail.email,
        input.password
      );
    }
    redirectWithToast(event, ToastType.success, "User updated!");
    throw event.redirect(302, "/users");
  },
  zodForm$(UpdateUser_Schema)
);

export default component$(() => {
  const [UpdateUser_Form, { Form, Field }] = useForm<UpdateUser_Type>({
    loader: useUpdateUser_FormLoader(),
    action: useUpdateUser_FormAction(),
    validate: zodForm$(UpdateUser_Schema),
  });

  return (
    <section class="container flex w-96 flex-col items-center py-4">
      <H1 class="flex w-full grow items-center gap-4">
        <AnchorButton href="/users">
          <LuChevronsLeft />
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
        <Button class="mt-2" type="submit">
          Update user
        </Button>
      </Form>
    </section>
  );
});
