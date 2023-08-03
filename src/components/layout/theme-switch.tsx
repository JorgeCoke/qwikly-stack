import { component$ } from "@builder.io/qwik";
import { useThemeSwich } from "~/routes/layout";
import LucideSunmoon from "../icons/lucide-sunmoon";
import { Button } from "../ui/buttons";

export const ThemeSwitch = component$(() => {
  const themeSwich = useThemeSwich();

  return (
    <Button
      onClick$={() => themeSwich.submit()}
      variant="ghost"
      aria-label="Theme switcher"
    >
      <LucideSunmoon class="h-4 w-4" />
    </Button>
  );
});
