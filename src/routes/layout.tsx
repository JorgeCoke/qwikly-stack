import { component$, Slot } from "@builder.io/qwik";
import { globalAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";
import "cal-sans";
import { Footer } from "~/components/layout/footer";
import { NavBar } from "~/components/layout/nav-bar";
import { TailwindIndicator } from "~/components/layout/tailwind-indicator";
import { Toaster } from "~/components/layout/toaster";
import type { CrudCookies } from "~/components/ui/crud";
import { signJwt } from "~/lib/crypto";
import { auth } from "~/lib/lucia-auth";
import { sendSetPasswordEmail } from "~/lib/mail/mailer";
import { ToastType, withToast } from "~/lib/toast";
import { CrudCookiesOptions } from "~/lib/utils";

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

export const useThemeSwich = globalAction$(async (input, event) => {
  const theme = event.cookie.get("theme")?.value || "light";
  event.cookie.set("theme", theme === "light" ? "dark" : "light", {
    path: "/",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60,
    secure: true,
  });
});

// NOTE: We could use queryParams instead
export const useSetCrudCookies = globalAction$(async (input, event) => {
  let crudCookies: CrudCookies | undefined = event.cookie
    .get(input.cookieKey)
    ?.json();
  if (crudCookies) {
    crudCookies = { ...crudCookies, ...input };
    event.cookie.set(input.cookieKey, crudCookies, CrudCookiesOptions);
  }
}, zod$({ cookieKey: z.string(), limit: z.number().optional(), offset: z.number().optional() }));

export const useResetCrudCookies = globalAction$(async (input, event) => {
  event.cookie.delete(input.cookieKey);
}, zod$({ cookieKey: z.string() }));

export const useSetCrudOrderBy = globalAction$(async (input, event) => {
  const crudCookies: CrudCookies | undefined = event.cookie
    .get(input.cookieKey)
    ?.json();
  if (crudCookies) {
    crudCookies.orderBy = input.sort ? `${input.columnName},${input.sort}` : "";
    event.cookie.set(input.cookieKey, crudCookies, CrudCookiesOptions);
  }
}, zod$({ cookieKey: z.string(), columnName: z.string(), sort: z.string().nullable() }));

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

export const useTheme = routeLoader$(async (event) => {
  if (!event.cookie.get("theme")?.value) {
    event.cookie.set("theme", "light", {
      path: "/",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      secure: true,
    });
  }
  const theme = event.cookie.get("theme")?.value || "light";
  return theme as "light" | "dark";
});

export default component$(() => {
  const theme = useTheme();

  return (
    <div class={theme.value}>
      <div class="flex min-h-screen flex-col overflow-x-hidden bg-slate-100 dark:bg-slate-900">
        <NavBar />
        <main class="flex-1 flex items-stretch overflow-x-auto bg-gradient-to-b from-slate-50 via-transparent dark:from-violet-600/[.15] dark:via-transparent">
          <Slot />
        </main>
        <Footer />
        <Toaster />
        <TailwindIndicator />
      </div>
    </div>
  );
});
