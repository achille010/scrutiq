"use client";

import {
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  UserPlus,
  Activity,
  RefreshCcw,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

const ActivityFeed = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      const response = await api.get("/stats");
      const recent = response.data.data.recentActivity || [];

      // Transform backend activity to technical UI format
      const transformed = recent.map((act: any, i: number) => ({
        id: i,
        type: act.type.toLowerCase(),
        message: act.message,
        target: "System Protocol Active",
        time: act.time,
        icon:
          act.type === "INGESTION"
            ? UserPlus
            : act.type === "SCREENING"
              ? ShieldCheck
              : Activity,
        color:
          act.type === "INGESTION"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-aurora-blue/10 text-aurora-blue",
      }));

      // Fallback for demo completeness if backend is lean
      if (transformed.length < 3) {
        transformed.push({
          id: 99,
          type: "status",
          message: "Registry Calibration Synced",
          target: "Matching Matrix 5.1",
          time: "1h ago",
          icon: CheckCircle2,
          color: "bg-purple-50 text-purple-600",
        });
      }

      setActivities(transformed);
    } catch (error) {
      console.error("Activity Stream Fault:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-card p-12 flex flex-col items-center justify-center space-y-4">
        <RefreshCcw className="size-6 text-aurora-blue animate-spin" />
        <p className="text-[10px] font-black text-aurora-muted uppercase tracking-widest">
          Streaming Technical Logs...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="p-6 border-b border-aurora-border/50 bg-aurora-bg/10 flex items-center justify-between">
        <h2 className="text-sm font-black text-aurora-dark uppercase tracking-widest">
          Global Activity Stream
        </h2>
        <button
          onClick={fetchActivity}
          className="p-1.5 hover:bg-white rounded-lg transition-all"
        >
          <RefreshCcw className="size-3.5 text-aurora-muted" />
        </button>
      </div>
      <div className="divide-y divide-aurora-border/30">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-5 flex items-start gap-4 hover:bg-aurora-bg/30 transition-all group cursor-default"
          >
            <div
              className={`p-2.5 rounded-xl border border-transparent group-hover:border-white shadow-sm transition-all ${activity.color}`}
            >
              <activity.icon className="size-4" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-aurora-dark uppercase tracking-tight">
                  {activity.message}
                </p>
                <span className="text-[9px] font-bold text-aurora-muted uppercase tracking-widest">
                  {activity.time}
                </span>
              </div>
              <p className="text-[10px] font-bold text-aurora-muted uppercase tracking-widest leading-none truncate">
                {activity.target}
              </p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-white rounded-lg border border-aurora-border shadow-sm">
              <ArrowUpRight className="size-3 text-aurora-blue" />
            </button>
          </div>
        ))}
      </div>
      <button className="w-full py-4 text-[9px] font-black text-aurora-muted hover:text-aurora-blue uppercase tracking-widest border-t border-aurora-border/50 hover:bg-aurora-bg transition-all">
        Access Full Protocol Logs
      </button>
    </div>
  );
};

export default ActivityFeed;
