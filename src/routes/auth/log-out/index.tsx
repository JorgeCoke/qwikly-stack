import type { RequestHandler } from "@builder.io/qwik-city";
import { auth } from "~/lib/lucia-auth";
import { Router } from "~/lib/router";
import { ToastType, withToast } from "~/lib/toast";

// See endpoint example: https://qwik.builder.io/docs/endpoints/
export const onGet: RequestHandler = async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session) {
    throw event.error(401, "Unauthorized");
  } else {
    authRequest.setSession(null);
    await auth.invalidateAllUserSessions(session.user.userId);
    withToast(event, ToastType.success, "Logout Success!");
    throw event.redirect(302, Router.index);
  }
};
