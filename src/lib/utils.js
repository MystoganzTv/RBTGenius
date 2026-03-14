import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatTitle(value = "") {
  return String(value).trim();
}

export function noop() {}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
