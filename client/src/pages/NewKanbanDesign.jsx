import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home, ChevronRight, Settings, Users as UsersIcon, User, Plus, MessageCircle, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/navigation/Header";

export default function NewKanbanDesign() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jobListing = {
    title: "Full-Stack Engineer Intern",
    location: "New York, NY",
  };

  // Kanban columns with color-coded data
  const columns = [
    {
      id: "new",
      label: "Assessments In Progress",
      color: "purple",
      total: 8,
      candidates: [
        {
          id: 1,
          name: "Maya Johnson",
          priority: "Important",
          priorityColor: "purple",
          avatars: [{ initials: "MJ", bg: "bg-blue-500" }, { initials: "CR", bg: "bg-orange-500" }],
          comments: 11
        },
        {
          id: 2,
          name: "Carlos Rivera",
          priority: "Meh",
          priorityColor: "gray",
          avatars: [
            { initials: "EC", bg: "bg-green-500" },
            { initials: "JW", bg: "bg-purple-500" },
            { initials: "PP", bg: "bg-pink-500" },
            { initials: "ML", bg: "bg-yellow-500" }
          ],
          comments: 32
        },
        {
          id: 3,
          name: "Emily Chen",
          priority: "OK",
          priorityColor: "yellow",
          avatars: [{ initials: "SM", bg: "bg-indigo-500" }, { initials: "DK", bg: "bg-red-500" }],
          comments: 987
        }
      ]
    },
    {
      id: "assessment",
      label: "Assessments Completed",
      color: "orange",
      total: 2,
      candidates: [
        {
          id: 13,
          name: "Sam Patel",
          priority: "Important",
          priorityColor: "green",
          avatars: [{ initials: "SP", bg: "bg-teal-500" }, { initials: "AK", bg: "bg-amber-500" }],
          comments: 11
        },
        {
          id: 14,
          name: "Aisha Khan",
          priority: "Meh",
          priorityColor: "gray",
          avatars: [
            { initials: "LB", bg: "bg-cyan-500" },
            { initials: "NW", bg: "bg-lime-500" },
            { initials: "TK", bg: "bg-fuchsia-500" },
            { initials: "MD", bg: "bg-rose-500" }
          ],
          comments: 32
        }
      ]
    },
    {
      id: "completed",
      label: "Interviews Scheduled",
      color: "green",
      total: 6,
      candidates: [
        {
          id: 20,
          name: "Riley Brown",
          priority: "Important",
          priorityColor: "purple",
          avatars: [{ initials: "RB", bg: "bg-violet-500" }, { initials: "CW", bg: "bg-emerald-500" }],
          comments: 11
        },
        {
          id: 21,
          name: "Cameron White",
          priority: "High Priority",
          priorityColor: "red",
          avatars: [
            { initials: "TA", bg: "bg-sky-500" },
            { initials: "JD", bg: "bg-orange-500" },
            { initials: "KZ", bg: "bg-green-500" }
          ],
          comments: 1
        },
        {
          id: 22,
          name: "Taylor Anderson",
          priority: "OK",
          priorityColor: "yellow",
          avatars: [{ initials: "RG", bg: "bg-blue-400" }],
          comments: 987
        }
      ]
    }
  ];

  const colorMap = {
    purple: {
      dot: "bg-purple-500",
      button: "bg-purple-500 hover:bg-purple-600",
      badge: "bg-purple-100 text-purple-700"
    },
    orange: {
      dot: "bg-orange-500",
      button: "bg-orange-500 hover:bg-orange-600",
      badge: "bg-orange-100 text-orange-700"
    },
    green: {
      dot: "bg-green-500",
      button: "bg-green-500 hover:bg-green-600",
      badge: "bg-green-100 text-green-700"
    },
    gray: {
      badge: "bg-gray-100 text-gray-700"
    },
    yellow: {
      badge: "bg-yellow-100 text-yellow-700"
    },
    red: {
      badge: "bg-red-100 text-red-700"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header currentPage="EmployerDashboard" />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
            <button onClick={() => navigate("/EmployerDashboard")} className="hover:text-[#0B1121] transition-colors">
              <Home className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4" />
            <button onClick={() => navigate("/EmployerDashboard")} className="hover:text-[#0B1121] transition-colors">
              Job Listings
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0B1121] font-medium">{jobListing.title}</span>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold text-[#0B1121]">
                  {jobListing.title}
                </h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                  Label
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <Settings className="w-5 h-5 text-[#6B7280]" />
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <UsersIcon className="w-5 h-5 text-[#6B7280]" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#0B1121]" />
                </button>
                <Button className="h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                  Export Data
                </Button>
              </div>
            </div>

            {/* View Options and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                <button className="px-4 py-2 text-sm text-[#6B7280] hover:bg-gray-50 rounded-md transition-colors">
                  Grid View
                </button>
                <button className="px-4 py-2 text-sm text-[#0B1121] bg-gray-100 rounded-md font-medium">
                  List View
                </button>
                <button className="px-4 py-2 text-sm text-[#6B7280] hover:bg-gray-50 rounded-md transition-colors">
                  Column View
                </button>
                <button className="px-4 py-2 text-sm text-[#6B7280] hover:bg-gray-50 rounded-md transition-colors">
                  Row View
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-10 px-4 border-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" className="h-10 px-4 border-gray-300">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Kanban Columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-3 gap-6"
          >
            {columns.map((column, idx) => (
              <div key={column.id} className="flex flex-col">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                  {/* Column Header */}
                  <div className="px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${colorMap[column.color].dot}`} />
                        <h3 className="font-semibold text-[#0B1121] text-base">{column.label}</h3>
                      </div>
                      <span className="text-sm text-[#6B7280] font-medium">{column.total} Total</span>
                    </div>
                    <Button
                      className={`w-full h-10 ${colorMap[column.color].button} text-white rounded-lg font-medium shadow-sm`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Task
                    </Button>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 p-4 space-y-3 bg-gray-50/40 overflow-y-auto">
                    {column.candidates.map((candidate) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="mb-3">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${colorMap[candidate.priorityColor]?.badge || colorMap.gray.badge}`}>
                            {candidate.priority}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#0B1121] mb-3">
                          {candidate.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center -space-x-2">
                            {candidate.avatars.map((avatar, i) => (
                              <div
                                key={i}
                                className={`w-7 h-7 rounded-full ${avatar.bg} flex items-center justify-center text-white text-xs font-medium border-2 border-white`}
                              >
                                {avatar.initials}
                              </div>
                            ))}
                            {candidate.avatars.length > 4 && (
                              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                                +{candidate.avatars.length - 4}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[#6B7280]">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">{candidate.comments}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}