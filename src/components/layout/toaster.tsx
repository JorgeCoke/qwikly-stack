import { component$, useSignal } from "@builder.io/qwik";
import { LuCheckCircle2, LuInfo, LuX, LuXCircle } from "@qwikest/icons/lucide";
import { useToasts } from "~/routes/layout";

// TODO: Close toasts automatically
export const Toaster = component$(() => {
  const toasts = useToasts();
  const shown = useSignal(true);

  return (toasts.value.success || toasts.value.error || toasts.value.info) &&
    shown.value ? (
    <div class="absolute left-0 top-8 w-full">
      <div class="mx-auto w-full rounded-md border border-slate-500 bg-slate-100 shadow-lg md:w-2/3 xl:w-1/2">
        <div class="flex items-center justify-between p-4">
          <span class="flex items-center text-slate-950">
            {toasts.value.success && (
              <LuCheckCircle2 class="mr-4 h-6 w-6 text-green-500" />
            )}
            {toasts.value.error && (
              <LuXCircle class="mr-4 h-6 w-6 text-red-500" />
            )}
            {toasts.value.info && <LuInfo class="mr-4 h-6 w-6 text-blue-500" />}
            {toasts.value.success || toasts.value.error || toasts.value.info}
          </span>
          <button
            type="button"
            class=" text-slate-900 hover:text-slate-950"
            onClick$={() => {
              shown.value = false;
            }}
          >
            <LuX class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
});
