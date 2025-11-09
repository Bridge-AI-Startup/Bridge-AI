import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, CheckCircle, TrendingUp } from "lucide-react";
import Header from "../components/navigation/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StudentInterviewed() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const interviewed = [
    { id: 5, company: "DataFlow", role: "ML Engineer Intern", location: "Boston, MA", match: "85%", date: "Completed Oct 5", logo: "dataflow" }
  ];

  const CompanyLogo = ({ type }) => {
    const logos = {
      dataflow: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#DC2626] to-[#F87171] flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
      )
    };
    return logos[type] || logos.dataflow;
  };

  const filteredInterviewed = interviewed.filter(item =>
    item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role.toLowerCase().includes(searchQuery.toLowerCase())
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
              Completed Interviews
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Interviews you've completed - waiting for next steps
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Completed</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0B1121]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInterviewed.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CompanyLogo type={item.logo} />
                          <span className="font-semibold text-[#0B1121]">{item.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{item.role}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{item.location}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#1E3A8A] text-white text-xs font-semibold rounded-full">
                          {item.match}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                          <CheckCircle className="w-3 h-3" />
                          Interview Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{item.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9"
                          >
                            View Details
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