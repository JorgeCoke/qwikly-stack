import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useToasts } from "~/routes/layout";
import LucideCheckCircle2 from "../icons/lucide-check-circle-2";
import LucideInfo from "../icons/lucide-info";
import LucideX from "../icons/lucide-x";
import LucideXCircle from "../icons/lucide-x-circle";

export const Toaster = component$(() => {
  const toasts = useToasts();
  const shown = useSignal(true);

  useVisibleTask$(() => {
    const timeoutId = setTimeout(() => {
      shown.value = false;
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  });

  return (toasts.value.success || toasts.value.error || toasts.value.info) &&
    shown.value ? (
    <div class="absolute left-0 top-8 z-20 w-full">
      <div class="mx-auto w-full rounded-md border border-slate-300 bg-slate-100 shadow-lg dark:border-slate-500 md:w-2/3 xl:w-1/2">
        <div class="flex items-center justify-between gap-4 p-4">
          <button type="button">
            {toasts.value.success && (
              <LucideCheckCircle2 class="h-6 w-6 text-green-500" />
            )}
            {toasts.value.error && (
              <LucideXCircle class="h-6 w-6 text-red-500" />
            )}
            {toasts.value.info && <LucideInfo class="h-6 w-6 text-blue-500" />}
          </button>
          <p class="grow text-slate-950">
            {toasts.value.success || toasts.value.error || toasts.value.info}
          </p>
          <button
            type="button"
            class=" text-slate-900 hover:text-slate-950"
            onClick$={() => {
              shown.value = false;
            }}
          >
            <LucideX class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
});
function useVisibleTask(arg0: () => void) {
  throw new Error("Function not implemented.");
}
