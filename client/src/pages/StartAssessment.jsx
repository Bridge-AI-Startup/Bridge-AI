
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import AssessmentHeader from "../components/assessment/AssessmentHeader";
import AssessmentInstructions from "../components/assessment/AssessmentInstructions";
import TimeAllotment from "../components/assessment/TimeAllotment";
import AssessmentActions from "../components/assessment/AssessmentActions";
import LoadingOverlay from "../components/assessment/LoadingOverlay";

export default function StartAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isStarting, setIsStarting] = useState(false);

  // Get navigation source from state
  const from = location.state?.from;
  const companyName = location.state?.companyName || "Seedify Labs";
  const jobRole = location.state?.jobRole || "Product Intern"; // Changed default jobRole

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock data - would come from URL params or props
  const assessmentData = {
    title: "Software Engineer Mini-Project",
    companyName: companyName,
    duration: "2 hours"
  };

  // Build breadcrumb items dynamically
  const breadcrumbItems = [
    { label: "Dashboard", path: "StudentDashboard" }
  ];

  if (from === "StudentPipeline") {
    breadcrumbItems.push({ label: "My Applications", path: "StudentPipeline" });
  } else if (from === "JobAnalysis") {
    breadcrumbItems.push({ label: `${companyName} - ${jobRole}`, path: `JobAnalysis?company=${encodeURIComponent(companyName)}` });
  }

  breadcrumbItems.push({ label: "Start Assessment" });

  const handleStart = () => {
    setIsStarting(true);
    // Simulate loading time
    setTimeout(() => {
      navigate("/TakeAssessment");
    }, 2000);
  };

  const handleRemindLater = () => {
    navigate("/StudentDashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <AssessmentHeader onBack={() => navigate("/StudentDashboard")} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-200"
          >
            {/* Title Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0B1121] mb-3">
                {assessmentData.title}
              </h2>
              <p className="text-lg text-[#6B7280] font-normal">
                You've been invited by <span className="font-semibold text-[#1E3A8A]">{assessmentData.companyName}</span> to complete a timed skills assessment.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 mb-8" />

            {/* Instructions */}
            <AssessmentInstructions />

            {/* Time Allotment */}
            <TimeAllotment duration={assessmentData.duration} />

            {/* Action Buttons */}
            <AssessmentActions 
              onStart={handleStart}
              onRemindLater={handleRemindLater}
            />

            {/* Footer Note */}
            <p className="text-sm text-[#6B7280] text-center mt-6 font-normal">
              We only track timing and file submissions. No screen recording.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isStarting && <LoadingOverlay />}
      </AnimatePresence>
    </div>
  );
}
