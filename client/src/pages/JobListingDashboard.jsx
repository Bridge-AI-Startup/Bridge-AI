
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Changed useSearchParams to useLocation
import { motion } from "framer-motion";
import { Pencil, TrendingUp, Users, Calendar, FileCheck, Briefcase, CheckCircle2 } from "lucide-react"; // Updated icons: Added FileCheck, Briefcase, kept Pencil, removed ArrowLeft, User, Search
import { Button } from "@/components/ui/button";
// Removed Input import as it's not directly used in this file anymore
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // New import
// Removed KanbanColumn as per instructions, it's either internal or not used
import KanbanBoard from "../components/candidate-tracking/KanbanBoard";
import AssessmentModal from "../components/review-assessments/AssessmentModal";
import BridgeAIButton from "../components/bridge-ai/BridgeAIButton";
import BridgeAIPanel from "../components/bridge-ai/BridgeAIPanel";
import CandidateModal from "../components/candidate-tracking/CandidateModal";
import { API_URL } from "@/config";

export default function JobListingDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // Using useLocation instead of useSearchParams
  const urlParams = new URLSearchParams(location.search);
  const listingId = urlParams.get("id"); // Get ID from URL params

  // State
  const [jobListing, setJobListing] = useState(null);
  const [isLoadingListing, setIsLoadingListing] = useState(true);
  const [listingError, setListingError] = useState(null);
  const [selectedAssessmentForReview, setSelectedAssessmentForReview] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidateStage, setSelectedCandidateStage] = useState(null);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(null);

  // Fetch job listing data
  useEffect(() => {
    const fetchJobListing = async () => {
      if (!listingId) {
        setListingError("No job listing ID provided");
        setIsLoadingListing(false);
        return;
      }

      try {
        setIsLoadingListing(true);
        setListingError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const response = await fetch(`${API_URL}/api/job-listings/${listingId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job listing');
        }

        const data = await response.json();
        if (data.success) {
          setJobListing(data.data.jobListing);
        } else {
          throw new Error(data.message || 'Failed to fetch job listing');
        }
      } catch (error) {
        console.error('Error fetching job listing:', error);
        setListingError(error.message);
      } finally {
        setIsLoadingListing(false);
      }
    };

    fetchJobListing();
  }, [listingId, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pipeline stages configuration
  const stages = [
    { id: "new", label: "Assessments In Progress", color: "blue" },
    { id: "assessment", label: "Assessments Completed", color: "yellow" },
    { id: "interview-scheduled", label: "Interview Scheduled", color: "purple" },
    { id: "interviewed", label: "Interviewed", color: "green" },
    { id: "offer", label: "Offers Extended", color: "fuchsia" }
  ];

  // Candidates data organized by stage
  const candidatesData = {
    "new": [
      {
        id: 1,
        name: "Maya Johnson",
        role: "Full-Stack Engineer Intern",
        match: "94%",
        date: "Dec 15",
        weeklyStartDeadline: "2025-11-03T05:40:00",
        assessmentStarted: true,
        hoursLeft: 2,
        completionTimeAllowedHours: 4
      },
      {
        id: 2,
        name: "Carlos Rivera",
        role: "Full-Stack Engineer Intern",
        match: "91%",
        date: "Dec 15",
        weeklyStartDeadline: "2025-11-03T05:40:00",
        assessmentStarted: false,
        completionTimeAllowedHours: 4
      },
      {
        id: 3,
        name: "Emily Chen",
        role: "Full-Stack Engineer Intern",
        match: "89%",
        date: "Dec 14",
        weeklyStartDeadline: "2025-11-03T05:40:00",
        assessmentStarted: true,
        hoursLeft: -2,
        completionTimeAllowedHours: 4
      },
      {
        id: 4,
        name: "James Wilson",
        role: "Full-Stack Engineer Intern",
        match: "92%",
        date: "Dec 14",
        weeklyStartDeadline: "2025-11-03T05:40:00",
        assessmentStarted: false,
        completionTimeAllowedHours: 4
      },
      {
        id: 5,
        name: "Priya Patel",
        role: "Full-Stack Engineer Intern",
        match: "88%",
        date: "Dec 13",
        weeklyStartDeadline: "2025-11-03T05:40:00",
        assessmentStarted: false,
        completionTimeAllowedHours: 4
      },
      {
        id: 6,
        name: "Marcus Lee",
        role: "Full-Stack Engineer Intern",
        match: "90%",
        date: "Dec 13",
        weeklyStartDeadline: "2025-11-03T05:40:00",
        assessmentStarted: true,
        hoursLeft: 3,
        completionTimeAllowedHours: 4
      },
      {
        id: 7,
        name: "Sofia Martinez",
        role: "Full-Stack Engineer Intern",
        match: "87%",
        date: "Dec 12",
        weeklyStartDeadline: "2025-11-03T05:40:00",
        assessmentStarted: false,
        completionTimeAllowedHours: 4
      },
      {
        id: 8,
        name: "David Kim",
        role: "Full-Stack Engineer Intern",
        match: "93%",
        date: "Dec 12",
        weeklyStartDeadline: "2025-11-03T05:40:00",
        assessmentStarted: true,
        hoursLeft: 1,
        completionTimeAllowedHours: 4
      }
    ],
    "interview-scheduled": [
      { id: 9, name: "Alex Park", role: "Full-Stack Engineer Intern", match: "92%", date: "Dec 18, 2pm" },
      { id: 10, name: "Jordan Lee", role: "Full-Stack Engineer Intern", match: "88%", date: "Dec 19, 10am" },
      { id: 11, name: "Rachel Green", role: "Full-Stack Engineer Intern", match: "91%", date: "Dec 19, 3pm" },
      { id: 12, name: "Kevin Zhang", role: "Full-Stack Engineer Intern", match: "89%", date: "Dec 20, 11am" }
    ],
    "assessment": [
      { id: 13, name: "Sam Patel", role: "Full-Stack Engineer Intern", match: "90%", date: "Dec 20", assessmentStatus: "completed", completedDate: "2024-12-18", aiScore: 92 },
      { id: 14, name: "Aisha Khan", role: "Full-Stack Engineer Intern", match: "86%", date: "Dec 21", assessmentStatus: "completed", completedDate: "2024-12-19", aiScore: 78 },
      { id: 15, name: "Lucas Brown", role: "Full-Stack Engineer Intern", match: "88%", date: "Dec 18", assessmentStatus: "completed", completedDate: "2024-12-18", aiScore: 85 },
      { id: 16, name: "Nina Walsh", role: "Full-Stack Engineer Intern", match: "92%", date: "Dec 17", assessmentStatus: "completed", completedDate: "2024-12-17", aiScore: 88 }
    ],
    "interviewed": [
      { id: 17, name: "Taylor Kim", role: "Full-Stack Engineer Intern", match: "93%", date: "Completed Dec 12", interviewRating: 9 },
      { id: 18, name: "Morgan Davis", role: "Full-Stack Engineer Intern", match: "87%", date: "Completed Dec 11", interviewRating: 7 },
      { id: 19, name: "Nina Rodriguez", role: "Full-Stack Engineer Intern", match: "91%", date: "Completed Dec 10", interviewRating: 8 }
    ],
    "offer": [
      { id: 20, name: "Riley Brown", role: "Full-Stack Engineer Intern", match: "95%", date: "Sent Dec 10", offerStatus: "accepted" },
      { id: 21, name: "Cameron White", role: "Full-Stack Engineer Intern", match: "94%", date: "Sent Dec 9", offerStatus: "waiting" },
      { id: 22, name: "Taylor Anderson", role: "Full-Stack Engineer Intern", match: "92%", date: "Sent Dec 8", offerStatus: "declined" }
    ]
  };

  // Sort and filter candidates
  const sortCandidatesByStatus = (candidates) => {
    return [...candidates].sort((a, b) => {
      const getStatus = (candidate) => {
        if (candidate.assessmentStarted && candidate.hoursLeft !== undefined) {
          const isOverdue = candidate.hoursLeft < 0;
          return isOverdue ? 3 : 1;
        }
        return 2;
      };
      return getStatus(a) - getStatus(b);
    });
  };

  const candidates = {
    ...candidatesData,
    "new": sortCandidatesByStatus(candidatesData["new"]),
    "assessment": [...candidatesData["assessment"]].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)),
    "interviewed": [...candidatesData["interviewed"]].sort((a, b) => (b.interviewRating || 0) - (a.interviewRating || 0))
  };

  // Filter candidates by search query
  const filterCandidates = (candidatesList) => {
    if (!searchQuery) return candidatesList;
    return candidatesList.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredCandidates = Object.keys(candidates).reduce((acc, stageId) => {
    acc[stageId] = filterCandidates(candidates[stageId]);
    return acc;
  }, {});

  // Calculate overview metrics
  const totalApplicants = Object.values(candidates).reduce((sum, arr) => sum + arr.length, 0);

  // Event handlers
  const handleReviewAssessment = (candidate) => {
    const assessment = {
      id: candidate.id,
      candidateName: candidate.name,
      role: candidate.role,
      submissionDate: candidate.date,
      aiScore: candidate.aiScore || 86,
      aiSummary: "Strong React logic, good code structure",
      employerNotes: "",
      status: candidate.assessmentStatus,
      projectTitle: "Real-time Chat Application",
      projectDescription: "Build a real-time chat application with user authentication, message persistence, and typing indicators using React and WebSockets.",
      submittedCode: "Sample code here",
      aiAnalysis: {
        functionalCorrectness: 85,
        codeClarity: 90,
        problemSolving: 82,
        efficiency: 88,
        overallScore: candidate.aiScore || 86,
        summary: "Strong understanding of React hooks and WebSocket implementation. Code is clean and well-structured."
      }
    };
    setSelectedAssessmentForReview(assessment);
  };

  const handleViewAll = (stageId) => {
    switch(stageId) {
      case "new":
        navigate('/ReviewMatches');
        break;
      case "interview-scheduled":
        navigate('/InterviewCalendar');
        break;
      case "assessment":
        navigate('/ReviewAssessments');
        break;
      case "interviewed":
        navigate('/ReviewInterviews');
        break;
      case "offer":
        navigate('/ReviewOffers');
        break;
      default:
        break;
    }
  };

  const handleOpenModal = (candidate, stageId) => {
    const stageCandidates = filteredCandidates[stageId] || [];
    const index = stageCandidates.findIndex(c => c.id === candidate.id);
    setSelectedCandidateIndex(index);
    setSelectedCandidate(candidate);
    setSelectedCandidateStage(stageId);
  };

  const handleCloseModal = () => {
    setSelectedCandidate(null);
    setSelectedCandidateStage(null);
    setSelectedCandidateIndex(null);
  };

  const handleNextCandidate = () => {
    if (selectedCandidateIndex !== null && selectedCandidateStage) {
      const stageCandidates = filteredCandidates[selectedCandidateStage] || [];
      if (selectedCandidateIndex < stageCandidates.length - 1) {
        const nextIndex = selectedCandidateIndex + 1;
        setSelectedCandidateIndex(nextIndex);
        setSelectedCandidate(stageCandidates[nextIndex]);
      }
    }
  };

  const handlePrevCandidate = () => {
    if (selectedCandidateIndex !== null && selectedCandidateStage) {
      const stageCandidates = filteredCandidates[selectedCandidateStage] || [];
      if (selectedCandidateIndex > 0) {
        const prevIndex = selectedCandidateIndex - 1;
        setSelectedCandidateIndex(prevIndex);
        setSelectedCandidate(stageCandidates[prevIndex]);
      }
    }
  };

  // Format location from job listing
  const formatLocation = (listing) => {
    if (!listing) return "Location not specified";

    if (listing.officeLocation && listing.officeLocation.city) {
      const { city, state } = listing.officeLocation;
      return `${city}${state ? `, ${state}` : ''}`;
    }

    // Format locationType
    const locationTypes = {
      'remote': 'Remote',
      'hybrid': 'Hybrid',
      'in_person': 'On-site'
    };

    return locationTypes[listing.locationType] || listing.locationType;
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: jobListing?.roleTitle || "Job Listing" } // Using jobListing.title for the dynamic breadcrumb
  ];

  // Show loading state
  if (isLoadingListing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="EmployerDashboard" />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-12 border border-gray-200 flex items-center justify-center">
              <p className="text-[#6B7280]">Loading job listing...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (listingError || !jobListing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="EmployerDashboard" />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-12 border border-red-200 flex flex-col items-center justify-center gap-4">
              <p className="text-red-600">Error: {listingError || "Job listing not found"}</p>
              <Button
                onClick={() => navigate('/EmployerDashboard')}
                className="h-11 px-6 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bridge AI context - only create after jobListing is loaded
  const aiContext = {
    roleTitle: jobListing.roleTitle,
    stage: "Pipeline Overview",
    totals: {
      candidates: totalApplicants,
      assessmentsInProgress: candidates["new"].length,
      assessmentsCompleted: candidates["assessment"].length,
      interviews: candidates["interview-scheduled"].length + candidates["interviewed"].length
    },
    candidates: []
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50" // Changed background color class
    >
      <Header currentPage="EmployerDashboard" />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto"> {/* Changed max-w */}
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-[#0B1121] mb-1">
                  {jobListing.roleTitle}
                </h1>
                <p className="text-base text-[#6B7280] font-normal">
                  {formatLocation(jobListing)} • {totalApplicants} candidates in pipeline
                </p>
              </div>
              <Button
                onClick={() => navigate(`/CreateListing?id=${listingId}`)} // Navigate to CreateListing for editing
                variant="outline"
                className="h-11 px-5 rounded-xl border border-gray-300 hover:border-[#1E3A8A] hover:shadow-sm transition-all"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Listing
              </Button>
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8"
          >
            <h2 className="text-lg font-semibold text-[#0B1121] mb-5">Progress Overview</h2>
            <div className="grid grid-cols-4 gap-4">
              {/* New Matches This Week */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#1E3A8A]" />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-[#0B1121] mb-1">
                  {candidates["new"].length}
                </p>
                <p className="text-sm text-[#6B7280] font-normal">
                  New {candidates["new"].length === 1 ? 'match' : 'matches'} this week
                </p>
              </div>

              {/* Assessments Awaiting Review */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-[#0B1121] mb-1">
                  {candidates["assessment"].length}
                </p>
                <p className="text-sm text-[#6B7280] font-normal">
                  {candidates["assessment"].length === 1 ? 'Assessment' : 'Assessments'} awaiting review
                </p>
              </div>

              {/* Interviews Scheduled This Week */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-[#0B1121] mb-1">
                  {candidates["interview-scheduled"].length}
                </p>
                <p className="text-sm text-[#6B7280] font-normal">
                  {candidates["interview-scheduled"].length === 1 ? 'Interview' : 'Interviews'} scheduled
                </p>
              </div>

              {/* Offers Pending Approval */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-[#0B1121] mb-1">
                  {candidates["offer"].filter(c => c.offerStatus === "waiting").length}
                </p>
                <p className="text-sm text-[#6B7280] font-normal">
                  {candidates["offer"].filter(c => c.offerStatus === "waiting").length === 1 ? 'Offer' : 'Offers'} pending
                </p>
              </div>
            </div>
          </motion.div>

          {/* Kanban Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-[#0B1121] mb-6">
              Application Pipeline
            </h2>

            <KanbanBoard
              stages={stages}
              filteredCandidates={filteredCandidates}
              onReviewAssessment={handleReviewAssessment}
              onViewAll={handleViewAll}
              onOpenModal={handleOpenModal}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </motion.div>
        </div>
      </div>

      {/* Assessment Review Modal */}
      {selectedAssessmentForReview && (
        <AssessmentModal
          assessment={selectedAssessmentForReview}
          onClose={() => setSelectedAssessmentForReview(null)}
        />
      )}

      {/* Candidate Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          stageId={selectedCandidateStage}
          onClose={handleCloseModal}
          onNext={handleNextCandidate}
          onPrev={handlePrevCandidate}
          hasNext={
            selectedCandidateIndex !== null &&
            selectedCandidateStage &&
            selectedCandidateIndex < (filteredCandidates[selectedCandidateStage] || []).length - 1
          }
          hasPrev={selectedCandidateIndex !== null && selectedCandidateIndex > 0}
        />
      )}

      {/* Bridge AI Components */}
      <BridgeAIButton
        hasUpdates={candidates["assessment"].length > 0}
        onOpen={() => setIsPanelOpen(true)}
        isOpen={isPanelOpen}
      />

      <BridgeAIPanel
        isOpen={isPanelOpen}
        context={aiContext}
        onClose={() => setIsPanelOpen(false)}
        onPromptRun={(prompt) => console.log("Prompt:", prompt)}
        onFreeformPrompt={(text) => console.log("Freeform:", text)}
        onViewCandidate={(id) => {
          const candidate = Object.values(candidates).flat().find(c => String(c.id) === id);
          if (candidate) navigate(`/ApplicantProfile?name=${encodeURIComponent(candidate.name)}`);
        }}
        onInvite={(id) => console.log("Invite:", id)}
        onSendReminder={(id) => console.log("Reminder:", id)}
        onFlag={(id) => console.log("Flag:", id)}
      />
    </motion.div>
  );
}
