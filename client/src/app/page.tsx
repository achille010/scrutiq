"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Briefcase, Users, Search } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-aurora-bg flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] size-96 bg-aurora-blue/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] size-96 bg-purple-500/5 rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl space-y-12 relative z-10"
      >
        <div className="space-y-6">
          <div className="size-16 bg-aurora-blue rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-aurora-blue/20">
            <ShieldCheck className="size-10 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-aurora-dark tracking-tighter leading-none">
              Aurora <span className="text-aurora-blue">portal</span>
            </h1>
            <p className="text-lg md:text-xl text-aurora-muted max-w-2xl mx-auto leading-relaxed font-bold tracking-wide">
              AI-powered candidate screening for modern recruitment
            </p>
          </div>
          <p className="text-sm text-aurora-muted max-w-xl mx-auto leading-relaxed font-medium tracking-widest opacity-80">
            Manage your jobs, upload resumes, and let Gemini AI find the best candidates for your company in minutes.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/dashboard" className="w-full md:w-auto">
            <button className="btn-primary w-full md:w-auto px-12 py-5 text-[13px] font-black tracking-widest shadow-2xl shadow-aurora-blue/30 flex items-center justify-center gap-3 group">
              <span>Go to dashboard</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/register" className="w-full md:w-auto">
             <button className="btn-secondary w-full md:w-auto px-12 py-5 text-[13px] font-black tracking-widest bg-white">
               Create company account
             </button>
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Briefcase, text: "Job management" },
            { icon: Search, text: "Resume ingestion" },
            { icon: Users, text: "AI candidate ranking" },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="size-10 rounded-xl bg-white border border-aurora-border flex items-center justify-center text-aurora-blue shadow-sm">
                <feature.icon className="size-5" />
              </div>
              <span className="text-[10px] font-black text-aurora-muted tracking-widest">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <footer className="absolute bottom-10 flex flex-col items-center gap-2">
        <p className="text-[9px] font-black tracking-widest text-aurora-muted/40">
          Umurava Technical Portal &copy; 2026 • AI Alignment Standards
        </p>
      </footer>
    </div>
  );
}
