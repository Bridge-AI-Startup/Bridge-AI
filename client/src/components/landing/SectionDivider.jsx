
import React from "react";
import { motion } from "framer-motion";

export default function SectionDivider({ variant = "wave", flip = false }) {
  if (variant === "wave") {
    return (
      <div className={`relative h-16 ${flip ? 'rotate-180' : ''}`}>
        <svg
          className="absolute bottom-0 w-full h-16"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#EC4899"
            fillOpacity="0.3"
          />
          <path
            d="M0,96L48,90.7C96,85,192,75,288,69.3C384,64,480,64,576,69.3C672,75,768,85,864,85.3C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#EC4899"
            fillOpacity="0.2"
          />
        </svg>
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className="relative h-16 bg-gradient-to-b from-[#F9FAFB] via-white to-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-96 h-16 blur-3xl bg-[#EC4899]/20"
          />
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className="relative h-16 flex items-center justify-center overflow-hidden">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 rounded-full bg-[#EC4899]"
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
