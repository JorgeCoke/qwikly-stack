import { CookieOptions } from "@builder.io/qwik-city";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
