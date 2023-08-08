import { CookieOptions } from "@builder.io/qwik-city";

export const CrudCookiesOptions: CookieOptions = {
    path: "/",
    sameSite: "strict",
    maxAge: 1 * 60 * 60,
    secure: true,
  }