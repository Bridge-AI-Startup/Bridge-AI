import React from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, CheckCircle2, Sparkles, X, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardMockup() {
  const CompanyLogo = ({ type }) => {
    const logos = {
      nova: (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white rounded-full" />
            <div className="absolute w-3 h-3 bg-white rounded-full" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
          </div>
        </div>
      ),
      seedify: (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#059669] to-[#10B981] flex items-center justify-center">
          <div className="relative">
            <div className="w-3 h-6 bg-white rounded-full" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
      ),
      cloudstream: (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center relative">
          <div className="flex gap-0.5">
            <div className="w-1.5 bg-white rounded-full" style={{ height: '20px' }} />
            <div className="w-1.5 bg-white rounded-full" style={{ height: '28px' }} />
            <div className="w-1.5 bg-white rounded-full" style={{ height: '16px' }} />
            <div className="w-1.5 bg-white rounded-full" style={{ height: '24px' }} />
          </div>
        </div>
      )
    };
    return logos[type];
  };

  return (
    <div className="relative py-16 md:py-20 px-4 md:px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-4 md:mb-6 tracking-tight px-4">
            <span className="text-[#0B1121]">Your personalized</span>{" "}
            <span className="text-[#1E3A8A]">Bridge matching dashboard</span>
          </h2>
          <p className="text-base md:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed px-4 font-normal">
            Track your matches, schedule interviews, and monitor your progress — all in one beautiful interface.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main dashboard mockup */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-gray-200">
            {/* Dashboard header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-200 gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#0B1121] mb-1 md:mb-2">
                  Welcome back, Saaz
                </h3>
                <p className="text-sm md:text-base text-[#6B7280] font-normal">
                  You have 3 new matches this week
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
              {[
                { label: "Matches", value: "3", icon: TrendingUp },
                { label: "Interviews Booked", value: "1", icon: Calendar },
                { label: "Projects Completed", value: "1", icon: CheckCircle2 }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-200"
                >
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4 bg-gray-100">
                    <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-[#0B1121]" />
                  </div>
                  <p className="text-[#6B7280] text-xs md:text-sm mb-1 font-normal">{stat.label}</p>
                  <p className="text-xl md:text-3xl font-semibold text-[#0B1121]">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Match cards list */}
            <div className="space-y-4 md:space-y-6">
              {[
                {
                  company: "Nova Robotics",
                  role: "Data Science Intern",
                  location: "San Diego, CA",
                  match: "94%",
                  description: "Building autonomous systems for warehouse logistics. Looking for a data science intern to optimize ML models.",
                  skills: ["Python", "TensorFlow", "Data Analysis", "Machine Learning", "Statistics"],
                  insight: "Your machine learning coursework and Python projects align perfectly with their tech stack.",
                  logo: "nova",
                  actionType: "interview"
                },
                {
                  company: "Seedify Labs",
                  role: "Product Intern",
                  location: "Remote",
                  match: "89%",
                  description: "Early-stage fintech startup revolutionizing investment tools. Need a product intern to help shape our roadmap.",
                  skills: ["React", "Figma", "Product Strategy", "User Research"],
                  insight: "Your React projects and design thinking experience make you a strong fit for their product team.",
                  logo: "seedify",
                  actionType: "assessment"
                },
                {
                  company: "CloudStream",
                  role: "Backend Engineer Intern",
                  location: "San Francisco, CA",
                  match: "87%",
                  description: "Real-time streaming platform serving millions of users. Looking for backend engineers passionate about scale.",
                  skills: ["Node.js", "PostgreSQL", "AWS", "Microservices"],
                  insight: "Your Node.js expertise and cloud architecture knowledge align with their infrastructure needs.",
                  logo: "cloudstream",
                  actionType: "booked",
                  bookedDate: "November 25th"
                }
              ].map((match, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    <CompanyLogo type={match.logo} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h4 className="text-lg md:text-2xl font-semibold text-[#0B1121] truncate">{match.company}</h4>
                          <p className="text-xs md:text-base text-[#6B7280] truncate font-normal">{match.role} • {match.location}</p>
                        </div>
                        <div className="px-3 py-1 md:px-4 md:py-2 bg-[#1E3A8A] text-white text-xs md:text-base font-semibold rounded-full flex-shrink-0 self-start">
                          {match.match}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-[#6B7280] mb-3 md:mb-4 leading-relaxed font-normal">
                    {match.description}
                  </p>

                  <div className="mb-3 md:mb-4">
                    <h5 className="text-[#0B1121] font-semibold mb-2 md:mb-3 text-xs md:text-sm">Skills overlap</h5>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {match.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 text-[#0B1121] rounded-lg text-xs md:text-sm font-normal"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 md:p-4 rounded-xl border border-gray-200 bg-gray-50 mb-3 md:mb-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#1E3A8A]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#0B1121] font-semibold mb-1 text-xs md:text-sm">Why this is a great match</p>
                        <p className="text-[#6B7280] text-xs md:text-sm leading-relaxed font-normal">
                          {match.insight}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {match.actionType === "booked" ? (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-green-800 font-semibold">Interview booked for {match.bookedDate}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          className="w-full h-10 md:h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-sm md:text-base font-medium rounded-xl shadow-lg transition-all"
                        >
                          {match.actionType === "assessment" ? (
                            <>
                              <FileCheck className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                              Complete Assessment
                            </>
                          ) : (
                            <>
                              <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                              Book Interview
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="sm:w-auto"
                      >
                        <Button
                          variant="outline"
                          className="w-full h-10 md:h-12 px-4 md:px-6 bg-white hover:bg-gray-50 text-[#6B7280] hover:text-[#0B1121] border-gray-300 rounded-xl transition-all text-sm md:text-base font-medium"
                        >
                          <X className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                          Pass
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}