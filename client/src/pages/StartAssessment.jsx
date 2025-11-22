
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import AssessmentHeader from "../components/assessment/AssessmentHeader";
import AssessmentInstructions from "../components/assessment/AssessmentInstructions";
import TimeAllotment from "../components/assessment/TimeAllotment";
import AssessmentActions from "../components/assessment/AssessmentActions";
import LoadingOverlay from "../components/assessment/LoadingOverlay";
import { API_URL } from "@/config";

export default function StartAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isStarting, setIsStarting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);

  const assessmentId = searchParams.get("id");

  // Get navigation source from state
  const from = location.state?.from;
  const companyName = location.state?.companyName || "Company";
  const jobRole = location.state?.jobRole || "Position";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAssessment();
  }, [assessmentId]);

  const fetchAssessment = async () => {
    if (!assessmentId) {
      setError("No assessment ID provided");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/assessments/${assessmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assessment');
      }

      const data = await response.json();
      if (data.success) {
        setAssessment(data.data.assessment);
      } else {
        throw new Error(data.message || 'Failed to fetch assessment');
      }
    } catch (err) {
      console.error('Error fetching assessment:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const assessmentData = assessment ? {
    title: assessment.title,
    companyName: companyName,
    duration: `${Math.floor(assessment.timeLimit / 60)} hour${Math.floor(assessment.timeLimit / 60) !== 1 ? 's' : ''}`
  } : {
    title: "Loading...",
    companyName: companyName,
    duration: "..."
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
      navigate(`/TakeAssessment?id=${assessmentId}`);
    }, 2000);
  };

  const handleRemindLater = () => {
    navigate("/StudentDashboard");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="Dashboard" />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading assessment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="Dashboard" />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-red-200 text-center">
              <p className="text-red-600 mb-4">{error || "Assessment not found"}</p>
              <button
                onClick={() => navigate("/StudentDashboard")}
                className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
