
import React from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function ProjectsList({ projects, onProjectSelect, isLoading, recommendedProjectId }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-200 h-64 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelect={() => onProjectSelect(project)}
          delay={i * 0.1}
          isRecommended={project.id === recommendedProjectId}
        />
      ))}
    </div>
  );
}
