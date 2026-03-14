import { Bell, Crown, LogOut, Menu, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createPageUrl } from "@/utils";

const planLabels = {
  free: "Free Plan",
  premium_monthly: "Premium Monthly",
  premium_yearly: "Premium Yearly",
};

export default function TopBar({
  onMenuClick,
  user = null,
  plan = "free",
  onLogout,
}) {
  const fullName = user?.full_name || user?.name || "Student";
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {onMenuClick ? (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </Button>
        ) : null}

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics, questions..."
            className="w-[280px] rounded-xl border-0 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-600 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E5EFF]/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl text-slate-400 hover:text-slate-600"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#1E5EFF]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-xl py-1.5 pl-2 pr-3 transition-all hover:bg-slate-50">
              <Avatar className="h-8 w-8 bg-gradient-to-br from-[#1E5EFF] to-[#6366F1]">
                <AvatarFallback className="bg-transparent text-xs font-semibold text-white">
                  {initials || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-slate-700">{fullName}</p>
                <p className="text-[11px] text-slate-400">
                  {planLabels[plan] ?? planLabels.free}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <Link to={createPageUrl("Profile")}>
              <DropdownMenuItem className="rounded-lg">
                <User className="mr-2 h-4 w-4" /> Perfil
              </DropdownMenuItem>
            </Link>
            <Link to={createPageUrl("Pricing")}>
              <DropdownMenuItem className="rounded-lg text-[#FFB800]">
                <Crown className="mr-2 h-4 w-4" /> Upgrade to Pro
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="rounded-lg text-red-500"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
