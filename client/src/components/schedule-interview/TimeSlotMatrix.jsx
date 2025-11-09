
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TimeSlotMatrix({
  weekDays,
  timeSlots,
  weekOffset,
  setWeekOffset,
  selectedSlots,
  isDragging,
  dragStart,
  dragEnd,
  dragMode,
  handleMouseDown,
  handleMouseEnter,
  getSlotId,
  gridContainerRef,
  selectAllMornings,
  selectAllAfternoons,
  clearAllSlots,
  areAllSlotsInRangeSelected
}) {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateShort = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const isSlotInDragArea = (dayIdx, timeIdx) => {
    if (!isDragging || !dragStart || !dragEnd) return false;
    
    const minDay = Math.min(dragStart.dayIdx, dragEnd.dayIdx);
    const maxDay = Math.max(dragStart.dayIdx, dragEnd.dayIdx);
    const minTime = Math.min(dragStart.timeIdx, dragEnd.timeIdx);
    const maxTime = Math.max(dragStart.timeIdx, dragEnd.timeIdx);
    
    return dayIdx >= minDay && dayIdx <= maxDay && timeIdx >= minTime && timeIdx <= maxTime;
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-[#0B1121]">
            Your Available Time Slots
          </label>
          <div className="flex gap-2">
            <button
              onClick={selectAllMornings}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-normal ${
                areAllSlotsInRangeSelected("9:00 AM", "11:30 AM")
                  ? "bg-[#1E3A8A] text-white"
                  : "bg-gray-100 text-[#0B1121] hover:bg-gray-200"
              }`}
            >
              All Mornings
            </button>
            <button
              onClick={selectAllAfternoons}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-normal ${
                areAllSlotsInRangeSelected("1:00 PM", "5:00 PM")
                  ? "bg-[#1E3A8A] text-white"
                  : "bg-gray-100 text-[#0B1121] hover:bg-gray-200"
              }`}
            >
              All Afternoons
            </button>
            <button
              onClick={clearAllSlots}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-[#6B7280] hover:bg-gray-200 transition-colors font-normal"
            >
              Clear All
            </button>
          </div>
        </div>
        <p className="text-xs text-[#6B7280] font-normal">
          Click and drag to select a rectangular area of time slots
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
          disabled={weekOffset === 0}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-[#0B1121]">
          Week of {formatDate(weekDays[0])}
        </span>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={gridContainerRef}
        className="overflow-x-auto"
        style={{ userSelect: 'none' }}
      >
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 mb-2">
            <div className="text-xs font-semibold text-[#6B7280]">Time</div>
            {weekDays.map((day, i) => (
              <div key={i} className="text-xs font-semibold text-[#0B1121] text-center">
                {formatDateShort(day)}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {timeSlots.map((time, timeIdx) => (
              <div key={timeIdx} className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
                <div className="time-label text-xs text-[#6B7280] flex items-center font-normal">
                  {time}
                </div>
                {weekDays.map((day, dayIdx) => {
                  const slotId = getSlotId(day, time);
                  const isCurrentlySelected = selectedSlots.has(slotId);
                  const isInCurrentDragArea = isSlotInDragArea(dayIdx, timeIdx);

                  let buttonClasses = "h-8 rounded-lg border-2 transition-all text-xs relative";

                  if (!isDragging) {
                    if (isCurrentlySelected) {
                      buttonClasses += " border-[#1E3A8A] bg-[#1E3A8A] text-white font-semibold";
                    } else {
                      buttonClasses += " border-gray-200 hover:border-gray-300 text-[#6B7280] hover:bg-gray-50";
                    }
                  } else {
                    if (isInCurrentDragArea) {
                      if (dragMode === 'select') {
                        buttonClasses += " bg-blue-100/50 border-blue-300";
                      } else {
                        buttonClasses += " bg-red-100/50 border-red-300";
                      }
                    } else {
                      if (isCurrentlySelected) {
                        buttonClasses += " border-[#1E3A8A] bg-[#1E3A8A] text-white font-semibold";
                      } else {
                        buttonClasses += " border-gray-200";
                      }
                    }
                  }
                  
                  return (
                    <button
                      key={dayIdx}
                      data-day-idx={dayIdx}
                      data-time-idx={timeIdx}
                      onMouseDown={(e) => handleMouseDown(dayIdx, timeIdx, e)}
                      onMouseEnter={() => handleMouseEnter(dayIdx, timeIdx)}
                      className={buttonClasses}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-[#6B7280] mt-4 font-normal">
        Selected {selectedSlots.size} time slot{selectedSlots.size !== 1 ? 's' : ''}. Candidate will choose their preferred time from your selection.
      </p>
    </>
  );
}
