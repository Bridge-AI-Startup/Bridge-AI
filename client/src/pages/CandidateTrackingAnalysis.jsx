
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Added import for Breadcrumbs
import { Button } from "@/components/ui/button";

export default function CandidateTrackingAnalysis() {
  const navigate = useNavigate();

  const solutions = [
    {
      id: 1,
      name: "Kanban/Pipeline Board",
      route: "/CandidateTrackingSolution1",
      description: "Visual drag-and-drop interface with columns for each stage",
      rating: "8/10",
      bestFor: "Startups with moderate hiring volume (20-50 candidates)",
      pros: [
        "Highly intuitive and visual",
        "Easy to identify bottlenecks at a glance",
        "Fast drag-and-drop status updates",
        "Great for collaborative teams",
        "Clear sense of pipeline flow"
      ],
      cons: [
        "Requires horizontal scrolling on smaller screens",
        "Becomes cluttered with 100+ candidates",
        "Limited filtering and sorting capabilities",
        "Challenging mobile experience",
        "Less effective for data export/reporting"
      ],
      recommendation: "⭐ Recommended if you prioritize visual clarity and expect moderate candidate volume. Perfect for teams familiar with tools like Trello or Asana."
    },
    {
      id: 2,
      name: "Table View with Advanced Filtering",
      route: "/CandidateTrackingSolution2",
      description: "Traditional data table with powerful search, filters, and bulk actions",
      rating: "9/10",
      bestFor: "High-volume hiring or data-driven teams (100+ candidates)",
      pros: [
        "Scales to hundreds of candidates effortlessly",
        "Powerful filtering, sorting, and search",
        "Bulk actions save significant time",
        "Easy data export for reporting",
        "Familiar interface for most users"
      ],
      cons: [
        "Less visually engaging than other solutions",
        "No drag-and-drop functionality",
        "Harder to visualize pipeline flow",
        "Can feel impersonal or 'corporate'",
        "Learning curve for complex filters"
      ],
      recommendation: "⭐⭐⭐ Highly recommended for scale. If you expect high candidate volume or need robust reporting, this is your best option."
    },
    {
      id: 3,
      name: "Grouped Card View",
      route: "/CandidateTrackingSolution3",
      description: "Card-based design with collapsible sections grouped by stage",
      rating: "9/10",
      bestFor: "Most teams - balanced approach for moderate to high volume",
      pros: [
        "Maintains the current familiar card design",
        "Clean, organized by stage",
        "Collapsible sections save space",
        "Mobile-friendly layout",
        "Minimal learning curve for users"
      ],
      cons: [
        "Requires clicking to expand/collapse sections",
        "Less visually immediate than Kanban",
        "Fewer power features than table view",
        "Can become lengthy with many stages",
        "Middle-ground compromise"
      ],
      recommendation: "⭐⭐ Recommended as the balanced solution. Keeps the current UX while adding organization. Best all-around choice for most scenarios."
    }
  ];

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Candidate Tracking Analysis" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Breadcrumbs items={breadcrumbItems} />
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
              Candidate Tracking Solutions
            </h1>
            <p className="text-xl text-[#6B7280] font-normal">
              Analysis of three approaches to managing candidates at scale
            </p>
          </motion.div>

          {/* Executive Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-2xl p-8 text-white mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Executive Summary</h2>
            <div className="space-y-3 text-white/90 font-normal">
              <p>
                <strong className="text-white">Problem:</strong> As candidate volume grows beyond 10-20 matches, the current single-list view becomes difficult to navigate. Employers lose track of which candidates are at which stage, leading to missed follow-ups and disorganized hiring.
              </p>
              <p>
                <strong className="text-white">Our Recommendation:</strong> Implement <strong className="text-white">Solution 3 (Grouped Card View)</strong> as the primary interface, with an optional toggle to <strong className="text-white">Solution 2 (Table View)</strong> for power users who need advanced filtering.
              </p>
              <p>
                <strong className="text-white">Why:</strong> Solution 3 maintains familiarity with the current design while adding critical organization. It scales better than the current approach without overwhelming users. The table view option gives flexibility for high-volume hirers.
              </p>
            </div>
          </motion.div>

          {/* Detailed Solutions */}
          <div className="space-y-6">
            {solutions.map((solution, idx) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">
                      Solution {solution.id}: {solution.name}
                    </h2>
                    <p className="text-[#6B7280] font-normal mb-1">{solution.description}</p>
                    <p className="text-sm text-[#6B7280] font-normal">
                      <strong>Best for:</strong> {solution.bestFor}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(solution.route)}
                    className="flex items-center gap-2 h-10 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl"
                  >
                    View Demo
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                      <span className="text-xl">✓</span> Strengths
                    </h3>
                    <ul className="space-y-2">
                      {solution.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-[#6B7280] font-normal flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                      <span className="text-xl">✗</span> Weaknesses
                    </h3>
                    <ul className="space-y-2">
                      {solution.cons.map((con, i) => (
                        <li key={i} className="text-sm text-[#6B7280] font-normal flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-[#1E3A8A] mb-2">Overall Rating: {solution.rating}</h3>
                  <p className="text-sm text-[#6B7280] font-normal">{solution.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Implementation Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white rounded-2xl p-8 border-2 border-[#1E3A8A]"
          >
            <h2 className="text-2xl font-semibold text-[#0B1121] mb-4">Implementation Recommendation</h2>
            
            <div className="space-y-4 text-[#6B7280] font-normal">
              <div>
                <h3 className="font-semibold text-[#0B1121] mb-2">Phase 1: Launch with Solution 3 (Grouped Cards)</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Minimal disruption to current UX</li>
                  <li>• Easiest to implement and test</li>
                  <li>• Solves the immediate organization problem</li>
                  <li>• Provides clear path for scaling</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#0B1121] mb-2">Phase 2: Add Table View Toggle</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Add toggle button: "Card View" vs "Table View"</li>
                  <li>• Preference saves per user</li>
                  <li>• Gives power users the tools they need</li>
                  <li>• Maintains simplicity for casual users</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#0B1121] mb-2">Future: Consider Kanban Option</h3>
                <ul className="space-y-1 ml-4">
                  <li>• Add as third view option if users request it</li>
                  <li>• Great for visual teams</li>
                  <li>• Lower priority than phases 1-2</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-[#1E3A8A] font-medium">
                <strong>Bottom Line:</strong> Start with Solution 3, add Solution 2 as a toggle, and you'll have a system that works for startups today while scaling to high-volume hiring tomorrow.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
