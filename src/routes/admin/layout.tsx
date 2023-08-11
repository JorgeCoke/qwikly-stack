import type { RequestHandler } from "@builder.io/qwik-city";
import { auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const onRequest: RequestHandler = async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  // TODO: You can restrict the access to your admin dashboard here
  // if (event.url.pathname.includes(Router.admin.landing.index) && session && session.user.role !== UserRole.Admin) {
  //   withToast(event, ToastType.error, "You are not authorized to access this page");
  //   throw event.redirect(302, Router.admin.landing.index);
  // }

  if (!event.url.pathname.includes(Router.admin.landing.index) && !session) {
    withToast(event, ToastType.error, "You need to Log In first!");
    throw event.redirect(302, Router.admin.landing.access);
  }
  if (event.url.pathname.includes(Router.admin.landing.access) && session) {
    withToast(event, ToastType.error, "You are already signed in");
    throw event.redirect(302, Router.admin.dashboard.index);
  }
  // await event.next();
};
