import { Router } from "./router";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  title: "Qwikly Stack",
  description: "The qwikest delightful, overpowered, beautifully handcrafted full-stack web framework template, built on top of Qwik, seasoned with modern tools",
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
      title: "C.R.U.D.",
      href: Router.users.index
    },
  ],
} as const;
