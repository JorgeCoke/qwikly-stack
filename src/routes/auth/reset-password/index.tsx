import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { useForm, zodForm$ } from "@modular-forms/qwik";
import LucideKeySquare from "~/components/icons/lucide-key-square";
import { Button } from "~/components/ui/buttons";
import { Input } from "~/components/ui/form";
import { H1 } from "~/components/ui/typography";
import { useSendSetPasswordEmail } from "~/routes/layout";

export const ResetPassword_Schema = z.object({
  email: z.string().email(),
});
type ResetPassword_Type = z.infer<typeof ResetPassword_Schema>;

export const useResetPassword_FormLoader = routeLoader$<
  InitialValues<ResetPassword_Type>
>((event) => ({
  email: event.query.get("email") || "",
}));

export default component$(() => {
  const sendSetPasswordEmail = useSendSetPasswordEmail();

  const [ResetPassword_Form, { Form, Field }] = useForm<ResetPassword_Type>({
    loader: useResetPassword_FormLoader(),
    validate: zodForm$(ResetPassword_Schema),
  });

  return (
    <section class="container flex w-96 flex-col items-center py-4">
      <H1>Reset password</H1>
      <Form
        onSubmit$={async (input) => {
          await sendSetPasswordEmail.submit({ email: input.email });
        }}
      >
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
        <Button
          size="wide"
          class="mt-2"
          type="submit"
          aria-label="Reset password button"
          disabled={sendSetPasswordEmail.isRunning}
        >
          Reset password
        </Button>
      </Form>
      <p class="mt-8 flex w-full flex-row items-center justify-center border-t border-slate-400 pt-6 text-center text-slate-800 dark:border-slate-700 dark:text-slate-400">
        Go back to
        <a
          class="px-2 font-medium underline underline-offset-4 hover:text-black dark:hover:text-white"
          href={`/auth/log-in`}
        >
          Log In page
        </a>
        <LucideKeySquare class="h-4 w-4" />
      </p>
    </section>
  );
});
