import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { LuChevronsRight } from "@qwikest/icons/lucide";
import { AnchorButton } from "~/components/ui/buttons";
import { H0 } from "~/components/ui/typography";
import ImgQwikLogo from "~/media/qwik-logo.svg?jsx";

export default component$(() => {
  return (
    <section class="mx-auto max-w-[85rem] space-y-10 py-24">
      <ImgQwikLogo class="mx-auto h-24" />
      <div class="mx-auto max-w-3xl text-center">
        <H0>
          Now it's easier than ever to{" "}
          <span class="bg-gradient-to-tr from-blue-600 to-violet-400 bg-clip-text text-transparent">
            build products
          </span>
        </H0>
      </div>

      <div class="mx-auto max-w-5xl text-center">
        <p class="text-lg text-slate-400">
          Delightful, overpowered, beautifully handcrafted web framework
          template, built on top of Qwik, seasoned with modern tools.
        </p>
      </div>

      <div class="text-center">
        <AnchorButton
          class=" rounded-full bg-gradient-to-tl from-blue-600 to-violet-600 px-6 py-3  font-bold  text-white shadow-lg  hover:shadow-blue-700/50 "
          href="/auth/log-in"
        >
          GET STARTED
        </AnchorButton>
      </div>
      <div class="flex justify-center">
        <div class="group flex cursor-pointer items-center justify-between gap-4 rounded-full border border-white/[.05] bg-white/[.05] p-1 px-4 pl-4 text-sm text-slate-300 shadow-md hover:bg-white/[.1]">
          <span>Open Source, and Edge Runtime ready!</span>
          <LuChevronsRight />
        </div>
      </div>
    </section>
  );
});

// See https://qwik.builder.io/docs/caching/
export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};
