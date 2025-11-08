import React from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle2 } from "lucide-react";

export default function UploadResumeCard({ 
  resumeFile, 
  isDragging, 
  onFileChange, 
  onDrop, 
  onDragOver, 
  onDragLeave 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="h-full"
    >
      <label
        htmlFor="resume-upload"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          flex flex-col items-center justify-center h-full min-h-[280px]
          bg-gray-50 border-2 border-dashed rounded-3xl p-8 
          cursor-pointer transition-all duration-200
          hover:border-gray-400 hover:bg-gray-100
          ${isDragging ? "border-[#1E3A8A] bg-gray-100" : "border-gray-300"}
          ${resumeFile ? "border-green-500 bg-green-50" : ""}
        `}
      >
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={onFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center text-center">
          {resumeFile ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-600 mb-4" />
              <p className="text-[#0B1121] font-semibold mb-2">Resume uploaded</p>
              <p className="text-sm text-[#6B7280] font-normal truncate max-w-full">
                {resumeFile.name}
              </p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-[#0B1121] font-semibold mb-2">Upload resume</p>
              <p className="text-sm text-[#6B7280] font-normal">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX</p>
            </>
          )}
        </div>
      </label>
    </motion.div>
  );
}