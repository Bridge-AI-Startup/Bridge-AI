
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../components/navigation/Header";
import AssessmentTopBar from "../components/take-assessment/AssessmentTopBar";
import ProjectDetailsCard from "../components/take-assessment/ProjectDetailsCard";
import UploadSubmissionCard from "../components/take-assessment/UploadSubmissionCard";
import AssessmentFooter from "../components/take-assessment/AssessmentFooter";
import ConfirmationModal from "../components/take-assessment/ConfirmationModal";
import SuccessState from "../components/take-assessment/SuccessState";
import { API_URL } from "@/config";

export default function TakeAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [projectLinks, setProjectLinks] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);

  const assessmentId = searchParams.get("id");

  // Get navigation source from state
  const from = location.state?.from;
  const companyName = location.state?.companyName || "Company";
  const jobRole = location.state?.jobRole || "Position";

  const isExpired = timeRemaining <= 0;
  const isLocked = isExpired || isSubmitted;

  useEffect(() => {
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
        // Set time remaining in seconds
        setTimeRemaining(data.data.assessment.timeLimit * 60);
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

  const projectData = assessment ? {
    title: assessment.title,
    description: assessment.description,
    requirements: assessment.codingChallenge?.problemStatement ?
      [assessment.codingChallenge.problemStatement] :
      assessment.questions?.map(q => q.questionText) || [],
    acceptanceCriteria: assessment.codingChallenge?.testCases?.map(tc =>
      `Test case: ${tc.input} should return ${tc.expectedOutput}`
    ) || []
  } : null;

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
    if (isLocked || !assessment) return;

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
  }, [isLocked, assessment]);

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

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('assessmentId', assessmentId);
      formData.append('projectLinks', projectLinks);
      formData.append('timeTaken', Math.floor((assessment.timeLimit * 60 - timeRemaining) / 60)); // in minutes

      // Append all uploaded files
      uploadedFiles.forEach((file, index) => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_URL}/api/assessments/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
        setSubmittedAt(new Date());
      } else {
        throw new Error(data.message || 'Failed to submit assessment');
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
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
        isSubmitting={isSubmitting}
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
