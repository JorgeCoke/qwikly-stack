import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { FormError, formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import type { LuciaError } from "lucia";
import LucideKeySquare from "~/components/icons/lucide-key-square";
import { Button } from "~/components/ui/buttons";
import { Input } from "~/components/ui/form";
import { H1 } from "~/components/ui/typography";
import { UserRole } from "~/lib/db/schema";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const SignUp_Schema = z.object({
  email: z.string().email(),
  name: z.string().nullable(),
  password: z.string().min(1),
  repeatPassword: z.string().min(1),
});
type SignUp_Type = z.infer<typeof SignUp_Schema>;

export const useSignUp_FormLoader = routeLoader$<InitialValues<SignUp_Type>>(
  () => ({
    email: "",
    name: "",
    password: "",
    repeatPassword: "",
  })
);

export const useSignUp_FormAction = formAction$<SignUp_Type>(
  async (input, event) => {
    if (input.password !== input.repeatPassword) {
      throw new FormError<SignUp_Type>({
        repeatPassword: "Passwords does not match",
      });
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
          role: UserRole.User,
        },
      })
      .catch((err) => {
        if (
          err.code === "SQLITE_CONSTRAINT_UNIQUE" ||
          (err as LuciaError).message === "AUTH_DUPLICATE_KEY_ID"
        ) {
          throw new FormError<SignUp_Type>({
            email: "Email already exists",
          });
        }
        throw err;
      });
    withToast(
      event,
      ToastType.success,
      "You can now Log In into your account!"
    );
    throw event.redirect(302, Router.auth.logIn);
  },
  zodForm$(SignUp_Schema)
);

export default component$(() => {
  const [SignUp_Form, { Form, Field }] = useForm<SignUp_Type>({
    loader: useSignUp_FormLoader(),
    action: useSignUp_FormAction(),
    validate: zodForm$(SignUp_Schema),
  });

  return (
    <section class="container flex w-96 flex-col items-center py-4">
      <H1>Sign Up</H1>
      <Form>
        <Field name="email">
          {(field, props) => (
            <Input
              {...props}
              label="Your email"
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
        <Field name="repeatPassword">
          {(field, props) => (
            <Input
              {...props}
              label="Repeat Password"
              type="password"
              required
              value={field.value}
              error={field.error}
            />
          )}
        </Field>
        <Button class="mt-2" type="submit" aria-label="SignUp button">
          Sign Up
        </Button>
      </Form>
      <p class="mt-8 flex w-full flex-row items-center justify-center border-t border-slate-400 pt-6 text-center text-slate-800 dark:border-slate-700 dark:text-slate-400">
        Do you have an account?
        <a
          class="px-2 font-medium underline underline-offset-4 hover:text-black dark:hover:text-white"
          href={`/auth/log-in`}
        >
          Log In here
        </a>
        <LucideKeySquare class="h-4 w-4" />
      </p>
    </section>
  );
});
