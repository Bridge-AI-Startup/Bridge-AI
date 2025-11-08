import React from "react";
import { motion } from "framer-motion";
import { Wrench, Palette, TrendingUp, Minus } from "lucide-react";

export default function TeamTypeSection({ selected, onSelect, accentColor = "#1E3A8A" }) {
  const types = [
    {
      value: "engineering",
      label: "Engineering-heavy",
      description: "Focus on technical challenges and building scalable systems.",
      icon: Wrench,
    },
    {
      value: "product-design",
      label: "Product / Design-focused",
      description: "Shape user experiences and innovative product development.",
      icon: Palette,
    },
    {
      value: "growth-business",
      label: "Growth / Business-oriented",
      description: "Drive market expansion, partnerships, and strategic initiatives.",
      icon: TrendingUp,
    },
    {
      value: "no-preference",
      label: "No preference",
      description: "Open to various team compositions and responsibilities.",
      icon: Minus,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">Team Type</h2>
      <p className="text-gray-600 mb-6 font-normal">What kind of team do you want to work with?</p>

      <div className="grid md:grid-cols-2 gap-4">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => onSelect(type.value)}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${
              selected === type.value
                ? "border-[#1E3A8A] bg-[#1E3A8A]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              selected === type.value ? "bg-[#1E3A8A]" : "bg-gray-100"
            }`}>
              <type.icon className={`w-6 h-6 ${
                selected === type.value ? "text-white" : "text-[#0B1121]"
              }`} />
            </div>
            <h3 className="font-semibold text-[#0B1121] mb-2">{type.label}</h3>
            <p className="text-sm text-gray-600 font-normal">{type.description}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}