import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFFF00] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-[#1E3A8A]" />
          </div>
          <h3 className="text-2xl font-semibold text-[#0B1121]">
            Submit Assessment?
          </h3>
        </div>
        
        <p className="text-[#6B7280] font-normal mb-6 leading-relaxed">
          Are you sure you want to submit? You won't be able to make any changes after submission.
        </p>
        
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A]"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-semibold"
          >
            Yes, Submit
          </Button>
        </div>
      </motion.div>
    </div>
  );
}