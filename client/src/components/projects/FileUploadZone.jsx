import React, { useState } from "react";
import { Upload } from "lucide-react";

export default function FileUploadZone({ onFilesAdded }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => {
      const validTypes = [
        'application/zip',
        'application/x-zip-compressed',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/markdown',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif'
      ];
      return validTypes.includes(file.type) && file.size <= 20 * 1024 * 1024; // 20MB max
    });

    if (files.length > 0) {
      onFilesAdded(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(file => {
      return file.size <= 20 * 1024 * 1024; // 20MB max
    });
    
    if (files.length > 0) {
      onFilesAdded(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        block bg-white border-2 border-dashed rounded-3xl p-12 
        cursor-pointer transition-all duration-200
        hover:border-[#1E3A8A] hover:bg-gray-50
        ${isDragging ? "border-[#1E3A8A] bg-gray-50 scale-[1.02]" : "border-gray-300"}
      `}
    >
      <input
        type="file"
        multiple
        accept=".zip,.pdf,.doc,.docx,.md,.png,.jpg,.jpeg,.gif"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
          <Upload className="w-8 h-8 text-[#1E3A8A]" />
        </div>
        <h3 className="text-2xl font-semibold text-[#0B1121] mb-2">
          Upload your projects
        </h3>
        <p className="text-[#6B7280] mb-4 font-normal">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-sm text-gray-500 font-normal">
          Supports ZIP, PDF, DOCX, MD, and images (max 20MB each)
        </p>
      </div>
    </label>
  );
}