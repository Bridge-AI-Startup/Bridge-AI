
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Clock, Sparkles, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

export default function ProjectDetailModal({ project, onClose, onAssign, onUpdateProject }) {
  // Parse initial time
  const parseTime = (timeString) => {
    const hourMatch = timeString.match(/(\d+)\s*hour/);
    const dayMatch = timeString.match(/(\d+)\s*day/);
    const weekMatch = timeString.match(/(\d+)\s*week/);
    
    if (weekMatch) return { hours: parseInt(weekMatch[1]) * 7 * 24, minutes: 0 };
    if (dayMatch) return { hours: parseInt(dayMatch[1]) * 24, minutes: 0 };
    if (hourMatch) return { hours: parseInt(hourMatch[1]), minutes: 0 };
    return { hours: 3, minutes: 0 };
  };

  const initialParsedTime = parseTime(project.estimatedTime);
  const [timeHours, setTimeHours] = useState(initialParsedTime.hours);
  const [timeMinutes, setTimeMinutes] = useState(initialParsedTime.minutes);
  const [hoursInputValue, setHoursInputValue] = useState(initialParsedTime.hours.toString());
  const [minutesInputValue, setMinutesInputValue] = useState(initialParsedTime.minutes.toString());
  const [modificationRequest, setModificationRequest] = useState("");
  
  const isHoldingMinutesTimeoutRef = useRef(null); // Renamed from isHoldingMinutes for clarity
  const holdIntervalRef = useRef(null);
  
  const [rubricWeights, setRubricWeights] = useState(
    project.gradingRubric.reduce((acc, rubric) => {
      acc[rubric.category] = rubric.defaultEmphasis || 50;
      return acc;
    }, {})
  );
  const [showRequirements, setShowRequirements] = useState(true);
  const [showRubric, setShowRubric] = useState(true);

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800"
  };

  const handleRubricWeightChange = (category, value) => {
    setRubricWeights({
      ...rubricWeights,
      [category]: value[0]
    });
  };

  const getEmphasisLabel = (value) => {
    if (value < 33) return "Low Priority";
    if (value < 67) return "Standard";
    return "High Priority";
  };

  const handleApplyModifications = () => {
    if (!modificationRequest.trim()) {
      alert("Please enter modification requests.");
      return;
    }
    
    alert("Your modification request will be applied to the project specifications.");
    setModificationRequest("");
  };

  const formatTimeDisplay = () => {
    if (timeHours === 0 && timeMinutes === 0) return "0 minutes";
    const parts = [];
    if (timeHours > 0) parts.push(`${timeHours} ${timeHours === 1 ? 'hour' : 'hours'}`);
    if (timeMinutes > 0) parts.push(`${timeMinutes} ${timeMinutes === 1 ? 'minute' : 'minutes'}`);
    return parts.join(' ');
  };

  const incrementHours = () => {
    const newValue = Math.min(timeHours + 1, 99);
    setTimeHours(newValue);
    setHoursInputValue(newValue.toString());
  };
  
  const decrementHours = () => {
    const newValue = Math.max(timeHours - 1, 0);
    setTimeHours(newValue);
    setHoursInputValue(newValue.toString());
  };
  
  const incrementMinutes = () => {
    setTimeMinutes(prev => {
      const newValue = Math.min(prev + 1, 59);
      setMinutesInputValue(newValue.toString());
      return newValue;
    });
  };
  
  const decrementMinutes = () => {
    setTimeMinutes(prev => {
      const newValue = Math.max(prev - 1, 0);
      setMinutesInputValue(newValue.toString());
      return newValue;
    });
  };

  const handleMinutesHold = (direction) => {
    const action = direction === 'up' ? incrementMinutes : decrementMinutes;
    
    // Initial click
    action();
    
    // Start holding after 500ms
    isHoldingMinutesTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(action, 50); // Fast increment while holding
    }, 500);
  };

  const handleMinutesRelease = () => {
    if (isHoldingMinutesTimeoutRef.current) {
      clearTimeout(isHoldingMinutesTimeoutRef.current);
      isHoldingMinutesTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      handleMinutesRelease();
    };
  }, []);

  const handleHoursChange = (e) => {
    const value = e.target.value;
    setHoursInputValue(value);
    
    if (value === '') {
      setTimeHours(0);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setTimeHours(Math.max(0, Math.min(99, numValue)));
      }
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    setMinutesInputValue(value);
    
    if (value === '') {
      setTimeMinutes(0);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setTimeMinutes(Math.max(0, Math.min(59, numValue)));
      }
    }
  };

  const handleHoursFocus = () => {
    if (timeHours === 0 && hoursInputValue === '0') { // Only clear if it's explicitly '0'
      setHoursInputValue('');
    }
  };

  const handleHoursBlur = () => {
    if (hoursInputValue === '') {
      setTimeHours(0);
      setHoursInputValue('0');
    } else {
      setHoursInputValue(timeHours.toString()); // Ensure displayed value matches actual state
    }
  };

  const handleMinutesFocus = () => {
    if (timeMinutes === 0 && minutesInputValue === '0') { // Only clear if it's explicitly '0'
      setMinutesInputValue('');
    }
  };

  const handleMinutesBlur = () => {
    if (minutesInputValue === '') {
      setTimeMinutes(0);
      setMinutesInputValue('0');
    } else {
      setMinutesInputValue(timeMinutes.toString()); // Ensure displayed value matches actual state
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto pt-8 pb-8"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-8 border-b border-gray-200">
          <div className="flex-1 pr-4">
            <h2 className="text-3xl font-semibold text-[#0B1121] mb-3">
              {project.title}
            </h2>
            <p className="text-[#6B7280] font-normal mb-4">
              {project.description}
            </p>
            
            <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#0B1121] mb-1">Why This Project</p>
                  <p className="text-sm text-[#6B7280] font-normal leading-relaxed">
                    {project.whyCurated}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-normal">{formatTimeDisplay()}</span>
              </div>
              <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${difficultyColors[project.difficulty]}`}>
                {project.difficulty}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#6B7280]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-[#0B1121] mb-3">
              Skills Tested
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 text-[#0B1121] rounded-lg text-sm font-normal"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <button
              onClick={() => setShowRequirements(!showRequirements)}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <h3 className="text-lg font-semibold text-[#0B1121]">
                Requirements ({project.requirements.length})
              </h3>
              {showRequirements ? (
                <ChevronUp className="w-5 h-5 text-[#6B7280] group-hover:text-[#0B1121]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#6B7280] group-hover:text-[#0B1121]" />
              )}
            </button>
            {showRequirements && (
              <ul className="space-y-2">
                {project.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-[#0B1121] flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[#6B7280] font-normal">{req}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Assessment Criteria with Sliders */}
          <div>
            <button
              onClick={() => setShowRubric(!showRubric)}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <h3 className="text-lg font-semibold text-[#0B1121]">
                Assessment Criteria
              </h3>
              {showRubric ? (
                <ChevronUp className="w-5 h-5 text-[#6B7280] group-hover:text-[#0B1121]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#6B7280] group-hover:text-[#0B1121]" />
              )}
            </button>
            {showRubric && (
              <div className="space-y-4">
                {project.gradingRubric.map((rubric, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#0B1121] mb-1">{rubric.category}</h4>
                        <p className="text-sm text-[#6B7280] font-normal">{rubric.description}</p>
                      </div>
                      <span className="ml-4 px-3 py-1.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg whitespace-nowrap">
                        {getEmphasisLabel(rubricWeights[rubric.category])}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#6B7280] font-normal w-20">Low Priority</span>
                      <Slider
                        value={[rubricWeights[rubric.category]]}
                        onValueChange={(value) => handleRubricWeightChange(rubric.category, value)}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-[#6B7280] font-normal w-20 text-right">High Priority</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customization Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-[#0B1121] mb-4">
              Customize Project
            </h3>
            
            {/* Time to Complete */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                Time to Complete
              </label>
              <div className="flex items-center gap-4">
                {/* Hours */}
                <div className="flex-1">
                  <label className="block text-xs text-[#6B7280] mb-1 font-normal">Hours</label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementHours}
                      className="h-10 w-10 rounded-lg border-2 border-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={hoursInputValue}
                      onChange={handleHoursChange}
                      onFocus={handleHoursFocus}
                      onBlur={handleHoursBlur}
                      className="h-10 text-center text-lg font-semibold rounded-lg border-2 border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                      max="99"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementHours}
                      className="h-10 w-10 rounded-lg border-2 border-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Minutes */}
                <div className="flex-1">
                  <label className="block text-xs text-[#6B7280] mb-1 font-normal">Minutes</label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onMouseDown={() => handleMinutesHold('down')}
                      onMouseUp={handleMinutesRelease}
                      onMouseLeave={handleMinutesRelease}
                      onTouchStart={() => handleMinutesHold('down')}
                      onTouchEnd={handleMinutesRelease}
                      className="h-10 w-10 rounded-lg border-2 border-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={minutesInputValue}
                      onChange={handleMinutesChange}
                      onFocus={handleMinutesFocus}
                      onBlur={handleMinutesBlur}
                      className="h-10 text-center text-lg font-semibold rounded-lg border-2 border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                      max="59"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onMouseDown={() => handleMinutesHold('up')}
                      onMouseUp={handleMinutesRelease}
                      onMouseLeave={handleMinutesRelease}
                      onTouchStart={() => handleMinutesHold('up')}
                      onTouchEnd={handleMinutesRelease}
                      className="h-10 w-10 rounded-lg border-2 border-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modification Requests */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
                <h4 className="text-sm font-semibold text-[#0B1121]">
                  Suggest Modifications
                </h4>
              </div>
              <p className="text-xs text-[#6B7280] mb-3 font-normal">
                Describe any changes you'd like to make to this project (e.g., add specific requirements, adjust difficulty, include particular technologies)
              </p>
              
              <Textarea
                value={modificationRequest}
                onChange={(e) => setModificationRequest(e.target.value)}
                placeholder="Example: Add a requirement for unit tests, increase difficulty by including authentication, require deployment to a live URL..."
                className="min-h-[120px] mb-3 rounded-xl"
              />
              
              {modificationRequest.trim() && (
                <Button
                  onClick={handleApplyModifications}
                  className="w-full h-10 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl"
                >
                  Apply Modifications
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-8 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A]"
          >
            Cancel
          </Button>
          <Button
            onClick={onAssign}
            className="flex-1 h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-semibold"
          >
            Select This Project
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
