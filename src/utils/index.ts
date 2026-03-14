import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

const pageUrlMap: Record<string, string> = {
  Dashboard: "/dashboard",
  Practice: "/practice",
  Flashcards: "/flashcards",
  MockExams: "/mock-exams",
  AITutor: "/ai-tutor",
  Analytics: "/analytics",
  Pricing: "/pricing",
  Profile: "/profile",
};

export function createPageUrl(pageName: string) {
  if (pageUrlMap[pageName]) {
    return pageUrlMap[pageName];
  }

  return `/${pageName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
}
