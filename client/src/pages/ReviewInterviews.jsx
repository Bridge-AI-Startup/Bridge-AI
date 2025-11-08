
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, User } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Updated import path for Breadcrumbs
import { Input } from "@/components/ui/input";
// Removed Select imports as the rating filter is being removed and no other Select is added by the outline
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InterviewsTabs from "../components/review-interviews/InterviewsTabs";
import InterviewsTable from "../components/review-interviews/InterviewsTable";
import InterviewModal from "../components/review-interviews/InterviewModal";
import InterviewAnalyticsSummary from "../components/review-interviews/InterviewAnalyticsSummary";
import BridgeAIButton from "../components/bridge-ai/BridgeAIButton";
import BridgeAIPanel from "../components/bridge-ai/BridgeAIPanel";
import { Toaster } from "@/components/ui/toaster";

export default function ReviewInterviews() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // Removed ratingFilter state as per changes
  // const [ratingFilter, setRatingFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedInterviewIndex, setSelectedInterviewIndex] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const interviews = [
    {
      id: 1,
      candidateName: "Taylor Kim",
      role: "Product Designer Intern",
      interviewDate: "Dec 12, 2024",
      interviewer: "Emily Watson",
      duration: "45 min",
      status: "completed",
      rating: 9,
      matchScore: 93,
      notes: "Excellent communication skills, strong portfolio, great culture fit. Recommended for next round.",
      strengths: ["Communication", "Portfolio Quality", "Problem Solving", "Cultural Fit"],
      concerns: ["Limited experience with Figma plugins"],
      recommendation: "Strong Hire"
    },
    {
      id: 2,
      candidateName: "Morgan Davis",
      role: "Full-Stack Engineer Intern",
      interviewDate: "Dec 11, 2024",
      interviewer: "Sarah Chen",
      duration: "60 min",
      status: "completed",
      rating: 7,
      matchScore: 87,
      notes: "Solid technical skills, but needs more confidence. Good potential for growth.",
      strengths: ["Technical Skills", "Problem Solving", "Quick Learner"],
      concerns: ["Communication", "Confidence in Answers"],
      recommendation: "Hire"
    },
    {
      id: 3,
      candidateName: "Nina Rodriguez",
      role: "ML Engineer Intern",
      interviewDate: "Dec 10, 2024",
      interviewer: "Mike Rodriguez",
      duration: "60 min",
      status: "completed",
      rating: 8,
      matchScore: 91,
      notes: "Strong ML fundamentals, impressive project work. Good team collaboration skills.",
      strengths: ["ML Knowledge", "Project Experience", "Team Collaboration"],
      concerns: ["Limited production ML experience"],
      recommendation: "Strong Hire"
    },
  ];

  const analytics = {
    averageRating: 7.3,
    completionRate: 67,
    topStrengths: [
      { tag: "Problem Solving", count: 15 },
      { tag: "Technical Skills", count: 12 },
      { tag: "Communication", count: 10 },
      { tag: "Cultural Fit", count: 8 },
      { tag: "Project Experience", count: 7 }
    ]
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Full-Stack Engineer Intern", path: "JobListingDashboard?id=fullstack-engineer" },
    { label: "Interviews" }
  ];

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || interview.role.includes(roleFilter);
    const matchesStatus = statusFilter === "all" || interview.status === activeTab; // Use activeTab for status filtering as per tab logic
    // Removed matchesRating logic as ratingFilter state was removed
    const matchesTab = activeTab === "all" || interview.status === activeTab;
    
    return matchesSearch && matchesRole && matchesStatus && matchesTab; // Removed matchesRating from condition
  });

  const handleViewInterview = (interview) => {
    const index = filteredInterviews.findIndex(i => i.id === interview.id);
    setSelectedInterviewIndex(index);
    setSelectedInterview(interview);
  };

  const handleNext = () => {
    if (selectedInterviewIndex !== null && selectedInterviewIndex < filteredInterviews.length - 1) {
      const nextIndex = selectedInterviewIndex + 1;
      setSelectedInterviewIndex(nextIndex);
      setSelectedInterview(filteredInterviews[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (selectedInterviewIndex !== null && selectedInterviewIndex > 0) {
      const prevIndex = selectedInterviewIndex - 1;
      setSelectedInterviewIndex(prevIndex);
      setSelectedInterview(filteredInterviews[prevIndex]);
    }
  };

  const aiContext = {
    roleTitle: "All Roles",
    stage: "Interviews",
    totals: {
      candidates: interviews.length,
      completed: interviews.filter(i => i.status === "completed").length,
      avgRating: interviews.filter(i => i.rating).length > 0 
        ? Math.round(interviews.reduce((sum, i) => sum + (i.rating || 0), 0) / interviews.filter(i => i.rating).length)
        : 0
    },
    candidates: interviews.filter(i => i.rating).map(i => ({
      id: String(i.id),
      name: i.candidateName,
      status: "interviewed",
      matchScore: i.matchScore,
      aiEvalScore: i.rating * 10,
      rationale: i.recommendation || "Completed interview"
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} /> {/* Replaced ArrowLeft button with Breadcrumbs */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
              Review Interviews
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Track and manage all candidate interviews {/* Updated description text */}
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by candidate name..."
                  className="h-12 pl-12 rounded-xl"
                />
              </div>
              {/* Removed Select component for rating filter */}
            </div>
          </motion.div>

          {/* Interviews Table */}
          <InterviewsTable 
            interviews={filteredInterviews}
            onViewInterview={handleViewInterview}
          />

          {/* Interview Modal */}
          {selectedInterview && (
            <InterviewModal
              interview={selectedInterview}
              onClose={() => {
                setSelectedInterview(null);
                setSelectedInterviewIndex(null);
              }}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={selectedInterviewIndex !== null && selectedInterviewIndex < filteredInterviews.length - 1}
              hasPrev={selectedInterviewIndex !== null && selectedInterviewIndex > 0}
            />
          )}
        </div>
      </div>

      {/* Bridge AI Components */}
      <BridgeAIButton
        hasUpdates={interviews.filter(i => i.status === "completed").length > 0}
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
          const interview = interviews.find(i => String(i.id) === id);
          if (interview) handleViewInterview(interview);
        }}
        onInvite={(id) => console.log("Invite:", id)}
        onSendReminder={(id) => console.log("Reminder:", id)}
        onFlag={(id) => console.log("Flag:", id)}
      />

      <Toaster />
    </div>
  );
}
