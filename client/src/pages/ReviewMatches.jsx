
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Clock } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Added import for Breadcrumbs
import { Input } from "@/components/ui/input";
import { AnimatePresence } from "framer-motion";

import InsightsSidebar from "../components/review-matches/InsightsSidebar";
import BridgeAIButton from "../components/bridge-ai/BridgeAIButton";
import BridgeAIPanel from "../components/bridge-ai/BridgeAIPanel";

export default function ReviewMatches() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  // Renamed selectedMatch to selectedCandidate and added new states
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]); // New state
  const [filters, setFilters] = useState({ // New state
    search: "",
    role: "all",
    matchScore: "all",
    skills: []
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false); // New state

  const candidates = [
    {
      id: 1,
      name: "Maya Johnson",
      university: "Stanford University",
      gradYear: "2025",
      role: "Full-Stack Engineer Intern",
      matchScore: 94,
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      hasGithub: true,
      hasPortfolio: true,
      matchReason: "React + Node overlap; 10-12 week availability; strong GitHub activity",
      availability: "10-12 weeks, June-Aug 2025",
      location: "San Francisco, CA",
      timezone: "PST",
      visa: "US Citizen",
      projects: [
        { title: "Real-time Collaboration Tool", description: "Built with React, Socket.io, and MongoDB", link: "https://github.com/maya/collab" },
        { title: "E-commerce Platform", description: "Full-stack MERN application with Stripe integration", link: "https://github.com/maya/ecommerce" },
        { title: "Task Management API", description: "RESTful API with Node.js and PostgreSQL", link: "https://github.com/maya/tasks" }
      ],
      assessmentStarted: false,
      hoursLeft: null
    },
    {
      id: 2,
      name: "Carlos Rivera",
      university: "MIT",
      gradYear: "2025",
      role: "ML Engineer Intern",
      matchScore: 91,
      skills: ["Python", "TensorFlow", "PyTorch", "ML"],
      hasGithub: true,
      hasPortfolio: false,
      matchReason: "ML background with research publications; 12+ week availability",
      availability: "12+ weeks, May-Sep 2025",
      location: "Boston, MA",
      timezone: "EST",
      visa: "F-1 Visa",
      projects: [
        { title: "Image Classification Model", description: "CNN model with 94% accuracy on CIFAR-10", link: "https://github.com/carlos/image-classifier" },
        { title: "Sentiment Analysis Tool", description: "NLP model using BERT and transformers", link: "https://github.com/carlos/sentiment" }
      ],
      assessmentStarted: true,
      hoursLeft: 48
    },
    {
      id: 3,
      name: "Emily Chen",
      university: "UC Berkeley",
      gradYear: "2026",
      role: "Product Designer Intern",
      matchScore: 89,
      skills: ["Figma", "User Research", "Design Systems", "Prototyping"],
      hasGithub: false,
      hasPortfolio: true,
      matchReason: "Strong UX portfolio; design thinking + user research experience",
      availability: "10 weeks, June-Aug 2025",
      location: "Berkeley, CA",
      timezone: "PST",
      visa: "US Citizen",
      projects: [
        { title: "Mobile Banking App Redesign", description: "Complete UX overhaul with user testing", link: "https://emilych.design/banking" },
        { title: "Design System Library", description: "Comprehensive component library in Figma", link: "https://emilych.design/system" }
      ],
      assessmentStarted: true,
      hoursLeft: -12
    },
    {
      id: 5,
      name: "Priya Patel",
      university: "Carnegie Mellon",
      gradYear: "2025",
      role: "ML Engineer Intern",
      matchScore: 92,
      skills: ["Python", "Data Science", "ML", "Statistics"],
      hasGithub: true,
      hasPortfolio: false,
      matchReason: "Data science background with industry project experience",
      availability: "10-12 weeks, June-Aug 2025",
      location: "Pittsburgh, PA",
      timezone: "EST",
      visa: "F-1 Visa",
      projects: [
        { title: "Predictive Analytics Model", description: "Time series forecasting with LSTM", link: "https://github.com/priya/forecast" },
        { title: "Customer Churn Analysis", description: "ML classification model with 88% accuracy", link: "https://github.com/priya/churn" }
      ],
      assessmentStarted: true,
      hoursLeft: 72
    },
    {
      id: 6,
      name: "Marcus Lee",
      university: "Cornell University",
      gradYear: "2026",
      role: "Product Designer Intern",
      matchScore: 85,
      skills: ["Figma", "Design", "Prototyping", "UI/UX"],
      hasGithub: false,
      hasPortfolio: true,
      matchReason: "Product thinking + design system experience from previous internship",
      availability: "8 weeks, July-Aug 2025",
      location: "Ithaca, NY",
      timezone: "EST",
      visa: "US Citizen",
      projects: [
        { title: "E-commerce Redesign", description: "Complete UI/UX overhaul", link: "https://marcusl.design/ecommerce" }
      ],
      assessmentStarted: false,
      hoursLeft: null
    },
    {
      id: 7,
      name: "Alex Turner",
      university: "UCLA",
      gradYear: "2025",
      role: "Full-Stack Engineer Intern",
      matchScore: 88,
      skills: ["React", "Node.js", "MongoDB", "Docker"],
      hasGithub: true,
      hasPortfolio: true,
      matchReason: "Strong full-stack skills with containerization experience",
      availability: "10 weeks, June-Aug 2025",
      location: "Los Angeles, CA",
      timezone: "PST",
      visa: "US Citizen",
      projects: [
        { title: "Social Media Dashboard", description: "Real-time analytics platform with React and Node.js", link: "https://github.com/alex/dashboard" }
      ],
      assessmentStarted: true,
      hoursLeft: 8
    }
  ];

  const insights = {
    totalMatches: candidates.length,
    avgMatchScore: Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length),
    topSkills: ["React", "Python", "Figma"]
  };

  const getProjectStatus = (candidate) => {
    if (!candidate.assessmentStarted) {
      return "not-started";
    }
    if (candidate.hoursLeft < 0) {
      return "overdue";
    }
    return "started";
  };

  const tabs = [
    { id: "all", label: "All Matches", count: candidates.length },
    { id: "not-started", label: "Not Started", count: candidates.filter(c => getProjectStatus(c) === "not-started").length },
    { id: "started", label: "Started", count: candidates.filter(c => getProjectStatus(c) === "started").length },
    { id: "overdue", label: "Overdue", count: candidates.filter(c => getProjectStatus(c) === "overdue").length }
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const status = getProjectStatus(candidate);
    if (activeTab !== "all" && status !== activeTab) return false;
    if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !candidate.university.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const getStatusPriority = (candidate) => {
      const status = getProjectStatus(candidate);
      if (status === "started") return 1;
      if (status === "not-started") return 2;
      if (status === "overdue") return 3;
      return 4; // Default for any other unexpected status
    };

    return getStatusPriority(a) - getStatusPriority(b);
  });

  const getProjectStatusDisplay = (candidate) => {
    if (!candidate.assessmentStarted) {
      return {
        text: "Haven't started yet",
        color: "text-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200"
      };
    }

    if (candidate.hoursLeft < 0) {
      const absHours = Math.abs(candidate.hoursLeft);
      return {
        text: `${absHours}h overdue`,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200"
      };
    }

    return {
      text: `${candidate.hoursLeft}h left`,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    };
  };

  const handleScheduleInterview = (e, candidate) => {
    e.stopPropagation();
    navigate(`/ScheduleInterview?candidate=${candidate.name}&job=fullstack-engineer`);
  };

  const handleMakeOffer = (e, candidate) => {
    e.stopPropagation();
    alert(`Making offer to ${candidate.name}`);
  };

  const handlePass = (e, candidate) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to pass on ${candidate.name}?`)) {
      alert(`Passed on ${candidate.name}`);
    }
  };

  // New functions for BridgeAIPanel interaction
  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleBulkAction = (actionType, candidateIds) => {
    console.log(`Performing bulk action: ${actionType} on candidates: ${candidateIds.join(', ')}`);
    // Implement actual bulk action logic here, e.g., update selectedCandidates state or make API calls
    alert(`Bulk action: ${actionType} for candidate IDs: ${candidateIds.join(', ')}`);
  };

  const aiContext = {
    roleTitle: "New Matches",
    stage: "Matches",
    totals: {
      candidates: candidates.length,
      avgMatch: Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length),
      topSkill: insights.topSkills[0] // Use actual top skill from insights
    },
    candidates: candidates.map(c => ({
      id: String(c.id), // Ensure ID is a string as expected by BridgeAIPanel
      name: c.name,
      status: getProjectStatus(c) === "not-started" ? "matched" : "in-progress", // Map project status to general recruitment status
      matchScore: c.matchScore,
      rationale: `${c.skills.slice(0, 3).join(", ")} • ${c.role}` // Using c.role for experience context
    }))
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Full-Stack Engineer Intern", path: "JobListingDashboard?id=fullstack-engineer" },
    { label: "Assessments In Progress" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* This button is replaced by breadcrumbs and removed as per instructions */}
          {/*
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/JobListingDashboard?id=fullstack-engineer")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#0B1121] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-normal">Back to Pipeline</span>
          </motion.button>
          */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
              Assessments In Progress
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Candidates matched by skills and projects, then assigned role-specific projects.
            </p>
          </motion.div>

          <div className="mb-6">
            <InsightsSidebar insights={insights} candidates={candidates} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate name or university..."
                className="h-12 pl-12 rounded-xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-2 border border-gray-200 mb-6 flex gap-2 overflow-x-auto"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-[#6B7280] hover:bg-gray-100'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-[#6B7280]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Candidate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Match Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Project Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Why This Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCandidates.map((candidate, idx) => {
                    const statusDisplay = getProjectStatusDisplay(candidate);
                    return (
                      <motion.tr
                        key={candidate.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                        onClick={() => navigate(`/ApplicantProfile?candidate=${candidate.id}&job=fullstack-engineer&from=review-matches`)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-semibold">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-[#0B1121]">{candidate.name}</p>
                              <p className="text-sm text-[#6B7280] font-normal">{candidate.university} • {candidate.gradYear}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="px-3 py-1.5 bg-[#1E3A8A] text-white rounded-full text-sm font-semibold inline-block">
                            {candidate.matchScore}%
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusDisplay.bg} ${statusDisplay.border}`}>
                            <Clock className={`w-4 h-4 ${statusDisplay.color}`} />
                            <span className={`text-sm font-semibold ${statusDisplay.color}`}>
                              {statusDisplay.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#6B7280] font-normal max-w-md">{candidate.matchReason}</p>
                        </td>                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {selectedCandidate && (
        <MatchModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

      {/* Bridge AI Components */}
      <BridgeAIButton
        hasUpdates={candidates.length > 0} // Assuming any candidates mean updates
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
          const candidate = candidates.find(c => String(c.id) === id); // Find candidate by string ID
          if (candidate) handleViewCandidate(candidate);
        }}
        onInvite={(id) => handleBulkAction("invite", [parseInt(id)])} // Assuming invite is a bulk action on one ID
        onSendReminder={(id) => console.log("Reminder:", id)}
        onFlag={(id) => console.log("Flag:", id)}
      />
    </div>
  );
}

