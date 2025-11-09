import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Calendar, X } from "lucide-react";
import Header from "../components/navigation/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StudentNewMatches() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const matches = [
    { id: 1, company: "Nova Robotics", role: "Data Science Intern", location: "San Diego, CA", match: "94%", date: "Dec 15", logo: "nova" },
    { id: 2, company: "Seedify Labs", role: "Product Intern", location: "Remote", match: "89%", date: "Dec 15", logo: "seedify" }
  ];

  const CompanyLogo = ({ type }) => {
    const logos = {
      nova: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white rounded-full" />
        </div>
      ),
      seedify: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#059669] to-[#10B981] flex items-center justify-center">
          <div className="relative">
            <div className="w-1.5 h-4 bg-white rounded-full" />
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full" />
          </div>
        </div>
      )
    };
    return logos[type] || logos.nova;
  };

  const filteredMatches = matches.filter(match =>
    match.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.role.toLowerCase().includes(searchQuery.toLowerCase())
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
              New Matches
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Companies that match your profile and preferences
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Matched On</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0B1121]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMatches.map((match, idx) => (
                    <motion.tr
                      key={match.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      onClick={() => navigate("/JobAnalysis")}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CompanyLogo type={match.logo} />
                          <span className="font-semibold text-[#0B1121]">{match.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{match.role}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{match.location}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#1E3A8A] text-white text-xs font-semibold rounded-full">
                          {match.match}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{match.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/BookInterview");
                            }}
                            size="sm"
                            className="h-9 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            Book
                          </Button>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            variant="outline"
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
        </div>
      </div>
    </div>
  );
}