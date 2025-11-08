import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function OnboardingActions({ canContinue, onContinue }) {
  return (
    <>
      {/* Privacy Line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-sm text-gray-500 text-center mb-8 font-normal"
      >
        We never share without your permission.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-end"
      >
        <Button
          onClick={onContinue}
          disabled={!canContinue}
          className="h-14 px-10 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: canContinue ? '#FFFF00' : '#E5E5E5',
            color: canContinue ? '#1E3A8A' : '#9CA3AF'
          }}
        >
          Continue
        </Button>
      </motion.div>
    </>
  );
}