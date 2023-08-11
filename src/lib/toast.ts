import { RequestEvent, RequestEventAction, RequestEventBase } from "@builder.io/qwik-city";
import { ToastCookiesOptions } from "./utils";

export enum ToastType {
    success = "success",
    error = "error",
    info = "info"
}

export const withToast = (event: RequestEventAction | RequestEvent | RequestEventBase, type: ToastType, message: string) => {
    event.cookie.delete(ToastType.success, ToastCookiesOptions);
    event.cookie.delete(ToastType.error, ToastCookiesOptions);
    event.cookie.delete(ToastType.info, ToastCookiesOptions);
    event.cookie.set(
        type,
        message,
        ToastCookiesOptions
    );
}