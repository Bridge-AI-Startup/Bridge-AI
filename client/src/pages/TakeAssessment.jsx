
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../components/navigation/Header";
import AssessmentTopBar from "../components/take-assessment/AssessmentTopBar";
import ProjectDetailsCard from "../components/take-assessment/ProjectDetailsCard";
import UploadSubmissionCard from "../components/take-assessment/UploadSubmissionCard";
import AssessmentFooter from "../components/take-assessment/AssessmentFooter";
import ConfirmationModal from "../components/take-assessment/ConfirmationModal";
import SuccessState from "../components/take-assessment/SuccessState";

export default function TakeAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeRemaining, setTimeRemaining] = useState(2 * 60 * 60); // 2 hours in seconds
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [projectLinks, setProjectLinks] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);

  // Get navigation source from state
  const from = location.state?.from;
  const companyName = location.state?.companyName || "Company";
  const jobRole = location.state?.jobRole || "Position";

  const isExpired = timeRemaining <= 0;
  const isLocked = isExpired || isSubmitted;

  // Mock project data
  const projectData = {
    title: "Full-Stack Developer Mini-Project",
    description: "Build a simple task management application with user authentication, CRUD operations, and a clean UI. This project tests your ability to integrate frontend and backend technologies.",
    requirements: [
      "Create a REST API with at least 3 endpoints (Create, Read, Update/Delete tasks)",
      "Implement user authentication (login/signup)",
      "Build a responsive frontend interface",
      "Connect frontend to backend API",
      "Include basic error handling and validation"
    ],
    acceptanceCriteria: [
      "Code is clean, well-organized, and follows best practices",
      "Application runs without errors",
      "All core features work as expected",
      "UI is intuitive and responsive",
      "README with setup instructions is included"
    ]
  };

  // Build breadcrumb items dynamically
  const breadcrumbItems = [
    { label: "Dashboard", path: "StudentDashboard" }
  ];

  if (from === "StudentPipeline") {
    breadcrumbItems.push({ label: "My Applications", path: "StudentPipeline" });
  }

  breadcrumbItems.push({ label: "Assessment" });

  // Countdown timer
  useEffect(() => {
    if (isLocked) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked]);

  const handleFileUpload = (newFiles) => {
    const filesArray = Array.from(newFiles);
    const validFiles = filesArray.filter(file => {
      const maxSize = 50 * 1024 * 1024; // 50MB
      return file.size <= maxSize;
    });

    if (uploadedFiles.length + validFiles.length > 10) {
      alert("You can only upload up to 10 files");
      return;
    }

    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSaveProgress = () => {
    // Save progress logic here
    alert("Progress saved successfully!");
  };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0 && !projectLinks.trim()) {
      alert("Please upload at least one file or provide a project link");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmission = () => {
    setIsSubmitted(true);
    setSubmittedAt(new Date());
    setShowConfirmModal(false);
  };

  if (isSubmitted) {
    return <SuccessState submittedAt={submittedAt} onBackToDashboard={() => navigate("/StudentDashboard")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />
      
      <AssessmentTopBar
        timeRemaining={timeRemaining}
        isExpired={isExpired}
        breadcrumbItems={breadcrumbItems}
      />

      <div className="pt-44 pb-32 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <ProjectDetailsCard projectData={projectData} />
          
          <UploadSubmissionCard
            uploadedFiles={uploadedFiles}
            projectLinks={projectLinks}
            setProjectLinks={setProjectLinks}
            onFileUpload={handleFileUpload}
            onRemoveFile={handleRemoveFile}
            isLocked={isLocked}
          />

          {isExpired && !isSubmitted && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-800 font-semibold mb-4">
                Time's up. You can still review your uploads.
              </p>
              <button
                onClick={() => navigate("/StudentDashboard")}
                className="px-6 py-3 bg-[#1E3A8A] text-white rounded-xl font-medium hover:bg-[#1E3A8A]/90 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      <AssessmentFooter
        onSubmit={handleSubmit}
        onSaveProgress={handleSaveProgress}
        isLocked={isLocked}
        canSubmit={uploadedFiles.length > 0 || projectLinks.trim().length > 0}
      />

      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmationModal
            onConfirm={confirmSubmission}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
