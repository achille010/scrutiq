"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Building2, 
  Globe, 
  ShieldCheck, 
  RefreshCcw, 
  Save, 
  Bell,
  Palette,
  Eye,
  EyeOff,
  Cloud
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { motion } from "framer-motion";
import AuditLogModal from "@/components/settings/AuditLogModal";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [profileData, setProfileData] = useState({
    fullName: "",
    companyName: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        
        // Always fetch latest data to ensure email and company are synced
        if (parsed.id) {
          api.get(`/auth/profile/${parsed.id}`)
            .then(res => {
              if (res.data?.data) {
                const fresh = { ...parsed, ...res.data.data };
                localStorage.setItem("user", JSON.stringify(fresh));
                setUser(fresh);
                setProfileData({
                  fullName: fresh.name || "",
                  companyName: fresh.company || "",
                });
              }
            })
            .catch(err => {
              if (err.response?.status === 404) {
                 // Severe session corruption or legacy ID — Force repair
                 console.warn("Incompatible session detected. Initiating repair...");
                 localStorage.removeItem("user");
                 window.location.href = "/login";
                 return;
              }
              console.error("Profile refresh fault:", err);
              // Fallback to local data
              setProfileData({
                fullName: parsed.name || "",
                companyName: parsed.company || "",
              });
            });
        }
      }
      setIsLoading(false);
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const response = await api.put(`/auth/profile/${user.id}`, profileData);
      
      // Sync local storage
      const updatedUser = {
        ...user,
        name: response.data.data.name,
        company: response.data.data.company
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Dispatch custom event for real-time header sync
      window.dispatchEvent(new Event("user-profile-updated"));
      
      toast.success("Profile preferences synchronized successfully.");
    } catch (error) {
      toast.error("Failed to update portal preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCcw className="size-10 text-aurora-blue animate-spin" />
        <p className="text-xs font-bold text-aurora-muted tracking-widest">Loading account configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-aurora-surface p-8 rounded-2xl border border-aurora-border shadow-sm gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-aurora-dark tracking-tighter">Portal settings</h1>
          <p className="text-sm font-bold text-aurora-muted tracking-wide max-w-lg">
            Manage your professional identity, technical preferences, and recruitment portal configuration.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => window.location.reload()}
             className="p-4 rounded-xl border border-aurora-border bg-white transition-all hover:bg-aurora-bg"
           >
             <RefreshCcw className="size-5 text-aurora-muted" />
           </button>
           <button 
             form="profile-form"
             type="submit"
             disabled={isSaving}
             className="btn-primary flex items-center gap-2 px-8 shadow-xl shadow-aurora-blue/20"
           >
             {isSaving ? <RefreshCcw className="size-4 animate-spin" /> : <Save className="size-4" />}
             <span>{isSaving ? "Saving..." : "Save preferences"}</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-8">
           <section className="admin-card p-10 bg-aurora-surface space-y-8">
              <div className="flex items-center gap-4 border-b border-aurora-border/50 pb-6">
                 <div className="size-16 rounded-3xl bg-aurora-blue flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-aurora-blue/20">
                   {profileData.fullName.charAt(0) || "U"}
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-aurora-dark tracking-tight">Recruiter profile</h2>
                    <p className="text-xs font-bold text-aurora-muted tracking-widest leading-none mt-1">Update your professional information</p>
                 </div>
              </div>

              <form id="profile-form" onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-aurora-muted tracking-widest uppercase ml-1">Full name</label>
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-aurora-muted group-focus-within:text-aurora-blue transition-colors" />
                       <input 
                         type="text" 
                         value={profileData.fullName}
                         onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                         className="form-input pl-12"
                         placeholder="Technical Recruiter Name"
                         required
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-aurora-muted tracking-widest uppercase ml-1">Email address</label>
                    <div className="relative opacity-60">
                       <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-aurora-muted" />
                       <input 
                         type="email" 
                         value={user?.email || "loading..."}
                         disabled
                         className="form-input pl-12 bg-aurora-bg cursor-not-allowed"
                       />
                    </div>
                 </div>

                 <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-aurora-muted tracking-widest uppercase ml-1">Company name</label>
                    <div className="relative group">
                       <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-aurora-muted group-focus-within:text-aurora-blue transition-colors" />
                       <input 
                         type="text" 
                         value={profileData.companyName}
                         onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                         className="form-input pl-12"
                         placeholder="Corporate Registry"
                         required
                       />
                    </div>
                 </div>
              </form>
           </section>

           <section className="admin-card p-10 bg-aurora-surface space-y-8 hover-lift">
              <div className="flex items-center gap-4 border-b border-aurora-border/50 pb-6">
                 <div className="size-12 rounded-2xl bg-aurora-bg border border-aurora-border flex items-center justify-center text-aurora-blue">
                   <Bell className="size-6" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-aurora-dark tracking-tight">Notifications</h2>
                    <p className="text-[10px] font-bold text-aurora-muted tracking-widest uppercase mt-1">Preference calibration</p>
                 </div>
              </div>

              <div className="space-y-4">
                 {[
                   { label: "New candidate alerts", desc: "Get notified when a high-alignment dossier is uploaded." },
                   { label: "Screening completions", desc: "Receive report once the Ai ranking protocol finishes." },
                 ].map((opt, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-aurora-bg transition-colors">
                      <div className="space-y-1">
                         <p className="text-sm font-black text-aurora-dark tracking-tight">{opt.label}</p>
                         <p className="text-[10px] font-bold text-aurora-muted tracking-widest">{opt.desc}</p>
                      </div>
                      <div className="w-12 h-6 bg-aurora-blue rounded-full relative">
                         <div className="absolute top-1 right-1 size-4 bg-white rounded-full shadow-sm" />
                       </div>
                   </div>
                 ))}
              </div>
           </section>

           {/* Danger Zone */}
           <section className="admin-card p-8 md:p-10 bg-white border-2 border-rose-500/20 space-y-6 relative overflow-hidden group hover:border-rose-500/40 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-rose-500/10 transition-colors" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rose-100/50">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-rose-600 tracking-tight">Danger Zone</h2>
                  <p className="text-[10px] font-bold text-aurora-muted tracking-widest uppercase">
                    Irreversible administrative actions
                  </p>
                </div>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-sm font-black text-aurora-dark tracking-tight">Delete account</h3>
                  <p className="text-[10px] font-bold text-aurora-muted tracking-widest leading-relaxed max-w-sm mt-1">
                    Once you delete your account, there is no going back. All candidate registries, job definitions, and screening history will be permanently wiped.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm("Are you absolutely sure? This action is completely irreversible.")) {
                      try {
                        setIsSaving(true);
                        await api.delete(`/auth/profile/${user.id}`);
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        toast.success("Account deleted successfully.");
                        window.location.href = "/login";
                      } catch (error) {
                        toast.error("Failed to delete account. Please try again later.");
                        setIsSaving(false);
                      }
                    }
                  }}
                  className="shrink-0 px-6 py-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-lg hover:shadow-rose-500/20 transition-all font-jakarta"
                >
                  Delete account
                </button>
              </div>
           </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
           <div className="admin-card p-8 bg-aurora-blue/5 border-aurora-blue/20 flex flex-col items-center text-center space-y-6">
              <div className="size-20 rounded-3xl bg-white flex items-center justify-center shadow-lg shadow-aurora-blue/5 border border-aurora-border">
                 <ShieldCheck className="size-10 text-aurora-blue" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-lg font-black text-aurora-dark tracking-tight">Secure session</h3>
                 <p className="text-[10px] font-bold text-aurora-muted tracking-widest leading-relaxed">
                   Your portal session is currently encrypted and verified against our cloud security registry.
                 </p>
              </div>
              <button 
                onClick={() => setIsAuditModalOpen(true)}
                className="text-[10px] font-black text-aurora-blue tracking-widest uppercase hover:underline"
              >
                View audit logs
              </button>
           </div>

           <div className="admin-card p-8 bg-white space-y-6">
              <div className="flex items-center gap-3">
                 <Cloud className="size-4 text-aurora-blue" />
                 <span className="text-xs font-black text-aurora-dark tracking-widest uppercase">System status</span>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-aurora-muted tracking-widest">Environment</span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Production</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-aurora-muted tracking-widest">Ai model</span>
                    <span className="text-[10px] font-black text-aurora-blue uppercase">Gemini 1.5 Pro</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-aurora-muted tracking-widest">Region</span>
                    <span className="text-[10px] font-black text-aurora-dark uppercase">East Africa</span>
                 </div>
              </div>
           </div>

           <div className="admin-card p-8 bg-aurora-dark text-white space-y-6">
              <div className="space-y-2">
                 <h3 className="text-base font-black tracking-tight">Activity trail</h3>
                 <p className="text-[10px] font-bold text-aurora-muted/80 tracking-widest leading-relaxed">
                   Monitor all administrative actions taken by your account.
                 </p>
              </div>
              <button 
                onClick={() => setIsAuditModalOpen(true)}
                className="btn-primary w-full bg-white text-aurora-dark border-white hover:bg-aurora-bg h-10 px-0"
              >
                View Logs
              </button>
           </div>
        </div>
      </div>

      <AuditLogModal 
        userId={user?.id}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}
