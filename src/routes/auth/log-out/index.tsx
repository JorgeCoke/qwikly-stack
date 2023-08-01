import type { RequestHandler } from "@builder.io/qwik-city";
import { auth } from "~/lib/lucia-auth";
import { ToastType, redirectWithToast } from "~/lib/toast";

// See endpoint example: https://qwik.builder.io/docs/endpoints/
export const onGet: RequestHandler = async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (!session) {
    event.json(401, { message: "Unauthorized" });
  } else {
    authRequest.setSession(null);
    await auth.invalidateAllUserSessions(session.user.userId);
    redirectWithToast(event, ToastType.success, "Logout Success!");
    throw event.redirect(302, "/");
  }
};
