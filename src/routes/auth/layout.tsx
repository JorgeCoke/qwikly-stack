import type { RequestHandler } from "@builder.io/qwik-city";
import { auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const onRequest: RequestHandler = async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (
    event.url.pathname.includes(Router.auth.logIn) ||
    event.url.pathname.includes(Router.auth.signUp)
  ) {
    if (session) {
      withToast(event, ToastType.success, "You are already signed in!");
      throw event.redirect(302, Router.index);
    }
  }
  if (
    event.url.pathname.includes(Router.auth.profile) ||
    event.url.pathname.includes(Router.auth.logOut)
  ) {
    if (!session) {
      withToast(event, ToastType.success, "You are not signed in!");
      throw event.redirect(302, Router.index);
    }
  }
  // await event.next();
};
