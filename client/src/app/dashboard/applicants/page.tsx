"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Mail,
  FileText,
  Plus,
  ShieldCheck,
  MapPin,
  Briefcase,
  RefreshCcw,
  Upload,
  Download,
  Activity,
  Trash2,
} from "lucide-react";
import api from "@/lib/api";
import { useNotifications } from "@/context/NotificationContext";
import UploadDossierModal from "@/components/applicants/UploadDossierModal";
import ResumeDrawer from "@/components/applicants/ResumeDrawer";
import ContactModal from "@/components/applicants/ContactModal";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const ApplicantsPage = () => {
  const { notify } = useNotifications();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/applicants");
      setCandidates(response.data.data);
    } catch (error) {
      console.error("Candidate Registry Retrieval Fault:", error);
      notify("Failed to connect to the technical talent registry.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const toggleSort = () => {
    setSortOrder(prev => prev === "none" ? "asc" : prev === "asc" ? "desc" : "none");
  };

  const handleDeleteCandidate = async (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${name} from the registry?`,
      )
    ) {
      try {
        await api.delete(`/applicants/${id}`);
        notify("Profile removed successfully.", "success");
        fetchCandidates();
      } catch (error) {
        notify("Failed to remove profile.", "error");
      }
    }
  };

  const handleDownload = () => {
    if (candidates.length === 0) return;

    const headers = ["ID", "Name", "Email", "Role", "Experience", "Screened"];
    const rows = candidates.map((app) => [
      app._id,
      app.name,
      app.email,
      app.role,
      app.experience,
      app.isScreened ? "Yes" : "No",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `candidate_registry_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Exporting candidate registry to CSV...", "info");
  };

  const filteredCandidates = candidates
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "none") return 0;
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4 font-jakarta">
        <RefreshCcw className="size-10 text-aurora-blue animate-spin" />
        <p className="text-xs font-bold text-aurora-muted tracking-widest">
          Loading applicants...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-aurora-surface p-6 md:p-8 rounded-2xl border border-aurora-border shadow-sm gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-aurora-dark tracking-tighter">
            Applicants
          </h1>
          <p className="text-xs font-bold text-aurora-muted tracking-widest">
            Manage your candidate registry and resumes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="size-4" />
            <span className="hidden sm:block">Download list</span>
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary flex items-center gap-2 px-6 shadow-lg shadow-aurora-blue/20 transition-all hover:-translate-y-0.5"
          >
            <Upload className="size-4" />
            <span>Upload resumes</span>
          </button>
        </div>
      </div>

      <div className="admin-card p-6 bg-aurora-surface relative overflow-hidden group">
        <div className="relative z-10 space-y-2">
          <h2 className="text-xl font-black text-aurora-dark tracking-tight">
            Registry guide
          </h2>
          <p className="text-xs font-bold text-aurora-muted tracking-widest leading-relaxed max-w-2xl">
            This registry contains all technical talent uploaded to your portal. You can search by name, 
            sort alphabetically, or view detailed resumes. Screened applicants can be contacted directly via email.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-4">
          <div className="relative group flex items-center bg-white border border-aurora-border rounded-xl px-4 py-2 w-80 focus-within:border-aurora-blue focus-within:ring-4 focus-within:ring-aurora-blue/5 transition-all">
            <Search className="size-4 text-aurora-muted group-focus-within:text-aurora-blue" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-aurora-dark ml-2.5 w-full tracking-wider placeholder:text-aurora-muted/50"
            />
          </div>
          <button
            onClick={toggleSort}
            className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold tracking-widest ${sortOrder !== "none" ? "bg-aurora-blue text-white border-aurora-blue" : "bg-white border-aurora-border text-aurora-muted hover:bg-aurora-bg"}`}
          >
            <Filter className="size-4" />
            <span>Sort: {sortOrder === "none" ? "None" : sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
          </button>
        </div>
        <button
          onClick={fetchCandidates}
          className="p-3 text-aurora-muted hover:text-aurora-blue transition-colors rounded-xl border border-aurora-border"
        >
          <RefreshCcw className="size-4" />
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-aurora-bg text-[10px] font-bold text-aurora-muted tracking-widest border-b border-aurora-border/50">
                <th className="px-6 py-5">Applicant</th>
                <th className="px-6 py-5">Experience</th>
                <th className="px-6 py-5">Ai status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aurora-border/30">
              {filteredCandidates.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-aurora-bg/30 transition-all group"
                >
                  <td className="px-6 py-6 font-jakarta">
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-xl bg-aurora-blue/5 border border-aurora-blue/10 flex items-center justify-center font-bold text-aurora-blue group-hover:bg-aurora-blue group-hover:text-white transition-all shadow-sm">
                        {app.name.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black text-aurora-dark tracking-tight">
                          {app.name.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                        </p>
                        <p className="text-[10px] font-bold text-aurora-muted tracking-widest leading-none">
                          {app.email || "technical-registry"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-aurora-muted font-bold text-[10px] uppercase tracking-widest">
                      <MapPin className="size-3.5" />
                      {app.experience}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {app.isScreened ? (
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5 w-fit font-jakarta">
                        <ShieldCheck className="size-3" />
                        Scanned
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-1.5 w-fit font-jakarta">
                        <Activity className="size-3" />
                        Unscanned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedCandidate(app);
                          setIsContactOpen(true);
                        }}
                        disabled={!app.isScreened}
                        className={`p-2 rounded-xl border transition-all ${
                          app.isScreened
                            ? "text-aurora-muted hover:text-aurora-blue hover:bg-white border-transparent hover:border-aurora-border"
                            : "text-aurora-muted/30 border-transparent cursor-not-allowed"
                        }`}
                        title={app.isScreened ? "Send outreach email" : "Applicant must be scanned first"}
                      >
                        <Mail className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCandidate(app);
                          setIsResumeOpen(true);
                        }}
                        className="p-2 text-aurora-muted hover:text-aurora-blue hover:bg-white rounded-xl border border-transparent hover:border-aurora-border transition-all"
                        title="View Resume"
                      >
                        <FileText className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCandidate(app._id, app.name)}
                        className="p-2 text-aurora-muted hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all"
                        title="Delete Profile"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UploadDossierModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchCandidates}
      />

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
};

export default ApplicantsPage;
