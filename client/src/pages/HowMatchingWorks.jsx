
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle, Calendar, Clock, Archive, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/navigation/Header";

export default function HowMatchingWorks() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Mark that they've seen this page
    localStorage.setItem('hasSeenMatchingExplainer', 'true');
  }, []);

  const timelineCycle = [
    {
      day: "Monday",
      time: "9:00 AM",
      icon: Users,
      title: "Matches Delivered",
      description: "New candidates are matched to your listing each week and receive the project",
      color: "from-blue-500 to-blue-600",
      dotColor: "bg-blue-500"
    },
    {
      day: "Thursday",
      time: "End of Day",
      icon: Clock,
      title: "Project Start Deadline",
      description: "Candidates must start within 3 days. Those inactive for 2+ weeks are archived.",
      color: "from-orange-500 to-orange-600",
      dotColor: "bg-orange-500"
    },
    {
      day: "",
      time: "Ongoing",
      icon: Calendar,
      title: "Review & Interview",
      description: "Review completed assessments and schedule interviews with top candidates",
      color: "from-purple-500 to-purple-600",
      dotColor: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
              Your Listing is Live!
            </h1>
            <p className="text-xl text-[#6B7280] font-normal max-w-2xl mx-auto">
              Here's how Bridge AI will match you with top talent
            </p>
          </motion.div>

          {/* What Happens Next Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-2xl p-8 mb-12 text-white"
          >
            <h2 className="text-2xl font-semibold mb-3">What Happens Next?</h2>
            <p className="text-white/90 font-normal text-lg mb-4">
              Your listing’s live — our AI is analyzing student skills and projects to find your best matches. You'll receive your first batch of matched candidates on <span className="font-semibold">Monday at 9 AM</span>.
            </p>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5" />
              <span className="font-normal">You'll be notified by email when new matches arrive</span>
            </div>
          </motion.div>

          {/* Timeline Cycle Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-semibold text-[#0B1121] mb-8 text-center">
              Your Weekly Match Cycle
            </h2>

            <div className="relative bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
              {/* Timeline */}
              <div className="relative">
                {timelineCycle.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Connecting Line */}
                    {index < timelineCycle.length - 1 && (
                      <div className="absolute left-[23px] top-[48px] w-0.5 h-[calc(100%+0px)] bg-gradient-to-b from-gray-300 to-gray-200 z-0" />
                    )}

                    {/* Timeline Item */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                      className="relative flex items-center gap-6 mb-40 last:mb-0 z-10"
                    >
                      {/* Icon Circle */}
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg relative z-10`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-[#0B1121]">
                              {item.title}
                            </h3>
                            <p className="text-sm text-[#6B7280] font-normal mt-1">
                              {item.day}  {item.time}
                            </p>
                          </div>
                          <div className={`px-4 py-2 ${item.dotColor} bg-opacity-10 rounded-full`}>
                            <span className={`text-sm font-semibold ${item.dotColor.replace('bg-', 'text-')}`}>
                              {index === 0 ? 'Day 1' : index === 1 ? 'Day 3' : 'Ongoing'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[#6B7280] font-normal leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                ))}

                {/* Looping Arrow - Cycle Repeats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="relative flex items-center gap-4 mt-8 mb-4"
                >
                  <div className="flex-1 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-400 rounded-full">
                      <RefreshCw className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-600">Cycle Repeats Weekly</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Key Differentiators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-12"
          >
            <h3 className="text-2xl font-semibold text-[#0B1121] mb-4 text-center">
              Why Bridge is Different
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h4 className="font-semibold text-[#0B1121] mb-1">Skills, Not Keywords</h4>
                <p className="text-sm text-[#6B7280] font-normal">
                  Our AI analyzes actual code, projects, and experience to find the best fits.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🚫</div>
                <h4 className="font-semibold text-[#0B1121] mb-1">No More Résumé Overload</h4>
                <p className="text-sm text-[#6B7280] font-normal">
                  Stop sorting through endless applications. Each match completes a tailored mini-project that proves skill, commitment, and fit — so you only see high-signal talent.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔁</div>
                <h4 className="font-semibold text-[#0B1121] mb-1">Continuous, Automatic Matching</h4>
                <p className="text-sm text-[#6B7280] font-normal">
                  Bridge's AI continuously scans the entire talent pool, surfacing new, high-fit candidates every week — so you never wait for applications to roll in again.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center"
          >
            <Button
              onClick={() => navigate("/EmployerDashboard")}
              className="h-14 px-8 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: '#FFFF00', color: '#1E3A8A' }}
            >
              Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-[#6B7280] font-normal mt-4">
              You can also set up interview availability and review your listing details
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
