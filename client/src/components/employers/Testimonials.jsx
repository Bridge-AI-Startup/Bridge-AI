import React from "react";
import { motion } from "framer-motion";

export default function EmployerTestimonials() {
  const testimonial = {
    quote: "We hired our first intern in two weeks — no job posting needed.",
    author: "Sarah Kim",
    role: "Founder, TechFlow AI",
    avatar: "SK"
  };

  const logos = ["UCSD", "Northwestern", "Berkeley", "MIT", "Stanford"];

  return (
    <div className="relative py-20 px-6 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
            <span className="text-[#0B1121]">Loved by</span>{" "}
            <span className="text-[#1E3A8A]">founders</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gray-50 rounded-3xl p-12 shadow-lg border border-gray-200">
            <p className="text-3xl font-semibold text-[#0B1121] mb-8 leading-relaxed">
              "{testimonial.quote}"
            </p>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#1E3A8A] text-white text-xl font-semibold">
                {testimonial.avatar}
              </div>
              <div>
                <p className="font-semibold text-[#0B1121] text-lg">{testimonial.author}</p>
                <p className="text-[#6B7280] font-normal">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm font-normal mb-8 uppercase tracking-wider">
            Trusted by students from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {logos.map((logo, i) => (
              <div
                key={i}
                className="px-6 py-3 bg-gray-100 rounded-xl text-[#0B1121] font-semibold text-lg border border-gray-200"
              >
                {logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}