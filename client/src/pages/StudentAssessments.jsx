import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Code, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Header from "../components/navigation/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentAssessments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const assessments = [
    { 
      id: 3, 
      company: "TechFlow", 
      role: "Backend Engineer Intern", 
      location: "Austin, TX", 
      match: "91%", 
      dueDate: "Dec 20", 
      status: "pending",
      logo: "techflow"
    }
  ];

  const CompanyLogo = ({ type }) => {
    const logos = {
      techflow: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#FB923C] flex items-center justify-center">
          <Code className="w-5 h-5 text-white" />
        </div>
      )
    };
    return logos[type] || logos.techflow;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              Assessments
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              View and complete your technical assessments
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by company or role..."
                  className="h-12 pl-12 rounded-xl"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[200px] h-12 rounded-xl">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Due Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0B1121]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAssessments.map((assessment, idx) => (
                    <motion.tr
                      key={assessment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CompanyLogo type={assessment.logo} />
                          <span className="font-semibold text-[#0B1121]">{assessment.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{assessment.role}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{assessment.location}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#1E3A8A] text-white text-xs font-semibold rounded-full">
                          {assessment.match}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{assessment.dueDate}</td>
                      <td className="px-6 py-4">{getStatusBadge(assessment.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {assessment.status === "pending" && (
                            <Button
                              onClick={() => navigate("/StartAssessment")}
                              size="sm"
                              className="h-9 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                            >
                              <Code className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {assessment.status === "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9"
                            >
                              View Submission
                            </Button>
                          )}
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