import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { FormError, formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { LuChevronsLeft } from "@qwikest/icons/lucide";
import type { LuciaError } from "lucia";
import { AnchorButton, Button } from "~/components/ui/buttons";
import { Input } from "~/components/ui/form";
import { H1 } from "~/components/ui/typography";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { ToastType, redirectWithToast } from "~/lib/toast";

export const CreateUser_Schema = z.object({
  email: z.string().email(),
  name: z.string().nullable(),
  password: z.string().min(1),
});
type CreateUser_Type = z.infer<typeof CreateUser_Schema>;

export const useCreateUser_FormLoader = routeLoader$<
  InitialValues<CreateUser_Type>
>(async () => {
  return {
    email: "",
    name: null,
    password: "",
  };
});

export const useCreateUser_FormAction = formAction$<CreateUser_Type>(
  async (input, event) => {
    // TODO: Add shareable guards/actions? useIsAuthenticated(role?);
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();
    if (!session) {
      throw event.redirect(302, "/401");
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
    redirectWithToast(event, ToastType.success, "User created!");
    throw event.redirect(302, "/users");
  },
  zodForm$(CreateUser_Schema)
);

export default component$(() => {
  const [CreateUser_Form, { Form, Field }] = useForm<CreateUser_Type>({
    loader: useCreateUser_FormLoader(),
    action: useCreateUser_FormAction(),
    validate: zodForm$(CreateUser_Schema),
  });

  return (
    <section class="container flex w-96 flex-col items-center py-4">
      <H1 class="flex w-full grow items-center gap-4">
        <AnchorButton href="/users">
          <LuChevronsLeft />
        </AnchorButton>
        Create user:
      </H1>
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
        <Button class="mt-2" type="submit">
          Create user
        </Button>
      </Form>
    </section>
  );
});
