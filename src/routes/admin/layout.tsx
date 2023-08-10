import { Slot, component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import LucideMenu from "~/components/icons/lucide-menu";
import LucideUser from "~/components/icons/lucide-user";
import { AnchorButton } from "~/components/ui/buttons";
import { auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const onRequest: RequestHandler = async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session) {
    withToast(event, ToastType.error, "You need to Log In first!");
    throw event.redirect(302, Router.auth.logIn);
  }
  // await event.next();
};

export default component$(() => {
  const links = [
    {
      href: Router.admin.users.index,
      icon: <LucideUser class="h-4 w-4" />,
      label: "Users",
      disabled: false,
    },
    {
      href: null,
      icon: <LucideMenu class="h-4 w-4" />,
      label: "Other...",
      disabled: true,
    },
  ];

  return (
    <div class="flex flex-col md:flex-row">
      <nav class="flex flex-row gap-2 border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:m-4 md:mr-0 md:flex-col md:rounded-lg">
        {links.map((e) => (
          <AnchorButton
            key={e.href}
            class="flex gap-2 bg-slate-100 p-3 dark:bg-slate-900 md:w-48"
            href={e.href}
            variant="ghost"
            disabled={e.disabled}
          >
            {e.icon}
            {e.label}
          </AnchorButton>
        ))}
      </nav>
      <Slot />
    </div>
  );
});
