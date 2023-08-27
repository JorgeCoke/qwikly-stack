import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { FormError, formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import type { LuciaError } from "lucia";
import LucideChevronsLeft from "~/components/icons/lucide-chevrons-left";
import { AnchorButton, Button } from "~/components/ui/buttons";
import { Input, Select } from "~/components/ui/form";
import { UserRole } from "~/lib/db/schema";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const CreateUser_Schema = z.object({
  email: z.string().email(),
  name: z.string().nullable(),
  password: z.string().min(1),
  role: z.nativeEnum(UserRole),
});
type CreateUser_Type = z.infer<typeof CreateUser_Schema>;

export const useCreateUser_FormLoader = routeLoader$<
  InitialValues<CreateUser_Type>
>(async () => {
  return {
    email: "",
    name: null,
    password: "",
    role: UserRole.User,
  };
});

export const useCreateUser_FormAction = formAction$<CreateUser_Type>(
  async (input, event) => {
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();
    if (!session) {
      throw event.redirect(302, Router[401]);
    }

    await auth
      .createUser({
        key: {
          providerId: CREDENTIALS_PROVIDER_ID,
          providerUserId: input.email.toLowerCase().trim(),
          password: input.password,
        },
        attributes: {
          email: input.email.toLowerCase().trim(),
          name: input.name,
          role: input.role,
        },
      })
      .catch((err) => {
        if (
          err.code === "SQLITE_CONSTRAINT_UNIQUE" ||
          (err as LuciaError).message === "AUTH_DUPLICATE_KEY_ID"
        ) {
          throw new FormError<CreateUser_Type>({
            email: "Email already exists",
          });
        }
        throw err;
      });
    withToast(event, ToastType.success, "User created!");
    throw event.redirect(302, Router.admin.dashboard.users.index);
  },
  zodForm$(CreateUser_Schema),
);

export default component$(() => {
  const [CreateUser_Form, { Form, Field }] = useForm<CreateUser_Type>({
    loader: useCreateUser_FormLoader(),
    action: useCreateUser_FormAction(),
    validate: zodForm$(CreateUser_Schema),
  });

  return (
    <div class="max-w-xl">
      <span class="flex w-full grow items-center gap-4 text-3xl font-bold dark:text-white">
        <AnchorButton
          href={Router.admin.dashboard.users.index}
          aria-label="Go back button"
        >
          <LucideChevronsLeft class="h-4 w-4" />
        </AnchorButton>
        Create user:
      </span>
      <Form>
        <Field name="email">
          {(field, props) => (
            <Input
              {...props}
              label="Email"
              type="email"
              required
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
              type="text"
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
              required
              value={field.value}
              error={field.error}
            />
          )}
        </Field>
        <Button
          class="mt-2"
          size="wide"
          type="submit"
          aria-label="Create user button"
        >
          Create user
        </Button>
      </Form>
    </div>
  );
});
