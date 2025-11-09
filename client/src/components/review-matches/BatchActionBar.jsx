import React from "react";
import { motion } from "framer-motion";
import { Calendar, FileCheck, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BatchActionBar({ selectedCount, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1E3A8A] rounded-2xl p-4 flex items-center justify-between mt-6"
    >
      <div className="flex items-center gap-3">
        <span className="text-white font-semibold">
          {selectedCount} candidate{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <Button
          onClick={onClear}
          variant="ghost"
          size="sm"
          className="h-8 text-white hover:bg-white/20"
        >
          Clear
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 bg-white/20 text-white hover:bg-white/30"
        >
          <FileCheck className="w-4 h-4 mr-2" />
          Assign Project
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 bg-white/20 text-white hover:bg-white/30"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Interview
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 bg-white/20 text-white hover:bg-white/30"
        >
          <Award className="w-4 h-4 mr-2" />
          Extend Offer
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 bg-white/20 text-white hover:bg-red-500/90"
        >
          <X className="w-4 h-4 mr-2" />
          Pass
        </Button>
      </div>
    </motion.div>
  );
}