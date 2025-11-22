import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Clock, User, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URL } from "../config";

export default function GradeAssessment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [application, setApplication] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [moveToInterview, setMoveToInterview] = useState(false);

  const applicationId = searchParams.get("applicationId");
  const resultId = searchParams.get("resultId");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (applicationId && resultId) {
      fetchData();
    } else {
      setError("Missing application or result ID");
      setIsLoading(false);
    }
  }, [applicationId, resultId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch application details from admin endpoint
      const appResponse = await fetch(`${API_URL}/api/admin/applications/${applicationId}`);

      if (!appResponse.ok) {
        throw new Error('Failed to fetch application');
      }

      const appData = await appResponse.json();
      if (appData.success) {
        setApplication(appData.data.application);

        // Find the specific assessment result
        const result = appData.data.assessmentResults.find(r => r._id === resultId);
        if (result) {
          setAssessmentResult(result);
          setAssessment(result.assessmentId);

          // Pre-fill if already graded
          if (result.score) {
            setScore(result.score.toString());
          }
          if (result.results?.detailedFeedback) {
            setFeedback(result.results.detailedFeedback);
          }
        } else {
          throw new Error('Assessment result not found');
        }
      } else {
        throw new Error(appData.message || 'Failed to fetch application');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitGrade = async () => {
    if (!score || isNaN(Number(score))) {
      alert('Please enter a valid score');
      return;
    }

    const scoreNum = Number(score);
    if (scoreNum < 0 || scoreNum > 100) {
      alert('Score must be between 0 and 100');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/api/admin/applications/${applicationId}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assessmentResultId: resultId,
          score: scoreNum,
          feedback: feedback,
          moveToInterview: moveToInterview
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit grade');
      }

      const data = await response.json();
      if (data.success) {
        alert('Grade submitted successfully!');
        navigate('/ReviewAssessments');
      } else {
        throw new Error(data.message || 'Failed to submit grade');
      }
    } catch (err) {
      console.error('Error submitting grade:', err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const breadcrumbItems = [
    { label: "Admin", path: "ReviewAssessments" },
    { label: "Review Assessments", path: "ReviewAssessments" },
    { label: "Grade Assessment" }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="Dashboard" />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading assessment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !application || !assessmentResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="Dashboard" />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-red-200 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error || "Failed to load assessment"}</p>
              <button
                onClick={() => navigate("/ReviewAssessments")}
                className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90"
              >
                Back to Review Assessments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const candidate = application.candidateId;
  const jobListing = application.jobListingId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/ReviewAssessments")}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#0B1121] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-normal">Back to Review Assessments</span>
            </button>

            <h1 className="text-4xl font-semibold text-[#0B1121] mb-3">
              Admin: Grade Assessment
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Review candidate submission and provide manual grading
            </p>
          </div>

          {/* Candidate Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {candidate.profilePicture ? (
                  <img
                    src={candidate.profilePicture}
                    alt={`${candidate.firstName} ${candidate.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#6366F1] flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-semibold text-[#0B1121]">
                    {candidate.firstName} {candidate.lastName}
                  </h3>
                  <p className="text-sm text-[#6B7280] font-normal">
                    {candidate.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-[#0B1121] mb-1">
                  {jobListing.roleTitle}
                </p>
                <div className="flex items-center gap-1 text-[#6B7280] text-sm">
                  <Calendar className="w-3 h-3" />
                  <span className="font-normal">
                    Applied: {formatDate(application.appliedAt)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assessment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <h2 className="text-xl font-semibold text-[#0B1121] mb-4">Assessment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Title</p>
                <p className="font-semibold text-[#0B1121]">{assessment?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Type</p>
                <p className="font-semibold text-[#0B1121]">
                  {assessment?.assessmentType?.replace('_', ' ') || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Time Limit</p>
                <p className="font-semibold text-[#0B1121]">
                  {assessment?.timeLimit ? `${assessment.timeLimit} minutes` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Completed At</p>
                <p className="font-semibold text-[#0B1121]">
                  {formatDate(assessmentResult.completedAt)}
                </p>
              </div>
            </div>

            {assessment?.description && (
              <div className="mt-4">
                <p className="text-sm text-[#6B7280] mb-1">Description</p>
                <p className="text-[#0B1121]">{assessment.description}</p>
              </div>
            )}
          </motion.div>

          {/* Submission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <h2 className="text-xl font-semibold text-[#0B1121] mb-4">Candidate Submission</h2>

            {assessmentResult.results?.codeSubmission ? (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm font-mono text-[#0B1121] overflow-x-auto">
                  {assessmentResult.results.codeSubmission}
                </pre>
              </div>
            ) : (
              <p className="text-[#6B7280]">No submission content available</p>
            )}

            {assessmentResult.timeTaken && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#6B7280]">
                <Clock className="w-4 h-4" />
                <span>Time taken: {assessmentResult.timeTaken} minutes</span>
              </div>
            )}
          </motion.div>

          {/* Grading Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <h2 className="text-xl font-semibold text-[#0B1121] mb-4">Manual Grading</h2>

            <div className="space-y-4">
              {/* Score Input */}
              <div>
                <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                  Score (0-100) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Enter score out of 100"
                  className="h-12"
                />
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                  Feedback (Optional)
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide detailed feedback on the candidate's submission..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Move to Interview Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="moveToInterview"
                  checked={moveToInterview}
                  onChange={(e) => setMoveToInterview(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="moveToInterview" className="text-sm text-[#0B1121]">
                  Move application to "Interview Scheduled" stage after grading
                </label>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-end gap-4"
          >
            <Button
              variant="outline"
              onClick={() => navigate("/ReviewAssessments")}
              className="h-12 px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitGrade}
              disabled={isSubmitting || !score}
              className="h-12 px-8 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Grade</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
