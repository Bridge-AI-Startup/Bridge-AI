
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Sparkles, X, FileCheck, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CompanyLogo from "./CompanyLogo";

export default function MatchCard({ match, delay = 0, fromPage = "StudentDashboard" }) {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(match.hoursLeft || 0);
  const [timeUntilStartDeadline, setTimeUntilStartDeadline] = useState(0);

  // Countdown timer for assessments in progress
  useEffect(() => {
    if (match.actionType === "continue" && match.hoursLeft > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - (1 / 3600); // Decrease by 1 second worth of hours
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [match.actionType, match.hoursLeft]);

  // Countdown timer for start deadline
  useEffect(() => {
    if (match.actionType === "assessment" && match.startDeadline) {
      const calculateTimeUntilDeadline = () => {
        const deadline = new Date(match.startDeadline).getTime();
        const now = new Date().getTime();
        const difference = deadline - now;
        // Convert milliseconds to hours
        const hours = difference / (1000 * 60 * 60);
        return hours;
      };

      // Set initial value
      setTimeUntilStartDeadline(calculateTimeUntilDeadline());

      // Update every second
      const interval = setInterval(() => {
        setTimeUntilStartDeadline(calculateTimeUntilDeadline());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [match.actionType, match.startDeadline]);

  const handleBookInterview = () => {
    navigate("/BookInterview", {
      state: {
        from: fromPage,
        companyName: match.company,
        jobRole: match.role
      }
    });
  };

  const handleStartAssessment = () => {
    navigate("/StartAssessment", {
      state: {
        from: fromPage,
        companyName: match.company,
        jobRole: match.role
      }
    });
  };

  const handleContinueAssessment = () => {
    navigate("/TakeAssessment", {
      state: {
        from: fromPage,
        companyName: match.company,
        jobRole: match.role
      }
    });
  };

  const handleViewJobAnalysis = () => {
    navigate(`/JobAnalysis?company=${encodeURIComponent(match.company)}&job=${encodeURIComponent(match.logo)}`, {
      state: { from: fromPage }
    });
  };

  const isOverdue = match.actionType === "continue" && timeRemaining <= 0;
  const hours = Math.floor(Math.abs(timeRemaining)); // Use Math.abs for hours and minutes in overdue state
  const minutes = Math.floor((Math.abs(timeRemaining) - hours) * 60);

  const isStartDeadlinePassed = match.actionType === "assessment" && timeUntilStartDeadline <= 0;
  const startDays = Math.floor(Math.abs(timeUntilStartDeadline) / 24);
  const startHours = Math.floor(Math.abs(timeUntilStartDeadline) % 24);
  const startMinutes = Math.floor((Math.abs(timeUntilStartDeadline) % 1) * 60);
  const isStartDeadlineClose = timeUntilStartDeadline > 0 && timeUntilStartDeadline <= 24; // Less than 24 hours

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all shadow-sm cursor-pointer"
      onClick={handleViewJobAnalysis}
    >
      <div className="flex items-start gap-4 mb-4">
        <CompanyLogo type={match.logo} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="text-2xl font-semibold text-[#0B1121] truncate hover:text-[#1E3A8A] transition-colors">{match.company}</h3>
              <p className="text-base text-[#6B7280] truncate font-normal">{match.role} • {match.location}</p>
            </div>
            <div className="px-4 py-2 bg-[#1E3A8A] text-white text-base font-semibold rounded-full flex-shrink-0 self-start">
              {match.match}
            </div>
          </div>
        </div>
      </div>

      <p className="text-base text-[#6B7280] mb-4 leading-relaxed font-normal">
        {match.description}
      </p>

      <div className="mb-4">
        <h4 className="text-[#0B1121] font-semibold mb-3 text-sm">Skills overlap</h4>
        <div className="flex flex-wrap gap-2">
          {match.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-gray-100 text-[#0B1121] rounded-lg text-sm font-normal"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
          </div>
          <div className="min-w-0">
            <p className="text-[#0B1121] font-semibold mb-1 text-sm">Why this is a great match</p>
            <p className="text-[#6B7280] text-sm leading-relaxed font-normal">
              {match.insight}
            </p>
          </div>
        </div>
      </div>

      {/* Deadline to Start Warning */}
      {match.actionType === "assessment" && match.startDeadline && (
        <div className="p-4 rounded-xl border mb-4 bg-blue-50 border-blue-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100">
              <Clock className="w-4 h-4 text-blue-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm text-blue-900">
                  Deadline to Start
                </p>
                <div className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-900">
                  ACTIVE
                </div>
              </div>
              <p className="text-sm font-normal text-blue-700">
                Start by: <span className="font-semibold">{startDays}d {startHours}h {startMinutes}m</span> remaining — Must begin within 3 days of match
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Time Left Warning for Continue Assessment */}
      {match.actionType === "continue" && (
        <div className={`p-4 rounded-xl border mb-4 ${
          isOverdue 
            ? 'bg-red-50 border-red-300' 
            : 'bg-yellow-50 border-yellow-300'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isOverdue ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              {isOverdue ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : (
                <Clock className="w-4 h-4 text-yellow-700" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className={`font-semibold text-sm ${
                  isOverdue ? 'text-red-900' : 'text-yellow-900'
                }`}>
                  {isOverdue ? 'Assessment Overdue!' : 'Assessment In Progress'}
                </p>
                <div className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  isOverdue ? 'bg-red-100 text-red-900' : 'bg-yellow-100 text-yellow-900'
                }`}>
                  {isOverdue ? 'OVERDUE' : 'ACTIVE'}
                </div>
              </div>
              <p className={`text-sm font-normal ${
                isOverdue ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {isOverdue ? (
                  <>Time overdue: <span className="font-semibold">{hours}h {minutes}m</span> — Complete as soon as possible</>
                ) : (
                  <>Time left: <span className="font-semibold">{hours}h {minutes}m</span> of {match.completionTimeAllowedHours}h allowed</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {match.actionType === "booked" ? (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-semibold">Interview booked for {match.bookedDate}</p>
        </div>
      ) : match.actionType === "completed" ? (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-semibold">Assessment completed on October 5th</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3" onClick={(e) => e.stopPropagation()}>
          <Button 
            onClick={
              match.actionType === "continue" 
                ? handleContinueAssessment 
                : match.actionType === "interview"
                ? handleBookInterview
                : handleStartAssessment
            }
            className={`flex-1 h-12 rounded-xl ${
              (match.actionType === "continue" && isOverdue) || (match.actionType === "assessment" && isStartDeadlinePassed)
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white'
            }`}
            disabled={match.actionType === "assessment" && isStartDeadlinePassed}
          >
            {match.actionType === "continue" ? (
              <>
                <FileCheck className="w-5 h-5 mr-2" />
                Continue Assessment
              </>
            ) : match.actionType === "assessment" ? (
              <>
                <FileCheck className="w-5 h-5 mr-2" />
                Start Assessment
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Book Interview
              </>
            )}
          </Button>
          <Button variant="outline" className="sm:w-auto bg-white hover:bg-gray-50 text-[#6B7280] hover:text-[#0B1121] border-gray-300 rounded-xl h-12 px-6">
            <X className="w-5 h-5 mr-2" />
            Pass
          </Button>
        </div>
      )}
    </motion.div>
  );
}
