import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function OnboardingParse() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Auto-navigate after a short delay
    const timer = setTimeout(() => {
      navigate("/AddProjects");
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#1E3A8A] border-t-transparent rounded-full mx-auto mb-6"
        />
        <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">
          Processing your information...
        </h2>
        <p className="text-[#6B7280] font-normal">
          This will only take a moment
        </p>
      </motion.div>
    </div>
  );
}