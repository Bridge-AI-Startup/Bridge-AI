
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Header from "../components/navigation/Header";
import BridgeAIButton from "../components/bridge-ai/BridgeAIButton";
import BridgeAIPanel from "../components/bridge-ai/BridgeAIPanel";

export default function BridgeAIDemo() {
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Mock context data
  const mockContext = {
    roleTitle: "Full-Stack Engineer Intern",
    stage: "Assessments",
    totals: {
      candidates: 8,
      activeAssessments: 5,
      overdue: 2,
      avgScore: 86
    },
    candidates: [
      {
        id: "1",
        name: "Maya Johnson",
        status: "submitted",
        matchScore: 94,
        aiEvalScore: 92,
        rationale: "Excellent React + Node.js skills, strong system design thinking",
        submittedAt: "2024-12-18"
      },
      {
        id: "2",
        name: "Carlos Rivera",
        status: "submitted",
        matchScore: 91,
        aiEvalScore: 88,
        rationale: "Strong Python + ML background, good code quality",
        submittedAt: "2024-12-17"
      },
      {
        id: "3",
        name: "Emily Chen",
        status: "submitted",
        matchScore: 89,
        aiEvalScore: 85,
        rationale: "Solid full-stack skills, excellent documentation",
        submittedAt: "2024-12-16"
      },
      {
        id: "4",
        name: "Alex Park",
        status: "in_progress",
        matchScore: 92,
        rationale: "Strong React skills with startup experience"
      },
      {
        id: "5",
        name: "Jordan Lee",
        status: "in_progress",
        matchScore: 88,
        rationale: "Good backend experience, learning React"
      }
    ]
  };

  const handleViewCandidate = (candidateId) => {
    console.log("View candidate:", candidateId);
  };

  const handleInvite = (candidateId) => {
    console.log("Invite candidate:", candidateId);
  };

  const handleSendReminder = (candidateId) => {
    console.log("Send reminder to:", candidateId);
  };

  const handleFlag = (candidateId) => {
    console.log("Flag candidate:", candidateId);
  };

  const handlePromptRun = (prompt) => {
    console.log("Prompt run:", prompt);
  };

  const handleFreeformPrompt = (text) => {
    console.log("Freeform prompt:", text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/EmployerDashboard")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#0B1121] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-normal">Back to Dashboard</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-[#1E3A8A]" />
              <h1 className="text-4xl font-semibold text-[#0B1121]">
                Bridge AI Demo
              </h1>
            </div>
            <p className="text-lg text-[#6B7280] font-normal">
              Global AI assistant for talent intelligence — Notion-style, clean & structured
            </p>
          </motion.div>

          {/* Demo Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-[#0B1121] mb-4">Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#0B1121] mb-2">✨ Design Philosophy</h3>
                  <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                    <li>• No chat bubbles — structured insight cards</li>
                    <li>• Clean, minimal design (Notion-inspired)</li>
                    <li>• Right-side panel that pushes content</li>
                    <li>• Context-aware suggested prompts</li>
                    <li>• Persistent state across navigation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1121] mb-2">🎯 Insight Cards</h3>
                  <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                    <li>• Ranked lists with actions</li>
                    <li>• Side-by-side comparisons</li>
                    <li>• Weekly summaries with metrics</li>
                    <li>• Alert cards for urgent items</li>
                    <li>• All cards support quick actions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1121] mb-2">⌨️ Keyboard Shortcuts</h3>
                  <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                    <li>• <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">Cmd/Ctrl + I</kbd> to open</li>
                    <li>• <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">ESC</kbd> to close</li>
                    <li>• <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to submit prompt</li>
                    <li>• Tab navigation through cards</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1121] mb-2">🔄 Context Awareness</h3>
                  <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                    <li>• Adapts to current job role</li>
                    <li>• Stage-specific suggestions</li>
                    <li>• Real-time candidate data</li>
                    <li>• Smart metric tracking</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-2xl p-8 text-white"
            >
              <h2 className="text-2xl font-semibold mb-4">Try it now</h2>
              <p className="text-white/90 mb-6 font-normal">
                Click the "Bridge AI" button in the bottom-right corner to open the panel and explore suggested prompts.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="font-semibold mb-1">Current Context</p>
                  <p className="text-sm text-white/80 font-normal">{mockContext.roleTitle}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="font-semibold mb-1">Stage</p>
                  <p className="text-sm text-white/80 font-normal">{mockContext.stage}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="font-semibold mb-1">Candidates</p>
                  <p className="text-sm text-white/80 font-normal">{mockContext.totals.candidates} total</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-[#0B1121] mb-4">Sample Prompts to Try</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Compare top 3 candidates by AI score",
                  "Find overdue candidates",
                  "Who's ready to interview?",
                  "Summarize skill gaps",
                  "Compare Maya Johnson vs Carlos Rivera",
                  "Show weekly assessment summary"
                ].map((prompt, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-[#0B1121] font-normal">"{prompt}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Global Bridge AI Components */}
      <BridgeAIButton
        hasUpdates={true}
        onOpen={() => setIsPanelOpen(true)}
        isOpen={isPanelOpen}
      />

      <BridgeAIPanel
        isOpen={isPanelOpen}
        context={mockContext}
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
