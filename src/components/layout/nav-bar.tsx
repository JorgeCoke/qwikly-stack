import { component$, useSignal } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";
import { Router } from "~/lib/router";
import { siteConfig } from "~/lib/site.config";
import { useSession } from "~/routes/layout";
import LucideMenu from "../icons/lucide-menu";
import LucideUser from "../icons/lucide-user";
import LucideZap from "../icons/lucide-zap";
import { AnchorButton, Button } from "../ui/buttons";
import { ThemeSwitch } from "./theme-switch";

export const NavBar = component$(() => {
  const session = useSession();
  const showMobileNavBar = useSignal(false);

  return (
    <header class="z-10 flex w-full flex-col border-b border-black/[.1] bg-white dark:border-white/[.1] dark:bg-slate-950 sm:justify-start md:flex-row">
      <nav class="container relative mx-auto  w-full px-4 sm:flex sm:items-center sm:justify-between">
        <div class="flex items-center justify-between">
          <a
            class="flex w-max items-center gap-2 text-xl font-semibold text-black dark:text-white"
            href={Router.index}
            aria-label={siteConfig.title}
          >
            <LucideZap />
            {siteConfig.title}
          </a>
          <div class="py-4 sm:hidden">
            <Button
              aria-label="Navbar menu"
              type="button"
              variant="outline"
              class="w-auto"
              onClick$={() =>
                (showMobileNavBar.value = !showMobileNavBar.value)
              }
            >
              <LucideMenu />
            </Button>
          </div>
        </div>
        <div class="hs-collapse hidden grow basis-full overflow-hidden py-3 transition-all duration-300 sm:block">
          <div class="mt-5 flex flex-col gap-x-0 gap-y-4 sm:mt-0 sm:flex-row sm:items-center sm:justify-end sm:gap-x-7 sm:gap-y-0 sm:pl-7">
            {siteConfig.navBar.map((e) => (
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
              {!session.value && (
                <>
                  <AnchorButton
                    variant="outline"
                    href={Router.auth.logIn}
                    aria-label="LogIn button"
                  >
                    Log In
                  </AnchorButton>
                  <AnchorButton
                    href={Router.auth.signUp}
                    aria-label="SignUp button"
                  >
                    Sign Up
                  </AnchorButton>
                </>
              )}
              {session.value && (
                <AnchorButton
                  href={Router.auth.profile}
                  class="flex items-center gap-2"
                  aria-label="Profile button"
                >
                  <LucideUser class="h-4 w-4" /> Profile
                </AnchorButton>
              )}
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </nav>
      <div
        class={twMerge(
          "flex flex-col gap-6 p-6",
          showMobileNavBar.value ? "" : "hidden"
        )}
      >
        {siteConfig.navBar.map((e) => (
          <a
            aria-label={e.title}
            key={e.href}
            class="text-slate-800 hover:text-black dark:text-slate-300 dark:hover:text-white"
            href={e.href}
          >
            {e.title}
          </a>
        ))}
        {!session.value && (
          <>
            <AnchorButton
              variant="outline"
              href={Router.auth.logIn}
              aria-label="LogIn button"
            >
              Log In
            </AnchorButton>
            <AnchorButton href={Router.auth.signUp} aria-label="SignUp button">
              Sign Up
            </AnchorButton>
          </>
        )}
        {session.value && (
          <AnchorButton
            href={Router.auth.profile}
            class="flex items-center gap-2"
            aria-label="Profile button"
          >
            <LucideUser class="h-4 w-4" /> Profile
          </AnchorButton>
        )}
        <ThemeSwitch />
      </div>
    </header>
  );
});
