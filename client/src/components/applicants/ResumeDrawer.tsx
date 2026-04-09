"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, User, MapPin, Mail, Briefcase } from "lucide-react";

interface ResumeDrawerProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeDrawer({ candidate, isOpen, onClose }: ResumeDrawerProps) {
  if (!candidate) return null;

  const resumeText = candidate["resuméText"] || candidate.technicalProfile || "No resume text available.";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-aurora-dark/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-full bg-white rounded-3xl shadow-2xl border border-aurora-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-aurora-border/50 flex items-start justify-between bg-aurora-bg shrink-0">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-aurora-blue/10 flex items-center justify-center text-2xl font-black text-aurora-blue border border-aurora-blue/20">
                  {candidate.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-black text-aurora-dark uppercase tracking-tight">{candidate.name}</h2>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-aurora-muted uppercase tracking-widest">
                      <Briefcase className="size-3" /> {candidate.role}
                    </span>
                    {candidate.location && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-aurora-muted uppercase tracking-widest">
                        <MapPin className="size-3" /> {candidate.location}
                      </span>
                    )}
                  </div>
                  {candidate.email && !candidate.email.includes("@registry.extern") && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-aurora-blue mt-1">
                      <Mail className="size-3" /> {candidate.email}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-aurora-muted hover:text-aurora-dark hover:bg-white rounded-xl border border-transparent hover:border-aurora-border transition-all shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Resume Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-aurora-muted border-b border-aurora-border/50 pb-3">
                <FileText className="size-4 text-aurora-blue" />
                Resume / CV Text
              </div>
              <div className="bg-aurora-bg rounded-2xl border border-aurora-border/50 p-6">
                <pre className="text-xs text-aurora-dark font-medium leading-relaxed whitespace-pre-wrap font-sans">
                  {resumeText.trim()}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-aurora-border/50 bg-aurora-bg shrink-0">
              <p className="text-center text-[10px] font-bold text-aurora-muted uppercase tracking-widest">
                ID: {candidate.id} • Extracted from uploaded resume
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
