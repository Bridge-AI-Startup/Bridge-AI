import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  GraduationCap,
  Briefcase,
  Star,
  ChevronDown,
  ChevronUp,
  Trash2,
  Sparkles,
  Save,
  FileText,
  X
} from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { API_URL } from "../config";

export default function AdminMatching() {
  const [students, setStudents] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [ratings, setRatings] = useState({});
  const [pendingRatings, setPendingRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);
  const [showSubsliders, setShowSubsliders] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [hoveredStudent, setHoveredStudent] = useState(null);
  const [hoveredJob, setHoveredJob] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCells, setDraggedCells] = useState(new Set());
  const [dragMode, setDragMode] = useState(null); // 'select' or 'deselect'
  const [selectedForEdit, setSelectedForEdit] = useState(new Set()); // Cells selected for editing
  const [pendingDeletes, setPendingDeletes] = useState(new Set()); // Cells marked for deletion
  const [aiExplanation, setAiExplanation] = useState(null); // AI explanation for current suggestion

  const breadcrumbItems = [
    { label: "Admin", path: "/ReviewAssessments" },
    { label: "Manual Matching" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMatchingData();
  }, []);

  const fetchMatchingData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/admin/matching/data`);
      if (!response.ok) throw new Error('Failed to fetch matching data');

      const data = await response.json();
      if (data.success) {
        setStudents(data.data.students || []);
        setJobListings(data.data.jobListings || []);

        // Initialize ratings from existing matches
        const existingRatings = {};
        if (data.data.matches) {
          data.data.matches.forEach(match => {
            const key = `${match.studentId._id}-${match.jobListingId?._id}`;
            existingRatings[key] = {
              overallScore: match.overallScore,
              matchFactors: match.matchFactors || {}
            };
          });
        }
        setRatings(existingRatings);
      }
    } catch (err) {
      console.error('Error fetching matching data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellClick = (studentId, jobId) => {
    if (isDragging) return; // Don't open panel when dragging

    const key = `${studentId}-${jobId}`;

    // Remove from selectedForEdit when clicked
    if (selectedForEdit.has(key)) {
      const newSelectedForEdit = new Set(selectedForEdit);
      newSelectedForEdit.delete(key);
      setSelectedForEdit(newSelectedForEdit);
    }

    // Clear AI explanation when selecting a new cell
    setAiExplanation(null);

    const currentRating = pendingRatings[key] || ratings[key];
    setSelectedCell({
      studentId,
      jobId,
      key,
      overallScore: currentRating?.overallScore || 50,
      matchFactors: currentRating?.matchFactors || {
        skillsMatch: 50,
        experienceMatch: 50,
        educationMatch: 50,
        culturalFit: 50,
        locationMatch: 50,
        compensationMatch: 50
      }
    });
  };

  const handleRatingChange = (value) => {
    if (!selectedCell) return;
    setSelectedCell({
      ...selectedCell,
      overallScore: value
    });
    updatePendingRating(selectedCell.key, value, selectedCell.matchFactors);
  };

  const handleFactorChange = (factor, value) => {
    if (!selectedCell) return;
    const newFactors = {
      ...selectedCell.matchFactors,
      [factor]: value
    };
    setSelectedCell({
      ...selectedCell,
      matchFactors: newFactors
    });
    updatePendingRating(selectedCell.key, selectedCell.overallScore, newFactors);
  };

  const updatePendingRating = (key, overallScore, matchFactors) => {
    setPendingRatings(prev => ({
      ...prev,
      [key]: { overallScore, matchFactors }
    }));
  };

  const handleDeleteRating = (studentId, jobId) => {
    const key = `${studentId}-${jobId}`;

    // Mark for deletion (will be published later)
    const newPendingDeletes = new Set(pendingDeletes);
    newPendingDeletes.add(key);
    setPendingDeletes(newPendingDeletes);

    // Remove from pending ratings if it was there
    const newPendingRatings = { ...pendingRatings };
    delete newPendingRatings[key];
    setPendingRatings(newPendingRatings);

    if (selectedCell?.key === key) {
      setSelectedCell(null);
    }
  };

  const handlePublishAll = async () => {
    if (Object.keys(pendingRatings).length === 0 && pendingDeletes.size === 0) {
      alert('No pending changes to publish');
      return;
    }

    // Warn if there are selected cells without ratings
    if (selectedForEdit.size > 0) {
      const confirmPublish = window.confirm(
        `Warning: You have ${selectedForEdit.size} cell(s) selected for editing but not yet rated.\n\nDo you want to publish without rating them? (They will be removed from selection)`
      );
      if (!confirmPublish) return;

      // Clear selectedForEdit if user confirms
      setSelectedForEdit(new Set());
    }

    try {
      // Publish new/updated ratings
      if (Object.keys(pendingRatings).length > 0) {
        const ratingsToPublish = Object.entries(pendingRatings).map(([key, rating]) => {
          const [studentId, jobId] = key.split('-');
          const job = jobListings.find(j => j._id === jobId);
          return {
            studentId,
            companyId: job.companyId._id,
            jobListingId: jobId,
            overallScore: rating.overallScore,
            matchFactors: rating.matchFactors,
            adminNotes: "",
            matchReason: "Manual rating via grid interface"
          };
        });

        const response = await fetch(`${API_URL}/api/admin/matching/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matches: ratingsToPublish })
        });

        const data = await response.json();
        if (!data.success) {
          alert(data.message || 'Failed to publish ratings');
          return;
        }
      }

      // Process deletes
      if (pendingDeletes.size > 0) {
        const deletePromises = Array.from(pendingDeletes).map(async (key) => {
          const [studentId, jobId] = key.split('-');
          const job = jobListings.find(j => j._id === jobId);

          // Delete from backend
          const response = await fetch(`${API_URL}/api/admin/matching/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId,
              companyId: job.companyId._id,
              jobListingId: jobId
            })
          });

          return response.json();
        });

        await Promise.all(deletePromises);
      }

      const totalChanges = Object.keys(pendingRatings).length + pendingDeletes.size;
      alert(`Successfully published ${totalChanges} changes!`);

      // Update local state
      setRatings({ ...ratings, ...pendingRatings });
      setPendingRatings({});

      // Remove deleted ratings from state
      const newRatings = { ...ratings };
      pendingDeletes.forEach(key => {
        delete newRatings[key];
      });
      setRatings(newRatings);
      setPendingDeletes(new Set());

      fetchMatchingData();
    } catch (err) {
      console.error('Error publishing changes:', err);
      alert('Failed to publish changes');
    }
  };

  const handleAISuggest = async () => {
    if (!selectedCell) return;

    setIsLoadingAI(true);
    try {
      const student = students.find(s => s._id === selectedCell.studentId);
      const job = jobListings.find(j => j._id === selectedCell.jobId);

      const response = await fetch(`${API_URL}/api/admin/matching/ai-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          job
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedCell({
          ...selectedCell,
          overallScore: data.data.rating.overallScore,
          matchFactors: data.data.rating.matchFactors
        });
        updatePendingRating(
          selectedCell.key,
          data.data.rating.overallScore,
          data.data.rating.matchFactors
        );
        // Store the AI explanation
        setAiExplanation(data.data.rating.explanation || null);
        // Automatically show category sliders when AI generates them
        setShowSubsliders(true);
      } else {
        alert(data.message || 'Failed to get AI suggestion');
      }
    } catch (err) {
      console.error('Error getting AI suggestion:', err);
      alert('Failed to get AI suggestion: ' + err.message);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Drag selection handlers
  const handleCellDragStart = (e, studentId, jobId) => {
    e.preventDefault();
    e.stopPropagation();

    const key = `${studentId}-${jobId}`;
    const hasRating = pendingRatings[key] || ratings[key];

    setIsDragging(true);
    setDragMode(hasRating ? 'deselect' : 'select');

    const newDragged = new Set();
    newDragged.add(key);
    setDraggedCells(newDragged);
  };

  const handleCellDragOver = (e, studentId, jobId) => {
    if (!isDragging) return;
    e.preventDefault();

    const key = `${studentId}-${jobId}`;
    setDraggedCells(prev => {
      const newSet = new Set(prev);
      newSet.add(key);
      return newSet;
    });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    // Apply the drag action to all dragged cells
    if (dragMode === 'select') {
      // Mark cells as selected for editing
      const newSelectedForEdit = new Set(selectedForEdit);
      draggedCells.forEach(key => {
        if (!ratings[key] && !pendingRatings[key]) {
          newSelectedForEdit.add(key);
        }
      });
      setSelectedForEdit(newSelectedForEdit);
    } else if (dragMode === 'deselect') {
      // Mark cells for deletion
      const newPendingDeletes = new Set(pendingDeletes);
      draggedCells.forEach(key => {
        if (ratings[key] || pendingRatings[key]) {
          newPendingDeletes.add(key);
        }
      });
      setPendingDeletes(newPendingDeletes);

      // Remove from pending ratings if they were there
      const newPendingRatings = { ...pendingRatings };
      draggedCells.forEach(key => {
        delete newPendingRatings[key];
      });
      setPendingRatings(newPendingRatings);
    }

    setIsDragging(false);
    setDraggedCells(new Set());
    setDragMode(null);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, draggedCells, dragMode]);

  const getRating = (studentId, jobId) => {
    const key = `${studentId}-${jobId}`;
    return pendingRatings[key] || ratings[key];
  };

  const isPending = (studentId, jobId) => {
    const key = `${studentId}-${jobId}`;
    return key in pendingRatings;
  };

  const getRatingColor = (studentId, jobId) => {
    const rating = getRating(studentId, jobId);
    const score = rating?.overallScore || 0;
    const pending = isPending(studentId, jobId);
    const key = `${studentId}-${jobId}`;
    const isBeingDragged = draggedCells.has(key);
    const isSelectedForEdit = selectedForEdit.has(key);
    const isMarkedForDelete = pendingDeletes.has(key);

    // Show deletion preview during drag or when marked
    if (isMarkedForDelete || (isBeingDragged && dragMode === 'deselect')) {
      return 'bg-red-200 hover:bg-red-300 line-through'; // Preview of deletion
    }

    if (score === 0) {
      if (isSelectedForEdit || (isBeingDragged && dragMode === 'select')) {
        return 'bg-blue-200 hover:bg-blue-300 ring-2 ring-blue-400'; // Waiting for rating
      }
      return 'bg-white hover:bg-gray-50';
    }

    let baseColor = '';
    if (score >= 80) baseColor = 'bg-green-500 hover:bg-green-600';
    else if (score >= 60) baseColor = 'bg-blue-500 hover:bg-blue-600';
    else if (score >= 40) baseColor = 'bg-yellow-500 hover:bg-yellow-600';
    else baseColor = 'bg-red-500 hover:bg-red-600';

    // Add stripes for pending
    if (pending) {
      baseColor += ' bg-stripe-pattern';
    }

    return baseColor;
  };

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="Dashboard" />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading matching data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />

      <style>{`
        .bg-stripe-pattern {
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.2) 10px,
            rgba(255, 255, 255, 0.2) 20px
          );
        }
        .tooltip {
          position: absolute;
          z-index: 1000;
          background: #1e293b;
          color: white;
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          max-width: 300px;
          pointer-events: none;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          border: 1px solid #334155;
        }
        .tooltip::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 20px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid #1e293b;
        }
        .drag-selecting {
          user-select: none;
        }
      `}</style>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[95vw] mx-auto">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-[#0B1121] mb-3">
                Admin: Manual Matching Grid
              </h1>
              <p className="text-lg text-[#6B7280] font-normal">
                Click cells to rate • Drag across cells to select/deselect • Hover for details
              </p>
            </div>
            <a
              href="#rubric"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Rating Rubric
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-2xl font-semibold text-[#0B1121]">{students.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Job Listings</p>
                  <p className="text-2xl font-semibold text-[#0B1121]">{jobListings.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Saved Ratings</p>
                  <p className="text-2xl font-semibold text-[#0B1121]">
                    {Object.keys(ratings).length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Save className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Changes</p>
                  <p className="text-2xl font-semibold text-[#0B1121]">
                    {Object.keys(pendingRatings).length + pendingDeletes.size}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handlePublishAll}
                disabled={Object.keys(pendingRatings).length === 0 && pendingDeletes.size === 0 && selectedForEdit.size === 0}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Save className="w-4 h-4" />
                Publish All ({Object.keys(pendingRatings).length + pendingDeletes.size})
              </button>
            </div>
          </motion.div>

          {/* Batch Actions Panel for Selected Cells */}
          {selectedForEdit.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-300 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold">{selectedForEdit.size}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B1121]">
                      {selectedForEdit.size} cell{selectedForEdit.size !== 1 ? 's' : ''} selected
                    </h3>
                    <p className="text-sm text-gray-600">
                      Click individual cells to rate them, or use batch actions below
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const score = prompt('Enter a score (0-100, decimals allowed) to apply to all selected cells:');
                      if (score !== null && score !== '') {
                        const numScore = parseFloat(score);
                        if (!isNaN(numScore) && numScore >= 0 && numScore <= 100) {
                          const newPendingRatings = { ...pendingRatings };
                          selectedForEdit.forEach(key => {
                            newPendingRatings[key] = {
                              overallScore: numScore,
                              matchFactors: {
                                skillsMatch: numScore,
                                experienceMatch: numScore,
                                educationMatch: numScore,
                                culturalFit: numScore,
                                locationMatch: numScore,
                                compensationMatch: numScore
                              }
                            };
                          });
                          setPendingRatings(newPendingRatings);
                          setSelectedForEdit(new Set());
                        } else {
                          alert('Please enter a number between 0 and 100');
                        }
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Batch Rate All
                  </button>
                  <button
                    onClick={() => {
                      const newPendingDeletes = new Set(pendingDeletes);
                      selectedForEdit.forEach(key => {
                        // Only mark if there's an existing rating
                        if (ratings[key] || pendingRatings[key]) {
                          newPendingDeletes.add(key);
                        }
                      });
                      setPendingDeletes(newPendingDeletes);
                      setSelectedForEdit(new Set());
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Batch Delete All
                  </button>
                  <button
                    onClick={() => setSelectedForEdit(new Set())}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear Selection
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rating Input Panel */}
          {selectedCell && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0B1121]">
                  Set Rating for Selected Match
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAISuggest}
                    disabled={isLoadingAI}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isLoadingAI ? 'Loading...' : 'AI Suggest'}
                  </button>
                  <button
                    onClick={() => handleDeleteRating(selectedCell.studentId, selectedCell.jobId)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCell(null);
                      setAiExplanation(null);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Student: <span className="font-semibold">
                        {students.find(s => s._id === selectedCell.studentId)?.firstName}{' '}
                        {students.find(s => s._id === selectedCell.studentId)?.lastName}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Job: <span className="font-semibold">
                        {jobListings.find(j => j._id === selectedCell.jobId)?.roleTitle}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">Overall Score:</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={selectedCell.overallScore}
                      onChange={(e) => handleRatingChange(Number(e.target.value))}
                      className="w-64"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={selectedCell.overallScore}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0 && val <= 100) {
                          handleRatingChange(val);
                        }
                      }}
                      className="w-20 px-2 py-1 text-lg font-bold text-[#0B1121] border border-gray-300 rounded text-right"
                    />
                  </div>
                </div>

                {/* AI Explanation */}
                {aiExplanation && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-purple-900 mb-1">AI Analysis</p>
                        <p className="text-sm text-gray-700">{aiExplanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Subsliders Toggle */}
                <button
                  onClick={() => setShowSubsliders(!showSubsliders)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  {showSubsliders ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showSubsliders ? 'Hide' : 'Show'} Category Sliders
                </button>

                {/* Category Subsliders */}
                {showSubsliders && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    {Object.entries(selectedCell.matchFactors).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm text-gray-700 mb-1 flex items-center justify-between">
                          <span>{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={value}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val >= 0 && val <= 100) {
                                handleFactorChange(key, val);
                              }
                            }}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-right"
                          />
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.1"
                          value={value}
                          onChange={(e) => handleFactorChange(key, Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Hover Tooltips */}
          {hoveredStudent && (
            <div
              className="tooltip"
              style={{
                position: 'fixed',
                top: `${hoveredStudent.y}px`,
                left: `${hoveredStudent.x}px`,
              }}
            >
              <div className="font-semibold mb-2">{hoveredStudent.data.firstName} {hoveredStudent.data.lastName}</div>
              <div className="space-y-1 text-xs">
                <div><span className="text-gray-400">Email:</span> {hoveredStudent.data.email}</div>
                {hoveredStudent.data.university && (
                  <div><span className="text-gray-400">University:</span> {hoveredStudent.data.university}</div>
                )}
                {hoveredStudent.data.skills && hoveredStudent.data.skills.length > 0 && (
                  <div>
                    <span className="text-gray-400">Skills:</span>{' '}
                    {hoveredStudent.data.skills.slice(0, 5).map(s => s.skillName || s).join(', ')}
                    {hoveredStudent.data.skills.length > 5 && ` +${hoveredStudent.data.skills.length - 5} more`}
                  </div>
                )}
              </div>
            </div>
          )}

          {hoveredJob && (
            <div
              className="tooltip"
              style={{
                position: 'fixed',
                top: `${hoveredJob.y}px`,
                left: `${hoveredJob.x}px`,
              }}
            >
              <div className="font-semibold mb-2">{hoveredJob.data.roleTitle}</div>
              <div className="space-y-1 text-xs">
                <div><span className="text-gray-400">Company:</span> {hoveredJob.data.companyId?.companyName || 'Unknown'}</div>
                {hoveredJob.data.workLocation && (
                  <div><span className="text-gray-400">Location:</span> {hoveredJob.data.workLocation}</div>
                )}
                {hoveredJob.data.requiredSkills && hoveredJob.data.requiredSkills.length > 0 && (
                  <div>
                    <span className="text-gray-400">Required:</span>{' '}
                    {hoveredJob.data.requiredSkills.slice(0, 5).join(', ')}
                    {hoveredJob.data.requiredSkills.length > 5 && ` +${hoveredJob.data.requiredSkills.length - 5} more`}
                  </div>
                )}
                {hoveredJob.data.salaryRange && (
                  <div>
                    <span className="text-gray-400">Salary:</span> ${hoveredJob.data.salaryRange.min?.toLocaleString()} - ${hoveredJob.data.salaryRange.max?.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2D Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`bg-white rounded-2xl p-6 border border-gray-200 overflow-auto ${isDragging ? 'drag-selecting' : ''}`}
          >
            <div className="overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 bg-white border border-gray-300 p-3 min-w-[200px] text-left font-semibold text-sm">
                      Student / Job
                    </th>
                    {jobListings.map((job) => (
                      <th
                        key={job._id}
                        className="border border-gray-300 p-3 min-w-[140px] bg-gray-50 relative"
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredJob({ data: job, x: rect.left, y: rect.bottom + 10 });
                        }}
                        onMouseLeave={() => setHoveredJob(null)}
                      >
                        <div className="text-xs font-semibold text-[#0B1121] mb-1">
                          {job.roleTitle}
                        </div>
                        <div className="text-xs text-gray-600">
                          {job.companyId?.companyName || 'Unknown'}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td
                        className="sticky left-0 z-10 bg-white border border-gray-300 p-3 font-semibold text-sm relative"
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredStudent({ data: student, x: rect.right + 10, y: rect.top });
                        }}
                        onMouseLeave={() => setHoveredStudent(null)}
                      >
                        <div className="text-[#0B1121]">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-gray-600 font-normal">
                          {student.email}
                        </div>
                      </td>
                      {jobListings.map((job) => {
                        const rating = getRating(student._id, job._id);
                        const score = rating?.overallScore || 0;
                        const pending = isPending(student._id, job._id);
                        const isSelected = selectedCell?.studentId === student._id &&
                                         selectedCell?.jobId === job._id;
                        return (
                          <td
                            key={job._id}
                            className="border border-gray-300 p-0"
                          >
                            <button
                              onClick={() => handleCellClick(student._id, job._id)}
                              onMouseDown={(e) => handleCellDragStart(e, student._id, job._id)}
                              onMouseEnter={(e) => handleCellDragOver(e, student._id, job._id)}
                              className={`
                                w-full h-full min-h-[80px] flex items-center justify-center
                                transition-all duration-200 cursor-pointer
                                ${getRatingColor(student._id, job._id)}
                                ${isSelected ? 'ring-4 ring-blue-400 ring-offset-2' : ''}
                                ${score > 0 ? 'text-white font-bold' : 'text-gray-400'}
                              `}
                              title={`${pending ? 'PENDING: ' : ''}Click to rate • Drag to select/deselect multiple • ${student.firstName} ${student.lastName} - ${job.roleTitle}`}
                            >
                              <div className="text-center">
                                <div className="text-2xl">
                                  {score > 0 ? (Number.isInteger(score) ? score : score.toFixed(1)) : '-'}
                                </div>
                                {score > 0 && (
                                  <div className="text-xs opacity-80">
                                    {pending && '⏳ '}
                                    {score >= 80 ? 'Excellent' :
                                     score >= 60 ? 'Good' :
                                     score >= 40 ? 'Fair' : 'Poor'}
                                  </div>
                                )}
                              </div>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mt-6"
          >
            <h3 className="text-sm font-semibold text-[#0B1121] mb-3">Rating Legend</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded"></div>
                <span className="text-sm">80-100: Excellent Match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                <span className="text-sm">60-79: Good Match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                <span className="text-sm">40-59: Fair Match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
                <span className="text-sm">1-39: Poor Match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded"></div>
                <span className="text-sm">0: Not Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 bg-stripe-pattern rounded"></div>
                <span className="text-sm">⏳ Pending (not yet published)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-200 rounded ring-2 ring-blue-400"></div>
                <span className="text-sm">Selected for editing (click to rate)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-200 rounded line-through flex items-center justify-center text-xs">Del</div>
                <span className="text-sm">Marked for deletion</span>
              </div>
            </div>
          </motion.div>

          {/* Rubric Section */}
          <motion.div
            id="rubric"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 mt-6"
          >
            <h2 className="text-2xl font-semibold text-[#0B1121] mb-6">Student-Job Match Rating Rubric</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0B1121] mb-3">Overall Score Guidelines</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3">
                    <span className="font-semibold text-green-600 w-24">90-100:</span>
                    <span>Perfect match. Student exceeds all requirements with strong alignment on skills, experience, and culture.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-semibold text-green-600 w-24">80-89:</span>
                    <span>Excellent match. Student meets all key requirements with minor gaps that can be easily bridged.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-semibold text-blue-600 w-24">70-79:</span>
                    <span>Very good match. Student meets most requirements with some training needed in specific areas.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-semibold text-blue-600 w-24">60-69:</span>
                    <span>Good match. Student has foundational skills but needs development in several key areas.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-semibold text-yellow-600 w-24">50-59:</span>
                    <span>Fair match. Student shows potential but has noticeable gaps in experience or skills.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-semibold text-yellow-600 w-24">40-49:</span>
                    <span>Below average match. Significant training required, consider only if other factors are exceptional.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-semibold text-red-600 w-24">Below 40:</span>
                    <span>Poor match. Major misalignment on critical requirements. Not recommended unless special circumstances.</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-[#0B1121] mb-3">Category Breakdown</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#0B1121] mb-2">Skills Match (Technical Alignment)</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                      <li>Does the student have the required technical skills?</li>
                      <li>How closely do their skills align with the job description?</li>
                      <li>Consider programming languages, frameworks, tools, and methodologies</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#0B1121] mb-2">Experience Match (Level & Domain)</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                      <li>Does their experience level match the role (entry/mid/senior)?</li>
                      <li>Have they worked in similar industries or domains?</li>
                      <li>Do they have relevant project or internship experience?</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#0B1121] mb-2">Education Match (Academic Background)</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                      <li>Does their degree/major align with the role?</li>
                      <li>Do they meet any specific educational requirements?</li>
                      <li>Consider relevant coursework and academic achievements</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#0B1121] mb-2">Cultural Fit (Values & Work Style)</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                      <li>Do their values align with the company culture?</li>
                      <li>Does their work style match team dynamics?</li>
                      <li>Consider communication style, collaboration preferences, and career goals</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#0B1121] mb-2">Location Match (Geographic Alignment)</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                      <li>Are they in the right location or willing to relocate?</li>
                      <li>For remote roles: timezone compatibility</li>
                      <li>Consider visa/work authorization requirements</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#0B1121] mb-2">Compensation Match (Salary Expectations)</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                      <li>Do their salary expectations align with the budget?</li>
                      <li>Are they flexible on compensation?</li>
                      <li>Consider total compensation package (equity, benefits, etc.)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[#0B1121] mb-2">Best Practices</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                  <li>Use the AI suggestion as a starting point, then adjust based on your expertise</li>
                  <li>Focus on potential and growth trajectory, not just current state</li>
                  <li>Consider the whole candidate profile, not just one category</li>
                  <li>Be consistent in your rating methodology across all matches</li>
                  <li>Use pending mode to batch your changes before publishing</li>
                  <li><strong>Drag across empty cells</strong> to mark them for editing (they turn blue with ring)</li>
                  <li><strong>Click blue-ringed cells</strong> to open rating panel and set your score</li>
                  <li><strong>Drag across filled cells</strong> to mark them for deletion (they turn red)</li>
                  <li><strong>All changes are pending</strong> until you click "Publish All"</li>
                  <li>Hover over students and jobs to see detailed information</li>
                  <li>Deleted ratings stay visible until published, allowing you to undo mistakes</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
