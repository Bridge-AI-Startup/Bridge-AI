
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import ProjectCard from "./ProjectCard";

export default function ProjectsList({ projects, onProjectSelect, isLoading, recommendedProjectId }) {
  const assessmentTypes = [
    { type: 'assessment-1', label: 'Assessment 1', icon: '🎯' },
    { type: 'assessment-2', label: 'Assessment 2', icon: '🎯' },
    { type: 'assessment-3', label: 'Assessment 3', icon: '🎯' }
  ];

  if (isLoading && projects.length === 0) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">
            Generating AI Assessments
          </h2>
          <p className="text-gray-600">
            Our AI is creating custom assessments tailored to your job listing...
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="grid md:grid-cols-3 gap-4">
          {assessmentTypes.map((assessment, index) => (
            <motion.div
              key={assessment.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl p-6 border-2 border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{assessment.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0B1121]">{assessment.label}</h3>
                </div>
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Show loading state with some assessments already generated
  if (isLoading && projects.length > 0) {
    return (
      <div className="space-y-8">
        {/* Progress Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-medium">Generating {projects.length} of 3 assessments...</span>
          </div>
        </div>

        {/* Generated Assessments + Loading Placeholders */}
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

          {/* Loading placeholders for remaining assessments */}
          {[...Array(3 - projects.length)].map((_, i) => (
            <motion.div
              key={`loading-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-gray-300 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-[#0B1121] mb-2">
            No Assessments Generated
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to generate AI assessments. Please check your API configuration or try again.
          </p>
        </div>
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
