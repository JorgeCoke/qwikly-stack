import { component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { UserRole } from "~/lib/db/schema";
import { Router } from "~/lib/router";
import { SiteConfig } from "~/lib/site-config";
import { cn } from "~/lib/utils";
import { useSession } from "~/routes/layout";
import LucideCog from "../icons/lucide-cog";
import LucideMenu from "../icons/lucide-menu";
import LucideUser from "../icons/lucide-user";
import LucideZap from "../icons/lucide-zap";
import { AnchorButton, Button } from "../ui/buttons";
import { Gradient } from "../ui/typography";
import { ThemeSwitch } from "./theme-switch";

export const NavBar = component$(() => {
  const showMobileNavBar = useSignal(false);
  const loc = useLocation();

  return (
    <header class="z-10 flex w-full flex-col border-b border-black/[.1] bg-white dark:border-white/[.1] dark:bg-slate-950 lg:flex-row lg:justify-start">
      <nav class="container relative mx-auto  w-full px-4 lg:flex lg:items-center lg:justify-between">
        <div class="flex items-center justify-between">
          <a
            class="cal flex w-max items-center gap-2 text-xl text-black dark:text-white"
            href={Router.index}
            aria-label={SiteConfig.title}
          >
            <LucideZap />
            {SiteConfig.title}
            {loc.url.pathname.includes(Router.admin.index) && (
              <Gradient>ADMIN</Gradient>
            )}
          </a>
          <div class="py-3 lg:hidden">
            <Button
              aria-label="Navbar menu"
              type="button"
              variant="outline"
              class="w-auto"
              onClick$={() =>
                (showMobileNavBar.value = !showMobileNavBar.value)
              }
            >
              <LucideMenu class="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div class="hs-collapse hidden grow basis-full overflow-hidden py-3 transition-all duration-300 lg:block">
          <div class="mt-5 flex flex-col gap-x-0 gap-y-4 lg:mt-0 lg:flex-row lg:items-center lg:justify-end lg:gap-x-7 lg:gap-y-0 lg:pl-7">
            {SiteConfig.navBar.map((e) => (
              <a
                aria-label={e.title}
                key={e.href}
                class="text-slate-800 hover:text-black dark:text-slate-300 dark:hover:text-white"
                href={e.href}
              >
                {e.title}
              </a>
            ))}
            <div class="flex gap-3">
              <AuthButtons />
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </nav>
      <div
        class={cn(
          "flex flex-col gap-6 p-6",
          showMobileNavBar.value ? "" : "hidden",
        )}
      >
        {SiteConfig.navBar.map((e) => (
          <a
            aria-label={e.title}
            key={e.href}
            class="text-slate-800 hover:text-black dark:text-slate-300 dark:hover:text-white"
            href={e.href}
          >
            {e.title}
          </a>
        ))}
        <AuthButtons />
        <ThemeSwitch />
      </div>
    </header>
  );
});

const AuthButtons = component$(() => {
  const loc = useLocation();
  const session = useSession();

  return (
    <>
      {!session.value && !loc.url.pathname.includes(Router.admin.index) && (
        <>
          <AnchorButton
            class="justify-start"
            size="wide"
            variant="outline"
            href={Router.auth.logIn}
            aria-label="LogIn button"
          >
            Log In
          </AnchorButton>
          <AnchorButton
            class="justify-start"
            size="wide"
            href={Router.auth.signUp}
            aria-label="SignUp button"
          >
            Sign Up
          </AnchorButton>
        </>
      )}
      {!session.value && loc.url.pathname.includes(Router.admin.index) && (
        <>
          <AnchorButton
            size="wide"
            href={Router.admin.access}
            aria-label="Access button"
            class=" justify-start bg-gradient-to-tl from-blue-600 to-violet-600 dark:text-white"
          >
            Access Admin Panel
          </AnchorButton>
        </>
      )}
      {session.value && (
        <AnchorButton
          class="justify-start"
          size="wide"
          href={Router.auth.profile}
          aria-label="Profile button"
        >
          <LucideUser class="h-4 w-4" /> Profile
        </AnchorButton>
      )}
      {session.value && session.value.user.role === UserRole.Admin && (
        <>
          <AnchorButton
            size="wide"
            href={Router.admin.dashboard.index}
            aria-label="Admin button"
            class="justify-start bg-gradient-to-tl from-blue-600 to-violet-600 dark:text-white"
          >
            <LucideCog class="h-4 w-4" /> Admin
          </AnchorButton>
          <AnchorButton
            class="justify-start"
            size="wide"
            href={Router.auth.logOut}
            aria-label="Log out button"
            color="danger"
          >
            Log Out
          </AnchorButton>
        </>
      )}
    </>
  );
});
