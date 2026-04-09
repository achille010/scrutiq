"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faCircle,
  faEye,
  faUserSlash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Applicant } from "@/store/slices/applicantsSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ApplicantTableProps {
  source: "Umurava" | "External";
}

export default function ApplicantTable({ source }: ApplicantTableProps) {
  const applicants = useSelector((state: RootState) => state.applicants.items);

  const mockApplicants: Applicant[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "React Developer",
      matchScore: 85,
      source: "Umurava",
      status: "Shortlisted",
      appliedAt: "2024-03-21",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      role: "React Developer",
      matchScore: 62,
      source: "Umurava",
      status: "Screened",
      appliedAt: "2024-03-20",
    },
    {
      id: "3",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "React Developer",
      matchScore: 45,
      source: "External",
      status: "Pending",
      appliedAt: "2024-03-19",
    },
  ];

  const filteredApplicants = (applicants.length > 0 ? applicants : mockApplicants).filter(
    (a) => a.source === source
  );

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Candidate</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Match Score</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredApplicants.map((applicant, index) => (
              <motion.tr
                key={applicant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-white/[0.02] transition-all"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo/40 to-purple-500/40 border border-white/10 flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-white/10 group-hover:ring-brand-indigo/50 transition-all">
                      {applicant.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm group-hover:text-brand-indigo transition-colors">{applicant.name}</span>
                      <span className="text-[11px] text-gray-500">{applicant.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-300 font-medium">{applicant.role}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 w-48">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${applicant.matchScore}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-full rounded-full shadow-[0_0_8px_rgba(var(--color-glow))] ${
                          applicant.matchScore > 70 ? "bg-brand-emerald shadow-brand-emerald/50" : 
                          applicant.matchScore > 40 ? "bg-amber-400 shadow-amber-400/50" : "bg-rose-500 shadow-rose-500/50"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-bold ${
                      applicant.matchScore > 70 ? "text-brand-emerald" : 
                      applicant.matchScore > 40 ? "text-amber-400" : "text-rose-500"
                    }`}>
                      {applicant.matchScore}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase tracking-tighter font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 w-fit ${
                    applicant.status === "Shortlisted" ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20" :
                    applicant.status === "Screened" ? "text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20" :
                    "text-gray-400 bg-white/5 border-white/10"
                  }`}>
                    <FontAwesomeIcon icon={faCircle} className="text-[6px]" />
                    {applicant.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all" title="View Profile">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="p-2 hover:bg-rose-500/10 rounded-lg text-gray-500 hover:text-rose-400 transition-all" title="Reject Candidate">
                      <FontAwesomeIcon icon={faUserSlash} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredApplicants.length === 0 && (
        <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
            <FontAwesomeIcon icon={faUsers} size="2x" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">No candidates found</h3>
            <p className="text-gray-400 max-w-xs mx-auto">
              Start by importing candidates or promoting your job listing to the Umurava network.
            </p>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
        <span>Showing {filteredApplicants.length} of {filteredApplicants.length} results</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-all font-bold">Previous</button>
          <button className="px-3 py-1.5 bg-brand-indigo text-white rounded-lg shadow-lg shadow-brand-indigo/20 font-bold">Next</button>
        </div>
      </div>
    </div>
  );
}
