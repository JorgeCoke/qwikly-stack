import { component$, Slot } from "@builder.io/qwik";
import { globalAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";
import { Footer } from "~/components/layout/footer";
import { NavBar } from "~/components/layout/nav-bar";
import { Toaster } from "~/components/layout/toaster";
import { signJwt } from "~/lib/crypto";
import { auth } from "~/lib/lucia-auth";
import { sendSetPasswordEmail } from "~/lib/mail/mailer";
import { ToastType, withToast } from "~/lib/toast";

// Global Actions here. See: https://qwik.builder.io/docs/action/#globalaction
export const useSendSetPasswordEmail = globalAction$(async (input, event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  const email = session?.user.email ? session.user.email : input.email;
  const token = await signJwt({ email }, 24 * 60 * 60);
  sendSetPasswordEmail(
    { to: email! },
    { url: `${process.env.ORIGIN}auth/set-password?token=${token}` }
  );
  withToast(
    event,
    ToastType.success,
    "If your account exists, an email have been sent to your email. Please, follow the instructions to reset your password"
  );
}, zod$({ email: z.string().email().nullable() }));

// Global Loaders here. See: https://qwik.builder.io/docs/route-loader/#access-the-routeloader-data-within-another-routeloader
export const useSession = routeLoader$(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  return session;
});

export const useToasts = routeLoader$(async (event) => {
  const success = event.cookie.get("success")?.value;
  const error = event.cookie.get("error")?.value;
  const info = event.cookie.get("info")?.value;
  return { success, error, info };
});

export default component$(() => {
  return (
    <div class="flex min-h-screen flex-col overflow-x-hidden bg-slate-900">
      <NavBar />
      <main class="flex-1 bg-gradient-to-b from-violet-600/[.15] via-transparent">
        <Slot />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
});
