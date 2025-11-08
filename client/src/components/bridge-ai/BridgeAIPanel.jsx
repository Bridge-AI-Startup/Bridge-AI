
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PromptChips from "./PromptChips";
import RankedListCard from "./insight-cards/RankedListCard";
import ComparisonCard from "./insight-cards/ComparisonCard";
import SummaryCard from "./insight-cards/SummaryCard";
import AlertCard from "./insight-cards/AlertCard";

export default function BridgeAIPanel({
  isOpen,
  context,
  onClose,
  onPromptRun,
  onFreeformPrompt,
  onViewCandidate,
  onInvite,
  onSendReminder,
  onFlag
}) {
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [insights, setInsights] = useState([]);
  const [showExamples, setShowExamples] = useState(false);

  // Generate suggested prompts based on context
  const getSuggestedPrompts = () => {
    if (!context?.stage) return [];
    
    const promptMap = {
      "Matches": [
        { id: "compare-top", label: "Compare top candidates this week" },
        { id: "interview-ready", label: "Who's interview-ready?" },
        { id: "rank-backend", label: "Rank by backend readiness" },
        { id: "flag-risky", label: "Show risky candidates" }
      ],
      "Assessments": [
        { id: "compare-ai-scores", label: "Compare top 3 by AI score" },
        { id: "find-overdue", label: "Find overdue candidates" },
        { id: "ready-interview", label: "Who's ready to interview?" },
        { id: "skill-gaps", label: "Summarize skill gaps" }
      ],
      "Interviews": [
        { id: "rank-feedback", label: "Rank by interview feedback" },
        { id: "offer-ready", label: "Who should get offers?" },
        { id: "strengths-risks", label: "Summarize strengths/risks" }
      ],
      "Offers": [
        { id: "pending-offers", label: "Track pending offers" },
        { id: "acceptance-rate", label: "Show acceptance trends" }
      ]
    };

    return promptMap[context.stage] || promptMap["Assessments"];
  };

  const examplePrompts = [
    "Compare top 3 candidates by technical skills",
    "Who has the best React experience?",
    "Find candidates with startup experience",
    "Show me candidates available immediately"
  ];

  // Simulate thinking and generate insights
  const handlePromptRun = async (prompt) => {
    setIsThinking(true);
    onPromptRun?.(prompt);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInsight = generateMockInsight(prompt.id, context);
    setInsights(prev => [newInsight, ...prev]);
    setIsThinking(false);
  };

  const handleFreeformSubmit = async () => {
    if (!inputValue.trim()) return;
    
    setIsThinking(true);
    onFreeformPrompt?.(inputValue);
    setInputValue("");

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInsight = generateMockInsight("freeform", context);
    setInsights(prev => [newInsight, ...prev]);
    setIsThinking(false);
  };

  // Render insight card based on type
  const renderInsight = (insight) => {
    switch (insight.type) {
      case "ranked-list":
        return (
          <RankedListCard
            key={insight.id}
            title={insight.title}
            items={insight.data.items}
            onViewCandidate={onViewCandidate}
            onInvite={onInvite}
            onSendReminder={onSendReminder}
          />
        );
      case "comparison":
        return (
          <ComparisonCard
            key={insight.id}
            title={insight.title}
            candidateA={insight.data.candidateA}
            candidateB={insight.data.candidateB}
            verdict={insight.data.verdict}
            onViewCandidate={onViewCandidate}
          />
        );
      case "summary":
        return (
          <SummaryCard
            key={insight.id}
            title={insight.title}
            summary={insight.data.summary}
            metrics={insight.data.metrics}
          />
        );
      case "alert":
        return (
          <AlertCard
            key={insight.id}
            title={insight.title}
            alerts={insight.data.alerts}
            onNotify={onSendReminder}
          />
        );
      default:
        return null;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        if (isOpen) {
          onClose?.();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const contextLine = context
    ? `${context.totals?.candidates || 0} candidates • ${context.roleTitle || 'All Roles'} • ${context.stage || 'All'}`
    : "No active context";

  const hasNoCandidates = !context?.candidates || context.candidates.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Floating Panel */}
          <motion.div
            initial={{ 
              opacity: 0,
              scale: 0,
              right: '28px',
              bottom: '28px',
              width: '140px',
              height: '50px',
              borderRadius: '25px'
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              right: '24px',
              bottom: '24px',
              width: '480px',
              height: '85vh',
              borderRadius: '20px' // Changed from '16px' to '20px'
            }}
            exit={{ 
              opacity: 0,
              scale: 0,
              right: '28px',
              bottom: '28px',
              width: '140px',
              height: '50px',
              borderRadius: '25px'
            }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.4
            }}
            className="fixed z-50 flex flex-col bg-white shadow-2xl border border-gray-200 overflow-hidden" // Added overflow-hidden
            style={{ 
              maxHeight: '85vh'
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1E3A8A] flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">B</span>
                  </div>
                  <h2 className="text-sm font-semibold text-[#0B1121]">Bridge AI</h2>
                </div>
                {context && (
                  <span className="text-xs text-[#6B7280] font-normal truncate max-w-[280px]">
                    {contextLine}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>

            {/* Loading bar */}
            {isThinking && (
              <div className="flex-shrink-0 h-0.5 bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="h-full w-1/3 bg-[#1E3A8A]"
                />
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Insights Feed */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {insights.length === 0 && !isThinking ? (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    {hasNoCandidates ? (
                      <div className="text-center max-w-sm">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                          <X className="w-6 h-6 text-[#6B7280]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#0B1121] mb-1">No candidates yet</h3>
                        <p className="text-xs text-[#6B7280] font-normal">
                          New matches arrive weekly. You'll see insights here as activity starts.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center max-w-md">
                        <h3 className="text-sm font-semibold text-[#0B1121] mb-2">Ready to analyze your candidates</h3>
                        <p className="text-xs text-[#6B7280] font-normal mb-4">
                          Choose a suggested prompt below or ask your own question.
                        </p>
                        {/* Suggested Prompts - Inline */}
                        <div className="flex flex-wrap gap-2 justify-center">
                          {getSuggestedPrompts().map((prompt) => (
                            <button
                              key={prompt.id}
                              onClick={() => handlePromptRun(prompt)}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-[#1E3A8A] transition-colors text-xs text-[#0B1121] font-normal"
                            >
                              {prompt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-3 animate-pulse"
                      >
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-2 bg-gray-200 rounded w-full mb-1.5" />
                        <div className="h-2 bg-gray-200 rounded w-3/4" />
                      </motion.div>
                    )}
                    <div className="space-y-3">
                      {insights.map(renderInsight)}
                    </div>
                  </>
                )}
              </div>

              {/* Input Bar - Sticky at bottom */}
              <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleFreeformSubmit()}
                      placeholder="Ask, search, or make anything..."
                      className="h-10 pr-10 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => setShowExamples(!showExamples)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center"
                    >
                      <HelpCircle className="w-4 h-4 text-[#6B7280]" />
                    </button>
                  </div>
                  <Button
                    onClick={handleFreeformSubmit}
                    disabled={!inputValue.trim() || isThinking}
                    className="h-10 px-4 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {showExamples && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 rounded-lg bg-white border border-gray-200"
                  >
                    <p className="text-xs text-[#6B7280] mb-2 font-semibold">Example prompts:</p>
                    <div className="space-y-1">
                      {examplePrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputValue(prompt);
                            setShowExamples(false);
                          }}
                          className="block w-full text-left text-xs text-[#0B1121] hover:text-[#1E3A8A] py-1 hover:bg-gray-50 rounded px-2"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Generate mock insights based on prompt type
function generateMockInsight(promptId, ctx) {
  const candidates = ctx?.candidates || [];
  
  if (promptId === "compare-top" || promptId === "compare-ai-scores") {
    const top3 = candidates.slice(0, 3).map((c, idx) => ({
      id: c.id,
      name: c.name,
      score: c.aiEvalScore || c.matchScore || 90 - idx * 5,
      rationale: c.rationale || `Strong ${idx === 0 ? 'React + Node' : idx === 1 ? 'Python + ML' : 'design'} skills, ${idx === 0 ? 'excellent' : 'good'} code quality`
    }));

    return {
      type: "ranked-list",
      id: Date.now(),
      title: "Top Candidates by AI Evaluation",
      data: { items: top3 }
    };
  }

  if (promptId === "find-overdue") {
    const overdue = candidates
      .filter(c => c.status === "in_progress")
      .slice(0, 2)
      .map(c => ({
        id: c.id,
        name: c.name,
        message: "Assessment overdue by 2 days"
      }));

    return {
      type: "alert",
      id: Date.now(),
      title: "Overdue Assessments",
      data: { alerts: overdue }
    };
  }

  if (promptId === "skill-gaps" || promptId === "strengths-risks") {
    return {
      type: "summary",
      id: Date.now(),
      title: "Weekly Assessment Summary",
      data: {
        metrics: [
          { key: "avgScore", label: "Avg Score", value: "86/100" },
          { key: "passRate", label: "Pass Rate", value: "72%" },
          { key: "avgTime", label: "Avg Time", value: "3.2h" }
        ],
        summary: [
          "Strong performance in React and Node.js fundamentals",
          "Most candidates struggle with system design questions",
          "Error handling and testing need improvement across board",
          "Top performers show excellent documentation practices"
        ]
      }
    };
  }

  // Default to comparison
  if (candidates.length >= 2) {
    return {
      type: "comparison",
      id: Date.now(),
      title: `${candidates[0].name} vs ${candidates[1].name}`,
      data: {
        candidateA: {
          id: candidates[0].id,
          name: candidates[0].name,
          strengths: ["Strong React skills", "Great communication", "Fast learner"],
          weaknesses: ["Limited backend experience", "No testing background"]
        },
        candidateB: {
          id: candidates[1].id,
          name: candidates[1].name,
          strengths: ["Full-stack experience", "Good testing practices"],
          weaknesses: ["Slower development pace", "Less polished UI work"]
        },
        verdict: `${candidates[0].name} is better suited for frontend-focused roles, while ${candidates[1].name} brings stronger full-stack capabilities.`
      }
    };
  }

  return {
    type: "summary",
    id: Date.now(),
    title: "Analysis Complete",
    data: {
      metrics: [
        { key: "avgScore", label: "Candidates", value: String(candidates.length) }
      ],
      summary: ["No specific insights available for this query"]
    }
  };
}
