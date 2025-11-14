import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import ProjectsHeader from "../components/projects/ProjectsHeader";
import FileUploadZone from "../components/projects/FileUploadZone";
import ProjectsList from "../components/projects/ProjectsList";
import GitHubConnect from "../components/projects/GitHubConnect";
import ProjectsActions from "../components/projects/ProjectsActions";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/config";

export default function EditProjects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [existingProjects, setExistingProjects] = useState([]);
  const [githubUrl, setGithubUrl] = useState("");

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

  const loadOnboardingStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/StudentSignIn');
        return;
      }

      const response = await fetch(`${API_URL}/api/onboarding/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      // Handle authentication errors
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Session expired",
            description: "Please sign in again",
            variant: "destructive"
          });
          navigate('/StudentSignIn');
          return;
        }
        throw new Error(data.message || 'Failed to load data');
      }

      if (data.success && data.data.user) {
        if (data.data.user.projects && data.data.user.projects.length > 0) {
          setExistingProjects(data.data.user.projects);
        }
        if (data.data.user.githubUrl) {
          setGithubUrl(data.data.user.githubUrl);
        }
      }
    } catch (error) {
      console.error('Error loading onboarding status:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to load your information',
        variant: "destructive"
      });
    }
  }, [navigate, toast]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadOnboardingStatus();
  }, [loadOnboardingStatus]);

  const handleGitHubRepos = async (repos) => {
    if (repos.length > 0 && repos[0].profileUrl) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/onboarding/github`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ githubUrl: repos[0].profileUrl })
        });

        const data = await response.json();
        if (data.success) {
          toast({
            title: "GitHub connected",
            description: `Connected to GitHub with ${repos.length} repositories found.`,
          });
        }
      } catch (error) {
        console.error('Error saving GitHub URL:', error);
        toast({
          title: "Error",
          description: "Failed to save GitHub profile.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/StudentSignIn');
        return;
      }

      // Upload each project to the backend (if any)
      if (projects.length > 0) {
        for (const project of projects) {
          const formData = new FormData();
          formData.append('title', project.name);
          formData.append('description', project.description || '');

          if (project.file) {
            formData.append('projectFiles', project.file);
          }

          const response = await fetch(`${API_URL}/api/onboarding/projects`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || `Failed to upload project: ${project.name}`);
          }
        }

        toast({
          title: "Projects saved",
          description: `Successfully uploaded ${projects.length} project(s).`,
        });
      }

      setIsSaving(false);

      // Always return to Profile
      setTimeout(() => {
        navigate("/Profile");
      }, 500);
    } catch (error) {
      console.error('Error saving projects:', error);
      setIsSaving(false);
      toast({
        title: "Error",
        description: error.message || 'Failed to save projects',
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    navigate("/Profile");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Onboarding" />

      <div className="pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[
            { label: "Profile", path: "Profile" },
            { label: "Projects" }
          ]} />
          <ProjectsHeader />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <GitHubConnect
              onReposImported={handleGitHubRepos}
              initialGithubUrl={githubUrl}
            />
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
