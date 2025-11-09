import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus, X, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import SendOfferModal from "./SendOfferModal";
import RejectCandidateModal from "./RejectCandidateModal";

export default function AssessmentsTable({ assessments, onViewAssessment }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleRowClick = (assessment) => {
    navigate(`/ApplicantProfile?name=${encodeURIComponent(assessment.candidateName)}&from=review-assessments`);
  };

  const handleInviteCandidate = (e, assessment) => {
    e.stopPropagation();
    navigate(`/ScheduleInterview?candidate=${encodeURIComponent(assessment.candidateName)}&role=${encodeURIComponent(assessment.role)}`);
  };

  const handleExtendOffer = (e, assessment) => {
    e.stopPropagation();
    setSelectedCandidate(assessment);
    setOfferModalOpen(true);
  };

  const handleReject = (e, assessment) => {
    e.stopPropagation();
    setSelectedCandidate(assessment);
    setRejectModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Candidate</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Submitted</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">AI Evaluation</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Notes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">View Project</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assessments.map((assessment, idx) => (
                <motion.tr
                  key={assessment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  onClick={() => handleRowClick(assessment)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {assessment.candidateName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-semibold text-[#0B1121]">{assessment.candidateName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{assessment.submissionDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1.5 rounded-lg border-2 font-semibold text-sm ${getScoreColor(assessment.aiScore)}`}>
                        {assessment.aiScore}/100
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#6B7280] font-normal">{assessment.aiSummary}</p>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                          <div
                            className={`h-1.5 rounded-full ${getScoreBadgeColor(assessment.aiScore)}`}
                            style={{ width: `${assessment.aiScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#6B7280] font-normal italic">
                      {assessment.employerNotes || "No notes yet"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewAssessment(assessment);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-9"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => handleInviteCandidate(e, assessment)}
                        variant="ghost"
                        size="sm"
                        className="h-9 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Invite
                      </Button>
                      <Button
                        onClick={(e) => handleExtendOffer(e, assessment)}
                        variant="ghost"
                        size="sm"
                        className="h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Award className="w-4 h-4 mr-1" />
                        Offer
                      </Button>
                      <Button
                        onClick={(e) => handleReject(e, assessment)}
                        variant="ghost"
                        size="sm"
                        className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <SendOfferModal
        isOpen={offerModalOpen}
        onClose={() => {
          setOfferModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidateName={selectedCandidate?.candidateName}
        role={selectedCandidate?.role}
      />

      <RejectCandidateModal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidateName={selectedCandidate?.candidateName}
        role={selectedCandidate?.role}
      />
    </>
  );
}