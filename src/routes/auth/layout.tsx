import type { RequestHandler } from "@builder.io/qwik-city";
import { auth } from "~/lib/lucia-auth";
import { ToastType, withToast } from "~/lib/toast";

export const onRequest: RequestHandler = async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (
    event.url.pathname.includes("/log-in") ||
    event.url.pathname.includes("/sign-up")
  ) {
    if (session) {
      withToast(event, ToastType.success, "You are already signed in!");
      throw event.redirect(302, "/");
    }
  }
  if (
    event.url.pathname.includes("/profile") ||
    event.url.pathname.includes("/log-out")
  ) {
    if (!session) {
      withToast(event, ToastType.success, "You are not signed in!");
      throw event.redirect(302, "/");
    }
  }
  // await event.next();
};
