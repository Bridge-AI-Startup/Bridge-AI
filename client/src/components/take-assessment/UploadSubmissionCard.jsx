import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Link as LinkIcon, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UploadSubmissionCard({
  uploadedFiles,
  projectLinks,
  setProjectLinks,
  onFileUpload,
  onRemoveFile,
  isLocked
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLocked) return;
    
    const files = e.dataTransfer.files;
    onFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isLocked) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    if (isLocked) return;
    const files = e.target.files;
    onFileUpload(files);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
      zip: '📦',
      md: '📝',
      pdf: '📄',
      py: '🐍',
      js: '📜',
      jsx: '⚛️',
      ipynb: '📓',
      default: '📎'
    };
    return iconMap[ext] || iconMap.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl p-8 border border-gray-200"
    >
      <h3 className="text-xl font-semibold text-[#0B1121] mb-6">
        Upload Your Submission
      </h3>

      {/* Drag and Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all mb-6 ${
          isDragging
            ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
            : isLocked
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-[#1E3A8A] cursor-pointer'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".zip,.md,.pdf,.py,.js,.jsx,.ipynb"
          onChange={handleFileInputChange}
          disabled={isLocked}
          className="hidden"
        />
        
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isLocked ? 'text-gray-400' : 'text-[#1E3A8A]'}`} />
        
        <p className="text-[#0B1121] font-semibold mb-2">
          {isDragging ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="text-sm text-[#6B7280] font-normal mb-4">
          or
        </p>
        <label
          htmlFor="file-upload"
          className={`inline-block px-6 py-3 rounded-xl font-medium transition-all ${
            isLocked
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 cursor-pointer'
          }`}
        >
          Choose Files
        </label>
        <p className="text-xs text-[#6B7280] mt-4 font-normal">
          Accepted: ZIP, MD, PDF, .py, .js, .ipynb • Max 50MB each • Up to 10 files
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#0B1121] mb-3">
            Uploaded Files ({uploadedFiles.length}/10)
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(file.name)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0B1121] truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {!isLocked && (
                  <button
                    onClick={() => onRemoveFile(i)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Links */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[#0B1121] mb-2">
          <LinkIcon className="w-4 h-4" />
          GitHub or Hosted Project Link (Optional)
        </label>
        <Input
          type="url"
          placeholder="https://github.com/yourusername/project"
          value={projectLinks}
          onChange={(e) => setProjectLinks(e.target.value)}
          disabled={isLocked}
          className="h-12 rounded-xl"
        />
        <p className="text-xs text-[#6B7280] mt-2 font-normal">
          Paste your GitHub repository or deployed app URL
        </p>
      </div>
    </motion.div>
  );
}