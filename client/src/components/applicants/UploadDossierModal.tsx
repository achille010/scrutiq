"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Upload,
  FileText,
  CheckCircle2,
  RefreshCcw,
  ShieldCheck,
  AlertCircle,
  Mail,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface UploadDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadDossierModal = ({
  isOpen,
  onClose,
  onSuccess,
}: UploadDossierModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (f) => f.type === "application/pdf",
      );
      if (newFiles.length < e.target.files.length) {
        toast.warning("Please only upload PDF resumes.");
      }
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("dossiers", file);
    });

    try {
      setUploadProgress(40);
      const response = await api.post("/applicants/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "success") {
        setUploadProgress(100);
        toast.success(
          `Success! ${files.length} resumes have been added to your candidates.`,
        );
        onSuccess();
        setTimeout(onClose, 1000);
      }
    } catch (error: any) {
      console.error("Upload Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong during the upload. Please try again.",
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-aurora-dark/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-aurora-surface rounded-3xl border border-aurora-border shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-aurora-border/50 flex items-start justify-between bg-aurora-bg/30">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-aurora-blue flex items-center justify-center shadow-lg shadow-aurora-blue/20">
                  <Upload className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-aurora-dark uppercase tracking-tight">
                    Upload New Resumes
                  </h2>
                  <p className="text-[10px] font-bold text-aurora-muted uppercase tracking-widest leading-none mt-1">
                    Add multiple candidate profiles to your registry
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-aurora-muted hover:text-aurora-blue hover:bg-white rounded-xl border border-transparent hover:border-aurora-border transition-all"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
                  isUploading
                    ? "border-aurora-border bg-aurora-bg/10"
                    : "border-aurora-border/50 hover:border-aurora-blue hover:bg-aurora-blue/5 cursor-pointer"
                }`}
                onClick={() =>
                  !isUploading && document.getElementById("fileInput")?.click()
                }
              >
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  hidden
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <FileText
                  className={`size-12 mb-4 ${isUploading ? "text-aurora-border animate-pulse" : "text-aurora-muted group-hover:text-aurora-blue"}`}
                />
                <div className="text-center">
                  <p className="text-xs font-black text-aurora-dark uppercase tracking-widest">
                    Select PDF Resumes
                  </p>
                  <p className="text-[10px] font-bold text-aurora-muted uppercase tracking-widest mt-1">
                    Drag and drop files here to upload
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-aurora-bg/50 border border-aurora-border rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="size-4 text-aurora-blue" />
                        <span className="text-[11px] font-bold text-aurora-dark uppercase tracking-tight truncate max-w-[300px]">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="p-1 hover:text-rose-500 transition-colors"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-aurora-blue uppercase tracking-widest">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-aurora-bg border border-aurora-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-aurora-blue rounded-full"
                    />
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-aurora-border/50 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || files.length === 0}
                  className="btn-primary flex items-center gap-2 shadow-lg shadow-aurora-blue/20 disabled:opacity-50"
                >
                  {isUploading ? (
                    <RefreshCcw className="size-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="size-4" />
                  )}
                  <span>
                    {isUploading
                      ? "Uploading..."
                      : `Upload ${files.length} Resumes`}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadDossierModal;
