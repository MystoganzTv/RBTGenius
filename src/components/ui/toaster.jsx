import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

function resolveTheme(theme, prefersDark) {
  if (theme === "system") {
    return prefersDark ? "dark" : "light";
  }

  return theme;
}

function Toaster(props) {
  const [prefersDark, setPrefersDark] = useState(false);
  const theme = props.theme ?? "system";

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setPrefersDark(mediaQuery.matches);

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);

  return (
    <Sonner
      theme={resolveTheme(theme, prefersDark)}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:border-slate-200 group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-slate-500",
          actionButton:
            "group-[.toast]:bg-brand-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
