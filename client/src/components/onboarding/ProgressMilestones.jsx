import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

function CircularProgress({ percentage }) {
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="flex-shrink-0">
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="2"
      />
      <motion.circle
        cx="10"
        cy="10"
        r={radius}
        fill="none"
        stroke="#FFFF00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        transform="rotate(-90 10 10)"
      />
    </svg>
  );
}

export default function ProgressMilestones({ milestones, currentMilestone, progress }) {
  return (
    <div className="space-y-4 mb-8">
      <AnimatePresence mode="wait">
        {milestones.slice(0, Math.min(currentMilestone + 1, milestones.length)).map((milestone, i) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              {milestone.id < currentMilestone ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : milestone.id === currentMilestone ? (
                <CircularProgress percentage={progress} />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
              )}
              <span className={`text-sm ${milestone.id === currentMilestone ? 'text-white font-medium' : 'text-gray-400'}`}>
                {milestone.text}
              </span>
            </div>
            {milestone.subtext && milestone.id === currentMilestone && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.5 }}
                className="ml-8 mt-1"
              >
                <span className="text-xs text-[#FFFF00] font-medium">
                  {milestone.subtext}
                </span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="mt-6 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#FFFF00]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      
      {/* Progress percentage text */}
      <div className="flex justify-end mt-2">
        <span className="text-xs text-gray-400 font-medium">
          {Math.round(progress)}% complete
        </span>
      </div>
    </div>
  );
}