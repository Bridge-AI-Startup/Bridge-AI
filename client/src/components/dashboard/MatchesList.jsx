import React from "react";
import { motion } from "framer-motion";
import MatchCard from "./MatchCard";

export default function MatchesList({ matches }) {
  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-2xl font-semibold text-[#0B1121]"
      >
        To Do
      </motion.h2>
      
      {matches.map((match, i) => (
        <MatchCard
          key={i}
          match={match}
          delay={0.2 + i * 0.1}
        />
      ))}
    </div>
  );
}