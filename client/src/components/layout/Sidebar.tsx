"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Search,
  Settings,
  ShieldCheck,
  BarChart3,
  Activity,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname();
  const [lastUpdate, setLastUpdate] = useState("Just Now");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLastUpdate(
        `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Applicants", href: "/dashboard/applicants", icon: Users },
    {
      name: "Ai screening",
      href: "/dashboard/screenings",
      icon: ShieldCheck,
    },
    { name: "System analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-72 bg-aurora-surface border-r border-aurora-border flex flex-col h-full shadow-2xl lg:shadow-none">
      <div className="p-8 border-b border-aurora-border/50 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="size-10 bg-aurora-blue rounded-xl flex items-center justify-center shadow-lg shadow-aurora-blue/20 group-hover:rotate-6 transition-all duration-500">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-aurora-dark tracking-tighter leading-none group-hover:text-aurora-blue transition-colors">
              HireIQ
            </h1>
            <span className="text-[11px] font-bold text-aurora-muted tracking-widest">
              Technical portal
            </span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-aurora-muted hover:text-aurora-blue transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                isActive
                  ? "bg-white text-aurora-blue shadow-lg shadow-aurora-blue/5 border border-aurora-border/50 scale-[1.02]"
                  : "text-aurora-muted hover:bg-white hover:text-aurora-dark hover:shadow-sm"
              }`}
            >
              <item.icon
                className={`size-5.5 ${isActive ? "text-aurora-blue" : "text-aurora-muted group-hover:text-aurora-blue transition-colors"}`}
              />
              <span
                className={`text-[15px] font-bold tracking-tight ${isActive ? "text-aurora-blue" : ""}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-aurora-border/50">
        <div className="bg-aurora-bg p-5 rounded-2xl border border-aurora-border/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="size-12 text-aurora-blue" />
          </div>
          <p className="text-[10px] font-black text-aurora-muted tracking-widest mb-1.5 flex items-center justify-between">
            System status
            <span className="text-aurora-blue animate-pulse">●</span>
          </p>
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-aurora-dark tracking-tight">
                Technical registry
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-aurora-muted tracking-widest">
                Online & Synced
              </span>
              <span className="text-[9px] font-black text-aurora-blue tracking-widest">
                {lastUpdate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
