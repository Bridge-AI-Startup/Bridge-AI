
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import InterviewHeader from "../components/booking/InterviewHeader";
import CompanyCard from "../components/booking/CompanyCard";
import DateSelector from "../components/booking/DateSelector";
import TimeSlotPicker from "../components/booking/TimeSlotPicker";
import BookingActions from "../components/booking/BookingActions";
import BookingConfirmation from "../components/booking/BookingConfirmation";

export default function BookInterview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBooked, setIsBooked] = useState(false);

  // Get navigation source from state
  const from = location.state?.from;
  const companyName = location.state?.companyName || "Nova Robotics";
  const jobRole = location.state?.jobRole || "Data Science Intern";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock company data - in real app, would come from URL params or props
  const companyData = {
    company: companyName,
    role: jobRole,
    location: "San Diego, CA",
    duration: "45 minutes"
  };

  // Build breadcrumb items dynamically
  const breadcrumbItems = [
    { label: "Dashboard", path: "StudentDashboard" }
  ];

  if (from === "StudentPipeline") {
    breadcrumbItems.push({ label: "My Applications", path: "StudentPipeline" });
  } else if (from === "JobAnalysis") {
    breadcrumbItems.push({ label: `${companyName} - ${jobRole}`, path: `JobAnalysis?company=${encodeURIComponent(companyName)}` });
  }

  breadcrumbItems.push({ label: "Book Interview" });

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsBooked(true);
    }
  };

  const handleCancel = () => {
    navigate("/StudentDashboard");
  };

  const handleBackToDashboard = () => {
    navigate("/StudentDashboard");
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="Dashboard" />
        <div className="pt-24 pb-16 px-6">
          <BookingConfirmation
            company={companyData.company}
            role={companyData.role}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onBackToDashboard={handleBackToDashboard}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <InterviewHeader
            onBack={handleCancel}
            companyName={companyData.company}
            role={companyData.role}
          />

          <CompanyCard
            company={companyData.company}
            role={companyData.role}
            location={companyData.location}
            duration={companyData.duration}
          />

          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          <TimeSlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
          />

          <BookingActions
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            disabled={!selectedDate || !selectedTime}
          />
        </div>
      </div>
    </div>
  );
}
