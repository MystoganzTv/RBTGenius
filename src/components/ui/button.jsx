import { cn } from "@/lib/utils";

const buttonVariantStyles = {
  default:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:ring-brand-300",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
};

const buttonSizeStyles = {
  default: "h-10 px-4 py-2",
  sm: "h-8 rounded-lg px-3 text-xs",
  icon: "h-9 w-9",
};

export function buttonVariants({ variant = "default", size = "default" } = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
    buttonVariantStyles[variant] ?? buttonVariantStyles.default,
    buttonSizeStyles[size] ?? buttonSizeStyles.default,
  );
}

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export default Button;
