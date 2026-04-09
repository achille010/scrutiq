"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  BarChart,
  Target,
} from "lucide-react";
import { ScreeningResult } from "@/store/slices/screeningSlice";

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ScreeningResult | null;
}

const CandidateDetailModal = ({
  isOpen,
  onClose,
  result,
}: CandidateDetailModalProps) => {
  if (!result) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-aurora-dark/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-aurora-surface rounded-3xl border border-aurora-border shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-aurora-border/50 flex items-start justify-between bg-aurora-bg/30">
              <div className="flex items-center gap-5">
                <div className="size-16 rounded-2xl bg-aurora-blue flex items-center justify-center shadow-lg shadow-aurora-blue/20">
                  <User className="size-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-aurora-dark uppercase tracking-tighter">
                    {result.candidateName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5">
                      <ShieldCheck className="size-3" />
                      Verified Profile
                    </span>
                    <span className="text-[10px] font-bold text-aurora-muted uppercase tracking-widest px-2.5 py-1 bg-white border border-aurora-border rounded-lg">
                      ID: {result.candidateId}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-aurora-muted hover:text-aurora-blue hover:bg-white rounded-xl border border-transparent hover:border-aurora-border transition-all"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-aurora-bg p-5 rounded-2xl border border-aurora-border/50 space-y-1">
                  <div className="flex items-center gap-2 text-aurora-muted">
                    <BarChart className="size-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-aurora-muted">
                      Alignment Matrix
                    </span>
                  </div>
                  <p className="text-2xl font-black text-aurora-blue">
                    {result.matchScore}%
                  </p>
                </div>
                <div className="bg-aurora-bg p-5 rounded-2xl border border-aurora-border/50 space-y-1">
                  <div className="flex items-center gap-2 text-aurora-muted">
                    <Target className="size-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-aurora-muted">
                      Recommendation
                    </span>
                  </div>
                  <p className="text-sm font-black text-aurora-dark uppercase tracking-tight">
                    {result.finalRecommendation ||
                      (result as any).recommendation}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-aurora-blue" />
                  <h3 className="text-sm font-black text-aurora-dark uppercase tracking-tight">
                    Technical Summary
                  </h3>
                </div>
                <div className="bg-white border border-aurora-border/50 p-6 rounded-2xl">
                  <p className="text-sm font-medium text-aurora-muted leading-relaxed italic">
                    {result.reasoning}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-aurora-border/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <h3 className="text-sm font-black text-aurora-dark uppercase tracking-tight">
                    Verified Competencies
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "System Architecture",
                    "Technical Execution",
                    "Operational Synergy",
                    "Core Strategy",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-xl border border-aurora-border bg-aurora-bg text-[10px] font-bold text-aurora-dark uppercase tracking-widest hover:border-aurora-blue transition-all cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-aurora-border/50 bg-aurora-bg/30 flex justify-end gap-4">
              <button onClick={onClose} className="btn-secondary">
                Close Protocol
              </button>
              <button className="btn-primary shadow-lg shadow-aurora-blue/20">
                Finalize Alignment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CandidateDetailModal;
