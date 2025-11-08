
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ParseHeader from "../components/onboarding/ParseHeader";
import ProgressMilestones from "../components/onboarding/ProgressMilestones";
import VizFallback from "../components/onboarding/VizFallback";
import { Button } from "@/components/ui/button";

export default function PreferencesParse() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const milestones = [
    { id: 0, text: "Processing your preferences", progress: 20, duration: 800 },
    { id: 1, text: "Analyzing company fit", progress: 40, duration: 1000 },
    { id: 2, text: "Matching with startups", progress: 65, duration: 800 },
    { id: 3, text: "Finding perfect opportunities", progress: 85, duration: 800, subtext: "found 12 matches" },
    { id: 4, text: "Finalizing your profile", progress: 100, duration: 600 }
  ];

  useEffect(() => {
    let timeoutId;
    let startTime = Date.now();
    let currentMilestoneIndex = 0;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const milestone = milestones[currentMilestoneIndex];
      
      if (elapsed < milestone.duration) {
        const milestoneProgress = elapsed / milestone.duration;
        const prevProgress = currentMilestoneIndex > 0 ? milestones[currentMilestoneIndex - 1].progress : 0;
        const targetProgress = milestone.progress;
        setProgress(prevProgress + (targetProgress - prevProgress) * milestoneProgress);
        timeoutId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(milestone.progress);
        setCurrentMilestone(milestone.id);
        
        if (currentMilestoneIndex < milestones.length - 1) {
          currentMilestoneIndex++;
          startTime = Date.now();
          timeoutId = requestAnimationFrame(updateProgress);
        } else {
          setIsComplete(true);
        }
      }
    };

    timeoutId = requestAnimationFrame(updateProgress);

    return () => {
      if (timeoutId) cancelAnimationFrame(timeoutId);
    };
  }, []);

  const handleShowMatches = () => {
    navigate("/StudentDashboard");
  };

  return (
    <div className="min-h-screen bg-[#0B1121] relative overflow-hidden">
      <div className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ParseHeader 
            title="Finding your perfect matches"
            subtitle="Using your preferences to connect you with the right startups..."
          />

          {/* Glass card container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl mb-8"
          >
            {/* Visualization */}
            <div className="mb-8">
              <VizFallback currentMilestone={currentMilestone} />
            </div>

            {/* Progress milestones */}
            <ProgressMilestones 
              milestones={milestones}
              currentMilestone={currentMilestone}
              progress={progress}
            />
          </motion.div>

          {/* Actions */}
          <div className="flex items-center justify-center mt-8">
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <Button
                  onClick={handleShowMatches}
                  className="w-full h-14 px-10 text-lg font-medium rounded-2xl text-[#1E3A8A] shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: '#FFFF00' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
                >
                  Show me my matches
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
