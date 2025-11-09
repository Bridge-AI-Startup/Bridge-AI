
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, BarChart3 } from "lucide-react";
import Header from "../components/navigation/Header";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AssessmentsTabs from "../components/review-assessments/AssessmentsTabs";
import AssessmentsTable from "../components/review-assessments/AssessmentsTable";
import AssessmentModal from "../components/review-assessments/AssessmentModal";
import AnalyticsSummary from "../components/review-assessments/AnalyticsSummary";
import BridgeAIButton from "../components/bridge-ai/BridgeAIButton";
import BridgeAIPanel from "../components/bridge-ai/BridgeAIPanel";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Added import for Breadcrumbs
import { Toaster } from "@/components/ui/toaster";

export default function ReviewAssessments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedAssessmentIndex, setSelectedAssessmentIndex] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const assessments = [
    {
      id: 1,
      candidateName: "Maya Johnson",
      role: "Full-Stack Engineer Intern",
      submissionDate: "Dec 18, 2024",
      aiScore: 86,
      aiSummary: "Strong React logic, good code structure",
      employerNotes: "",
      status: "pending",
      projectTitle: "Real-time Chat Application",
      projectDescription: "Build a real-time chat application with user authentication, message persistence, and typing indicators using React and WebSockets.",
      submittedCode: `import React, { useState, useEffect } => 'react';
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
      socket.emit('message', { text: input, user: 'Maya' });
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
    },
    {
      id: 2,
      candidateName: "Sam Patel",
      role: "Full-Stack Engineer Intern",
      submissionDate: "Dec 19, 2024",
      aiScore: 92,
      aiSummary: "Excellent code quality, robust error handling",
      employerNotes: "Impressive implementation",
      status: "completed",
      projectTitle: "Real-time Chat Application",
      projectDescription: "Build a real-time chat application with user authentication, message persistence, and typing indicators using React and WebSockets.",
      submittedCode: `// Excellent implementation with error handling...`,
      aiAnalysis: {
        functionalCorrectness: 95,
        codeClarity: 92,
        problemSolving: 90,
        efficiency: 91,
        overallScore: 92,
        summary: "Outstanding implementation with comprehensive error handling, clean architecture, and excellent performance optimization."
      }
    },
    {
      id: 3,
      candidateName: "Aisha Khan",
      role: "ML Engineer Intern",
      submissionDate: "Dec 17, 2024",
      aiScore: 78,
      aiSummary: "Good algorithm understanding, needs optimization",
      employerNotes: "",
      status: "pending",
      projectTitle: "Image Classification Model",
      projectDescription: "Build an image classification model using TensorFlow that can categorize images into 10 different classes with at least 85% accuracy.",
      submittedCode: `import tensorflow as tf
from tensorflow import keras

# Model implementation...`,
      aiAnalysis: {
        functionalCorrectness: 80,
        codeClarity: 75,
        problemSolving: 78,
        efficiency: 79,
        overallScore: 78,
        summary: "Solid understanding of machine learning concepts. Model architecture is appropriate but could benefit from optimization and better preprocessing."
      }
    },
    {
      id: 4,
      candidateName: "Lucas Brown",
      role: "Product Designer Intern",
      submissionDate: "Dec 16, 2024",
      aiScore: 55,
      aiSummary: "Basic implementation, missing key features",
      employerNotes: "",
      status: "flagged",
      projectTitle: "Design System Component Library",
      projectDescription: "Create a reusable component library with at least 10 common UI components following modern design principles.",
      submittedCode: `// Basic components implementation...`,
      aiAnalysis: {
        functionalCorrectness: 60,
        codeClarity: 55,
        problemSolving: 50,
        efficiency: 55,
        overallScore: 55,
        summary: "Implementation lacks depth and misses several key requirements. Components are basic and don't follow best practices for reusability."
      }
    }
  ];

  const analytics = {
    averageScore: 78,
    inviteRate: 45,
    commonWeaknesses: [
      { tag: "Error Handling", count: 12 },
      { tag: "Time Complexity", count: 8 },
      { tag: "Code Documentation", count: 7 },
      { tag: "Edge Cases", count: 6 },
      { tag: "Testing", count: 5 }
    ]
  };

  // Filter assessments based on search and score filter
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.candidateName.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesScore = true;
    if (scoreFilter === "high") {
      matchesScore = assessment.aiScore >= 80;
    } else if (scoreFilter === "medium") {
      matchesScore = assessment.aiScore >= 60 && assessment.aiScore < 80;
    } else if (scoreFilter === "low") {
      matchesScore = assessment.aiScore < 60;
    }
    
    return matchesSearch && matchesScore;
  });

  const handleViewAssessment = (assessment) => {
    const index = filteredAssessments.findIndex(a => a.id === assessment.id);
    setSelectedAssessmentIndex(index);
    setSelectedAssessment(assessment);
  };

  const handleNext = () => {
    if (selectedAssessmentIndex !== null && selectedAssessmentIndex < filteredAssessments.length - 1) {
      const nextIndex = selectedAssessmentIndex + 1;
      setSelectedAssessmentIndex(nextIndex);
      setSelectedAssessment(filteredAssessments[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (selectedAssessmentIndex !== null && selectedAssessmentIndex > 0) {
      const prevIndex = selectedAssessmentIndex - 1;
      setSelectedAssessmentIndex(prevIndex);
      setSelectedAssessment(filteredAssessments[prevIndex]);
    }
  };

  const aiContext = {
    roleTitle: "All Roles",
    stage: "Assessments",
    totals: {
      candidates: assessments.length,
      completed: assessments.filter(a => a.status === "completed").length,
      avgScore: assessments.length > 0 ? Math.round(assessments.reduce((sum, a) => sum + (a.aiScore || 0), 0) / assessments.length) : 0
    },
    candidates: assessments.map(a => ({
      id: String(a.id),
      name: a.candidateName,
      status: a.status === "completed" ? "submitted" : "in_progress", // Assuming pending/flagged are 'in_progress' for AI panel
      matchScore: 90, // Placeholder as there's no real 'matchScore' in assessments data
      aiEvalScore: a.aiScore,
      rationale: a.aiSummary,
      submittedAt: a.submissionDate
    }))
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" }, // Adjusted path
    { label: "Full-Stack Engineer Intern", path: "JobListingDashboard?id=fullstack-engineer" }, // Adjusted path
    { label: "Assessments" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Removed the old "Back to Pipeline" button */}
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
              Review Assessments
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              AI-powered evaluation to help you identify top talent faster
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

              <div className="flex gap-4">
                <Select value={scoreFilter} onValueChange={setScoreFilter}>
                  <SelectTrigger className="w-48 h-12 rounded-xl">
                    <SelectValue placeholder="AI Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scores</SelectItem>
                    <SelectItem value="high">High (80-100)</SelectItem>
                    <SelectItem value="medium">Medium (60-79)</SelectItem>
                    <SelectItem value="low">Low (0-59)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Assessments Table */}
          <AssessmentsTable 
            assessments={filteredAssessments}
            onViewAssessment={handleViewAssessment}
          />

          {/* Assessment Modal */}
          {selectedAssessment && (
            <AssessmentModal
              assessment={selectedAssessment}
              onClose={() => {
                setSelectedAssessment(null);
                setSelectedAssessmentIndex(null);
              }}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={selectedAssessmentIndex !== null && selectedAssessmentIndex < filteredAssessments.length - 1}
              hasPrev={selectedAssessmentIndex !== null && selectedAssessmentIndex > 0}
            />
          )}
        </div>
      </div>

      {/* Bridge AI Components */}
      <BridgeAIButton
        hasUpdates={assessments.filter(a => a.status === "completed").length > 0}
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
          const assessment = assessments.find(a => String(a.id) === id);
          if (assessment) handleViewAssessment(assessment);
        }}
        onInvite={(id) => console.log("Invite:", id)}
        onSendReminder={(id) => console.log("Reminder:", id)}
        onFlag={(id) => console.log("Flag:", id)}
      />
    </div>
  );
}
