import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import type { LuciaError } from "lucia";
import LucideKeySquare from "~/components/icons/lucide-key-square";
import { Button } from "~/components/ui/buttons";
import { Input } from "~/components/ui/form";
import { H1 } from "~/components/ui/typography";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const LogIn_Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type LogIn_Type = z.infer<typeof LogIn_Schema>;

export const useLogIn_FormLoader = routeLoader$<InitialValues<LogIn_Type>>(
  () => ({
    email: "",
    password: "",
  })
);

export const useLogIn_FormAction = formAction$<LogIn_Type>(
  async (input, event) => {
    const authRequest = auth.handleRequest(event);
    try {
      const key = await auth.useKey(
        CREDENTIALS_PROVIDER_ID,
        input.email.toLowerCase().trim(),
        input.password
      );
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      }); // NOTE: Add session attributes if needed
      authRequest.setSession(session);
      withToast(event, ToastType.success, "Log In Success!");
      throw event.redirect(302, Router.index);
    } catch (err) {
      if (
        (err as LuciaError).message === "AUTH_INVALID_PASSWORD" ||
        (err as LuciaError).message === "AUTH_INVALID_KEY_ID"
      ) {
        return event.fail(419, {
          message: "Invalid credentials",
        });
      }
      throw err;
    }
  },
  zodForm$(LogIn_Schema)
);

// TODO: Update qwik version and use onSubmitCompleted$ to reset the form on failures (https://qwik.builder.io/docs/action/#actions-with-event-handlers)
export default component$(() => {
  const [LogIn_Form, { Form, Field }] = useForm<LogIn_Type>({
    loader: useLogIn_FormLoader(),
    action: useLogIn_FormAction(),
    validate: zodForm$(LogIn_Schema),
  });

  return (
    <section class="container flex w-96 flex-col items-center py-4">
      <H1>Log In</H1>
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
        {LogIn_Form.response.message && (
          <p class="text-red-500">{LogIn_Form.response.message}</p>
        )}
        <Button class="mt-2" type="submit" aria-label="LogIn button">
          Log In
        </Button>
      </Form>
      <p class="mt-8 flex w-full flex-row items-center justify-center border-t border-slate-400 pt-6 text-center text-slate-800 dark:border-slate-700 dark:text-slate-400">
        Forgotten your password?
        <a
          class="px-2 font-medium underline underline-offset-4 hover:text-black dark:hover:text-white"
          href={`/auth/reset-password?email=${LogIn_Form.internal.fields.email?.value}`}
        >
          Click here
        </a>
        <LucideKeySquare class="h-4 w-4" />
      </p>
    </section>
  );
});
