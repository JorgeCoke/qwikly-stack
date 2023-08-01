import { component$ } from "@builder.io/qwik";
import { LuMenu } from "@qwikest/icons/lucide";
import { siteConfig } from "~/lib/site.config";
import { useSession } from "~/routes/layout";
import { AnchorButton, Button } from "../ui/buttons";

export const NavBar = component$(() => {
  const session = useSession();

  return (
    <header class="flex w-full border-b border-white/[.1] bg-slate-950 sm:justify-start">
      <nav class="container relative mx-auto w-full px-4 sm:flex sm:items-center sm:justify-between">
        <div class="flex items-center justify-between">
          <a
            class="w-max text-xl font-semibold text-white"
            href="/"
            aria-label={siteConfig.title}
          >
            {siteConfig.title}
          </a>
          <div class="py-4 sm:hidden">
            <Button type="button" variant="outline" class="w-auto">
              <LuMenu />
            </Button>
          </div>
        </div>
        <div class="hs-collapse hidden grow basis-full overflow-hidden py-3 transition-all duration-300 sm:block">
          <div class="mt-5 flex flex-col gap-x-0 gap-y-4 sm:mt-0 sm:flex-row sm:items-center sm:justify-end sm:gap-x-7 sm:gap-y-0 sm:pl-7">
            {siteConfig.navBar.map((e) => (
              <a
                key={e.href}
                class=" text-slate-300 hover:text-white"
                href={e.href}
              >
                {e.title}
              </a>
            ))}
            {!session.value && (
              <>
                <AnchorButton variant="outline" href="/auth/log-in">
                  Log In
                </AnchorButton>
                <AnchorButton href="/auth/sign-up">Sign Up</AnchorButton>
              </>
            )}
            {session.value && (
              <Button>
                <a href="/auth/log-out">Log out</a>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
});
