import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-slate-900 text-white",
  secondary: "bg-slate-100 text-slate-700",
  outline: "border border-slate-200 bg-white text-slate-700",
};

export default function Badge({
  className,
  variant = "default",
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        badgeVariants[variant] ?? badgeVariants.default,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
