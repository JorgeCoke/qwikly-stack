import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { eq } from "drizzle-orm";
import type { LuciaError } from "lucia";
import { Button } from "~/components/ui/buttons";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/form";
import { H1 } from "~/components/ui/typography";
import { db } from "~/lib/db/drizzle";
import { UserRole, users } from "~/lib/db/schema";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const LogInAdmin_Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type LogInAdmin_Type = z.infer<typeof LogInAdmin_Schema>;

export const useLogInAdmin_FormLoader = routeLoader$<
  InitialValues<LogInAdmin_Type>
>(() => ({
  email: "",
  password: "",
}));

export const useLogInAdmin_FormAction = formAction$<LogInAdmin_Type>(
  async (input, event) => {
    const authRequest = auth.handleRequest(event);
    try {
      const key = await auth.useKey(
        CREDENTIALS_PROVIDER_ID,
        input.email.toLowerCase().trim(),
        input.password,
      );
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, key.userId))
        .get();
      if (!user || user.role !== UserRole.Admin) {
        return event.fail(419, {
          message: "Invalid credentials",
        });
      }
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      }); // NOTE: Add session attributes if needed
      authRequest.setSession(session);
      withToast(event, ToastType.success, "Log In Success!");
      throw event.redirect(302, Router.admin.dashboard.index);
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
  zodForm$(LogInAdmin_Schema),
);

export default component$(() => {
  const [LogInAdmin_Form, { Form, Field }] = useForm<LogInAdmin_Type>({
    loader: useLogInAdmin_FormLoader(),
    action: useLogInAdmin_FormAction(),
    validate: zodForm$(LogInAdmin_Schema),
  });

  return (
    <section class="container flex flex-col items-center py-4">
      <Card class="w-5xl p-8">
        <div>
          <H1>Access Admin Panel</H1>
          <Form>
            <Field name="email">
              {(field, props) => (
                <Input
                  {...props}
                  {...field}
                  label="Email"
                  type="email"
                  required
                />
              )}
            </Field>
            <Field name="password">
              {(field, props) => (
                <Input
                  {...props}
                  {...field}
                  label="Password"
                  type="password"
                  required
                />
              )}
            </Field>
            {LogInAdmin_Form.response.message && (
              <p class="text-red-500">{LogInAdmin_Form.response.message}</p>
            )}
            <Button
              class="mt-2"
              size="wide"
              type="submit"
              aria-label="LogIn button"
            >
              Log In
            </Button>
          </Form>
        </div>
      </Card>
    </section>
  );
});
