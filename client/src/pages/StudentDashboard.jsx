
import React, { useEffect, useState } from "react";
import { Calendar, TrendingUp, CheckCircle2, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "../components/navigation/Header";
import MatchesList from "../components/dashboard/MatchesList";
import ProfileCompletionCard from "../components/dashboard/ProfileCompletionCard";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const getNextMatchDate = () => {
      const now = new Date();
      const nextMatch = new Date();
      // Calculate days until next Monday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      // (1 + 7 - now.getDay()) % 7: This will give 1 for Sunday, 0 for Monday, 6 for Tuesday etc.
      // We want to count days until the *next* Monday.
      // If today is Monday, getDay() is 1, so (1 + 7 - 1) % 7 = 0. We want 7 days later.
      // So if it's Monday, we want next Monday. If it's Tuesday, we want next Monday.
      // Let's refine this to target the *upcoming* Monday at 9 AM.
      // If current day is Monday, and time is before 9 AM, it's today. If after, it's next Monday.
      
      const currentDay = now.getDay(); // 0 for Sunday, 1 for Monday
      let daysUntilNextMonday = (1 - currentDay + 7) % 7; // Days until *this* coming Monday
      
      nextMatch.setDate(now.getDate() + daysUntilNextMonday);
      nextMatch.setHours(9, 0, 0, 0); // Set to 9 AM on that Monday

      // If the calculated nextMatch time is in the past (e.g., it's Tuesday and we calculated this past Monday),
      // then we need to add another 7 days to get to the *next* Monday.
      if (nextMatch.getTime() < now.getTime()) {
        nextMatch.setDate(nextMatch.getDate() + 7);
      }

      return nextMatch;
    };

    const calculateTimeLeft = () => {
      const difference = getNextMatchDate().getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const matches = [
    {
      company: "Seedify Labs",
      role: "Product Intern",
      location: "Remote",
      match: "89%",
      description: "Early-stage fintech startup revolutionizing investment tools. Need a product intern to help shape our roadmap.",
      skills: ["React", "Figma", "Product Strategy", "User Research"],
      insight: "Your React projects and design thinking experience make you a strong fit for their product team.",
      logo: "seedify",
      actionType: "continue",
      assessmentStarted: true,
      hoursLeft: 2,
      completionTimeAllowedHours: 4
    },
    {
      company: "CloudVentures",
      role: "Frontend Engineer Intern",
      location: "Seattle, WA",
      match: "88%",
      description: "Building next-generation cloud storage solutions for developers. Looking for a frontend engineer passionate about user experience and performance.",
      skills: ["React", "TypeScript", "Tailwind CSS", "GraphQL"],
      insight: "Your frontend expertise and TypeScript knowledge make you an excellent fit for their engineering team.",
      logo: "cloudstream",
      actionType: "assessment",
      assessmentStarted: false,
      completionTimeAllowedHours: 4,
      startDeadline: "2025-12-15T23:59:59",
      matchedDate: "2025-12-12"
    },
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
    }
  ];

  const completionSections = {
    resume: true,
    projects: true,
    preferences: false
  };
  const completedCount = Object.values(completionSections).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / 3) * 100);
  const isProfileComplete = true; // This should be dynamic based on completionSections

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
                  Welcome back, Student
                </h1>
                <p className="text-lg text-[#6B7280] font-normal">
                  You have {matches.length} new matches this week
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate("/StudentCalendar", { state: { from: "StudentDashboard" } })}
                  variant="outline"
                  className="h-12 px-6 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Calendar
                </Button>
                <Button
                  onClick={() => navigate("/Profile", { state: { from: "StudentDashboard" } })}
                  variant="outline"
                  className="h-12 px-6 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  View Profile
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats grid with integrated countdown */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {/* Next Match Countdown integrated as a stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-orange-100">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-[#6B7280] text-sm mb-1 font-normal">Next Matches</p>
              <p className="text-3xl font-semibold text-[#0B1121]">
                {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-blue-100">
                <TrendingUp className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <p className="text-[#6B7280] text-sm mb-1 font-normal">Matches</p>
              <p className="text-3xl font-semibold text-[#0B1121]">4</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-purple-100">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-[#6B7280] text-sm mb-1 font-normal">Interviews Booked</p>
              <p className="text-3xl font-semibold text-[#0B1121]">1</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-yellow-100">
                <CheckCircle2 className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-[#6B7280] text-sm mb-1 font-normal">Projects Left</p>
              <p className="text-3xl font-semibold text-[#0B1121]">2</p>
            </motion.div>
          </div>

          {!isProfileComplete && (
            <ProfileCompletionCard
              completionPercentage={completionPercentage}
              completionSections={completionSections}
            />
          )}

          {/* My Pipeline Button - Full width above matches list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
          >
            <Button
              onClick={() => navigate("/StudentPipeline")}
              className="w-full h-14 bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border-2 border-[#1E3A8A] rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">View My Pipeline</span>
            </Button>
          </motion.div>

          <MatchesList matches={matches} />
        </div>
      </div>
    </div>
  );
}
