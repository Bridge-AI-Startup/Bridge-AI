import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { format, addDays } from "date-fns";

export default function DateSelector({ selectedDate, onDateSelect }) {
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <h3 className="text-xl font-semibold text-[#0B1121] mb-4">
        Select a Date
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {dates.map((date, i) => {
          const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          return (
            <Button
              key={i}
              onClick={() => onDateSelect(date)}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto py-4 px-3 flex flex-col items-center rounded-xl transition-all ${
                isSelected
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                  : 'border-2 border-gray-200 hover:border-[#1E3A8A] bg-white'
              }`}
            >
              <span className="text-xs font-normal mb-1">
                {format(date, 'EEE')}
              </span>
              <span className="text-2xl font-semibold">
                {format(date, 'd')}
              </span>
              <span className="text-xs font-normal">
                {format(date, 'MMM')}
              </span>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}