import { Router } from "./router";

export const SiteConfig = {
  title: "Qwikly Stack",
  description: "The qwikest delightful, overpowered, beautifully handcrafted full-stack web framework template, built on top of Qwik, seasoned with modern tools",
  keywords: "qwikly stack, qwik, qwikly, template, stack, framework, fullstack, drizzleorm, lucia auth, github",
  navBar: [
    {
      title: "Home",
      href: Router.index
    },
    {
      title: "Payments",
      href: Router.payments.index
    },
    {
      title: "Admin",
      href: Router.admin.index
    },
  ],
} as const;
