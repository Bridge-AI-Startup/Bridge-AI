import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ParseActions({ isComplete, onSkip, onAddProjects, onShowMatches }) {
  return (
    <div className="flex items-center justify-between mt-8">
      <AnimatePresence>
        {!isComplete && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onSkip}
            className="text-sm text-gray-400 hover:text-white transition-colors font-normal"
          >
            Skip
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col gap-3"
          >
            <Button
              onClick={onAddProjects}
              className="w-full h-14 px-10 text-lg font-medium rounded-2xl text-[#1E3A8A] shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: '#FFFF00' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
            >
              Continue
            </Button>
            <button
              onClick={onShowMatches}
              className="w-full h-14 px-10 text-lg font-normal rounded-2xl text-gray-300 hover:text-white transition-colors"
            >
              Show me my matches
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}