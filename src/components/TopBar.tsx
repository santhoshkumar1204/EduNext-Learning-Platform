import Icon from "./Icon";
import { getCurrentUser } from "../lib/database";

export default function TopBar({ title }: { title?: string }) {
  const user = getCurrentUser();
  const initial = (user?.name || "U").charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        {title && <h1 className="font-bold text-navy text-lg font-display hidden sm:block">{title}</h1>}
        <div className="relative max-w-xs w-full hidden md:block">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]" />
          <input
            placeholder="Search…"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:text-navy">
          <Icon name="notifications" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-navy hidden sm:block">{user?.name || "User"}</span>
          <div className="w-9 h-9 rounded-full bg-[#0F2B5B] text-white flex items-center justify-center font-bold text-sm">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
