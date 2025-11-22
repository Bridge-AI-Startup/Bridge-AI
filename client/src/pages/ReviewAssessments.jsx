
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, FileText, Clock, User, Calendar } from "lucide-react";
import Header from "../components/navigation/Header";
import { Input } from "@/components/ui/input";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { API_URL } from "../config";

export default function ReviewAssessments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingAssessments, setPendingAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPendingAssessments();
  }, []);

  const fetchPendingAssessments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/api/admin/assessments/pending`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending assessments');
      }

      const data = await response.json();
      if (data.success) {
        setPendingAssessments(data.data.pendingAssessments || []);
      } else {
        throw new Error(data.message || 'Failed to fetch pending assessments');
      }
    } catch (err) {
      console.error('Error fetching pending assessments:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssessmentTypeColor = (type) => {
    switch (type) {
      case 'coding':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'technical_quiz':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'case_study':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filter assessments based on search
  const filteredAssessments = pendingAssessments.filter(item => {
    if (!searchQuery) return true;
    const candidate = item.application.candidateId;
    const fullName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase();
    const email = candidate.email.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Review Assessments" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-3">
              Admin: Review Assessments
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Manually review and grade completed assessments from all candidates across all companies
            </p>
          </div>

          {/* Search Bar */}
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
                placeholder="Search by candidate name or email..."
                className="h-12 pl-12 rounded-xl"
              />
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
                <p className="text-[#6B7280]">Loading assessments...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-white rounded-2xl p-12 border border-red-200 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchPendingAssessments}
                  className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredAssessments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-12 border border-gray-200 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-xl text-[#0B1121] font-semibold mb-2">
                {searchQuery ? 'No matching assessments found' : 'No assessments to review'}
              </p>
              <p className="text-[#6B7280] text-center">
                {searchQuery ? 'Try adjusting your search query' : 'Completed assessments will appear here for you to review and grade'}
              </p>
            </motion.div>
          )}

          {/* Assessments List */}
          {!isLoading && !error && filteredAssessments.length > 0 && (
            <div className="space-y-4">
              {filteredAssessments.map((item, index) => {
                const { application, assessmentResults } = item;
                const candidate = application.candidateId;
                const jobListing = application.jobListingId;

                return (
                  <motion.div
                    key={application._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#1E3A8A] hover:shadow-md transition-all"
                  >
                    {/* Candidate Info Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        {candidate.profilePicture ? (
                          <img
                            src={candidate.profilePicture}
                            alt={`${candidate.firstName} ${candidate.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#6366F1] flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-semibold text-[#0B1121]">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                          <p className="text-sm text-[#6B7280] font-normal">
                            {candidate.email}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#0B1121] mb-1">
                          {jobListing.roleTitle}
                        </p>
                        <p className="text-xs text-[#6B7280] mb-2">
                          {application.companyId?.companyName || 'Company'}
                        </p>
                        <div className="flex items-center gap-1 text-[#6B7280] text-sm">
                          <Calendar className="w-3 h-3" />
                          <span className="font-normal">
                            Applied: {formatDate(application.appliedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assessment Results */}
                    {assessmentResults.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <h4 className="text-sm font-semibold text-[#0B1121] mb-3">
                          Completed Assessments ({assessmentResults.length})
                        </h4>
                        {assessmentResults.map((result) => (
                          <div
                            key={result._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <FileText className="w-5 h-5 text-[#6366F1]" />
                              <div>
                                <p className="font-semibold text-[#0B1121]">
                                  {result.assessmentId?.title || 'Assessment'}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getAssessmentTypeColor(result.assessmentId?.assessmentType)}`}>
                                    {result.assessmentId?.assessmentType?.replace('_', ' ')}
                                  </span>
                                  {result.completedAt && (
                                    <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                                      <Clock className="w-3 h-3" />
                                      <span>Completed: {formatDate(result.completedAt)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => navigate(`/GradeAssessment?applicationId=${application._id}&resultId=${result._id}`)}
                              className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 transition-colors font-semibold"
                            >
                              Review & Grade
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Application Metadata */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-6 text-sm text-[#6B7280]">
                        <span className="font-normal">
                          Application Stage: <span className="font-semibold text-[#0B1121]">{application.stage.replace('_', ' ')}</span>
                        </span>
                        {application.rating && (
                          <span className="font-normal">
                            Rating: <span className="font-semibold text-[#0B1121]">{application.rating}/5</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
