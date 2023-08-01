import { RequestEvent, RequestEventAction, RequestEventBase } from "@builder.io/qwik-city";

export enum ToastType {
    success="success",
    error="error",
    info="info"
}

export const withToast = (event: RequestEventAction | RequestEvent | RequestEventBase, type: ToastType, message: string) => {
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