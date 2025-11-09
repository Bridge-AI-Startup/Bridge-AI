import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function BridgeAIButton({ hasUpdates, onOpen, isOpen }) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="fixed bottom-7 right-7 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-[#1E3A8A] text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-medium text-sm">Bridge AI</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}