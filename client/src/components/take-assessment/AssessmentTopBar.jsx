
import React, { useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import Breadcrumbs from "../navigation/Breadcrumbs";

export default function AssessmentTopBar({ timeRemaining, isExpired, breadcrumbItems }) {
  const liveRegionRef = useRef(null);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ARIA live announcements
  useEffect(() => {
    if (!liveRegionRef.current) return;

    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;

    // Announce every minute
    if (secs === 0 && mins > 0) {
      liveRegionRef.current.textContent = `${mins} minutes remaining`;
    }

    // Announce every second for last 10 seconds
    if (timeRemaining <= 10 && timeRemaining > 0) {
      liveRegionRef.current.textContent = `${timeRemaining} seconds remaining`;
    }

    // Announce expiration
    if (timeRemaining === 0) {
      liveRegionRef.current.textContent = "Time expired";
    }
  }, [timeRemaining]);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Breadcrumbs */}
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <div className="mb-3">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Empty space for balance */}
          <div className="w-32"></div>

          {/* Timer - centered */}
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#1E3A8A]" />
            <span className={`text-3xl font-bold ${
              timeRemaining < 300 ? 'text-red-600' : 'text-[#0B1121]'
            }`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Status Pill */}
          <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
            isExpired 
              ? 'bg-red-100 text-red-800'
              : 'bg-[#FFFF00] text-[#1E3A8A]'
          }`}>
            {isExpired ? 'Expired' : 'In Progress'}
          </div>
        </div>
      </div>

      {/* ARIA Live Region */}
      <div
        ref={liveRegionRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
}
