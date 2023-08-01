import { RequestEvent, RequestEventAction } from "@builder.io/qwik-city";

export enum ToastType {
    success="success",
    error="error",
    info="info"
}

export const redirectWithToast = (event: RequestEventAction | RequestEvent, type: ToastType, message: string) => {
    event.cookie.set(
        type,
        message,
        {
            path: "/",
            sameSite: "strict",
            maxAge: 1,
            secure: true,
          }
      );
}