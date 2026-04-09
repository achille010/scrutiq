"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Target, 
  FileText, 
  Database,
  RefreshCcw,
  Zap,
  ArrowUp,
  ArrowDown,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import api from "@/lib/api";
import { toast } from "sonner";

const COLORS = ["#2C7BE5", "#E63757", "#F6AD55", "#48BB78", "#744210", "#805AD5"];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"performance" | "distribution">("performance");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Resource error: Could not sync analytics data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success("System alignment synced.");
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCcw className="size-10 text-aurora-blue animate-spin" />
        <p className="text-xs font-bold text-aurora-muted tracking-widest">Synchronizing real-time metrics...</p>
      </div>
    );
  }

  const metricCards = [
    { 
      label: "Ai screening accuracy", 
      value: `${Math.round(stats?.matchSuccessRate || 0)}%`, 
      change: "+0.4%", 
      isUp: true, 
      icon: Target, 
      color: "blue" 
    },
    { 
      label: "Active job postings", 
      value: stats?.activeJobs || 0, 
      change: "Stable", 
      isUp: true, 
      icon: Zap, 
      color: "emerald" 
    },
    { 
      label: "Applicant registry", 
      value: stats?.candidates || 0, 
      change: "+12", 
      isUp: true, 
      icon: FileText, 
      color: "amber" 
    },
  ];

  const chartData = stats?.performanceData?.length > 0 
    ? stats.performanceData.map((d: any) => ({
        ...d,
        name: new Date(d.name).toLocaleDateString('en-US', { weekday: 'short' })
      }))
    : [
        { name: "Mon", screenings: 0, quality: 0 },
        { name: "Tue", screenings: 0, quality: 0 },
        { name: "Wed", screenings: 0, quality: 0 },
        { name: "Thu", screenings: 0, quality: 0 },
        { name: "Fri", screenings: 0, quality: 0 },
      ];

  const jobDistribution = stats?.jobDistribution?.length > 0
    ? stats.jobDistribution
    : [{ name: "No data", value: 1 }];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-aurora-surface p-8 rounded-2xl border border-aurora-border shadow-sm gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-aurora-dark tracking-tighter">System analytics</h1>
          <p className="text-sm font-bold text-aurora-muted tracking-wide max-w-lg">
            Monitor real-time system performance, ai alignment fidelity, and candidate registry growth metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className={`p-4 rounded-xl border border-aurora-border bg-white transition-all hover:bg-aurora-bg active:scale-95`}
          >
            <RefreshCcw className={`size-5 text-aurora-muted ${isRefreshing ? "animate-spin text-aurora-blue" : ""}`} />
          </button>
          <div className="h-10 w-px bg-aurora-border mx-2" />
          <button className="btn-primary flex items-center gap-2 shadow-xl shadow-aurora-blue/20">
            <Database className="size-4" />
            <span>Generate report</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metricCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="admin-card p-8 bg-aurora-surface group hover-lift relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="size-24" />
            </div>
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="size-14 rounded-2xl bg-aurora-bg flex items-center justify-center">
                <stat.icon className={`size-7 text-aurora-blue`} />
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-aurora-muted tracking-widest">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-4xl font-black text-aurora-dark tracking-tighter">{stat.value}</h3>
                  <div className={`flex items-center gap-1 text-[10px] font-black pb-1.5 ${stat.change.includes("+") ? "text-emerald-500" : "text-aurora-muted"}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 admin-card p-10 bg-aurora-surface min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-aurora-dark tracking-tight">Active performance</h2>
              <p className="text-xs font-bold text-aurora-muted tracking-widest leading-relaxed">
                Visualizing weekly Ai screening volume and quality metrics
              </p>
            </div>
            <div className="flex p-1 bg-aurora-bg border border-aurora-border rounded-xl">
               <button 
                 onClick={() => setActiveTab("performance")}
                 className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${activeTab === "performance" ? "bg-white text-aurora-blue shadow-sm" : "text-aurora-muted hover:text-aurora-dark"}`}
               >
                 Screenings
               </button>
               <button 
                 onClick={() => setActiveTab("distribution")}
                 className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${activeTab === "distribution" ? "bg-white text-aurora-blue shadow-sm" : "text-aurora-muted hover:text-aurora-dark"}`}
               >
                 Quality
               </button>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2C7BE5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2C7BE5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: "#94a3b8" }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '10px',
                    fontWeight: 800
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeTab === "performance" ? "screenings" : "quality"} 
                  stroke="#2C7BE5" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBlue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card p-10 bg-aurora-surface flex flex-col justify-between">
           <div className="space-y-1">
             <h2 className="text-2xl font-black text-aurora-dark tracking-tight">Role distribution</h2>
             <p className="text-xs font-bold text-aurora-muted tracking-widest">Jobs categorized by department</p>
           </div>

           <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={jobDistribution}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={8}
                   dataKey="value"
                 >
                   {jobDistribution.map((entry: any, index: number) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>

           <div className="space-y-4 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
             {jobDistribution.map((job: any, i: number) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                   <span className="text-[10px] font-black text-aurora-muted tracking-widest">{job.name}</span>
                 </div>
                 <span className="text-xs font-black text-aurora-dark">{job.value} jobs</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Bottom Technical Status */}
      <div className="admin-card border-[#2C7BE5]/10 bg-aurora-blue/5 p-8 relative overflow-hidden group">
         <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="size-20 rounded-3xl bg-white flex items-center justify-center shadow-lg shadow-aurora-blue/5 border border-aurora-border">
               <Activity className="size-10 text-aurora-blue" />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
               <h3 className="text-lg font-black text-aurora-dark tracking-tight">Active synchronization</h3>
               <p className="text-xs font-bold text-aurora-muted tracking-widest leading-relaxed max-w-3xl">
                 Technical dashboard is now reflecting live production data. All counts for jobs, applicants, 
                 and historical screening activity are synced with your company registry.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
