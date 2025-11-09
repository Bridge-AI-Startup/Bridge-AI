import React from "react";
import { motion } from "framer-motion";
import { FileText, Brain, Calendar } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Describe your role",
    description: "Enter a short prompt or upload a brief"
  },
  {
    number: "02",
    icon: Brain,
    title: "AI matches candidates",
    description: "Uses student projects, skills, and experiences to find real fit"
  },
  {
    number: "03",
    icon: Calendar,
    title: "Review & interview",
    description: "Request mini-projects, assessments, or schedule interviews instantly"
  }
];

export default function EmployerHowItWorks() {
  return (
    <div className="relative py-16 md:py-20 px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-2 rounded-full font-normal text-sm mb-6 bg-gray-100 border border-gray-300 text-[#1E3A8A]">
            How it works
          </div>
          <h2 className="text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
            <span className="text-[#0B1121]">Three steps to</span>{" "}
            <span className="text-[#1E3A8A]">hiring great talent</span>
          </h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed font-normal">
            Stop sorting résumés. Our AI builds 3D skill profiles from real projects and experience — and matches you only with candidates who fit.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative h-full"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-full w-full h-0.5 -translate-x-1/2 bg-gray-300" />
              )}

              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 group h-full flex flex-col">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#1E3A8A] rounded-2xl flex items-center justify-center text-white font-medium shadow-lg">
                  {step.number}
                </div>

                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-gray-100">
                  <step.icon className="w-10 h-10 text-[#0B1121]" />
                </div>

                <h3 className="text-2xl font-semibold mb-4 text-[#0B1121]">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed flex-grow font-normal">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}