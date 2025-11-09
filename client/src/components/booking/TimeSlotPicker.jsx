import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function TimeSlotPicker({ selectedTime, onTimeSelect, selectedDate }) {
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  if (!selectedDate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h3 className="text-xl font-semibold text-[#0B1121] mb-4">
          Select a Time
        </h3>
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
          <p className="text-[#6B7280] font-normal">
            Please select a date first to see available time slots
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <h3 className="text-xl font-semibold text-[#0B1121] mb-4">
        Select a Time
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map((time, i) => {
          const isSelected = selectedTime === time;
          return (
            <Button
              key={i}
              onClick={() => onTimeSelect(time)}
              variant={isSelected ? "default" : "outline"}
              className={`h-14 rounded-xl transition-all ${
                isSelected
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                  : 'border-2 border-gray-200 hover:border-[#1E3A8A] bg-white text-[#0B1121]'
              }`}
            >
              {time}
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}