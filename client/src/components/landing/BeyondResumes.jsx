
import React from "react";
import { motion } from "framer-motion";
import { FileText, Network, Sparkles, Github, Briefcase, Code, Award, BookOpen, Users } from "lucide-react";

export default function BeyondResumes() {
  const nodes = [
    { label: "GitHub", Icon: Github, position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
    { label: "Projects", Icon: Code, position: "top-[15%] right-0 translate-x-1/2 -translate-y-1/2" },
    { label: "Skills", Icon: Award, position: "bottom-[15%] right-0 translate-x-1/2 translate-y-1/2" },
    { label: "Experience", Icon: Briefcase, position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
    { label: "Coursework", Icon: BookOpen, position: "bottom-[15%] left-0 -translate-x-1/2 translate-y-1/2" },
    { label: "Leadership", Icon: Users, position: "top-[15%] left-0 -translate-x-1/2 -translate-y-1/2" }
  ];

  return (
    <div className="relative py-16 md:py-20 px-4 md:px-6 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-6">
            <span className="text-[#0B1121]">Beyond</span>{" "}
            <span className="text-[#1E3A8A]">Résumés</span>
          </h2>
          <p className="text-lg md:text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed mb-4 font-normal">
            Résumés were invented in the 1400s — and they haven't evolved much since. They're static, one-dimensional lists of titles and buzzwords that can't capture who you actually are.
          </p>
          <p className="text-lg md:text-xl text-[#0B1121] font-normal max-w-3xl mx-auto leading-relaxed">
            Our platform goes beyond static résumés. It continuously evolves as you do — analyzing every new project, course, or experience you add. Over time, it builds a living 3D map of your skills, understanding meaning and potential, not just keywords.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto pb-8">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-full"
          >
            <div className="text-center h-14 flex items-center justify-center flex-shrink-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm font-medium border border-gray-300">
                <FileText className="w-4 h-4" />
                One Dimensional
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 md:p-8 border-2 border-gray-300 shadow-lg flex-1 flex items-center my-6 min-h-[500px] md:min-h-[600px]">
              <div className="bg-white rounded-2xl p-6 md:p-8 space-y-4 md:space-y-6 w-full border border-gray-200">
                <div className="space-y-2">
                  <div className="h-6 md:h-8 bg-gray-200 rounded w-32 md:w-48" />
                  <div className="h-3 md:h-4 bg-gray-100 rounded w-24 md:w-32" />
                  <div className="h-3 md:h-4 bg-gray-100 rounded w-28 md:w-40" />
                </div>

                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-gray-200">
                  <div className="h-2 md:h-3 bg-gray-100 rounded w-full" />
                  <div className="h-2 md:h-3 bg-gray-100 rounded w-full" />
                  <div className="h-2 md:h-3 bg-gray-100 rounded w-3/4" />
                </div>

                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-gray-200">
                  <div className="h-3 md:h-4 bg-gray-100 rounded w-24 md:w-32" />
                  <div className="flex gap-2">
                    <div className="h-5 md:h-6 bg-gray-100 rounded-full w-16 md:w-20" />
                    <div className="h-5 md:h-6 bg-gray-100 rounded-full w-20 md:w-24" />
                    <div className="h-5 md:h-6 bg-gray-100 rounded-full w-12 md:w-16" />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-gray-200">
                  <div className="h-2 md:h-3 bg-gray-100 rounded w-full" />
                  <div className="h-2 md:h-3 bg-gray-100 rounded w-5/6" />
                </div>

                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-gray-200">
                  <div className="h-2 md:h-3 bg-gray-100 rounded w-full" />
                  <div className="h-2 md:h-3 bg-gray-100 rounded w-4/5" />
                </div>

                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-gray-200">
                  <div className="h-2 md:h-3 bg-gray-100 rounded w-full" />
                  <div className="h-2 md:h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            </div>

            <div className="text-center h-14 flex items-center justify-center flex-shrink-0">
              <div className="inline-block px-4 md:px-6 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full">
                Static & Limited
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-full"
          >
            <div className="text-center h-14 flex items-center justify-center flex-shrink-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 border border-gray-300 text-[#1E3A8A]">
                <Network className="w-4 h-4" />
                Multi-Dimensional Understanding
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 md:p-16 border-2 border-gray-300 shadow-2xl flex-1 flex items-center justify-center my-6 min-h-[500px] md:min-h-[600px]">
              <div className="relative w-full max-w-[280px] md:max-w-sm aspect-square">
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center shadow-2xl bg-[#1E3A8A]">
                    <Sparkles className="w-10 md:w-12 h-10 md:h-12 text-white" />
                  </div>
                </div>

                {nodes.map((node, i) => (
                  <div
                    key={i}
                    className={`absolute ${node.position}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 md:w-16 h-12 md:h-16 rounded-full flex items-center justify-center shadow-lg bg-[#1E3A8A]">
                        <node.Icon className="w-6 md:w-8 h-6 md:h-8 text-white" />
                      </div>
                      <span className="text-[#0B1121] text-xs md:text-sm font-semibold whitespace-nowrap bg-white px-2 md:px-3 py-1 rounded-lg border border-gray-200">
                        {node.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center h-14 flex items-center justify-center flex-shrink-0">
              <div className="inline-block px-4 md:px-6 py-2 text-white text-sm font-semibold rounded-full shadow-lg bg-[#1E3A8A]">
                Dynamic & Deep
              </div>
            </div>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 md:mt-24 text-center"
        >
          <div className="max-w-3xl mx-auto rounded-3xl p-6 md:p-8 border border-gray-300 bg-gray-50">
            <p className="text-base md:text-lg text-[#0B1121] leading-relaxed font-normal">
              <span className="font-semibold text-[#1E3A8A]">The result? </span> 
               Our AI sees patterns, connections, and capabilities that no human recruiter or ATS system could spot by scanning a PDF.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
