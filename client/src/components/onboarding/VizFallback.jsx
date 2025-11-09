import React from "react";
import { motion } from "framer-motion";

export default function VizFallback({ currentMilestone }) {
  const skillLabels = ["React", "Python", "Design", "Communication", "Leadership", "Data Analysis"];
  
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 600 400">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFF00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFF00" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#grid)" />

        {/* Skill nodes with connections */}
        {currentMilestone >= 1 && (
          <>
            {/* Connections */}
            <motion.line
              x1="200" y1="150" x2="400" y2="150"
              stroke="url(#yellowGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: currentMilestone >= 2 ? 1 : 0, opacity: currentMilestone >= 2 ? 0.6 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.line
              x1="200" y1="150" x2="300" y2="250"
              stroke="url(#yellowGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: currentMilestone >= 2 ? 1 : 0, opacity: currentMilestone >= 2 ? 0.6 : 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            />
            <motion.line
              x1="400" y1="150" x2="300" y2="250"
              stroke="url(#yellowGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: currentMilestone >= 2 ? 1 : 0, opacity: currentMilestone >= 2 ? 0.6 : 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            />

            {/* Skill nodes */}
            {[
              { x: 200, y: 150, label: skillLabels[0] },
              { x: 400, y: 150, label: skillLabels[1] },
              { x: 300, y: 250, label: skillLabels[2] },
              { x: 150, y: 250, label: skillLabels[3] },
              { x: 450, y: 250, label: skillLabels[4] },
              { x: 300, y: 100, label: skillLabels[5] }
            ].map((node, i) => (
              <motion.g key={i}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill="#FFFF00"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                />
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="16"
                  fill="none"
                  stroke="#FFFF00"
                  strokeWidth="1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.2 + 0.2 }}
                />
                <motion.text
                  x={node.x}
                  y={node.y + 30}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentMilestone >= 1 ? 0.7 : 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 + 0.4 }}
                >
                  {node.label}
                </motion.text>
              </motion.g>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}