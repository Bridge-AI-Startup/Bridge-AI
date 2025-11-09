import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Award, CheckCircle, XCircle, Clock } from "lucide-react";
import Header from "../components/navigation/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentOffers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const offers = [];

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            <Clock className="w-3 h-3" />
            Pending Decision
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            <CheckCircle className="w-3 h-3" />
            Accepted
          </span>
        );
      case "declined":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter;
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
              Offers
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              View and manage your job offers
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
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
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
            {filteredOffers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#0B1121] mb-2">No offers yet</h3>
                <p className="text-[#6B7280] font-normal">
                  Keep applying and interviewing - your offers will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Salary</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Expires</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[#0B1121]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOffers.map((offer, idx) => (
                      <motion.tr
                        key={offer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-semibold text-[#0B1121]">{offer.company}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{offer.role}</td>
                        <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{offer.location}</td>
                        <td className="px-6 py-4 text-sm text-[#0B1121] font-semibold">{offer.salary}</td>
                        <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{offer.expiresOn}</td>
                        <td className="px-6 py-4">{getStatusBadge(offer.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {offer.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-9 bg-green-600 hover:bg-green-700"
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  Decline
                                </Button>
                              </>
                            )}
                            {offer.status !== "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9"
                              >
                                View Details
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}