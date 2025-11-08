
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, Award, XCircle, Save, Calendar, Clock, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, FileCode, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import SendOfferModal from "../review-assessments/SendOfferModal";
import RejectCandidateModal from "../review-assessments/RejectCandidateModal";

export default function InterviewModal({ interview, onClose, onNext, onPrev, hasNext, hasPrev }) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(interview.notes || "");
  const [rating, setRating] = useState(interview.rating || 0);
  const [activeTab, setActiveTab] = useState("interview");
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Mock assessment data for this candidate
  const assessmentData = {
    projectTitle: "Real-time Chat Application",
    projectDescription: "Build a real-time chat application with user authentication, message persistence, and typing indicators using React and WebSockets.",
    aiScore: 86,
    submissionDate: "Dec 10, 2024",
    codeFiles: [
      {
        name: "ChatApp.jsx",
        path: "src/components/ChatApp.jsx",
        code: `import React, { useState, useEffect } from 'react';
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
      socket.emit('message', { text: input, user: '${interview.candidateName}' });
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
};`
      }
    ],
    aiAnalysis: {
      functionalCorrectness: 85,
      codeClarity: 90,
      problemSolving: 82,
      efficiency: 88,
      overallScore: 86,
      summary: "Strong understanding of React hooks and WebSocket implementation. Code is clean and well-structured. Minor improvements needed in error handling and edge cases."
    },
    testCases: [
      { id: 1, name: "Connection establishment", status: "passed", points: 10 },
      { id: 2, name: "Message sending", status: "passed", points: 15 },
      { id: 3, name: "Message receiving", status: "passed", points: 15 },
      { id: 4, name: "Error handling", status: "failed", points: 10, error: "Error handling not implemented" },
      { id: 5, name: "Empty message validation", status: "passed", points: 10 },
      { id: 6, name: "Cleanup on unmount", status: "passed", points: 10 }
    ]
  };

  const getCategoryColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const passedTests = assessmentData.testCases.filter(t => t.status === "passed");
  const totalPoints = assessmentData.testCases.reduce((sum, t) => sum + t.points, 0);
  const earnedPoints = passedTests.reduce((sum, t) => sum + t.points, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#0B1121]">{interview.candidateName}</h2>
                <p className="text-[#6B7280] font-normal">{interview.role} • {interview.interviewDate}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 -mb-px">
              <button
                onClick={() => setActiveTab("interview")}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "interview"
                    ? "text-[#1E3A8A]"
                    : "text-[#6B7280] hover:text-[#0B1121]"
                }`}
              >
                Interview
                {activeTab === "interview" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E3A8A]"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("assessment")}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "assessment"
                    ? "text-[#1E3A8A]"
                    : "text-[#6B7280] hover:text-[#0B1121]"
                }`}
              >
                Assessment
                {activeTab === "assessment" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E3A8A]"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "interview" ? (
              // Interview Content
              <>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Interview Details */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                      <h3 className="font-semibold text-[#0B1121] mb-4">Interview Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-[#6B7280]" />
                          <span className="text-sm text-[#6B7280] font-normal">{interview.interviewDate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-[#6B7280]" />
                          <span className="text-sm text-[#6B7280] font-normal">{interview.duration}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <UserPlus className="w-4 h-4 text-[#6B7280]" />
                          <span className="text-sm text-[#6B7280] font-normal">Interviewer: {interview.interviewer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#1E3A8A] text-white">
                            {interview.matchScore}% Match
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    {interview.status === "completed" && (
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="font-semibold text-[#0B1121] mb-auto">Interview Rating</h3>
                        <div className="mt-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-200"
                                style={{ width: `${rating * 10}%` }}
                              />
                            </div>
                            <span className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-full px-3 py-1 font-medium whitespace-nowrap">
                              {rating}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Strengths */}
                    {interview.strengths && interview.strengths.length > 0 && (
                      <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <ThumbsUp className="w-5 h-5 text-green-700" />
                          <h3 className="font-semibold text-green-900">Strengths</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {interview.strengths.map((strength, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Concerns */}
                    {interview.concerns && interview.concerns.length > 0 && (
                      <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                        <div className="flex items-center gap-2 mb-3">
                          <ThumbsDown className="w-5 h-5 text-red-700" />
                          <h3 className="font-semibold text-red-900">Concerns</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {interview.concerns.map((concern, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-sm font-medium"
                            >
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    {interview.recommendation && (
                      <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 flex flex-col">
                        <h3 className="font-semibold text-[#0B1121] mb-auto">Recommendation</h3>
                        <p className="text-lg font-semibold text-[#0B1121] mt-4">
                          {interview.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interview Notes - Full Width */}
                <div className="mt-6">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="font-semibold text-[#0B1121] mb-3">Interview Notes</h3>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your notes from the interview..."
                      className="min-h-[120px] rounded-xl bg-white"
                    />
                    <Button
                      className="mt-3 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Notes
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // Assessment Content
              <div className="space-y-6">
                {/* Project Description */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-semibold text-[#0B1121] mb-2">Project Brief</h3>
                  <h4 className="text-sm font-semibold text-[#1E3A8A] mb-2">{assessmentData.projectTitle}</h4>
                  <p className="text-sm text-[#6B7280] font-normal">{assessmentData.projectDescription}</p>
                </div>

                {/* AI Analysis Summary */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-semibold text-[#0B1121] text-lg">AI Analysis Summary</h3>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
                      <span className="text-lg text-[#1E3A8A] leading-none">
                        {assessmentData.aiAnalysis.overallScore}
                      </span>
                      <span className="text-xs text-[#6B7280]">/ 100</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#6B7280] font-normal leading-relaxed mb-4">
                    {assessmentData.aiAnalysis.summary}
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#6B7280] font-normal">Functional</span>
                        <span className="text-xs font-semibold text-[#0B1121]">{assessmentData.aiAnalysis.functionalCorrectness}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${getCategoryColor(assessmentData.aiAnalysis.functionalCorrectness)}`}
                          style={{ width: `${assessmentData.aiAnalysis.functionalCorrectness}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#6B7280] font-normal">Code Clarity</span>
                        <span className="text-xs font-semibold text-[#0B1121]">{assessmentData.aiAnalysis.codeClarity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${getCategoryColor(assessmentData.aiAnalysis.codeClarity)}`}
                          style={{ width: `${assessmentData.aiAnalysis.codeClarity}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#6B7280] font-normal">Problem Solving</span>
                        <span className="text-xs font-semibold text-[#0B1121]">{assessmentData.aiAnalysis.problemSolving}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${getCategoryColor(assessmentData.aiAnalysis.problemSolving)}`}
                          style={{ width: `${assessmentData.aiAnalysis.problemSolving}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#6B7280] font-normal">Efficiency</span>
                        <span className="text-xs font-semibold text-[#0B1121]">{assessmentData.aiAnalysis.efficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${getCategoryColor(assessmentData.aiAnalysis.efficiency)}`}
                          style={{ width: `${assessmentData.aiAnalysis.efficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submitted Code */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileCode className="w-5 h-5 text-[#1E3A8A]" />
                    <h3 className="font-semibold text-[#0B1121]">Submitted Code</h3>
                  </div>
                  <div className="mb-2 px-3 py-2 bg-gray-100 rounded-md">
                    <p className="text-xs text-[#6B7280] font-mono">{assessmentData.codeFiles[0].path}</p>
                  </div>
                  <div className="bg-[#1E1E1E] rounded-lg p-4 overflow-x-auto max-h-[300px]">
                    <pre className="text-sm text-gray-300 font-mono">
                      <code>{assessmentData.codeFiles[0].code}</code>
                    </pre>
                  </div>
                </div>

                {/* Test Cases */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0B1121]">Test Cases</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-[#6B7280] font-normal">
                          {passedTests.length} Passed
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-gray-200 rounded-lg">
                        <span className="text-sm font-semibold text-[#0B1121]">
                          {earnedPoints}/{totalPoints} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {assessmentData.testCases.map((test) => (
                      <div
                        key={test.id}
                        className={`p-4 rounded-lg border-2 ${
                          test.status === "passed"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-0.5">
                              {test.status === "passed" ? (
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                  <X className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#0B1121] text-sm mb-1">
                                {test.name}
                              </h4>
                              {test.error && (
                                <div className="flex items-start gap-2 mt-2 p-2 bg-white rounded border border-red-300">
                                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-red-800 font-normal">{test.error}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            test.status === "passed"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}>
                            {test.points} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Notes - Full Width */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-semibold text-[#0B1121] mb-3">Assessment Notes</h3>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your notes about this assessment..."
                    className="min-h-[120px] rounded-xl bg-white"
                  />
                  <Button
                    className="mt-3 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Notes
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button
                onClick={onPrev}
                disabled={!hasPrev}
                variant="outline"
                className="h-11 px-4"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={onNext}
                disabled={!hasNext}
                variant="outline"
                className="h-11 px-4"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setRejectModalOpen(true)}
                variant="outline"
                className="h-11 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Candidate
              </Button>
              <Button
                onClick={() => setOfferModalOpen(true)}
                variant="outline"
                className="h-11 border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-blue-50 hover:border-[#1E3A8A]"
              >
                <Award className="w-4 h-4 mr-2" />
                Extend Offer
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <SendOfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        candidateName={interview.candidateName}
        role={interview.role}
      />

      <RejectCandidateModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        candidateName={interview.candidateName}
        role={interview.role}
      />
    </>
  );
}
