import type { RequestHandler } from "@builder.io/qwik-city";
import { auth } from "~/lib/lucia-auth";
import { ToastType, redirectWithToast } from "~/lib/toast";

export const onRequest: RequestHandler = async (event) => {
  if (!event.url.pathname.includes("/log-out")) {
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();
    if (session) {
      redirectWithToast(event, ToastType.success, "You are already signed in!");
      throw event.redirect(302, "/");
    }
    // await event.next();
  }
};
