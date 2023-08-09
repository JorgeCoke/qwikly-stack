import { component$ } from "@builder.io/qwik";
import { Router } from "~/lib/router";
import { siteConfig } from "~/lib/site.config";
import GithubIcon from "../icons/github-icon";
import { ThemeSwitch } from "./theme-switch";

export const Footer = component$(() => {
  const links = [
    {
      icon: <GithubIcon />,
      href: "https://github.com/JorgeCoke/qwikly-stack",
    },
  ];

  return (
    <footer class="w-full border-t border-white/[.1] bg-white py-8 dark:bg-slate-950">
      <div class="container space-y-3 text-center">
        <a
          class="text-xl font-semibold text-black dark:text-white"
          href={Router.index}
          aria-label={siteConfig.title}
        >
          {siteConfig.title}
        </a>

        <p class="text-sm text-slate-700 dark:text-slate-400">
          Copyright © 2023 JorgeCoke - All rights reserved. See our{" "}
          <a
            aria-label="Terms and conditions"
            class="underline underline-offset-4 hover:text-black dark:hover:text-white"
            href={Router.termsAndConditions}
          >
            Terms of Service
          </a>
        </p>

        <div class="flex items-center justify-between">
          <ThemeSwitch />
          <div class="space-x-2">
            {links.map((e) => (
              <a
                aria-label="Github link"
                key={e.href}
                href={e.href}
                class="inline-flex h-10 w-10 items-center justify-center rounded-full  text-center text-slate-400 transition hover:bg-slate-300 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-white dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                {e.icon}
              </a>
            ))}
          </div>
          <p class="text-xs text-black opacity-50 dark:text-white">
            v{process.env.npm_package_version}
          </p>
        </div>
      </div>
    </footer>
  );
});
