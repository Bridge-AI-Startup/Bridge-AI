
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, Award, XCircle, Save, FileCode, Check, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SendOfferModal from "./SendOfferModal";
import RejectCandidateModal from "./RejectCandidateModal";

export default function AssessmentModal({ assessment, onClose, onNext, onPrev, hasNext, hasPrev }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [notes, setNotes] = useState(assessment.employerNotes || "");
  const [activeFile, setActiveFile] = useState(0);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-700";
    if (score >= 60) return "text-yellow-700";
    return "text-red-700";
  };

  const getCategoryColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Mock code files structure - in real implementation, this would come from assessment data
  const codeFiles = [
    {
      name: "ChatApp.jsx",
      path: "src/components/ChatApp.jsx",
      language: "javascript",
      code: assessment.submittedCode
    },
    {
      name: "socket.js",
      path: "src/utils/socket.js",
      language: "javascript",
      code: `import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

export const createSocket = () => {
  const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};`
    },
    {
      name: "Message.jsx",
      path: "src/components/Message.jsx",
      language: "javascript",
      code: `import React from 'react';

export default function Message({ message, isOwn }) {
  return (
    <div className={\`flex \${isOwn ? 'justify-end' : 'justify-start'} mb-2\`}>
      <div className={\`max-w-xs px-4 py-2 rounded-lg \${
        isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }\`}>
        <p className="text-sm font-semibold">{message.user}</p>
        <p>{message.text}</p>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}`
    }
  ];

  // Mock test cases - in real implementation, this would come from assessment data
  const testCases = [
    {
      id: 1,
      name: "Connection establishment",
      description: "Should establish WebSocket connection on component mount",
      status: "passed",
      points: 10
    },
    {
      id: 2,
      name: "Message sending",
      description: "Should emit message event when user sends a message",
      status: "passed",
      points: 15
    },
    {
      id: 3,
      name: "Message receiving",
      description: "Should update messages state when receiving new message",
      status: "passed",
      points: 15
    },
    {
      id: 4,
      name: "Error handling",
      description: "Should handle connection errors gracefully",
      status: "failed",
      points: 10,
      error: "Error handling not implemented for connection failures"
    },
    {
      id: 5,
      name: "Empty message validation",
      description: "Should prevent sending empty or whitespace-only messages",
      status: "passed",
      points: 10
    },
    {
      id: 6,
      name: "Cleanup on unmount",
      description: "Should close socket connection when component unmounts",
      status: "passed",
      points: 10
    },
    {
      id: 7,
      name: "Typing indicators",
      description: "Should emit and display typing indicators",
      status: "failed",
      points: 15,
      error: "Typing indicator feature not implemented"
    },
    {
      id: 8,
      name: "Message persistence",
      description: "Should persist messages to backend storage",
      status: "failed",
      points: 15,
      error: "No backend persistence implementation found"
    }
  ];

  const passedTests = testCases.filter(t => t.status === "passed");
  const failedTests = testCases.filter(t => t.status === "failed");
  const totalPoints = testCases.reduce((sum, t) => sum + t.points, 0);
  const earnedPoints = passedTests.reduce((sum, t) => sum + t.points, 0);
  const testScore = Math.round((earnedPoints / totalPoints) * 100);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-2xl font-semibold text-[#0B1121]">{assessment.candidateName}</h2>
              <p className="text-[#6B7280] font-normal">{assessment.role} • Submitted {assessment.submissionDate}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Project Description */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-2">Project Brief</h3>
                <h4 className="text-sm font-semibold text-[#1E3A8A] mb-2">{assessment.projectTitle}</h4>
                <p className="text-sm text-[#6B7280] font-normal">{assessment.projectDescription}</p>
              </div>

              {/* AI Analysis Summary with Score Pill */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-semibold text-[#0B1121] text-lg">AI Analysis Summary</h3>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
                    <span className="text-lg text-[#1E3A8A] leading-none">
                      {assessment.aiAnalysis.overallScore}
                    </span>
                    <span className="text-xs text-[#6B7280]">/ 100</span>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] font-normal leading-relaxed mb-4">
                  {assessment.aiAnalysis.summary}
                </p>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6B7280] font-normal">Functional</span>
                      <span className="text-xs font-semibold text-[#0B1121]">{assessment.aiAnalysis.functionalCorrectness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(assessment.aiAnalysis.functionalCorrectness)}`}
                        style={{ width: `${assessment.aiAnalysis.functionalCorrectness}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6B7280] font-normal">Code Clarity</span>
                      <span className="text-xs font-semibold text-[#0B1121]">{assessment.aiAnalysis.codeClarity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(assessment.aiAnalysis.codeClarity)}`}
                        style={{ width: `${assessment.aiAnalysis.codeClarity}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6B7280] font-normal">Problem Solving</span>
                      <span className="text-xs font-semibold text-[#0B1121]">{assessment.aiAnalysis.problemSolving}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(assessment.aiAnalysis.problemSolving)}`}
                        style={{ width: `${assessment.aiAnalysis.problemSolving}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6B7280] font-normal">Efficiency</span>
                      <span className="text-xs font-semibold text-[#0B1121]">{assessment.aiAnalysis.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(assessment.aiAnalysis.efficiency)}`}
                        style={{ width: `${assessment.aiAnalysis.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submitted Code with Multiple Files */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3">Submitted Code</h3>

                {/* File Tabs */}
                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="w-full justify-start bg-gray-100 p-1 rounded-lg mb-3 flex-wrap h-auto">
                    {codeFiles.map((file, idx) => (
                      <TabsTrigger
                        key={idx}
                        value={String(idx)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <FileCode className="w-4 h-4" />
                        {file.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {codeFiles.map((file, idx) => (
                    <TabsContent key={idx} value={String(idx)} className="mt-0">
                      <div className="mb-2 px-3 py-2 bg-gray-100 rounded-md">
                        <p className="text-xs text-[#6B7280] font-mono">{file.path}</p>
                      </div>
                      <div className="bg-[#1E1E1E] rounded-lg p-4 overflow-x-auto max-h-[400px]">
                        <pre className="text-sm text-gray-300 font-mono">
                          <code>{file.code}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Test Cases Section - Full Width */}
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
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-[#6B7280] font-normal">
                        {failedTests.length} Failed
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-gray-200 rounded-lg">
                      <span className="text-sm font-semibold text-[#0B1121]">
                        {earnedPoints}/{totalPoints} pts ({testScore}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {testCases.map((test) => (
                    <div
                      key={test.id}
                      className={`p-4 rounded-lg border-2 ${
                        test.status === "passed"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
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
                            <p className="text-xs text-[#6B7280] font-normal mb-2">
                              {test.description}
                            </p>
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

              {/* Employer Notes - Full Width */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3">Your Private Notes</h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your evaluation notes here..."
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
                className="h-11 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
              >
                <Award className="w-4 h-4 mr-2" />
                Extend Offer
              </Button>
              <Button
                onClick={() => navigate(`/ScheduleInterview?candidate=${encodeURIComponent(assessment.candidateName)}&role=${encodeURIComponent(assessment.role)}`)}
                variant="outline"
                className="h-11 border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite to Interview
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <SendOfferModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        candidateName={assessment.candidateName}
        role={assessment.role}
      />

      <RejectCandidateModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        candidateName={assessment.candidateName}
        role={assessment.role}
      />
    </>
  );
}
