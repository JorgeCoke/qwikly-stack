import { Slot, component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import LucideMenu from "~/components/icons/lucide-menu";
import LucideUser from "~/components/icons/lucide-user";
import { AnchorButton } from "~/components/ui/buttons";
import { Card } from "~/components/ui/card";
import { Router } from "~/lib/router";

export default component$(() => {
  const links = [
    {
      href: Router.admin.dashboard.users.index,
      icon: <LucideUser class="h-4 w-4" />,
      label: "Users",
      disabled: false,
    },
    {
      href: "other...",
      icon: <LucideMenu class="h-4 w-4" />,
      label: "Other...",
      disabled: true,
    },
  ];
  const loc = useLocation();

  return (
    <div class="flex grow flex-col md:flex-row">
      <nav class="flex flex-row gap-2 border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:m-4 md:mr-0 md:flex-col md:rounded-lg">
        {links.map((e) => (
          <AnchorButton
            key={e.href}
            class={[
              "justify-start p-4 hover:bg-slate-200 dark:hover:bg-slate-800 md:w-48",
              loc.url.pathname.includes(e.href)
                ? "bg-slate-100 dark:bg-slate-900"
                : "",
            ].join(" ")}
            href={e.href}
            variant="ghost"
            disabled={e.disabled}
          >
            {e.icon}
            {e.label}
          </AnchorButton>
        ))}
      </nav>
      <section class="container py-4">
        <Card class="p-4">
          <Slot />
        </Card>
      </section>
    </div>
  );
});
