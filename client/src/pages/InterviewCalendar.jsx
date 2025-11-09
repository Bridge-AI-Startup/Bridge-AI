
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Video, Clock, CheckCircle, ChevronLeft, ChevronRight, User, X } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast"; // Added import
import { Toaster } from "@/components/ui/toaster"; // Added import
import BridgeAIButton from "../components/bridge-ai/BridgeAIButton";
import BridgeAIPanel from "../components/bridge-ai/BridgeAIPanel";

export default function InterviewCalendar() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialized useToast
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 16)); // Dec 16, 2024
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const expandedSectionRef = useRef(null);

  const interviews = [
    {
      id: 1,
      candidateName: "Alex Park",
      role: "Full-Stack Engineer Intern",
      date: new Date(2024, 11, 18, 14, 0), // Dec 18, 2024, 2:00 PM
      duration: 45,
      interviewer: "Sarah Chen",
      meetingLink: "https://zoom.us/j/123456789",
      status: "upcoming",
      matchScore: 92
    },
    {
      id: 2,
      candidateName: "Jordan Lee",
      role: "ML Engineer Intern",
      date: new Date(2024, 11, 19, 10, 0), // Dec 19, 2024, 10:00 AM
      duration: 60,
      interviewer: "Mike Rodriguez",
      meetingLink: "https://zoom.us/j/987654321",
      status: "upcoming",
      matchScore: 88
    },
    {
      id: 3,
      candidateName: "Rachel Green",
      role: "Product Designer Intern",
      date: new Date(2024, 11, 19, 15, 0), // Dec 19, 2024, 3:00 PM
      duration: 45,
      interviewer: "Emily Watson",
      meetingLink: "https://zoom.us/j/456789123",
      status: "upcoming",
      matchScore: 91
    },
    {
      id: 4,
      candidateName: "Kevin Zhang",
      role: "Full-Stack Engineer Intern",
      date: new Date(2024, 11, 20, 11, 0), // Dec 20, 2024, 11:00 AM
      duration: 45,
      interviewer: "Sarah Chen",
      meetingLink: "https://zoom.us/j/321654987",
      status: "upcoming",
      matchScore: 89
    },
    {
      id: 5,
      candidateName: "Maya Chen",
      role: "Backend Engineer Intern",
      date: new Date(2024, 11, 23, 14, 0), // Dec 23, 2024, 2:00 PM
      duration: 45,
      interviewer: "Mike Rodriguez",
      meetingLink: "https://zoom.us/j/555666777",
      status: "upcoming",
      matchScore: 90
    },
    {
      id: 6,
      candidateName: "Taylor Kim",
      role: "Product Designer Intern",
      date: new Date(2024, 11, 12, 14, 0), // Dec 12, 2024, 2:00 PM
      duration: 45,
      interviewer: "Emily Watson",
      meetingLink: "https://zoom.us/j/111222333",
      status: "completed",
      matchScore: 93
    },
    {
      id: 7,
      candidateName: "Morgan Davis",
      role: "Full-Stack Engineer Intern",
      date: new Date(2024, 11, 11, 10, 0), // Dec 11, 2024, 10:00 AM
      duration: 60,
      interviewer: "Sarah Chen",
      meetingLink: "https://zoom.us/j/444555666",
      status: "completed",
      matchScore: 87
    }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getInterviewsForDate = (day) => {
    return interviews.filter(interview => {
      const interviewDate = interview.date;
      return interviewDate.getDate() === day &&
             interviewDate.getMonth() === currentDate.getMonth() &&
             interviewDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleAttendInterview = (interview) => {
    window.open(interview.meetingLink, '_blank');
    toast({
      title: "Opening interview",
      description: `Joining meeting with ${interview.candidateName}`,
      duration: 3000,
    });
  };

  const handleMarkCompleted = (interviewId) => {
    console.log("Mark interview as completed:", interviewId);
    toast({
      title: "Interview marked as completed",
      description: "You can now add feedback and rating for this interview.",
      duration: 3000,
    });
    // In a real app, you would update the state of your interviews here
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const handleDayClick = (day) => {
    const dayInterviews = getInterviewsForDate(day);
    if (dayInterviews.length > 0) {
      setSelectedDate(selectedDate === day ? null : day);
    }
  };

  const upcomingCount = interviews.filter(i => i.status === "upcoming").length;
  const completedCount = interviews.filter(i => i.status === "completed").length;
  const selectedDayInterviews = selectedDate ? getInterviewsForDate(selectedDate) : [];

  useEffect(() => {
    if (selectedDate && expandedSectionRef.current) {
      setTimeout(() => {
        expandedSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100); // Small delay to allow AnimatePresence to render before scrolling
    }
  }, [selectedDate]);

  const aiContext = {
    roleTitle: "Interview Calendar",
    stage: "Interviews",
    totals: {
      candidates: interviews.length,
      thisWeek: interviews.filter(i => {
        const interviewDate = i.date;
        const now = new Date();
        const oneWeekLater = new Date(now);
        oneWeekLater.setDate(now.getDate() + 7);

        // Filter for interviews from 'now' up to 'oneWeekLater' (inclusive)
        return interviewDate >= now && interviewDate <= oneWeekLater;
      }).length,
      nextWeek: interviews.filter(i => {
        const interviewDate = i.date;
        const now = new Date();
        const oneWeekLater = new Date(now);
        oneWeekLater.setDate(now.getDate() + 7);
        const twoWeeksLater = new Date(now);
        twoWeeksLater.setDate(now.getDate() + 14);

        // Filter for interviews strictly after 'oneWeekLater' up to 'twoWeeksLater' (inclusive)
        return interviewDate > oneWeekLater && interviewDate <= twoWeeksLater;
      }).length
    },
    candidates: interviews.map(i => ({
      id: String(i.id),
      name: i.candidateName,
      status: "scheduled",
      matchScore: i.matchScore || 90,
      rationale: `${i.role} • ${i.date.toLocaleDateString()} at ${i.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }))
  };

  // Added breadcrumbs items
  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Full-Stack Engineer Intern", path: "JobListingDashboard?id=fullstack-engineer" },
    { label: "Calendar" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
              Interview Calendar
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Manage and track all scheduled interviews
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-5 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] font-normal">Upcoming</p>
                  <p className="text-2xl font-semibold text-[#0B1121]">{upcomingCount}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-5 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] font-normal">Completed</p>
                  <p className="text-2xl font-semibold text-[#0B1121]">{completedCount}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-5 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] font-normal">Total Interviews</p>
                  <p className="text-2xl font-semibold text-[#0B1121]">{interviews.length}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#0B1121]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  onClick={previousMonth}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl border-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={nextMonth}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl border-2"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center py-2 text-sm font-semibold text-[#6B7280]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const dayInterviews = getInterviewsForDate(day);
                const hasInterviews = dayInterviews.length > 0;
                const todayClass = isToday(day);
                const isSelected = selectedDate === day;

                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square border-2 rounded-xl p-2 transition-all ${
                      isSelected ? 'border-[#1E3A8A] bg-blue-100 shadow-lg scale-105' :
                      todayClass ? 'border-[#1E3A8A] bg-blue-50' : 
                      'border-gray-200 bg-gray-50'
                    } ${hasInterviews ? 'cursor-pointer hover:border-[#1E3A8A] hover:shadow-md' : ''}`}
                  >
                    <div className="text-sm font-semibold text-[#0B1121] mb-1">{day}</div>
                    {dayInterviews.length > 0 && (
                      <div className="space-y-1">
                        {dayInterviews.slice(0, 2).map(interview => (
                          <div
                            key={interview.id}
                            className={`text-xs p-1 rounded ${
                              interview.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-[#1E3A8A]'
                            } truncate`}
                          >
                            {formatTime(interview.date)}
                          </div>
                        ))}
                        {dayInterviews.length > 2 && (
                          <div className="text-xs text-[#6B7280] font-medium">
                            +{dayInterviews.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Expanded Day Details */}
          <AnimatePresence>
            {selectedDate && selectedDayInterviews.length > 0 && (
              <motion.div
                ref={expandedSectionRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-white rounded-2xl p-6 border-2 border-[#1E3A8A]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-[#0B1121]">
                    {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
                  </h3>
                  <Button
                    onClick={() => setSelectedDate(null)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {selectedDayInterviews.map((interview, idx) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => navigate(`/ApplicantProfile?name=${encodeURIComponent(interview.candidateName)}&from=calendar`)}
                      className="bg-gray-50 rounded-xl p-5 border border-gray-200 cursor-pointer hover:border-[#1E3A8A] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-[#0B1121]">{interview.candidateName}</h4>
                            <Badge className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90">
                              {interview.matchScore}% Match
                            </Badge>
                            {interview.status === 'completed' && (
                              <Badge className="bg-green-600 text-white">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[#6B7280] font-normal mb-2">{interview.role}</p>
                          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(interview.date)}</span>
                            </div>
                            <span>•</span>
                            <span>{interview.duration} min</span>
                            <span>•</span>
                            <span>with {interview.interviewer}</span>
                          </div>
                        </div>
                      </div>

                      {interview.status === 'upcoming' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAttendInterview(interview);
                            }}
                            className="flex-1 h-10 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Attend Interview
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkCompleted(interview.id);
                            }}
                            variant="outline"
                            className="flex-1 h-10 border-2 border-gray-200 rounded-xl hover:border-green-600 hover:text-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Completed
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bridge AI Components */}
      <BridgeAIButton
        hasUpdates={interviews.length > 0}
        onOpen={() => setIsPanelOpen(true)}
        isOpen={isPanelOpen}
      />

      <BridgeAIPanel
        isOpen={isPanelOpen}
        context={aiContext}
        onClose={() => setIsPanelOpen(false)}
        onPromptRun={(prompt) => console.log("Prompt:", prompt)}
        onFreeformPrompt={(text) => console.log("Freeform:", text)}
        onViewCandidate={(id) => navigate(`/ApplicantProfile?name=${encodeURIComponent(interviews.find(i => String(i.id) === id)?.candidateName)}&from=calendar`)}
        onInvite={(id) => console.log("Invite:", id)}
        onSendReminder={(id) => console.log("Reminder:", id)}
        onFlag={(id) => console.log("Flag:", id)}
      />

      <Toaster /> {/* Added Toaster component */}
    </div>
  );
}
