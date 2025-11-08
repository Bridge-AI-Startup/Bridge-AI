import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, File, Code, AlertCircle, X, Upload, Github, Sparkles, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ProjectRow({ project, index, onUpdate, onRemove }) {
  const [tagInput, setTagInput] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  const getFileIcon = (file) => {
    if (!file) return File;
    if (file.type.includes('image')) return Image;
    if (file.type.includes('pdf')) return FileText;
    if (file.type.includes('zip')) return Code;
    return File;
  };

  const Icon = project.source === 'github' ? Github : getFileIcon(project.file);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !project.tags.includes(tag)) {
        onUpdate({ tags: [...project.tags, tag] });
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onUpdate({ tags: project.tags.filter(t => t !== tagToRemove) });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 20 * 1024 * 1024) {
      onUpdate({ 
        file: file,
        name: file.name.replace(/\.[^/.]+$/, "")
      });
    }
  };

  const handleGenerateDescription = async () => {
    if (!project.name) {
      alert("Please enter a project name first");
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Given the project name "${project.name}", generate a concise one-sentence description of what was built. Make it compelling and clear. Return only the description, no quotes or extra text.`,
        add_context_from_internet: false
      });

      if (result) {
        onUpdate({ description: result.trim() });
      }
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!project.name && !project.description) {
      alert("Please enter a project name or description first");
      return;
    }

    setIsGeneratingTags(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this project:
Name: ${project.name}
Description: ${project.description || "No description"}

Generate 3-5 relevant technology tags (e.g., React, Python, AWS, etc.). Return them as a comma-separated list, no extra text.`,
        add_context_from_internet: false
      });

      if (result) {
        const newTags = result.split(',').map(tag => tag.trim()).filter(tag => tag && !project.tags.includes(tag));
        if (newTags.length > 0) {
          onUpdate({ tags: [...project.tags, ...newTags] });
        }
      }
    } catch (error) {
      console.error("Error generating tags:", error);
      alert("Failed to generate tags. Please try again.");
    } finally {
      setIsGeneratingTags(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      {/* Header Row */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-[#1E3A8A]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {project.file ? (
              <span className="text-sm text-[#6B7280] truncate font-normal">
                {project.file.name}
              </span>
            ) : project.source === 'github' ? (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-[#1E3A8A] hover:underline font-normal"
              >
                {project.url}
              </a>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600 font-normal">File missing</span>
              </div>
            )}
          </div>

          <Input
            placeholder="Project name"
            value={project.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="text-lg font-semibold mb-3 border-gray-300 focus:border-[#1E3A8A]"
          />

          <div className="relative mb-3">
            <Input
              placeholder="One sentence about what you built"
              value={project.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="pr-12 border-gray-300 focus:border-[#1E3A8A]"
            />
            <Button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGeneratingDescription || !project.name}
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              title="Generate description with AI"
            >
              {isGeneratingDescription ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1E3A8A]" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
              )}
            </Button>
          </div>

          {/* Tags */}
          <div className="relative mb-3">
            <Input
              placeholder="Add tech tags (e.g., React, Python) - press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="text-sm border-gray-300 focus:border-[#1E3A8A] pr-12"
            />
            <Button
              type="button"
              onClick={handleGenerateTags}
              disabled={isGeneratingTags || (!project.name && !project.description)}
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              title="Generate tags with AI"
            >
              {isGeneratingTags ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1E3A8A]" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
              )}
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <Badge
                  key={i}
                  className="bg-gray-100 text-[#0B1121] hover:bg-gray-200 pl-3 pr-1 py-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-600 transition-colors p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        {!project.source && (
          <label className="flex-1">
            <input
              type="file"
              accept=".zip,.pdf,.doc,.docx,.md,.png,.jpg,.jpeg,.gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 hover:border-[#1E3A8A] hover:bg-gray-50"
              onClick={(e) => e.currentTarget.previousElementSibling.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {project.file ? "Replace file" : "Upload file"}
            </Button>
          </label>
        )}
      </div>
    </motion.div>
  );
}