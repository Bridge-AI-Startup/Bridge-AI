import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Calendar, Video } from "lucide-react";
import Header from "../components/navigation/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StudentInterviews() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const interviews = [
    { id: 4, company: "CloudStream", role: "Backend Engineer Intern", location: "San Francisco, CA", match: "87%", date: "Nov 25, 2pm", logo: "cloudstream" }
  ];

  const CompanyLogo = ({ type }) => {
    const logos = {
      cloudstream: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 bg-white rounded-full h-3" />
            <div className="w-0.5 bg-white rounded-full h-5" />
            <div className="w-0.5 bg-white rounded-full h-2.5" />
            <div className="w-0.5 bg-white rounded-full h-4" />
          </div>
        </div>
      )
    };
    return logos[type] || logos.cloudstream;
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interview.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="StudentDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/StudentPipeline")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#0B1121] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-normal">Back to Pipeline</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
              Scheduled Interviews
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Upcoming interviews with companies
            </p>
          </motion.div>

          {/* Search */}
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
                placeholder="Search by company or role..."
                className="h-12 pl-12 rounded-xl"
              />
            </div>
          </motion.div>

          {/* Table */}
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Match</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Interview Time</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0B1121]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInterviews.map((interview, idx) => (
                    <motion.tr
                      key={interview.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CompanyLogo type={interview.logo} />
                          <span className="font-semibold text-[#0B1121]">{interview.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{interview.role}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{interview.location}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#1E3A8A] text-white text-xs font-semibold rounded-full">
                          {interview.match}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          {interview.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="h-9 bg-purple-600 hover:bg-purple-700"
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9"
                          >
                            Reschedule
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}