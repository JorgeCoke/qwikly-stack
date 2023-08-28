import type { RequestHandler } from "@builder.io/qwik-city";
import { UserRole } from "~/lib/db/schema";
import { auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

export const onRequest: RequestHandler = async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();

  if (
    event.url.pathname.includes(Router.admin.dashboard.index) &&
    (!session || session.user.role !== UserRole.Admin)
  ) {
    withToast(
      event,
      ToastType.error,
      "You are not authorized to access this page",
    );
    throw event.redirect(302, Router.admin.index);
  }
  if (event.url.pathname.includes(Router.admin.access) && session) {
    withToast(event, ToastType.success, "You are already signed in");
    throw event.redirect(302, Router.admin.dashboard.index);
  }
  // await event.next();
};