// Match Modal Component
function MatchModal({ candidate, onClose }) {
  const navigate = useNavigate();
  const [notes, setNotes] = React.useState("");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#0B1121]">{candidate.name}</h2>
            <p className="text-[#6B7280] font-normal">{candidate.university} • {candidate.gradYear}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-semibold text-[#0B1121] mb-2">Why This Match</h3>
                <p className="text-sm text-[#6B7280] font-normal">{candidate.matchReason}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-[#0B1121] rounded-lg text-sm font-normal"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3">Projects</h3>
                <div className="space-y-3">
                  {candidate.projects.map((project, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-semibold text-[#1E3A8A] mb-1">{project.title}</h4>
                      <p className="text-sm text-[#6B7280] font-normal mb-2">{project.description}</p>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1E3A8A] hover:underline"
                      >
                        View Project →
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3">Your Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your evaluation notes here..."
                  className="w-full min-h-[120px] rounded-xl bg-white border border-gray-200 p-3 text-sm"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-xl p-6 text-center">
                <p className="text-white/80 text-sm font-medium mb-2">Match Score</p>
                <p className="text-6xl font-bold text-white mb-2">
                  {candidate.matchScore}%
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
                <div>
                  <p className="text-xs text-[#6B7280] font-normal mb-1">Role</p>
                  <p className="text-sm font-semibold text-[#0B1121]">{candidate.role}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] font-normal mb-1">Availability</p>
                  <p className="text-sm font-semibold text-[#0B1121]">{candidate.availability}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] font-normal mb-1">Location</p>
                  <p className="text-sm font-semibold text-[#0B1121]">{candidate.location}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] font-normal mb-1">Timezone</p>
                  <p className="text-sm font-semibold text-[#0B1121]">{candidate.timezone}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] font-normal mb-1">Visa Status</p>
                  <p className="text-sm font-semibold text-[#0B1121]">{candidate.visa}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3">Links</h3>
                <div className="space-y-2">
                  {candidate.hasGithub && (
                    <a href="#" className="block text-sm text-[#1E3A8A] hover:underline">
                      GitHub Profile →
                    </a>
                  )}
                  {candidate.hasPortfolio && (
                    <a href="#" className="block text-sm text-[#1E3A8A] hover:underline">
                      Portfolio Website →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-200 text-[#6B7280] rounded-xl font-medium hover:border-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => navigate(`/AssignProject?candidate=${candidate.id}`)}
            className="px-6 py-3 border-2 border-gray-200 text-[#0B1121] rounded-xl font-medium hover:border-[#1E3A8A] transition-colors"
          >
            Assign Project
          </button>
          <button
            onClick={() => navigate(`/ScheduleInterview?candidate=${candidate.name}`)}
            className="px-6 py-3 bg-[#1E3A8A] text-white rounded-xl font-medium hover:bg-[#1E3A8A]/90 transition-colors"
          >
            Schedule Interview
          </button>
        </div>
      </motion.div>
    </div>
  );
}
