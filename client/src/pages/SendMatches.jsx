import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  Settings,
  AlertCircle,
  TrendingDown,
  Eye,
  EyeOff,
  List,
  User,
  Building2,
  ChevronDown,
  ChevronUp,
  Database,
  Trash2
} from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { API_URL } from "../config";

export default function SendMatches() {
  const [isLoading, setIsLoading] = useState(false);
  const [studentLimit, setStudentLimit] = useState(5);
  const [jobLimit, setJobLimit] = useState(10);
  const [minScore, setMinScore] = useState(40);
  const [proposedMatches, setProposedMatches] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [stats, setStats] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [viewMode, setViewMode] = useState('list'); // 'list', 'byStudent', 'byJob'
  const [allMatches, setAllMatches] = useState([]);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const breadcrumbItems = [
    { label: "Admin", path: "/ReviewAssessments" },
    { label: "Send Matches" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    // Load existing published matches on mount
    loadExistingMatches();
    // Load all matches for the database view
    loadAllMatches();
  }, []);

  const loadExistingMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/matching/data`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        // Filter to only show published matches (visible to students and employers)
        const publishedMatches = data.data.matches.filter(
          m => m.visibleToStudent && m.visibleToEmployer
        );

        if (publishedMatches.length > 0) {
          setProposedMatches(publishedMatches);

          // Calculate stats
          const uniqueStudents = new Set(publishedMatches.map(m => m.studentId._id)).size;
          const uniqueJobs = new Set(publishedMatches.map(m => m.jobListingId._id)).size;
          const avgScore = publishedMatches.reduce((sum, m) => sum + m.overallScore, 0) / publishedMatches.length;

          setStats({
            totalMatches: publishedMatches.length,
            studentsMatched: uniqueStudents,
            companiesMatched: uniqueJobs,
            avgScore: Math.round(avgScore)
          });
        }
      }
    } catch (error) {
      console.error('Error loading existing matches:', error);
    }
  };

  const loadAllMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/matching/data`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        // Load only matches visible on dashboards (published matches)
        const visibleMatches = data.data.matches.filter(
          m => m.visibleToStudent && m.visibleToEmployer
        );
        setAllMatches(visibleMatches || []);
      }
    } catch (error) {
      console.error('Error loading all matches:', error);
    }
  };

  const handleGenerateMatches = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/matching/generate-optimal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentLimit,
          jobLimit,
          minScore
        })
      });

      const data = await response.json();
      if (data.success) {
        setProposedMatches(data.data.matches);
        setStats(data.data.stats);
      } else {
        alert(data.message || 'Failed to generate matches');
      }
    } catch (err) {
      console.error('Error generating matches:', err);
      alert('Failed to generate matches: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishMatches = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to publish ${proposedMatches.length} matches? This will make them visible to students and companies.`
    );
    if (!confirmed) return;

    setIsPublishing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/matching/publish-final`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matches: proposedMatches.map(m => ({
            studentId: m.studentId._id,
            companyId: m.companyId._id,
            jobListingId: m.jobListingId._id,
            overallScore: m.overallScore,
            matchFactors: m.matchFactors
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully published ${proposedMatches.length} matches!`);
        setProposedMatches([]);
        setStats(null);
      } else {
        alert(data.message || 'Failed to publish matches');
      }
    } catch (err) {
      console.error('Error publishing matches:', err);
      alert('Failed to publish matches: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleClearAllMatches = async () => {
    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete ALL matches and assessment results from the database. This action cannot be undone. Are you sure?`
    );
    if (!confirmed) return;

    // Double confirmation for safety
    const doubleConfirm = window.confirm(
      `This is your final confirmation. Delete all ${allMatches.length} matches and associated data?`
    );
    if (!doubleConfirm) return;

    setIsClearing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/matching/clear-all`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully deleted ${data.data.matchesDeleted} matches and ${data.data.assessmentResultsDeleted} assessment results`);
        // Refresh the page data
        setAllMatches([]);
        setProposedMatches([]);
        setStats(null);
        loadExistingMatches();
        loadAllMatches();
      } else {
        alert(data.message || 'Failed to clear matches');
      }
    } catch (err) {
      console.error('Error clearing matches:', err);
      alert('Failed to clear matches: ' + err.message);
    } finally {
      setIsClearing(false);
    }
  };

  const toggleDetails = (index) => {
    setShowDetails(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Group matches by student
  const groupByStudent = () => {
    const grouped = {};
    proposedMatches.forEach(match => {
      const studentId = match.studentId._id;
      if (!grouped[studentId]) {
        grouped[studentId] = {
          student: match.studentId,
          matches: []
        };
      }
      grouped[studentId].matches.push(match);
    });
    return Object.values(grouped);
  };

  // Group matches by job listing
  const groupByJob = () => {
    const grouped = {};
    proposedMatches.forEach(match => {
      const jobId = match.jobListingId._id;
      if (!grouped[jobId]) {
        grouped[jobId] = {
          job: match.jobListingId,
          company: match.companyId,
          matches: []
        };
      }
      grouped[jobId].matches.push(match);
    });
    return Object.values(grouped);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-[#0B1121] mb-2">Send Matches</h1>
                <p className="text-gray-600">
                  Generate and publish optimal student-job matches based on ratings and constraints
                </p>
              </div>
              {allMatches.length > 0 && (
                <button
                  onClick={handleClearAllMatches}
                  disabled={isClearing}
                  className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {isClearing ? 'Clearing...' : 'Clear All Matches'}
                </button>
              )}
            </div>
          </motion.div>

          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-[#0B1121]">Matching Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Student Limit */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Users className="w-4 h-4" />
                  Max Matches per Student
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={studentLimit}
                  onChange={(e) => setStudentLimit(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Each student will receive at most this many job matches
                </p>
              </div>

              {/* Job Listing Limit */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4" />
                  Max Matches per Job Listing
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={jobLimit}
                  onChange={(e) => setJobLimit(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Each job listing will receive at most this many student matches
                </p>
              </div>

              {/* Minimum Score */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <TrendingDown className="w-4 h-4" />
                  Minimum Match Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only matches with this score or higher will be included
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleGenerateMatches}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                <Settings className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate Matches'}
              </button>

              {proposedMatches.length > 0 && (
                <button
                  onClick={handlePublishMatches}
                  disabled={isPublishing}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  <Send className="w-4 h-4" />
                  {isPublishing ? 'Publishing...' : `Publish ${proposedMatches.length} Matches`}
                </button>
              )}
            </div>
          </motion.div>

          {/* Current Published Matches View */}
          {allMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
            >
              <button
                onClick={() => setShowAllMatches(!showAllMatches)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-[#0B1121]">
                      Current Published Matches ({allMatches.length})
                    </h2>
                    <p className="text-sm text-gray-600">
                      View all matches currently visible to students and employers
                    </p>
                  </div>
                </div>
                {showAllMatches ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {showAllMatches && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Student</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Job Listing</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Company</th>
                          <th className="text-center py-2 px-3 font-semibold text-gray-700">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allMatches.map((match, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-3">
                              <a
                                href={`/ApplicantProfile?userId=${match.studentId._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                {match.studentId.firstName} {match.studentId.lastName}
                              </a>
                              <p className="text-xs text-gray-500">{match.studentId.email}</p>
                            </td>
                            <td className="py-3 px-3">
                              <a
                                href={`/JobListingDashboard?jobId=${match.jobListingId._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                {match.jobListingId.roleTitle}
                              </a>
                              <p className="text-xs text-gray-500">
                                {match.jobListingId.workLocation || 'Remote'}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-gray-700">{match.companyId.companyName}</p>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(match.overallScore)}`}>
                                {Number.isInteger(match.overallScore) ? match.overallScore : match.overallScore.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>All matches shown are published and visible to both students and employers on their dashboards</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Stats Panel */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            >
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Matches</p>
                    <p className="text-2xl font-semibold text-[#0B1121]">{stats.totalMatches}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Students Matched</p>
                    <p className="text-2xl font-semibold text-[#0B1121]">{stats.studentsMatched}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jobs Matched</p>
                    <p className="text-2xl font-semibold text-[#0B1121]">{stats.companiesMatched}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Score</p>
                    <p className="text-2xl font-semibold text-[#0B1121]">
                      {Number.isInteger(stats.avgScore) ? stats.avgScore : stats.avgScore.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Proposed Matches List */}
          {proposedMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#0B1121]">
                  Proposed Matches ({proposedMatches.length})
                </h2>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('byStudent')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'byStudent'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    By Student
                  </button>
                  <button
                    onClick={() => setViewMode('byJob')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'byJob'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    By Job
                  </button>
                </div>
              </div>

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-3">
                  {proposedMatches.map((match, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <a
                              href={`/ApplicantProfile?userId=${match.studentId._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {match.studentId.firstName} {match.studentId.lastName}
                            </a>
                            <span className="text-gray-400">→</span>
                            <a
                              href={`/JobListingDashboard?jobId=${match.jobListingId._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {match.jobListingId.roleTitle}
                            </a>
                            <span className="text-xs text-gray-500">
                              @ {match.companyId.companyName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{match.studentId.email}</span>
                            <span>•</span>
                            <span>{match.jobListingId.workLocation || 'Remote'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(match.overallScore)}`}>
                            {Number.isInteger(match.overallScore) ? match.overallScore : match.overallScore.toFixed(1)}%
                          </span>
                          <button
                            onClick={() => toggleDetails(index)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {showDetails[index] ? (
                              <EyeOff className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {showDetails[index] && match.matchFactors && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                            {Object.entries(match.matchFactors).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="font-semibold">{value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Grouped by Student View */}
              {viewMode === 'byStudent' && (
                <div className="space-y-4">
                  {groupByStudent().map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="mb-3">
                        <a
                          href={`/ApplicantProfile?userId=${group.student._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {group.student.firstName} {group.student.lastName}
                        </a>
                        <p className="text-xs text-gray-500">{group.student.email}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {group.matches.length} match{group.matches.length !== 1 ? 'es' : ''}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {group.matches.map((match, matchIndex) => (
                          <div
                            key={matchIndex}
                            className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <a
                                  href={`/JobListingDashboard?jobId=${match.jobListingId._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {match.jobListingId.roleTitle}
                                </a>
                                <p className="text-xs text-gray-500">
                                  @ {match.companyId.companyName} • {match.jobListingId.workLocation || 'Remote'}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(match.overallScore)}`}>
                                {Number.isInteger(match.overallScore) ? match.overallScore : match.overallScore.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Grouped by Job View */}
              {viewMode === 'byJob' && (
                <div className="space-y-4">
                  {groupByJob().map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="mb-3">
                        <a
                          href={`/JobListingDashboard?jobId=${group.job._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {group.job.roleTitle}
                        </a>
                        <p className="text-xs text-gray-500">
                          @ {group.company.companyName} • {group.job.workLocation || 'Remote'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {group.matches.length} match{group.matches.length !== 1 ? 'es' : ''}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {group.matches.map((match, matchIndex) => (
                          <div
                            key={matchIndex}
                            className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <a
                                  href={`/ApplicantProfile?userId=${match.studentId._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {match.studentId.firstName} {match.studentId.lastName}
                                </a>
                                <p className="text-xs text-gray-500">{match.studentId.email}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(match.overallScore)}`}>
                                {Number.isInteger(match.overallScore) ? match.overallScore : match.overallScore.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Empty State */}
          {!isGenerating && proposedMatches.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-12 border border-gray-200 text-center"
            >
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Generated Yet</h3>
              <p className="text-gray-500">
                Configure your matching parameters above and click "Generate Matches" to get started.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
