import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { FormError, formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { eq } from "drizzle-orm";
import { Button } from "~/components/ui/buttons";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/form";
import { H1 } from "~/components/ui/typography";
import { verifyJwt } from "~/lib/crypto";
import { db } from "~/lib/db/drizzle";
import { users } from "~/lib/db/schema";
import { CREDENTIALS_PROVIDER_ID, auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const SetPassword_Schema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  repeatPassword: z.string().min(1),
});
type SetPassword_Type = z.infer<typeof SetPassword_Schema>;

export const useSetPassword_FormLoader = routeLoader$<
  InitialValues<SetPassword_Type>
>((event) => ({
  token: event.query.get("token")!,
  email: "",
  password: "",
  repeatPassword: "",
}));

export const useSetPassword_FormAction = formAction$<SetPassword_Type>(
  async (input, event) => {
    if (input.password !== input.repeatPassword) {
      throw new FormError<SetPassword_Type>({
        repeatPassword: "Passwords does not match",
      });
    }
    const payload = await verifyJwt<{ email: string }>(input.token);
    if (!payload) {
      return event.fail(419, {
        message: "Invalid token",
      });
    }
    if (payload.email != input.email) {
      throw new FormError<SetPassword_Type>({
        email: "This is not your email!",
      });
    }
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .get();
    if (!user) {
      throw new FormError<SetPassword_Type>({
        email: "This email is not found in our database",
      });
    }
    await auth.updateKeyPassword(
      CREDENTIALS_PROVIDER_ID,
      input.email,
      input.password,
    );
    withToast(
      event,
      ToastType.success,
      "You can now Log In into your account with your new password",
    );
    throw event.redirect(302, Router.auth.logIn);
  },
  zodForm$(SetPassword_Schema),
);

export default component$(() => {
  const [SetPassword_Form, { Form, Field }] = useForm<SetPassword_Type>({
    loader: useSetPassword_FormLoader(),
    action: useSetPassword_FormAction(),
    validate: zodForm$(SetPassword_Schema),
  });

  return (
    <section class="container py-4">
      <Card class="mx-auto max-w-xl p-8">
        <H1>New password</H1>
        <Form>
          <Field name="token">
            {(field, props) => (
              <Input {...props} {...field} type="hidden" required />
            )}
          </Field>
          <Field name="email">
            {(field, props) => (
              <Input
                {...props}
                {...field}
                label="Your email"
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
          <Field name="repeatPassword">
            {(field, props) => (
              <Input
                {...props}
                {...field}
                label="Repeat Password"
                type="password"
                required
              />
            )}
          </Field>
          {SetPassword_Form.response.message && (
            <p class="text-red-500">{SetPassword_Form.response.message}</p>
          )}
          <Button
            size="wide"
            class="mt-2"
            type="submit"
            aria-label="Set Up new password button"
          >
            Set up password
          </Button>
        </Form>
      </Card>
    </section>
  );
});
