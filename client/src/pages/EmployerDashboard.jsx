
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Calendar, Plus, ArrowRight, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "../components/navigation/Header";
import BridgeAIButton from "../components/bridge-ai/BridgeAIButton";
import BridgeAIPanel from "../components/bridge-ai/BridgeAIPanel";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set next match date (e.g., next Monday at 9 AM)
    const getNextMatchDate = () => {
      const now = new Date();
      const nextMatch = new Date();
      // Calculate days until next Monday (0=Sunday, 1=Monday, ..., 6=Saturday)
      // If today is Monday, getNextMatchDate().getDay() will be 1. (1 + 7 - 1) % 7 = 0. So it will be the next Monday.
      // If today is Sunday, getNextMatchDate().getDay() will be 0. (1 + 7 - 0) % 7 = 1. So it will be the next Monday.
      // If today is Saturday, getNextMatchDate().getDay() will be 6. (1 + 7 - 6) % 7 = 2. So it will be 2 days later, which is Monday.
      // The || 7 part handles the case where today is Monday, so daysUntilMonday would be 0, meaning 'today'.
      // We want *next* Monday if today is Monday, so we set it to 7 days if the calculation results in 0.
      const daysUntilMonday = (1 + 7 - now.getDay()) % 7 || 7; 
      
      nextMatch.setDate(now.getDate() + daysUntilMonday);
      nextMatch.setHours(9, 0, 0, 0); // Set to 9 AM
      return nextMatch;
    };

    const calculateTimeLeft = () => {
      const difference = getNextMatchDate().getTime() - new Date().getTime(); // Ensure getTime() for comparison
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // If the countdown has passed, set all to 0 or recalculate for the *next* next Monday
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        // Optionally, if the difference is negative, you might want to force a recalculation
        // for the *next* next Monday to keep the countdown active.
        // For simplicity, we'll just let it show 0s after it passes.
      }
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer); // Cleanup
  }, []);

  const jobListings = [
    {
      id: "fullstack-engineer",
      title: "Full-Stack Engineer Intern",
      department: "Engineering",
      newMatches: 3,
      totalCandidates: 12,
      interviews: 1,
      assessmentsReady: 2
    },
    {
      id: "ml-engineer",
      title: "Machine Learning Engineer Intern",
      department: "Data Science",
      newMatches: 2,
      totalCandidates: 8,
      interviews: 0,
      assessmentsReady: 1
    },
    {
      id: "product-designer",
      title: "Product Designer Intern",
      department: "Design",
      newMatches: 1,
      totalCandidates: 5,
      interviews: 3,
      assessmentsReady: 3
    }
  ];

  const totalStats = {
    assessmentsToReview: jobListings.reduce((sum, job) => sum + job.assessmentsReady, 0), // Total assessments pending review across all listings
    assessmentsInProgress: jobListings.reduce((sum, job) => sum + job.newMatches, 0),
    interviewsScheduled: jobListings.reduce((sum, job) => sum + job.interviews, 0)
  };

  const aiContext = {
    roleTitle: "All Listings",
    stage: "Overview",
    totals: {
      candidates: jobListings.reduce((sum, job) => sum + job.totalCandidates, 0),
      activeAssessments: totalStats.assessmentsInProgress,
      pendingReview: totalStats.assessmentsToReview,
      interviews: totalStats.interviewsScheduled
    },
    candidates: []
  };

  const handlePromptRun = (prompt) => {
    console.log("Prompt run:", prompt);
  };

  const handleFreeformPrompt = (text) => {
    console.log("Freeform prompt:", text);
  };

  const handleViewCandidate = (candidateId) => {
    console.log("View candidate:", candidateId);
  };

  const handleInvite = (candidateId) => {
    console.log("Invite candidate:", candidateId);
  };

  const handleSendReminder = (candidateId) => {
    console.log("Send reminder:", candidateId);
  };

  const handleFlag = (candidateId) => {
    console.log("Flag candidate:", candidateId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
                Welcome back, Employer
              </h1>
              <p className="text-lg text-[#6B7280] font-normal">
                You have {totalStats.assessmentsToReview} assessments to review this week
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/InterviewCalendar")}
                variant="outline"
                className="h-12 px-6 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </Button>
              <Button
                onClick={() => navigate("/EmployerProfile")}
                variant="outline"
                className="h-12 px-6 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                View Profile
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#0B1121]" />
            </div>
            <p className="text-[#6B7280] text-sm mb-1 font-normal">Assessments In Progress</p>
            <p className="text-4xl font-semibold text-[#0B1121]">{totalStats.assessmentsInProgress}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#0B1121]" />
            </div>
            <p className="text-[#6B7280] text-sm mb-1 font-normal">Assessments to Review</p>
            <p className="text-4xl font-semibold text-[#0B1121]">{totalStats.assessmentsToReview}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[#0B1121]" />
            </div>
            <p className="text-[#6B7280] text-sm mb-1 font-normal">Interviews Scheduled</p>
            <p className="text-4xl font-semibold text-[#0B1121]">{totalStats.interviewsScheduled}</p>
          </motion.div>

          {/* Next Match Countdown as stat card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-[#0B1121]" />
            </div>
            <p className="text-[#6B7280] text-sm mb-1 font-normal">Next Matches</p>
            <p className="text-4xl font-semibold text-[#0B1121]">
              {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h
            </p>
          </motion.div>
        </div>


        {/* Job Listings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#0B1121]">
              Job Listings
            </h2>
            <Button
              onClick={() => navigate("/CreateListing")}
              variant="outline"
              className="flex items-center gap-2 h-11 px-5 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] hover:bg-white transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Listing
            </Button>
          </div>

          <div className="space-y-4">
            {jobListings.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                onClick={() => navigate(`/JobListingDashboard?id=${job.id}`)}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#1E3A8A] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-[#0B1121] group-hover:text-[#1E3A8A] transition-colors">
                        {job.title}
                      </h3>
                      {job.newMatches > 0 && (
                        <span className="px-3 py-1 bg-blue-50 text-[#1E3A8A] text-sm font-semibold rounded-full border border-blue-200">
                          {job.newMatches} New
                        </span>
                      )}
                      {job.assessmentsReady > 0 && (
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-semibold rounded-full border border-yellow-200">
                          {job.assessmentsReady} Ready to Review
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[#6B7280] font-normal mb-4">
                      {job.department}
                    </p>

                    <div className="flex items-center gap-6 text-[#6B7280]">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-normal">
                          {job.totalCandidates} candidates
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-normal">
                          {job.interviews} interviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#1E3A8A] transition-colors flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bridge AI Components */}
      <BridgeAIButton
        hasUpdates={totalStats.assessmentsToReview > 0}
        onOpen={() => setIsPanelOpen(true)}
        isOpen={isPanelOpen}
      />

      <BridgeAIPanel
        isOpen={isPanelOpen}
        context={aiContext}
        onClose={() => setIsPanelOpen(false)}
        onPromptRun={handlePromptRun}
        onFreeformPrompt={handleFreeformPrompt}
        onViewCandidate={handleViewCandidate}
        onInvite={handleInvite}
        onSendReminder={handleSendReminder}
        onFlag={handleFlag}
      />
    </div>
  );
}
