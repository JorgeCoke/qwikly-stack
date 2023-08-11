import { CookieOptions } from "@builder.io/qwik-city";

export const CrudCookiesOptions: CookieOptions = {
  path: "/",
  sameSite: "strict",
  maxAge: 1 * 60 * 60,
  secure: true,
}

export const ToastCookiesOptions: CookieOptions = {
  path: "/",
  sameSite: "strict",
  maxAge: 2,
  secure: true,
}