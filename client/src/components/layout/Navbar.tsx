"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  User,
  LogOut,
  ChevronRight,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Menu,
  Clock,
  Check,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/api";
import { useNotifications } from "@/context/NotificationContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const pathname = usePathname();
  const {
    notifications: localNotifs,
    removeNotification,
    snoozeNotification,
  } = useNotifications();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    // Get user from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch dynamic notifications
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/stats");
        const stats = response.data.data;
        setNotifications(stats.recentActivity || []);
      } catch (error) {
        setNotifications([]);
      }
    };
    fetchNotifications();

    const handleProfileSync = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    window.addEventListener("user-profile-updated", handleProfileSync);
    return () => window.removeEventListener("user-profile-updated", handleProfileSync);
  }, []);

  const allNotifications = [...localNotifs, ...notifications];

  const handleSignOut = () => {
    toast.info("Signing out of your company portal...");
    localStorage.removeItem("user");
    setTimeout(() => {
      router.push("/login");
      toast.success("You have been signed out.");
    }, 1000);
  };

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter((p) => p);
    return paths.map((path, i) => ({
      name:
        path.charAt(0).toUpperCase() +
        path.slice(1).replace("-", " ").toLowerCase(),
      href: "/" + paths.slice(0, i + 1).join("/"),
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-20 bg-aurora-surface border-b border-aurora-border flex items-center justify-between px-4 md:px-8 relative z-30">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-aurora-muted hover:text-aurora-blue transition-colors"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-widest text-aurora-muted">
          <span className="hidden sm:inline">
            {user?.company || "Company registry"}
          </span>
          <ChevronRight className="size-3 text-aurora-blue hidden sm:inline" />
          {breadcrumbs.slice(-2).map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-2">
              <Link
                href={crumb.href}
                className={`hover:text-aurora-blue transition-colors ${i === breadcrumbs.slice(-2).length - 1 ? "text-aurora-dark" : ""}`}
              >
                {crumb.name}
              </Link>
              {i < breadcrumbs.slice(-2).length - 1 && (
                <ChevronRight className="size-3" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative group hidden md:flex items-center bg-aurora-bg border border-aurora-border rounded-xl px-4 py-2 w-48 lg:w-80 focus-within:border-aurora-blue focus-within:ring-4 focus-within:ring-aurora-blue/5 transition-all">
          <Search className="size-4 text-aurora-muted group-focus-within:text-aurora-blue" />
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/dashboard/applicants?search=${encodeURIComponent(searchQuery)}`);
              }
            }}
            className="flex-1 flex items-center"
          >
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] lg:text-xs font-bold text-aurora-dark ml-2.5 w-full tracking-wider placeholder:text-aurora-muted/50"
            />
          </form>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="ml-2 p-0.5 text-aurora-muted hover:text-aurora-dark transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className={`relative p-2 transition-all rounded-xl border ${
              showNotifications
                ? "bg-aurora-blue/5 border-aurora-blue/20 text-aurora-blue"
                : "text-aurora-muted hover:bg-aurora-bg hover:text-aurora-dark border-transparent hover:border-aurora-border"
            }`}
          >
            <Bell className="size-5" />
            <span
              className={`absolute top-2.5 right-2.5 size-1.5 rounded-full ${localNotifs.length > 0 ? "bg-orange-500 animate-pulse" : "bg-emerald-500"}`}
            />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-aurora-surface border border-aurora-border rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-4 border-b border-aurora-border/50 bg-aurora-bg/30">
                  <p className="text-[10px] font-bold text-aurora-dark tracking-widest">
                    Recent activity
                  </p>
                </div>
                <div className="divide-y divide-aurora-border/30 max-h-96 overflow-y-auto">
                  {allNotifications.length === 0 ? (
                    <div className="p-6 text-center text-[10px] font-bold tracking-widest text-aurora-muted">
                      No unread notifications
                    </div>
                  ) : (
                    allNotifications.map((n, idx) => {
                      const isRecent = "timestamp" in n; // Check if it's from context
                      return (
                        <div
                          key={n.id || idx}
                          className="p-4 hover:bg-aurora-bg/50 transition-colors cursor-pointer group flex items-start gap-4"
                        >
                          <Bell
                            className={`size-4 mt-0.5 ${isRecent ? "text-aurora-blue" : "text-aurora-muted"}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-aurora-dark tracking-tight group-hover:text-aurora-blue transition-colors truncate">
                              {n.title || n.message}
                            </p>
                            <p className="text-[10px] font-bold text-aurora-muted tracking-widest mt-0.5">
                              {n.time || "Just now"}
                            </p>
                          </div>
                          {isRecent && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(n.id);
                                  toast.success("Notification viewed.");
                                }}
                                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"
                                title="Mark Viewed"
                              >
                                <Check className="size-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  snoozeNotification(n.id);
                                }}
                                className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-all"
                                title="Snooze 5m"
                              >
                                <Clock className="size-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-aurora-border mx-2" />

        <div className="relative" ref={profileRef}>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-aurora-dark tracking-tight truncate max-w-[120px]">
                {user?.name 
                  ? user.name.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
                  : "Recruiter"}
              </p>
              <p className="text-[10px] font-bold text-aurora-blue tracking-widest leading-none">
                Technical portal
              </p>
            </div>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className={`size-10 rounded-xl border flex items-center justify-center transition-all overflow-hidden group ${
                showProfile
                  ? "bg-aurora-blue/5 border-aurora-blue/20"
                  : "bg-aurora-bg border-aurora-border hover:bg-aurora-surface"
              }`}
            >
              <User
                className={`size-5 ${showProfile ? "text-aurora-blue" : "text-aurora-muted group-hover:text-aurora-blue"}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-aurora-surface border border-aurora-border rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-2">
                  <div className="px-4 py-3 mb-2 border-b border-aurora-border/50">
                    <p className="text-[10px] font-bold text-aurora-muted tracking-widest">
                      Company account
                    </p>
                    <p className="text-xs font-bold text-aurora-dark truncate">
                      {user?.company || "Aurora"}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-aurora-bg text-aurora-muted hover:text-aurora-dark transition-all"
                  >
                    <Settings className="size-4" />
                    <span className="text-[11px] font-bold tracking-widest">
                      Account settings
                    </span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-aurora-bg text-aurora-muted hover:text-rose-500 transition-all text-left"
                  >
                    <LogOut className="size-4" />
                    <span className="text-[11px] font-bold tracking-widest">
                      Sign out
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
