
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, FileCheck, CheckCircle2, Award, Sparkles, Maximize2, Minimize2, Mail, X } from "lucide-react";
import Header from "../components/navigation/Header";
import { Button } from "@/components/ui/button";
import StatsOverview from "../components/candidate-tracking/StatsOverview";
import SectionCard from "../components/candidate-tracking/SectionCard";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Changed import for Breadcrumbs

// Smart Grouped Card View Solution
export default function CandidateTrackingSolution3() {
  const navigate = useNavigate();
  const sectionRefs = useRef({});
  
  // Auto-expand sections with activity (new matches, upcoming interviews, pending assessments)
  const [expandedSections, setExpandedSections] = useState(["new", "interview-scheduled", "assessment"]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  // Reordered by priority: interviewed, assessment complete, new match, interview scheduled, assessment in progress
  const sections = [
    {
      id: "interviewed",
      label: "Interviewed",
      icon: CheckCircle2,
      color: "green",
      count: 2,
      hasActivity: true,
      priority: 1,
      candidates: [
        { 
          id: 7, 
          name: "Taylor Kim", 
          role: "Product Designer Intern", 
          match: "93%", 
          completedDate: "Dec 12",
          insight: "Excellent design thinking and problem-solving skills demonstrated",
          skills: ["Figma", "Design Systems", "UX Research", "Prototyping"]
        },
        { 
          id: 8, 
          name: "Morgan Davis", 
          role: "Full-Stack Engineer Intern", 
          match: "87%", 
          completedDate: "Dec 11",
          insight: "Strong technical skills with great communication",
          skills: ["React", "TypeScript", "GraphQL", "PostgreSQL"]
        }
      ]
    },
    {
      id: "assessment-complete",
      label: "Assessment Complete",
      icon: Award,
      color: "purple",
      count: 1,
      hasActivity: true,
      priority: 2,
      candidates: [
        { 
          id: 10, 
          name: "Casey Martinez", 
          role: "Full-Stack Engineer Intern", 
          match: "91%", 
          completedDate: "Dec 14",
          insight: "Submitted high-quality code with excellent documentation",
          skills: ["React", "Node.js", "MongoDB", "Docker"]
        }
      ]
    },
    {
      id: "new",
      label: "New Matches",
      icon: Sparkles,
      color: "blue",
      count: 3,
      hasActivity: true,
      priority: 3,
      candidates: [
        { 
          id: 1, 
          name: "Maya Johnson", 
          role: "Full-Stack Engineer Intern", 
          match: "94%", 
          date: "Matched Dec 15",
          insight: "Strong React + teamwork signals from university projects",
          skills: ["React", "TypeScript", "Node.js", "AWS"]
        },
        { 
          id: 2, 
          name: "Carlos Rivera", 
          role: "ML Engineer Intern", 
          match: "91%", 
          date: "Matched Dec 14",
          insight: "ML background with startup experience and research publications",
          skills: ["Python", "TensorFlow", "PyTorch", "ML"]
        },
        { 
          id: 3, 
          name: "Emily Chen", 
          role: "Product Designer Intern", 
          match: "89%", 
          date: "Matched Dec 13",
          insight: "Product thinking + user research experience from internships",
          skills: ["Figma", "User Research", "Design", "Prototyping"]
        }
      ]
    },
    {
      id: "interview-scheduled",
      label: "Interview Scheduled",
      icon: Calendar,
      color: "yellow",
      count: 2,
      hasActivity: true,
      priority: 4,
      candidates: [
        { 
          id: 4, 
          name: "Alex Park", 
          role: "Full-Stack Engineer Intern", 
          match: "92%", 
          date: "Dec 18, 2:00 PM",
          insight: "Full-stack experience with strong system design knowledge",
          skills: ["React", "Python", "AWS", "Docker"]
        },
        { 
          id: 5, 
          name: "Jordan Lee", 
          role: "ML Engineer Intern", 
          match: "88%", 
          date: "Dec 19, 10:00 AM",
          insight: "Data science background with industry project experience",
          skills: ["Python", "Data Science", "ML", "Statistics"]
        }
      ]
    },
    {
      id: "assessment",
      label: "Assessment in Progress",
      icon: FileCheck,
      color: "pink",
      count: 1,
      hasActivity: true,
      priority: 5,
      candidates: [
        { 
          id: 6, 
          name: "Sam Patel", 
          role: "Full-Stack Engineer Intern", 
          match: "90%", 
          dueDate: "Dec 20",
          insight: "Strong algorithmic thinking and clean coding practices",
          skills: ["React", "Node.js", "PostgreSQL", "REST APIs"]
        }
      ]
    }
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-500" },
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", dot: "bg-yellow-500" },
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500" },
    pink: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", dot: "bg-pink-500" }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const scrollToSection = (sectionId) => {
    if (!expandedSections.includes(sectionId)) {
      setExpandedSections(prev => [...prev, sectionId]);
    }
    
    setTimeout(() => {
      sectionRefs.current[sectionId]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }, 100);
  };

  const expandAll = () => {
    setExpandedSections(sections.map(s => s.id));
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  const toggleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const toggleSelectAll = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const sectionCandidateIds = section.candidates.map(c => c.id);
    const allSelected = sectionCandidateIds.every(id => selectedCandidates.includes(id));

    if (allSelected) {
      setSelectedCandidates(prev => prev.filter(id => !sectionCandidateIds.includes(id)));
    } else {
      setSelectedCandidates(prev => [...new Set([...prev, ...sectionCandidateIds])]);
    }
  };

  const clearSelection = () => {
    setSelectedCandidates([]);
  };

  const handleBulkScheduleInterview = () => {
    console.log("Bulk schedule interview for:", selectedCandidates);
    // Navigate or show modal
  };

  const handleBulkAssignProject = () => {
    console.log("Bulk assign project for:", selectedCandidates);
    // Navigate or show modal
  };

  const handleBulkPass = () => {
    if (window.confirm(`Pass on ${selectedCandidates.length} selected candidates?`)) {
      console.log("Bulk pass on:", selectedCandidates);
      setSelectedCandidates([]);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "/EmployerDashboard" }, // Added leading slash for path
    { label: "Candidate Pipeline" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-4xl font-semibold text-[#0B1121]">
                  Candidate Pipeline
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-4 py-2 bg-gray-100 rounded-xl">
                    <span className="text-sm font-semibold text-[#6B7280]">Solution 3: Grouped Cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={expandAll}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs rounded-lg hover:bg-gray-100"
                    >
                      <Maximize2 className="w-3 h-3 mr-1" />
                      Expand All
                    </Button>
                    <Button
                      onClick={collapseAll}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs rounded-lg hover:bg-gray-100"
                    >
                      <Minimize2 className="w-3 h-3 mr-1" />
                      Collapse All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg text-[#6B7280] font-normal mt-4">
              Organized card view with smart grouping - sections with activity auto-expand
            </p>
          </motion.div>

          {/* Bulk Actions Bar */}
          {selectedCandidates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1E3A8A] rounded-2xl p-4 mb-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">
                  {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''} selected
                </span>
                <Button
                  onClick={clearSelection}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-white hover:bg-white/20"
                >
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleBulkScheduleInterview}
                  variant="ghost"
                  size="sm"
                  className="h-9 bg-white/20 text-white hover:bg-white/30"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interviews
                </Button>
                <Button
                  onClick={handleBulkAssignProject}
                  variant="ghost"
                  size="sm"
                  className="h-9 bg-white/20 text-white hover:bg-white/30"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Assign Projects
                </Button>
                <Button
                  onClick={handleBulkPass}
                  variant="ghost"
                  size="sm"
                  className="h-9 bg-white/20 text-white hover:bg-red-500/90"
                >
                  <X className="w-4 h-4 mr-2" />
                  Pass
                </Button>
              </div>
            </motion.div>
          )}

          {/* Stats Overview */}
          <StatsOverview
            sections={sections}
            colorClasses={colorClasses}
            onSectionClick={scrollToSection}
          />

          {/* Grouped Sections */}
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <SectionCard
                key={section.id}
                section={section}
                isExpanded={expandedSections.includes(section.id)}
                onToggle={() => toggleSection(section.id)}
                colorClasses={colorClasses}
                sectionRef={(el) => (sectionRefs.current[section.id] = el)}
                delay={0.2 + idx * 0.1}
                selectedCandidates={selectedCandidates}
                onToggleSelect={toggleSelectCandidate}
                onToggleSelectAll={toggleSelectAll}
              />
            ))}
          </div>

          {/* Analysis Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-white rounded-2xl p-8 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-[#0B1121] mb-4">Solution Analysis (Improved)</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✓ Improvements</h4>
                <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                  <li>• Auto-expand active sections</li>
                  <li>• Expand/Collapse all buttons</li>
                  <li>• Clickable stat cards to scroll</li>
                  <li>• Mini preview when collapsed</li>
                  <li>• Smoother animations</li>
                  <li>• Multi-select with bulk actions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">💡 Smart Features</h4>
                <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                  <li>• Sections with activity auto-open</li>
                  <li>• Quick overview mode available</li>
                  <li>• Hover states for feedback</li>
                  <li>• Persistent expand/collapse state</li>
                  <li>• Select all per section</li>
                  <li>• Bulk scheduling & assignment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E3A8A] mb-2">→ User Experience</h4>
                <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                  <li>• Less clicking required</li>
                  <li>• Important sections always visible</li>
                  <li>• Quick overview mode available</li>
                  <li>• Smooth, predictable interactions</li>
                  <li>• Clear visual hierarchy</li>
                  <li>• Efficient bulk operations</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
