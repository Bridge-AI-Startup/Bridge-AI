import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectRow from "./ProjectRow";

export default function ProjectsList({ projects, onUpdate, onRemove }) {
  return (
    <div className="space-y-4 mb-8">
      <AnimatePresence>
        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
            onUpdate={(updates) => onUpdate(project.id, updates)}
            onRemove={() => onRemove(project.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}