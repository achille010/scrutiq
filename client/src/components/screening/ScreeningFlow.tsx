"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  RefreshCcw,
  ExternalLink,
  Briefcase,
  Activity,
} from "lucide-react";
import api from "@/lib/api";
import { useNotifications } from "@/context/NotificationContext";
import CandidateDetailModal from "./CandidateDetailModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const ScreeningFlow = () => {
  const router = useRouter();
  const { notify } = useNotifications();
  const [step, setStep] = useState(1);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Getting candidates ready...",
  );
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  // Local state for registry data
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoadingRegistry, setIsLoadingRegistry] = useState(true);

  const fetchRegistry = async () => {
    setIsLoadingRegistry(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs"),
        api.get("/applicants"),
      ]);
      setJobs(jobsRes.data.data);
      setApplicants(appsRes.data.data);
    } catch (error) {
      console.error("Data Fetch Error:", error);
      notify("Failed to connect to the database.", "error");
    } finally {
      setIsLoadingRegistry(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  const handleStartScreening = async () => {
    if (!selectedJob || selectedCandidates.length === 0) return;

    setStep(3);
    setIsProcessing(true);
    setProgress(0);
    setStatusMessage("Extracting CV texts...");

    const estimatedTimeMs = Math.max(10000, selectedCandidates.length * 3500);
    const intervalTime = 100;
    const progressIncrement = 95 / (estimatedTimeMs / intervalTime);

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += progressIncrement;
      if (currentProgress < 30) setStatusMessage("Constructing requirement matrix...");
      else if (currentProgress < 60) setStatusMessage("Running Gemini structural analysis...");
      else if (currentProgress < 85) setStatusMessage("Scoring granular alignment...");
      else setStatusMessage("Finalizing recommendations...");
      
      setProgress(Math.min(95, currentProgress));
    }, intervalTime);

    try {
      const response = await api.post("/screening/execute", {
        jobId: selectedJob,
        candidateIds: selectedCandidates,
      });

      if (response.data.status === "success") {
        clearInterval(progressInterval);
        setProgress(100);
        setStatusMessage("Complete!");
        
        setTimeout(() => {
          setResults(response.data.data);
          setStep(4);
          notify("AI Screening finished! You can now view the results.");
        }, 500); // Small delay to let the 100% animation finish
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error("AI Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong with the AI screening.";
      notify(errorMsg, "error");
      setStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { n: 1, label: "Choose Job" },
    { n: 2, label: "Choose Candidates" },
    { n: 3, label: "AI Screening" },
    { n: 4, label: "Results" },
  ];

  if (isLoadingRegistry) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <RefreshCcw className="size-10 text-aurora-blue animate-spin" />
        <p className="text-xs font-black text-aurora-muted uppercase tracking-widest">
          Loading Database...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="admin-card p-8 bg-aurora-surface">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-aurora-border/50 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-aurora-dark tracking-tighter uppercase">
              AI Screening
            </h1>
            <p className="text-xs font-bold text-aurora-muted uppercase tracking-widest leading-none">
              Evaluate candidates against your job requirements
            </p>
          </div>
          <div className="flex items-center gap-4 bg-aurora-bg p-2 rounded-2xl border border-aurora-border/50">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div
                  className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                    step >= s.n
                      ? "bg-aurora-blue text-white shadow-lg shadow-aurora-blue/20"
                      : "bg-white text-aurora-muted border border-aurora-border"
                  }`}
                >
                  {s.n}
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest hidden lg:block ${
                    step >= s.n ? "text-aurora-dark" : "text-aurora-muted"
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="size-3 text-aurora-border mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-black text-aurora-dark uppercase tracking-tight">
                  Select a Job
                </h2>
                <p className="text-[10px] font-bold text-aurora-muted uppercase tracking-widest">
                  Select the role you&apos;re hiring for
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <button
                    key={job._id || job.id}
                    onClick={() => setSelectedJob(job._id || job.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all group ${
                      selectedJob === (job._id || job.id)
                        ? "border-aurora-blue bg-aurora-blue/5 shadow-inner"
                        : "border-aurora-border/50 hover:border-aurora-blue bg-aurora-bg/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-aurora-muted uppercase tracking-widest block">
                          JOB ID: {job._id || job.id}
                        </span>
                        <h3 className="text-sm font-black text-aurora-dark group-hover:text-aurora-blue transition-colors">
                          {job.title}
                        </h3>
                      </div>
                      <Briefcase
                        className={`size-4 ${selectedJob === (job._id || job.id) ? "text-aurora-blue" : "text-aurora-muted"}`}
                      />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedJob}
                  className="btn-primary disabled:opacity-50 flex items-center gap-2"
                >
                  Continue <ChevronRight className="size-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-black text-aurora-dark uppercase tracking-tight">
                  Select Candidates
                </h2>
                <p className="text-[10px] font-bold text-aurora-muted uppercase tracking-widest">
                  Pick the applicants to screen with AI
                </p>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {applicants.map((app) => (
                  <label
                    key={app._id}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all group ${
                      selectedCandidates.includes(app._id)
                        ? "border-aurora-blue bg-aurora-blue/5 shadow-inner"
                        : "border-aurora-border/50 hover:border-aurora-blue bg-aurora-bg/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`size-10 rounded-xl border flex items-center justify-center font-bold transition-all ${
                          selectedCandidates.includes(app._id)
                            ? "bg-aurora-blue text-white shadow-lg shadow-aurora-blue/20"
                            : "bg-white text-aurora-muted"
                        }`}
                      >
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-aurora-dark uppercase tracking-tight">
                          {app.name}
                        </p>
                        <p className="text-[10px] font-bold text-aurora-muted uppercase tracking-widest">
                          {app.role} | {app.experience}
                        </p>
                        <div className="mt-1">
                          {app.isScreened ? (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 w-fit font-jakarta">
                              <ShieldCheck className="size-2.5" />
                              SCANNED
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-1 w-fit font-jakarta">
                              <Activity className="size-2.5" />
                              UNSCANNED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      hidden
                      checked={selectedCandidates.includes(app._id)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedCandidates([
                            ...selectedCandidates,
                            app._id,
                          ]);
                        else
                          setSelectedCandidates(
                            selectedCandidates.filter((id) => id !== app._id),
                          );
                      }}
                    />
                    <div
                      className={`size-5 rounded border-2 transition-all flex items-center justify-center ${
                        selectedCandidates.includes(app._id)
                          ? "bg-aurora-blue border-aurora-blue"
                          : "border-aurora-border"
                      }`}
                    >
                      {selectedCandidates.includes(app._id) && (
                        <CheckCircle2 className="size-3 text-white" />
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleStartScreening}
                  disabled={selectedCandidates.length === 0 || isProcessing}
                  className="btn-primary disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-aurora-blue/20"
                >
                  {isProcessing ? "Processing..." : "Start AI Screening"}
                  <ShieldCheck className="size-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 flex flex-col items-center justify-center space-y-10"
            >
              <div className="relative">
                <div className="size-24 border-4 border-aurora-blue/10 border-t-aurora-blue rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="size-8 text-aurora-blue animate-pulse" />
                </div>
              </div>

              <div className="text-center space-y-4 w-full max-w-md">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-aurora-dark uppercase tracking-widest">
                    AI SCREENING IN PROGRESS
                  </h2>
                  <p className="text-[10px] font-black text-aurora-blue uppercase tracking-widest animate-pulse h-4">
                    {statusMessage}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-full bg-aurora-bg border border-aurora-border rounded-full overflow-hidden relative">
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 bg-aurora-blue rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear", duration: 0.2 }}
                    />
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black uppercase text-aurora-muted tracking-widest">Processing {selectedCandidates.length} profile{selectedCandidates.length !== 1 && 's'}</span>
                    <span className="text-[10px] font-black text-aurora-blue tracking-widest">{Math.floor(progress)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-aurora-border/50">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-aurora-dark uppercase tracking-tight">
                    Screening Results
                  </h2>
                  <p className="text-[10px] font-bold text-aurora-muted uppercase tracking-widest leading-none">
                    AI Analysis and Recommendations
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/jobs/${selectedJob}`)
                    }
                    className="btn-primary flex items-center gap-2 group shadow-lg shadow-aurora-blue/20"
                  >
                    <Briefcase className="size-4 group-hover:scale-110 transition-transform" />
                    <span>Go to Job Registry</span>
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary text-aurora-blue border-aurora-blue/20 bg-aurora-blue/5 hover:bg-aurora-blue/10 flex items-center gap-2"
                  >
                    <RefreshCcw className="size-3" />
                    <span>New Screening</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-aurora-bg text-[10px] font-black text-aurora-muted uppercase tracking-widest border-b border-aurora-border/50">
                      <th className="px-6 py-5">Rank</th>
                      <th className="px-6 py-5">Candidate</th>
                      <th className="px-6 py-5">Match Score</th>
                      <th className="px-6 py-5">Recommendation</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-aurora-border/30">
                    {results.map((result, index) => (
                      <motion.tr
                        key={result.candidateId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-aurora-bg/30 transition-all group"
                      >
                        <td className="px-6 py-6 font-jakarta">
                          <span
                            className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              index === 0
                                ? "bg-aurora-blue text-white shadow-lg shadow-aurora-blue/20"
                                : "bg-white text-aurora-muted border border-aurora-border"
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <p className="sm font-black text-aurora-dark uppercase tracking-tight">
                            {result.candidateName}
                          </p>
                          <p className="text-[9px] font-bold text-aurora-muted uppercase tracking-widest">
                            ID: {result.candidateId}
                          </p>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-aurora-bg border border-aurora-border rounded-full overflow-hidden w-24 hidden md:block">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${result.matchScore}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-aurora-blue rounded-full"
                              />
                            </div>
                            <span className="text-sm font-black text-aurora-blue">
                              {result.matchScore}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                              result.finalRecommendation ===
                              "Priority Alignment"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : result.finalRecommendation === "Technical Fit"
                                  ? "bg-blue-50 text-blue-600 border-blue-100"
                                  : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}
                          >
                            {result.finalRecommendation}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button
                            onClick={() => {
                              setSelectedResult(result);
                              setShowModal(true);
                            }}
                            className="p-2 text-aurora-muted hover:text-aurora-blue hover:bg-white rounded-xl border border-transparent hover:border-aurora-border transition-all"
                          >
                            <ExternalLink className="size-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CandidateDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={selectedResult}
      />
    </div>
  );
};

export default ScreeningFlow;
