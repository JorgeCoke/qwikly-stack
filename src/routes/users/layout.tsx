import type { RequestHandler } from "@builder.io/qwik-city";
import { auth } from "~/lib/lucia-auth";
import { ToastType, redirectWithToast } from "~/lib/toast";

export const onRequest: RequestHandler = async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session) {
    redirectWithToast(event, ToastType.error, "You need to Log In first!");
    throw event.redirect(302, "/auth/log-in");
  }
  // await event.next();
};
