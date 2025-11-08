
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/navigation/Header";
import { Checkbox } from "@/components/ui/checkbox";
import TableFilters from "../components/candidate-tracking/TableFilters";
import TableRow from "../components/candidate-tracking/TableRow";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Added import for Breadcrumbs

export default function CandidateTrackingSolution2() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const candidates = [
    { id: 1, name: "Maya Johnson", role: "Full-Stack Engineer", stage: "New", match: "94%", applied: "Dec 15", lastActivity: "2h ago" },
    { id: 2, name: "Carlos Rivera", role: "ML Engineer", stage: "New", match: "91%", applied: "Dec 14", lastActivity: "1d ago" },
    { id: 3, name: "Emily Chen", role: "Product Designer", stage: "New", match: "89%", applied: "Dec 13", lastActivity: "2d ago" },
    { id: 4, name: "Alex Park", role: "Full-Stack Engineer", stage: "Interview Scheduled", match: "92%", applied: "Dec 10", lastActivity: "3h ago" },
    { id: 5, name: "Jordan Lee", role: "ML Engineer", stage: "Interview Scheduled", match: "88%", applied: "Dec 9", lastActivity: "5h ago" },
    { id: 6, name: "Sam Patel", role: "Full-Stack Engineer", stage: "Assessment", match: "90%", applied: "Dec 8", lastActivity: "1d ago" },
    { id: 7, name: "Taylor Kim", role: "Product Designer", stage: "Interviewed", match: "93%", applied: "Dec 5", lastActivity: "4d ago" },
    { id: 8, name: "Morgan Davis", role: "Full-Stack Engineer", stage: "Interviewed", match: "87%", applied: "Dec 4", lastActivity: "5d ago" },
    { id: 9, name: "Riley Brown", role: "ML Engineer", stage: "Offer", match: "95%", applied: "Dec 1", lastActivity: "1w ago" }
  ];

  const toggleCandidate = (id) => {
    setSelectedCandidates(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedCandidates(prev =>
      prev.length === candidates.length ? [] : candidates.map(c => c.id)
    );
  };

  const clearSelection = () => {
    setSelectedCandidates([]);
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "All Candidates" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-semibold text-[#0B1121]">
                All Candidates
              </h1>
              <div className="px-4 py-2 bg-gray-100 rounded-xl">
                <span className="text-sm font-semibold text-[#6B7280]">Solution 2: Table View</span>
              </div>
            </div>
            <p className="text-lg text-[#6B7280] font-normal">
              Powerful filtering and bulk actions for high-volume hiring
            </p>
          </motion.div>

          <TableFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            selectedCount={selectedCandidates.length}
            onClearSelection={clearSelection}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <Checkbox
                        checked={selectedCandidates.length === candidates.length}
                        onCheckedChange={toggleAll}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Candidate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Stage</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Match</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Applied</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Last Activity</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0B1121]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {candidates.map((candidate, idx) => (
                    <TableRow
                      key={candidate.id}
                      candidate={candidate}
                      isSelected={selectedCandidates.includes(candidate.id)}
                      onToggle={toggleCandidate}
                      delay={0.3 + idx * 0.05}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl p-8 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-[#0B1121] mb-4">Solution Analysis</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✓ Strengths</h4>
                <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                  <li>• Scales to 100s of candidates</li>
                  <li>• Powerful filtering & sorting</li>
                  <li>• Bulk actions save time</li>
                  <li>• Export data easily</li>
                  <li>• Familiar interface for users</li>
                  <li>• Select all functionality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">✗ Weaknesses</h4>
                <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                  <li>• Less visually engaging</li>
                  <li>• No drag-and-drop</li>
                  <li>• Harder to see stage flow</li>
                  <li>• Feels more "corporate"</li>
                  <li>• Can feel overwhelming initially</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E3A8A] mb-2">→ Best For</h4>
                <ul className="text-sm text-[#6B7280] space-y-1 font-normal">
                  <li>• High-volume hiring</li>
                  <li>• Data-driven teams</li>
                  <li>• Need for reporting/exports</li>
                  <li>• Multiple job listings</li>
                  <li>• Teams comfortable with tables</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
