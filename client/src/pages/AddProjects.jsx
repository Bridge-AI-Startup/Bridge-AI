
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/navigation/Header";
import ProjectsHeader from "../components/projects/ProjectsHeader";
// SaveAnimation removed
import FileUploadZone from "../components/projects/FileUploadZone";
import ProjectsList from "../components/projects/ProjectsList";
import GitHubConnect from "../components/projects/GitHubConnect";
import ProjectsActions from "../components/projects/ProjectsActions";
import { useToast } from "@/components/ui/use-toast";

export default function AddProjects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesAdded = (files) => {
    const newProjects = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name.replace(/\.[^/.]+$/, ""),
      description: "",
      tags: []
    }));
    setProjects([...projects, ...newProjects]);
  };

  const handleUpdateProject = (id, updates) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleRemoveProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleGitHubRepos = (repos) => {
    const githubProjects = repos.map((repo) => ({
      id: Date.now() + Math.random(),
      file: null,
      name: repo.name,
      description: repo.description,
      tags: repo.tags,
      source: "github",
      url: repo.url
    }));
    setProjects([...projects, ...githubProjects]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    
    // Navigate to projects parse page
    setTimeout(() => {
      navigate("/ProjectsParse");
    }, 500);
  };

  const handleSkip = () => {
    navigate("/StudentDashboard");
  };

  const handleBack = () => {
    navigate("/Onboarding"); // Updated path from /OnboardingParse to /Onboarding
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Onboarding" />
      
      <div className="pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <ProjectsHeader />
          
          {/* SaveAnimation component removed */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <GitHubConnect onReposImported={handleGitHubRepos} />
          </motion.div>

          <ProjectsList
            projects={projects}
            onUpdate={handleUpdateProject}
            onRemove={handleRemoveProject}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <FileUploadZone onFilesAdded={handleFilesAdded} />
          </motion.div>

          <ProjectsActions
            hasProjects={projects.length > 0}
            isSaving={isSaving}
            onSave={handleSave}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}
