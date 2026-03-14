import { Children, cloneElement, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DropdownMenuContext = createContext(null);

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);

  if (!context) {
    throw new Error("DropdownMenu components must be used within DropdownMenu");
  }

  return context;
}

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open],
  );

  return (
    <DropdownMenuContext.Provider value={value}>
      <div ref={containerRef} className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild = false,
  children,
  className,
  ...props
}) {
  const { open, setOpen } = useDropdownMenu();

  const triggerProps = {
    type: "button",
    "aria-expanded": open,
    "aria-haspopup": "menu",
    onClick: () => setOpen((current) => !current),
    className,
    ...props,
  };

  if (asChild && Children.count(children) === 1) {
    const child = Children.only(children);

    return cloneElement(child, {
      ...triggerProps,
      className: cn(child.props.className, className),
      onClick: (event) => {
        child.props.onClick?.(event);
        if (!event.defaultPrevented) {
          triggerProps.onClick(event);
        }
      },
    });
  }

  return <button {...triggerProps}>{children}</button>;
}

export function DropdownMenuContent({
  align = "start",
  className,
  children,
  ...props
}) {
  const { open } = useDropdownMenu();

  if (!open) {
    return null;
  }

  return (
    <div
      role="menu"
      className={cn(
        "absolute top-full z-50 mt-2 min-w-[12rem] rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-200/60",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ className, onClick, children, ...props }) {
  const { setOpen } = useDropdownMenu();

  return (
    <div
      role="menuitem"
      className={cn(
        "flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-50",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className, ...props }) {
  return (
    <div
      className={cn("my-1 h-px bg-slate-100", className)}
      {...props}
    />
  );
}
