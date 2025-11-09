import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Video, CheckCircle2 } from "lucide-react";

export default function VideoSection({ recorded, onRecord }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-gradient-to-br from-[#FFFF00]/10 to-[#1E3A8A]/5 rounded-2xl p-8 border-2 border-dashed border-[#FFFF00]/30"
    >
      <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">
        Want to stand out?
      </h2>
      <p className="text-[#6B7280] font-normal mb-6">
        Record a 30-second video telling us what kind of startup excites you.
      </p>

      <Button
        onClick={onRecord}
        disabled={recorded}
        className={`
          h-12 px-6 rounded-xl transition-all
          ${recorded 
            ? "bg-green-500 hover:bg-green-600 text-white" 
            : "bg-white hover:bg-gray-50 text-[#0B1121] border-2 border-gray-200"
          }
        `}
      >
        {recorded ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Video Recorded
          </>
        ) : (
          <>
            <Video className="w-4 h-4 mr-2" />
            Record Video (Optional)
          </>
        )}
      </Button>
    </motion.div>
  );
}