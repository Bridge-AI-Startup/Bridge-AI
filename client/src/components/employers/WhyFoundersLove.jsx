
import React from "react";
import { motion } from "framer-motion";
import { X, Check, Brain, ArrowRight } from "lucide-react";

export default function WhyFoundersLove() {
  const comparisons = [
    {
      old: "Sorting through 500 résumés",
      new: "Reviewing 5 AI-matched candidates every week"
    },
    {
      old: "One-dimensional résumés",
      new: "Dynamic 3D AI profiles built from projects, GitHub, and experience"
    },
    {
      old: "Weeks of sourcing and waiting",
      new: "Instant matches that improve weekly as the AI learns your preferences"
    }
  ];

  return (
    <div className="relative py-20 px-6 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
            <span className="text-[#0B1121]">Why founders</span>{" "}
            <span className="text-[#1E3A8A]">love Bridge</span>
          </h2>
        </motion.div>

        <div className="space-y-8 mb-20">
          {comparisons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-[#6B7280] font-normal">{item.old}</p>
              </div>

              <div className="bg-gradient-to-br from-[#1E3A8A]/5 to-[#1E3A8A]/10 rounded-2xl p-6 border-2 border-[#1E3A8A]/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <p className="text-[#0B1121] font-semibold">{item.new}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center max-w-5xl mx-auto">
          {/* 500 Résumés - Overwhelming */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 shadow-xl relative overflow-hidden">
              {/* Overwhelming stack effect */}
              <div className="relative">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-lg p-3 mb-2 shadow-md border border-gray-200"
                    style={{
                      transform: `translateY(-${i * 2}px) rotate(${(i - 3) * 0.5}deg)`,
                      opacity: 1 - i * 0.12
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 bg-gray-200 rounded" style={{ width: `${Math.random() * 30 + 60}%` }} />
                        <div className="h-2 bg-gray-100 rounded" style={{ width: `${Math.random() * 20 + 70}%` }} />
                        <div className="flex gap-1">
                          <div className="h-4 w-10 bg-gray-100 rounded-full" />
                          <div className="h-4 w-12 bg-gray-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Overflow indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-200 text-[#0B1121] text-xs font-semibold rounded-full">
                +494 more...
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
                <X className="w-3 h-3 text-red-500" />
                <span className="text-red-700 font-semibold text-sm">500 Résumés</span>
              </div>
              <p className="text-[#6B7280] text-xs mt-1.5">Hours of manual screening</p>
            </motion.div>
          </motion.div>

          {/* Arrow with AI icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="hidden lg:flex flex-col items-center gap-2"
          >
            <ArrowRight className="w-6 h-6 text-[#1E3A8A]" />
          </motion.div>

          {/* 5 Multi-Dimensional Profiles - Clean & Intelligent */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="relative bg-white rounded-xl p-4 border-2 shadow-xl group hover:scale-105 transition-transform"
                  style={{
                    borderColor: `rgba(30, 58, 138, ${0.5 - i * 0.05})`,
                    boxShadow: `0 0 ${25 - i * 4}px rgba(30, 58, 138, ${0.2 - i * 0.03})`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-lg bg-[#1E3A8A]">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[#0B1121] font-semibold text-sm">Candidate {i + 1}</span>
                        <div className="px-2 py-0.5 bg-[#1E3A8A] text-white text-xs font-semibold rounded-full">
                          {95 - i * 2}%
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {["React", "ML", "Design"].slice(0, 2 + (i % 2)).map((skill, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-[#6B7280] rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-center mt-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1E3A8A]/10 border border-[#1E3A8A]/30 rounded-full">
                <Check className="w-3 h-3 text-[#1E3A8A]" />
                <span className="text-[#1E3A8A] font-semibold text-sm">5 Multi-Dimensional Profiles</span>
              </div>
              <p className="text-[#6B7280] text-xs mt-1.5 font-normal">AI-matched in seconds</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
