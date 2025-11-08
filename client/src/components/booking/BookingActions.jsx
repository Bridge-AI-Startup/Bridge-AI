import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";

export default function BookingActions({ onConfirm, onCancel, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <Button
        onClick={onConfirm}
        disabled={disabled}
        className="flex-1 h-14 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calendar className="w-5 h-5 mr-2" />
        Confirm Interview
      </Button>
      <Button
        onClick={onCancel}
        variant="outline"
        className="sm:w-auto h-14 px-8 border-2 border-gray-200 hover:border-[#1E3A8A] rounded-xl font-medium text-lg"
      >
        <X className="w-5 h-5 mr-2" />
        Cancel
      </Button>
    </motion.div>
  );
}