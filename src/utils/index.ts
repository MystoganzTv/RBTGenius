import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

export function createPageUrl(pageName: string) {
  return `/?page=${pageName.replace(/ /g, "-")}`;
}
