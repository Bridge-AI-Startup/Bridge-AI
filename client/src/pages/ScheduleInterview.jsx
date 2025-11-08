
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Added Breadcrumbs import
import CandidateInfoSidebar from "../components/schedule-interview/CandidateInfoSidebar";
import InterviewSettings from "../components/schedule-interview/InterviewSettings";
import TimeSlotMatrix from "../components/schedule-interview/TimeSlotMatrix";
import InterviewersSection from "../components/schedule-interview/InterviewersSection";
import InterviewNotes from "../components/schedule-interview/InterviewNotes";
import InterviewActions from "../components/schedule-interview/InterviewActions";

export default function ScheduleInterview() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const candidateId = searchParams.get("candidate");
  const jobId = searchParams.get("job");

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  // Updated initial duration value as per outline
  const [duration, setDuration] = useState("60");
  // Renamed state variable from 'locationType' to 'interviewType' as per outline
  const [interviewType, setInterviewType] = useState("video");
  const [locationDetails, setLocationDetails] = useState("");
  const [interviewers, setInterviewers] = useState([]);
  const [newInterviewerName, setNewInterviewerName] = useState("");
  const [newInterviewerEmail, setNewInterviewerEmail] = useState("");
  const [notes, setNotes] = useState("");
  // Renamed state variable from 'isCreating' to 'isScheduling' as per outline
  const [isScheduling, setIsScheduling] = useState(false);
  const [isCreated, setIsCreated] = useState(false); // Kept to preserve success message functionality
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [dragMode, setDragMode] = useState(null);
  
  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const gridContainerRef = useRef(null);
  const scrollAnimationRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY_HERE&libraries=places`; // IMPORTANT: Replace with your actual Google Maps API key
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script';
      document.head.appendChild(script);

      return () => {
        const existingScript = document.getElementById('google-maps-script');
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, []);

  useEffect(() => {
    // Updated to use 'interviewType'
    if (interviewType === "in-person" && locationInputRef.current && window.google && window.google.maps.places) {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        {
          types: ['establishment', 'geocode'],
          fields: ['formatted_address', 'name', 'place_id']
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place.formatted_address) {
          setLocationDetails(place.formatted_address);
        } else if (place.name) {
          setLocationDetails(place.name);
        } else {
          setLocationDetails("");
        }
      });
    }

    return () => {
      if (autocompleteRef.current && window.google && window.google.maps.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [interviewType]); // Dependency updated to 'interviewType'

  const candidate = {
    name: "Maya Johnson",
    initials: "MJ",
    role: "Full-Stack Engineer Intern",
    email: "maya.johnson@ucsd.edu",
    bgColor: "bg-[#1E3A8A]"
  };

  const getWeekDays = () => {
    const days = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + weekOffset * 7);
    
    const dayOfWeek = startDate.getDay();
    const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startDate.setDate(diff);

    for (let i = 0; i < 5; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const weekDays = getWeekDays();

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  const getSlotId = (date, time) => {
    return `${date.toISOString().split('T')[0]}_${time}`;
  };

  const handleMouseDown = (dayIdx, timeIdx, e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ dayIdx, timeIdx });
    setDragEnd({ dayIdx, timeIdx });
    
    const firstSlotId = getSlotId(weekDays[dayIdx], timeSlots[timeIdx]);
    setDragMode(selectedSlots.has(firstSlotId) ? 'deselect' : 'select');
  };

  const handleMouseEnter = (dayIdx, timeIdx) => {
    if (!isDragging) return;
    setDragEnd({ dayIdx, timeIdx });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Update drag end based on current mouse position over grid
    if (gridContainerRef.current) {
      const gridRect = gridContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Find which cell the mouse is currently over
      const cells = gridContainerRef.current.querySelectorAll('button[data-day-idx][data-time-idx]');
      let foundCell = false;
      
      cells.forEach((cell) => {
        const rect = cell.getBoundingClientRect();
        if (mouseX >= rect.left && mouseX <= rect.right &&
            mouseY >= rect.top && mouseY <= rect.bottom) {
          const dayIdx = parseInt(cell.dataset.dayIdx);
          const timeIdx = parseInt(cell.dataset.timeIdx);
          if (!isNaN(dayIdx) && !isNaN(timeIdx)) {
            setDragEnd({ dayIdx, timeIdx });
            foundCell = true;
          }
        }
      });
    }
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgeThreshold = 100;
    const maxScrollSpeed = 20;
    
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
    
    let scrollSpeedX = 0;
    let scrollSpeedY = 0;
    
    if (mouseY > viewportHeight - edgeThreshold) {
      const distance = mouseY - (viewportHeight - edgeThreshold);
      scrollSpeedY = Math.min((distance / edgeThreshold) * maxScrollSpeed, maxScrollSpeed);
    } else if (mouseY < edgeThreshold + 96) { // +96 to account for header height
      const distance = (edgeThreshold + 96) - mouseY;
      scrollSpeedY = -Math.min((distance / edgeThreshold) * maxScrollSpeed, maxScrollSpeed);
    }
    
    if (mouseX > viewportWidth - edgeThreshold) {
      const distance = mouseX - (viewportWidth - edgeThreshold);
      scrollSpeedX = Math.min((distance / edgeThreshold) * maxScrollSpeed, maxScrollSpeed);
    } else if (mouseX < edgeThreshold) {
      const distance = edgeThreshold - mouseX;
      scrollSpeedX = -Math.min((distance / edgeThreshold) * maxScrollSpeed, maxScrollSpeed);
    }
    
    if (scrollSpeedX !== 0 || scrollSpeedY !== 0) {
      const scroll = () => {
        window.scrollBy(scrollSpeedX, scrollSpeedY);
        scrollAnimationRef.current = requestAnimationFrame(scroll);
      };
      scrollAnimationRef.current = requestAnimationFrame(scroll);
    }
  };

  const handleMouseUp = () => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }

    if (!isDragging || !dragStart || !dragEnd) {
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
      setDragMode(null);
      return;
    }

    const minDay = Math.min(dragStart.dayIdx, dragEnd.dayIdx);
    const maxDay = Math.max(dragStart.dayIdx, dragEnd.dayIdx);
    const minTime = Math.min(dragStart.timeIdx, dragEnd.timeIdx);
    const maxTime = Math.max(dragStart.timeIdx, dragEnd.timeIdx);
    
    const newSlots = new Set(selectedSlots);
    
    for (let d = minDay; d <= maxDay; d++) {
      for (let t = minTime; t <= maxTime; t++) {
        const slotId = getSlotId(weekDays[d], timeSlots[t]);
        if (dragMode === 'select') {
          newSlots.add(slotId);
        } else {
          newSlots.delete(slotId);
        }
      }
    }
    
    setSelectedSlots(newSlots);
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    setDragMode(null);
  };

  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  const selectTimeRange = (startTime, endTime) => {
    const startIdx = timeSlots.indexOf(startTime);
    const endIdx = timeSlots.indexOf(endTime);
    const newSlots = new Set(selectedSlots);
    
    weekDays.forEach(date => {
      for (let i = startIdx; i <= endIdx; i++) {
        newSlots.add(getSlotId(date, timeSlots[i]));
      }
    });
    
    setSelectedSlots(newSlots);
  };

  const deselectTimeRange = (startTime, endTime) => {
    const startIdx = timeSlots.indexOf(startTime);
    const endIdx = timeSlots.indexOf(endTime);
    const newSlots = new Set(selectedSlots);
    
    weekDays.forEach(date => {
      for (let i = startIdx; i <= endIdx; i++) {
        newSlots.delete(getSlotId(date, timeSlots[i]));
      }
    });
    
    setSelectedSlots(newSlots);
  };

  const areAllSlotsInRangeSelected = (startTime, endTime) => {
    const startIdx = timeSlots.indexOf(startTime);
    const endIdx = timeSlots.indexOf(endTime);
    
    for (const date of weekDays) {
      for (let i = startIdx; i <= endIdx; i++) {
        if (!selectedSlots.has(getSlotId(date, timeSlots[i]))) {
          return false;
        }
      }
    }
    return true;
  };

  const selectAllMornings = () => {
    if (areAllSlotsInRangeSelected("9:00 AM", "11:30 AM")) {
      deselectTimeRange("9:00 AM", "11:30 AM");
    } else {
      selectTimeRange("9:00 AM", "11:30 AM");
    }
  };

  const selectAllAfternoons = () => {
    if (areAllSlotsInRangeSelected("1:00 PM", "5:00 PM")) {
      deselectTimeRange("1:00 PM", "5:00 PM");
    } else {
      selectTimeRange("1:00 PM", "5:00 PM");
    }
  };

  const clearAllSlots = () => {
    setSelectedSlots(new Set());
  };

  const addInterviewer = () => {
    if (newInterviewerName.trim() && newInterviewerEmail.trim() && 
        !interviewers.some(i => i.email === newInterviewerEmail.trim())) {
      setInterviewers([...interviewers, { 
        name: newInterviewerName.trim(), 
        email: newInterviewerEmail.trim()
      }]);
      setNewInterviewerName("");
      setNewInterviewerEmail("");
    }
  };

  const removeInterviewer = (email) => {
    setInterviewers(interviewers.filter(i => i.email !== email));
  };

  const handleCreateInterview = async () => {
    if (selectedSlots.size === 0 || interviewers.length === 0) {
      alert("Please select at least one time slot and add at least one interviewer.");
      return;
    }
    // Updated to use 'interviewType'
    if (interviewType === "in-person" && !locationDetails) {
      alert("Please enter a meeting location for in-person interviews.");
      return;
    }

    // Updated to use 'setIsScheduling'
    setIsScheduling(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsScheduling(false);
    setIsCreated(true);

    setTimeout(() => {
      navigate(`/JobListingDashboard?id=${jobId}`);
    }, 2000);
  };

  // This block is kept to preserve existing success screen functionality
  if (isCreated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-semibold text-[#0B1121] mb-2">
            Availability Sent!
          </h2>
          <p className="text-lg text-[#6B7280] font-normal">
            {candidate.name} will choose their preferred time from your available slots
          </p>
        </motion.div>
      </div>
    );
  }

  // Updated to use 'interviewType' and 'isScheduling'
  const canCreate = selectedSlots.size > 0 && interviewers.length > 0 && 
                    (interviewType === "video" || locationDetails);

  // Defined breadcrumbItems as per outline
  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Full-Stack Engineer Intern", path: "JobListingDashboard?id=fullstack-engineer" },
    { label: "Schedule Interview" }
  ];

  return (
    <div 
      className="min-h-screen bg-gray-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Header currentPage="EmployerDashboard" /> {/* Updated currentPage prop */}
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs component added, replaces ArrowLeft button */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Updated h1 content as per outline */}
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
              Schedule Interview
            </h1>
            {/* Updated p content as per outline */}
            <p className="text-lg text-[#6B7280] font-normal">
              Select your preferred time and interview settings
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            <div>
              <CandidateInfoSidebar
                candidate={candidate}
                duration={duration}
                // Updated to use 'interviewType'
                locationType={interviewType}
                locationDetails={locationDetails}
                interviewersCount={interviewers.length}
              />
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-[#0B1121] mb-2">Set Interview Availability</h3>
                <p className="text-sm text-[#6B7280] mb-6 font-normal">
                  Select time slots when you're available. The candidate will choose their preferred time.
                </p>

                <InterviewSettings
                  duration={duration}
                  setDuration={setDuration}
                  // Updated to use 'interviewType' and 'setInterviewType'
                  locationType={interviewType}
                  setLocationType={setInterviewType}
                  locationDetails={locationDetails}
                  setLocationDetails={setLocationDetails}
                  locationInputRef={locationInputRef}
                />

                <TimeSlotMatrix
                  weekDays={weekDays}
                  timeSlots={timeSlots}
                  weekOffset={weekOffset}
                  setWeekOffset={setWeekOffset}
                  selectedSlots={selectedSlots}
                  isDragging={isDragging}
                  dragStart={dragStart}
                  dragEnd={dragEnd}
                  dragMode={dragMode}
                  handleMouseDown={handleMouseDown}
                  handleMouseEnter={handleMouseEnter}
                  getSlotId={getSlotId}
                  gridContainerRef={gridContainerRef}
                  selectAllMornings={selectAllMornings}
                  selectAllAfternoons={selectAllAfternoons}
                  clearAllSlots={clearAllSlots}
                  areAllSlotsInRangeSelected={areAllSlotsInRangeSelected}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                <InterviewersSection
                  interviewers={interviewers}
                  newInterviewerName={newInterviewerName}
                  setNewInterviewerName={setNewInterviewerName}
                  newInterviewerEmail={newInterviewerEmail}
                  setNewInterviewerEmail={setNewInterviewerEmail}
                  addInterviewer={addInterviewer}
                  removeInterviewer={removeInterviewer}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                <InterviewNotes notes={notes} setNotes={setNotes} />
              </motion.div>

              <InterviewActions
                onCancel={() => navigate(`/JobListingDashboard?id=${jobId}`)}
                onSubmit={handleCreateInterview}
                canCreate={canCreate}
                // Updated to use 'isScheduling'
                isCreating={isScheduling}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
