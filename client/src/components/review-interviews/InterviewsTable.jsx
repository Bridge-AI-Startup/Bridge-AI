import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus, X, Award, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import SendOfferModal from "../review-assessments/SendOfferModal";
import RejectCandidateModal from "../review-assessments/RejectCandidateModal";

export default function InterviewsTable({ interviews, onViewInterview }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const getRatingColor = (rating) => {
    if (!rating) return "text-gray-400 bg-gray-50 border-gray-200";
    if (rating >= 8) return "text-green-700 bg-green-50 border-green-200";
    if (rating >= 6) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const handleRowClick = (interview) => {
    navigate(`/ApplicantProfile?name=${encodeURIComponent(interview.candidateName)}&from=review-interviews`);
  };

  const handleExtendOffer = (e, interview) => {
    e.stopPropagation();
    setSelectedCandidate(interview);
    setOfferModalOpen(true);
  };

  const handleReject = (e, interview) => {
    e.stopPropagation();
    setSelectedCandidate(interview);
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Interview Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Interviewer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">View Interview</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {interviews.map((interview, idx) => (
                <motion.tr
                  key={interview.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  onClick={() => handleRowClick(interview)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {interview.candidateName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#0B1121] block">{interview.candidateName}</span>
                        <span className="text-xs text-[#6B7280]">{interview.matchScore}% Match</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Calendar className="w-4 h-4" />
                      {interview.interviewDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{interview.interviewer}</td>
                  <td className="px-6 py-4">
                    {interview.rating ? (
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1.5 rounded-lg border-2 font-semibold text-sm ${getRatingColor(interview.rating)}`}>
                          {interview.rating}/10
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Not rated yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewInterview(interview);
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
                      {interview.status === "completed" && interview.rating >= 7 && (
                        <>
                          <Button
                            onClick={(e) => handleExtendOffer(e, interview)}
                            variant="ghost"
                            size="sm"
                            className="h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Award className="w-4 h-4 mr-1" />
                            Offer
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={(e) => handleReject(e, interview)}
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