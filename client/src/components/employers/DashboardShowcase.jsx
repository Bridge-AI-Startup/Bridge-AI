
import React from "react";
import { motion } from "framer-motion";
import { Calendar, Code, X, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardShowcase() {
  const candidates = [
    {
      name: "Maya Johnson",
      match: 94,
      skills: ["React", "TypeScript", "Design"],
      reason: "Matched for React + teamwork signals",
      insight: "Her React projects and TypeScript expertise align perfectly with your tech stack, plus strong collaboration skills from previous team projects."
    },
    {
      name: "Carlos Rivera",
      match: 91,
      skills: ["Python", "Data Science", "ML"],
      reason: "Strong ML background + startup experience",
      insight: "His machine learning coursework and Python projects match your data science needs. Previous startup internship shows he thrives in fast-paced environments."
    },
    {
      name: "Emily Chen",
      match: 89,
      skills: ["Product", "Figma", "Research"],
      reason: "Product thinking + user research skills",
      insight: "Her design thinking experience and user research projects demonstrate strong product intuition. Figma expertise matches your design workflow."
    }
  ];

  return (
    <div className="relative py-20 px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
            <span className="text-[#0B1121]">Your</span>{" "}
            <span className="text-[#1E3A8A]">employer dashboard</span>
          </h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto font-normal">
            Review matches, request projects, and schedule interviews — all in one place
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200"
        >
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <h3 className="text-3xl font-semibold text-[#0B1121] mb-2">Candidate Matches</h3>
              <p className="text-[#6B7280] font-normal">This week's top matches for your team</p>
            </div>
            <span className="px-4 py-2 bg-blue-50 text-[#1E3A8A] font-semibold rounded-full border border-blue-200">
              3 New Matches
            </span>
          </div>

          <div className="space-y-6">
            {candidates.map((candidate, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h4 className="text-2xl font-semibold text-[#0B1121]">{candidate.name}</h4>
                        <span className="px-4 py-2 bg-[#1E3A8A] text-white font-semibold rounded-full text-sm self-start sm:self-auto">
                          {candidate.match}% Match
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {candidate.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-[#0B1121] rounded-lg text-sm font-normal"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
                        <span className="text-[#0B1121] text-sm font-medium">{candidate.reason}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-200">
                        <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#0B1121] font-semibold mb-1 text-sm">Why this is a great match</p>
                        <p className="text-[#6B7280] text-sm leading-relaxed font-normal">
                          {candidate.insight}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-row gap-3">
                    <Button className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      Interview
                    </Button>
                    <Button className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#0B1121]">
                      <Code className="w-4 h-4 mr-2" />
                      Project
                    </Button>
                    <Button className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#0B1121]">
                      <X className="w-4 h-4 mr-2" />
                      Deny
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
