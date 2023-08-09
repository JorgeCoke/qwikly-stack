import type { RequestHandler } from "@builder.io/qwik-city";
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
