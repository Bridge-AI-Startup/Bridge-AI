import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Calendar, FileCheck, Phone, Award, X, Check, ChevronRight } from "lucide-react";
import Header from "../components/navigation/Header";
import { Button } from "@/components/ui/button";
import KanbanColumn from "../components/candidate-tracking/KanbanColumn";
import AssessmentModal from "../components/review-assessments/AssessmentModal";

// Breadcrumbs Component (defined here for simplicity, typically would be in its own file)
const Breadcrumbs = ({ items }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-[#6B7280] mx-1" />
            )}
            {item.path ? (
              <button
                onClick={() => navigate(`/${item.path}`)}
                className="inline-flex items-center text-sm font-medium text-[#6B7280] hover:text-[#0B1121] transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-sm font-medium text-[#0B1121] cursor-default">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};


export default function CandidateTrackingSolution1() {
  const navigate = useNavigate();
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedAssessmentForReview, setSelectedAssessmentForReview] = useState(null);
  const [expandedColumns, setExpandedColumns] = useState([]);

  const stages = [
    { id: "new", label: "New Matches", icon: Plus, color: "blue" },
    { id: "interview-scheduled", label: "Interview Scheduled", icon: Calendar, color: "purple" },
    { id: "assessment", label: "Assessment", icon: FileCheck, color: "yellow" },
    { id: "interviewed", label: "Interviewed", icon: Phone, color: "green" },
    { id: "offer", label: "Offer Extended", icon: Award, color: "pink" }
  ];

  const [candidates] = useState({
    "new": [
      { id: 1, name: "Maya Johnson", role: "Full-Stack Engineer Intern", match: "94%", date: "Dec 15" },
      { id: 2, name: "Carlos Rivera", role: "ML Engineer Intern", match: "91%", date: "Dec 15" },
      { id: 3, name: "Emily Chen", role: "Product Designer Intern", match: "89%", date: "Dec 14" },
      { id: 4, name: "James Wilson", role: "Full-Stack Engineer Intern", match: "92%", date: "Dec 14" },
      { id: 5, name: "Priya Patel", role: "ML Engineer Intern", match: "88%", date: "Dec 13" },
      { id: 6, name: "Marcus Lee", role: "Product Designer Intern", match: "90%", date: "Dec 13" },
      { id: 7, name: "Sofia Martinez", role: "Full-Stack Engineer Intern", match: "87%", date: "Dec 12" },
      { id: 8, name: "David Kim", role: "ML Engineer Intern", match: "93%", date: "Dec 12" }
    ],
    "interview-scheduled": [
      { id: 9, name: "Alex Park", role: "Full-Stack Engineer Intern", match: "92%", date: "Dec 18, 2pm" },
      { id: 10, name: "Jordan Lee", role: "ML Engineer Intern", match: "88%", date: "Dec 19, 10am" },
      { id: 11, name: "Rachel Green", role: "Product Designer Intern", match: "91%", date: "Dec 19, 3pm" },
      { id: 12, name: "Kevin Zhang", role: "Full-Stack Engineer Intern", match: "89%", date: "Dec 20, 11am" }
    ],
    "assessment": [
      { 
        id: 15, 
        name: "Lucas Brown", 
        role: "Product Designer Intern", 
        match: "88%", 
        date: "Dec 18",
        assessmentStatus: "completed",
        completedDate: "2024-12-18"
      },
      { 
        id: 13, 
        name: "Sam Patel", 
        role: "Full-Stack Engineer Intern", 
        match: "90%", 
        date: "Dec 20",
        assessmentStatus: "pending",
        dueDate: "2024-12-20"
      },
      { 
        id: 14, 
        name: "Aisha Khan", 
        role: "ML Engineer Intern", 
        match: "86%", 
        date: "Dec 21",
        assessmentStatus: "pending",
        dueDate: "2024-12-21"
      },
      { 
        id: 16, 
        name: "Nina Walsh", 
        role: "Full-Stack Engineer Intern", 
        match: "92%", 
        date: "Dec 17",
        assessmentStatus: "overdue",
        dueDate: "2024-12-17"
      }
    ],
    "interviewed": [
      { id: 17, name: "Taylor Kim", role: "Product Designer Intern", match: "93%", date: "Completed Dec 12" },
      { id: 18, name: "Morgan Davis", role: "Full-Stack Engineer Intern", match: "87%", date: "Completed Dec 11" },
      { id: 19, name: "Nina Rodriguez", role: "ML Engineer Intern", match: "91%", date: "Completed Dec 10" }
    ],
    "offer": [
      { id: 20, name: "Riley Brown", role: "ML Engineer Intern", match: "95%", date: "Sent Dec 10" },
      { id: 21, name: "Cameron White", role: "Full-Stack Engineer Intern", match: "94%", date: "Sent Dec 9" }
    ]
  });

  const stageColors = {
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    yellow: "bg-yellow-50 border-yellow-200",
    green: "bg-green-50 border-green-200",
    pink: "bg-pink-50 border-pink-200"
  };

  const toggleColumnExpand = (stageId) => {
    setExpandedColumns(prev => 
      prev.includes(stageId)
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  // Map candidate data to assessment format for the modal
  const getAssessmentForCandidate = (candidate) => {
    return {
      id: candidate.id,
      candidateName: candidate.name,
      role: candidate.role,
      submissionDate: candidate.date,
      aiScore: 86,
      aiSummary: "Strong React logic, good code structure",
      employerNotes: "",
      status: candidate.assessmentStatus,
      projectTitle: "Real-time Chat Application",
      projectDescription: "Build a real-time chat application with user authentication, message persistence, and typing indicators using React and WebSockets.",
      submittedCode: `import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket) {
      socket.emit('message', { text: input, user: '${candidate.name}' });
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg.user}: {msg.text}</div>
        ))}
      </div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
    </div>
  );
};`,
      aiAnalysis: {
        functionalCorrectness: 85,
        codeClarity: 90,
        problemSolving: 82,
        efficiency: 88,
        overallScore: 86,
        summary: "Strong understanding of React hooks and WebSocket implementation. Code is clean and well-structured. Minor improvements needed in error handling and edge cases."
      }
    };
  };

  const handleReviewAssessment = (candidate) => {
    const assessment = getAssessmentForCandidate(candidate);
    setSelectedAssessmentForReview(assessment);
  };

  const toggleSelectCandidate = (candidateId, stageId) => {
    setSelectedCandidates(prev => {
      // Get all candidate IDs from the current stage being interacted with
      const currentStageCandidates = candidates[stageId] || [];
      const currentStageCandidateIds = new Set(currentStageCandidates.map(c => c.id));
      
      // Check if any previously selected candidate is NOT from the current stage.
      // This indicates that selections currently span multiple stages.
      const selectionSpansMultipleStages = prev.some(id => !currentStageCandidateIds.has(id));
      
      if (selectionSpansMultipleStages) {
        // If selections are from other stages, clear them and start fresh with this candidate.
        // This ensures only candidates from the 'stageId' are selected.
        return [candidateId];
      } else {
        // If all current selections are within the current stage or `prev` is empty,
        // then perform the standard toggle (add/remove) for the clicked candidate.
        return prev.includes(candidateId)
          ? prev.filter(id => id !== candidateId)
          : [...prev, candidateId];
      }
    });
  };

  const toggleSelectAll = (stageId) => {
    const stageCandidates = candidates[stageId] || [];
    const stageCandidateIds = stageCandidates.map(c => c.id);
    
    // Check if ALL candidates in this specific stage are currently selected.
    // Ensure stage has candidates to prevent "select all" when no candidates exist.
    const allInThisStageSelected = stageCandidateIds.length > 0 && stageCandidateIds.every(id => selectedCandidates.includes(id));

    if (allInThisStageSelected) {
      // If all candidates in this specific stage are selected, deselect them all.
      // Since we restrict selection to a single stage, clearing 'selectedCandidates' effectively
      // deselects only from this stage.
      setSelectedCandidates([]);
    } else {
      // If not all are selected (or none are selected), select all from this stage.
      // This action implicitly clears any previous selections from other stages due to the single-stage restriction.
      setSelectedCandidates(stageCandidateIds);
    }
  };

  const clearSelection = () => {
    setSelectedCandidates([]);
  };

  // Determine which stages have selected candidates
  const getSelectedStages = () => {
    const stagesWithSelection = new Set();
    Object.entries(candidates).forEach(([stageId, stageCandidates]) => {
      if (stageCandidates.some(c => selectedCandidates.includes(c.id))) {
        stagesWithSelection.add(stageId);
      }
    });
    return Array.from(stagesWithSelection);
  };

  // Get relevant actions based on selected stages
  const getRelevantActions = () => {
    const selectedStages = getSelectedStages();
    const actions = new Set();

    selectedStages.forEach(stageId => {
      switch (stageId) {
        case "new":
          actions.add("project");
          actions.add("interview");
          actions.add("offer");
          actions.add("pass");
          break;
        case "interview-scheduled":
          actions.add("attend");
          actions.add("completed");
          actions.add("pass"); // Added pass action for interview scheduled
          break;
        case "assessment":
          actions.add("review");
          actions.add("interview");
          actions.add("offer");
          actions.add("pass");
          break;
        case "interviewed":
          actions.add("next-round");
          actions.add("project");
          actions.add("offer");
          actions.add("pass");
          break;
        case "offer":
          // No specific bulk actions for offer stage by default, but pass could be an option
          actions.add("pass");
          break;
        default:
          // For any other unexpected stage, ensure 'pass' is always an option
          actions.add("pass");
          break;
      }
    });

    return Array.from(actions);
  };

  const relevantActions = getRelevantActions();

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Candidate Pipeline" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-semibold text-[#0B1121]">
                Candidate Pipeline
              </h1>
              <div className="px-4 py-2 bg-gray-100 rounded-xl">
                <span className="text-sm font-semibold text-[#6B7280]">Solution 1: Kanban Board</span>
              </div>
            </div>
            <p className="text-lg text-[#6B7280] font-normal">
              Visual pipeline view - drag and drop candidates between stages
            </p>
          </motion.div>

          {selectedCandidates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E3A8A] rounded-2xl p-4 mb-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">
                  {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''} selected
                </span>
                <Button
                  onClick={clearSelection}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-white hover:bg-white/20"
                >
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {relevantActions.includes("project") && (
                  <Button
                    onClick={() => navigate('/AssignProject')}
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-white/20 text-white hover:bg-white/30"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    Assign Project
                  </Button>
                )}
                {relevantActions.includes("interview") && (
                  <Button
                    onClick={() => navigate('/ScheduleInterview')}
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-white/20 text-white hover:bg-white/30"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                )}
                {relevantActions.includes("next-round") && (
                  <Button
                    onClick={() => navigate('/ScheduleInterview')}
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-white/20 text-white hover:bg-white/30"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Next Round
                  </Button>
                )}
                {relevantActions.includes("attend") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-white/20 text-white hover:bg-white/30"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Attend Interview
                  </Button>
                )}
                {relevantActions.includes("completed") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-white/20 text-white hover:bg-white/30"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Completed
                  </Button>
                )}
                {relevantActions.includes("review") && (
                  <Button
                    onClick={() => navigate('/ReviewAssessments')} // This is for bulk review, individual handled by card
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-white/20 text-white hover:bg-white/30"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    Review Assessment
                  </Button>
                )}
                {relevantActions.includes("offer") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-white/20 text-white hover:bg-white/30"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Extend Offer
                  </Button>
                )}
                {relevantActions.includes("pass") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-white/20 text-white hover:bg-red-500/90"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Pass
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map((stage, idx) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                candidates={candidates[stage.id] || []}
                stageColors={stageColors}
                selectedCandidates={selectedCandidates}
                onToggleSelect={toggleSelectCandidate}
                onToggleSelectAll={toggleSelectAll}
                delay={idx * 0.1}
                stageId={stage.id}
                onReviewAssessment={handleReviewAssessment}
                onReviewAll={() => {
                  switch(stage.id) {
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
                      alert("Review All Offers page - Coming soon!");
                      break;
                    default:
                      break;
                  }
                }}
                isExpanded={expandedColumns.includes(stage.id)}
                onToggleExpand={() => toggleColumnExpand(stage.id)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white rounded-2xl p-8 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-[#0B1121] mb-4">Solution Analysis</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✓ Strengths</h4>
                <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                  <li>• Highly visual and intuitive</li>
                  <li>• Clear stage progression</li>
                  <li>• Easy to see bottlenecks</li>
                  <li>• Quick drag-and-drop updates</li>
                  <li>• Works great for 20-50 candidates</li>
                  <li>• Multi-select for bulk actions</li>
                  <li>• Select all candidates in a column</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">✗ Weaknesses</h4>
                <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                  <li>• Requires horizontal scrolling</li>
                  <li>• Less effective with 100+ candidates</li>
                  <li>• Limited filtering/sorting options</li>
                  <li>• Mobile experience challenging</li>
                  <li>• Can feel cluttered at scale</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E3A8A] mb-2">→ Best For</h4>
                <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                  <li>• Startups with moderate volume</li>
                  <li>• Teams that love visual tools</li>
                  <li>• Quick status updates</li>
                  <li>• Collaborative hiring teams</li>
                  <li>• Clear linear processes</li>
                </ul>
              </div>
            </div>
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
    </div>
  );
}