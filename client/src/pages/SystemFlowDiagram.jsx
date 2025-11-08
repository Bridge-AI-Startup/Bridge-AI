
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import Header from "../components/navigation/Header";

export default function SystemFlowDiagram() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const PageBox = ({ children, color = "blue", className = "" }) => (
    <div className={`bg-white border-2 rounded-xl px-4 py-3 text-center font-medium text-sm shadow-sm ${className}`}
         style={{ borderColor: color === "blue" ? "#3B82F6" : color === "green" ? "#10B981" : "#9CA3AF" }}>
      {children}
    </div>
  );

  const Arrow = ({ direction = "down" }) => (
    <div className="flex items-center justify-center py-2">
      {direction === "down" ? (
        <ArrowDown className="w-5 h-5 text-gray-400" />
      ) : (
        <ArrowRight className="w-5 h-5 text-gray-400" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="SystemFlowDiagram" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-4">
              Bridge Platform Flow
            </h1>
            <p className="text-lg text-[#6B7280] font-normal mb-6">
              Complete page flow for students and employers
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-blue-500"></div>
                <span className="text-sm text-[#6B7280]">Student Pages (Built)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-green-500"></div>
                <span className="text-sm text-[#6B7280]">Employer Pages (Built)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-gray-400 border-dashed"></div>
                <span className="text-sm text-[#6B7280]">To Be Built</span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Student Journey */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-[#0B1121] mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Student Journey
                  </h2>
                </div>

                <div className="space-y-0">
                  <PageBox color="blue">Home Landing Page</PageBox>
                  <Arrow />
                  <PageBox color="blue">Student Signup</PageBox>
                  <Arrow />
                  <PageBox color="blue">Student Sign In</PageBox>
                  <Arrow />
                  <PageBox color="blue">Student Onboarding</PageBox>
                  <Arrow />
                  <PageBox color="blue">Onboarding Parse (AI)</PageBox>
                  <Arrow />
                  <PageBox color="blue">Add Projects</PageBox>
                  <Arrow />
                  <PageBox color="blue">Projects Parse (AI)</PageBox>
                  <Arrow />
                  <PageBox color="blue">Company Preferences</PageBox>
                  <Arrow />
                  <PageBox color="blue">Preferences Parse (AI)</PageBox>
                  <Arrow />
                  <PageBox color="blue">Student Dashboard</PageBox>
                  
                  {/* Branch from Dashboard */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div>
                      <Arrow />
                      <PageBox color="blue" className="text-xs">Student Profile</PageBox>
                    </div>
                    <div>
                      <Arrow />
                      <PageBox color="blue" className="text-xs">Book Interview</PageBox>
                      <Arrow />
                      <PageBox color="gray" className="text-xs">Interview Confirmation</PageBox>
                      <Arrow />
                      <PageBox color="gray" className="text-xs">Video Interview</PageBox>
                      <Arrow />
                      <PageBox color="gray" className="text-xs">Interview Results</PageBox>
                    </div>
                    <div>
                      <Arrow />
                      <PageBox color="blue" className="text-xs">Start Assessment</PageBox>
                      <Arrow />
                      <PageBox color="blue" className="text-xs">Take Assessment</PageBox>
                      <Arrow />
                      <PageBox color="gray" className="text-xs">Submission Tracking</PageBox>
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs font-semibold text-[#6B7280] mb-3">TO BE BUILT</p>
                    <div className="grid grid-cols-2 gap-2">
                      <PageBox color="gray" className="text-xs py-2">Messaging Center</PageBox>
                      <PageBox color="gray" className="text-xs py-2">Notifications</PageBox>
                      <PageBox color="gray" className="text-xs py-2">Offer Management</PageBox>
                      <PageBox color="gray" className="text-xs py-2">Settings</PageBox>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Employer Journey */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-[#0B1121] mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Employer Journey
                  </h2>
                </div>

                <div className="space-y-0">
                  <PageBox color="green">Employers Landing Page</PageBox>
                  <Arrow />
                  <PageBox color="green">Employer Signup</PageBox>
                  
                  {/* Branch: First member vs Invited */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-center">
                      <Arrow />
                      <div className="text-xs text-[#6B7280] mb-2">If First</div>
                      <PageBox color="green" className="text-xs">Company Onboarding</PageBox>
                    </div>
                    <div className="text-center">
                      <Arrow />
                      <div className="text-xs text-[#6B7280] mb-2">If Invited</div>
                      <div className="h-16 flex items-end">
                        <div className="w-full border-l-2 border-gray-300 h-8"></div>
                      </div>
                    </div>
                  </div>

                  <Arrow />
                  <PageBox color="green">Employer Sign In</PageBox>
                  <Arrow />
                  <PageBox color="green">Employer Dashboard</PageBox>
                  
                  {/* Branch from Dashboard */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div>
                      <Arrow />
                      <PageBox color="green" className="text-xs">Employer Profile</PageBox>
                    </div>
                    <div>
                      <Arrow />
                      <PageBox color="green" className="text-xs">Team Members</PageBox>
                    </div>
                    <div>
                      <Arrow />
                      <PageBox color="green" className="text-xs">Create Listing</PageBox>
                      <Arrow />
                      <PageBox color="green" className="text-xs">Job Analysis (AI)</PageBox>
                    </div>
                  </div>

                  <Arrow />
                  <PageBox color="green">Edit Listing</PageBox>
                  <Arrow />
                  <PageBox color="green">Job Listing Dashboard</PageBox>
                  
                  {/* Actions from Job Dashboard */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div>
                      <Arrow />
                      <PageBox color="green" className="text-xs">Applicant Profile</PageBox>
                    </div>
                    <div>
                      <Arrow />
                      <PageBox color="green" className="text-xs">Schedule Interview</PageBox>
                      <Arrow />
                      <PageBox color="gray" className="text-xs">Interview Room</PageBox>
                    </div>
                    <div>
                      <Arrow />
                      <PageBox color="green" className="text-xs">Assign Project</PageBox>
                      <Arrow />
                      <PageBox color="gray" className="text-xs">Review Assessment</PageBox>
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs font-semibold text-[#6B7280] mb-3">TO BE BUILT</p>
                    <div className="grid grid-cols-2 gap-2">
                      <PageBox color="gray" className="text-xs py-2">Messaging Center</PageBox>
                      <PageBox color="gray" className="text-xs py-2">Notifications</PageBox>
                      <PageBox color="gray" className="text-xs py-2">Offer Creation</PageBox>
                      <PageBox color="gray" className="text-xs py-2">Analytics</PageBox>
                      <PageBox color="gray" className="text-xs py-2">Candidate Scoring</PageBox>
                      <PageBox color="gray" className="text-xs py-2">Recording Playback</PageBox>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Shared Platform Infrastructure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-[#0B1121] mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  Shared Platform Features (To Be Built)
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <PageBox color="gray" className="text-xs py-2">Real-time Messaging</PageBox>
                <PageBox color="gray" className="text-xs py-2">Calendar Integration</PageBox>
                <PageBox color="gray" className="text-xs py-2">Email Notifications</PageBox>
                <PageBox color="gray" className="text-xs py-2">SMS Reminders</PageBox>
                <PageBox color="gray" className="text-xs py-2">Video Infrastructure</PageBox>
                <PageBox color="gray" className="text-xs py-2">File Storage</PageBox>
                <PageBox color="gray" className="text-xs py-2">Payment Processing</PageBox>
                <PageBox color="gray" className="text-xs py-2">Admin Panel</PageBox>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
