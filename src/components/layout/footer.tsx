import { component$ } from "@builder.io/qwik";
import { siteConfig } from "~/lib/site.config";
import GithubIcon from "../icons/github-icon";

export const Footer = component$(() => {
  const links = [
    {
      icon: <GithubIcon />,
      href: "https://github.com/JorgeCoke/qwikly-stack",
    },
  ];

  return (
    <footer class="w-full border-t border-white/[.1] bg-slate-950 py-8">
      <div class="container space-y-3 text-center">
        <a
          class="text-xl font-semibold text-white"
          href="/"
          aria-label={siteConfig.title}
        >
          {siteConfig.title}
        </a>

        <p class="text-sm text-slate-400">
          Copyright © 2023 JorgeCoke - All rights reserved. See our{" "}
          <a
            aria-label="Terms and conditions"
            class="underline underline-offset-4 hover:text-white"
            href="/terms-and-conditions"
          >
            Terms of Service
          </a>
        </p>

        <div class="space-x-2">
          {links.map((e) => (
            <a
              aria-label="Github link"
              key={e.href}
              href={e.href}
              class="inline-flex h-10 w-10 items-center justify-center rounded-full  text-center text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-white"
            >
              {e.icon}
            </a>
          ))}
        </div>
        <p class="absolute right-2 text-xs text-white opacity-20">
          v{process.env.npm_package_version}
        </p>
      </div>
    </footer>
  );
});
