"use client";

import { useState, useEffect } from "react";
import { X, ShieldCheck, Clock, Shield, Database, User, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface AuditLogModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "AUTH": return <Shield className="size-4 text-aurora-blue" />;
    case "JOB": return <Database className="size-4 text-emerald-500" />;
    case "CANDIDATE": return <User className="size-4 text-amber-500" />;
    case "SCREENING": return <Activity className="size-4 text-rose-500" />;
    default: return <Clock className="size-4 text-aurora-muted" />;
  }
};

export default function AuditLogModal({ userId, isOpen, onClose }: AuditLogModalProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchLogs = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/auth/profile/${userId}/logs`);
          setLogs(response.data.data);
        } catch (error) {
          console.error("Audit Retrieval Fault:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLogs();
    }
  }, [isOpen, userId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-aurora-dark/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-aurora-border"
          >
            <div className="p-8 border-b border-aurora-border flex items-center justify-between bg-aurora-bg/30">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-aurora-dark flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-aurora-dark tracking-tight">Security audit logs</h2>
                  <p className="text-[10px] font-bold text-aurora-muted tracking-widest uppercase">Chronological activity history</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-aurora-border"
              >
                <X className="size-5 text-aurora-muted" />
              </button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
              {isLoading ? (
                <div className="py-20 text-center space-y-3">
                  <Clock className="size-8 text-aurora-blue animate-spin mx-auto" />
                  <p className="text-[10px] font-bold text-aurora-muted tracking-widest uppercase">Deciphering logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <Shield className="size-10 text-aurora-muted/30 mx-auto" />
                  <p className="text-sm font-bold text-aurora-muted">No security logs recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log._id} className="flex items-start gap-4 p-4 rounded-2xl border border-aurora-border/50 hover:bg-aurora-bg/30 transition-all group">
                       <div className="size-10 rounded-xl bg-white border border-aurora-border/50 flex items-center justify-center shrink-0 shadow-sm group-hover:border-aurora-blue/20 transition-all">
                          <CategoryIcon category={log.category} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                             <span className="text-[10px] font-black text-aurora-dark tracking-wide uppercase">{log.action.replace('_', ' ')}</span>
                             <span className="text-[10px] font-bold text-aurora-muted tabular-nums">
                               {new Date(log.createdAt).toLocaleString()}
                             </span>
                          </div>
                          <p className="text-xs text-aurora-muted font-medium leading-relaxed">
                            {log.details}
                          </p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-aurora-bg/30 border-t border-aurora-border flex items-center justify-between">
               <p className="text-[9px] font-bold text-aurora-muted max-w-[340px] uppercase tracking-wider">
                 These logs assist in providing a tamper-proof record of all administrative interactions within the HireIQ platform.
               </p>
               <button onClick={onClose} className="btn-secondary px-6">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
