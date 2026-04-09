"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Edit3,
  Save,
  ShieldCheck,
  User,
  Trash2,
  Mail,
  FileText,
} from "lucide-react";
import api from "@/lib/api";
import { useNotifications } from "@/context/NotificationContext";
import Link from "next/link";
import ResumeDrawer from "@/components/applicants/ResumeDrawer";
import ContactModal from "@/components/applicants/ContactModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function JobDetailPage() {
  const { notify } = useNotifications();
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "rankings">(
    "overview",
  );

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [jobRes, rankRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/screening/job/${jobId}`),
        ]);
        setJob(jobRes.data.data);
        setEditData({
          title: jobRes.data.data.title,
          description: jobRes.data.data.description,
        });

        // Sort rankings highest score first
        const sortedRanks = (rankRes.data.data || []).sort(
          (a: any, b: any) => b.matchScore - a.matchScore,
        );
        setRankings(sortedRanks);
      } catch (error) {
        console.error("Job Data Fetch Fault:", error);
        notify("Failed to load job details.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleSaveCriteria = async () => {
    try {
      const res = await api.put(`/jobs/${jobId}`, editData);
      setJob(res.data.data);
      setIsEditing(false);
      notify("Judgement criteria updated successfully!", "success");
    } catch (error) {
      notify("Failed to update criteria.", "error");
    }
  };

  const handleDeleteRanking = async (
    screeningId: string,
    candidateName: string,
  ) => {
    if (
      window.confirm(
        `Are you sure you want to remove the screening results for ${candidateName}?`,
      )
    ) {
      try {
        await api.delete(`/screening/${screeningId}`);
        notify("Screening result removed.", "success");
        // Refresh rankings
        const rankingsRes = await api.get(`/screening/job/${jobId}`);
        setRankings(rankingsRes.data.data);
      } catch (error) {
        notify("Failed to delete screening result.", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs font-black uppercase text-aurora-muted">
        Loading Engine...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="admin-card p-20 text-center space-y-6">
        <h2 className="text-xl font-black text-rose-500 uppercase">
          Job Not Found
        </h2>
        <button
          onClick={() => router.back()}
          className="text-aurora-blue font-black uppercase text-xs hover:underline"
        >
          Return to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-aurora-muted hover:text-aurora-blue transition-colors"
      >
        <ChevronLeft className="size-4" /> Back to Jobs
      </Link>

      {/* Header */}
      <div className="admin-card p-8 flex flex-col md:flex-row md:items-start justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-aurora-blue/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="space-y-2 z-10 w-full">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
              {job.status}
            </span>
            <span className="text-[10px] font-bold text-aurora-muted tracking-widest leading-none">
              {job.department} • {job.location}
            </span>
          </div>
          {isEditing ? (
            <input
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="text-3xl font-black text-aurora-dark bg-aurora-surface border-2 border-aurora-blue/30 rounded-xl px-4 py-2 w-full outline-none focus:border-aurora-blue"
            />
          ) : (
            <h1 className="text-4xl font-black text-aurora-dark tracking-tight">
              {job.title}
            </h1>
          )}
        </div>
        <div className="z-10 flex-shrink-0">
          {isEditing ? (
            <button
              onClick={handleSaveCriteria}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="size-4" /> Save Criteria
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center gap-2 border-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue hover:text-white"
            >
              <Edit3 className="size-4" /> Change Criteria
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-aurora-border/50">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-8 py-4 text-xs font-bold tracking-widest transition-all border-b-2 ${activeTab === "overview" ? "border-aurora-blue text-aurora-blue" : "border-transparent text-aurora-muted hover:text-aurora-dark"}`}
        >
          Judgement criteria & info
        </button>
        <button
          onClick={() => setActiveTab("rankings")}
          className={`px-8 py-4 text-xs font-bold tracking-widest transition-all border-b-2 ${activeTab === "rankings" ? "border-aurora-blue text-aurora-blue" : "border-transparent text-aurora-muted hover:text-aurora-dark"}`}
        >
          Applicants & Ai rankings
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 admin-card p-10 space-y-4">
              <h2 className="text-xs font-bold text-aurora-dark tracking-widest border-b border-aurora-border/50 pb-2">
                Technical description
              </h2>
              {isEditing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full h-80 bg-aurora-surface border-2 border-aurora-blue/30 rounded-xl p-4 text-sm font-medium text-aurora-dark outline-none focus:border-aurora-blue resize-none"
                />
              ) : (
                <p className="text-sm text-aurora-muted leading-relaxed font-medium whitespace-pre-wrap">
                  {job.description}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div className="admin-card p-10 bg-aurora-blue/5 border-aurora-blue/20 text-center hover-lift">
                <h3 className="text-[10px] font-bold text-aurora-blue tracking-widest mb-2">
                  Total scanned profiles
                </h3>
                <span className="text-6xl font-black text-aurora-dark tracking-tighter leading-none">
                  {rankings.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "rankings" && (
          <motion.div
            key="rankings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {rankings.length === 0 ? (
              <div className="admin-card p-24 text-center space-y-6">
                <div className="size-20 rounded-3xl bg-aurora-bg flex items-center justify-center mx-auto border border-aurora-border">
                  <User className="size-10 text-aurora-muted" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-aurora-dark tracking-tight">
                    No applicants ai screened yet
                  </h3>
                  <p className="text-xs text-aurora-muted font-bold max-w-sm mx-auto leading-relaxed">
                    Upload resumes on the applicants page and run an ai screening
                    protocol to see rankings here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-aurora-dark tracking-widest mb-4 border-b border-aurora-border/50 pb-2">
                  Ranked best-to-worst
                </h3>
                {rankings.map((rank, idx) => (
                  <div
                    key={rank._id}
                    className="admin-card p-6 flex flex-col md:flex-row md:items-start gap-6 border-l-4 hover:-translate-y-0.5 transition-all"
                    style={{
                      borderLeftColor:
                        rank.matchScore > 80
                          ? "#10b981"
                          : rank.matchScore > 60
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  >
                    <div className="flex flex-col items-center justify-center shrink-0 w-24 space-y-1">
                      <span className="text-[10px] font-black uppercase text-aurora-muted">
                        AI Score
                      </span>
                      <div
                        className="size-16 rounded-full flex items-center justify-center border-4"
                        style={{
                          borderColor:
                            rank.matchScore > 80
                              ? "#10b981"
                              : rank.matchScore > 60
                                ? "#f59e0b"
                                : "#ef4444",
                        }}
                      >
                        <span className="text-xl font-black text-aurora-dark">
                          {rank.matchScore}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-aurora-muted">
                        Rank #{idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-black text-aurora-dark uppercase tracking-tight">
                            {rank.candidateName || "Technical Candidate"}
                          </h4>
                          <p className="text-[10px] font-bold text-aurora-muted uppercase tracking-widest leading-none mt-1">
                            {rank.candidateEmail}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                rank.finalRecommendation ===
                                "Priority Alignment"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : rank.finalRecommendation === "Technical Fit"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : rank.finalRecommendation ===
                                        "Potential Fit"
                                      ? "bg-amber-50 text-amber-600 border-amber-100"
                                      : "bg-rose-50 text-rose-600 border-rose-100"
                              }`}
                            >
                              {rank.finalRecommendation}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-aurora-muted hidden md:block">
                            Evaluated:{" "}
                            {rank.createdAt || rank.timestamp
                              ? new Date(
                                  rank.createdAt || rank.timestamp,
                                ).toLocaleDateString()
                              : "Global History"}
                          </span>
                          <div className="flex items-center gap-1.5 border-l border-aurora-border/50 pl-4">
                            <button
                              onClick={() => {
                                setSelectedCandidate({
                                  name: rank.candidateName,
                                  email: rank.candidateEmail,
                                  role: job.title,
                                  resuméText:
                                    rank.candidateResume || rank.microSummary,
                                  id: rank.candidateId,
                                });
                                setIsResumeOpen(true);
                              }}
                              className="p-1.5 text-aurora-muted hover:text-aurora-blue hover:bg-aurora-blue/5 rounded-lg transition-all border border-transparent hover:border-aurora-blue/10"
                              title="Preview Profile"
                            >
                              <FileText className="size-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCandidate({
                                  name: rank.candidateName,
                                  email: rank.candidateEmail,
                                  role: job.title,
                                  resuméText: rank.candidateResume || rank.microSummary,
                                  id: rank.candidateId,
                                  _id: rank.candidateId,
                                  screening: rank
                                });
                                setIsContactOpen(true);
                              }}
                              className="p-1.5 text-aurora-muted hover:text-aurora-blue hover:bg-aurora-blue/5 rounded-lg transition-all border border-transparent hover:border-aurora-blue/10"
                              title="Send Email"
                            >
                              <Mail className="size-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteRanking(
                                  rank._id,
                                  rank.candidateName,
                                )
                              }
                              className="p-1.5 text-aurora-muted hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100"
                              title="Delete Result"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-aurora-bg p-4 rounded-xl border border-aurora-border/50">
                        <span className="text-[9px] font-black uppercase text-aurora-muted mb-1 block flex gap-1 items-center">
                          <ShieldCheck className="size-3 text-aurora-blue" />{" "}
                          Gemini AI Analysis
                        </span>
                        <p className="text-xs text-aurora-dark font-medium leading-relaxed">
                          {rank.reasoning}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ResumeDrawer
        candidate={selectedCandidate}
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
      <ContactModal 
        applicant={selectedCandidate}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
