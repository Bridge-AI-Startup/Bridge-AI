import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function IndustrySection({ selected, onToggle, accentColor = "#1E3A8A" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [otherText, setOtherText] = useState("");

  const industries = [
    "AI / Machine Learning",
    "Fintech",
    "SaaS / Productivity",
    "Consumer Apps",
    "Healthtech",
    "Climate / Sustainability",
    "Edtech",
    "Open Source",
    "E-commerce",
    "Biotech",
    "Enterprise Software",
    "Gaming",
    "Social Media",
    "Cryptocurrency / Blockchain",
    "Cloud Infrastructure",
    "Cybersecurity",
    "Developer Tools",
    "Marketing Tech",
    "HR Tech",
    "Real Estate Tech",
    "Food Tech",
    "Transportation / Mobility",
    "Agriculture Tech",
    "Legal Tech",
    "InsurTech",
    "Supply Chain / Logistics",
    "Manufacturing / Hardware",
    "Media / Entertainment",
    "Travel Tech",
    "Fashion / Retail Tech",
    "Sports Tech",
    "Music Tech",
    "Analytics / Data",
    "IoT (Internet of Things)",
    "AR / VR",
    "Robotics",
    "Space Tech",
    "Energy Tech",
    "Water Tech",
    "Waste Management",
    "Construction Tech",
    "Telecommunications",
    "Government Tech",
    "Other"
  ];

  const filteredIndustries = industries.filter(industry =>
    industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOtherTextChange = (e) => {
    const text = e.target.value;
    setOtherText(text);
    
    // If "Other" is not selected yet, select it
    if (text && !selected.includes("Other")) {
      onToggle("Other");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">Industries</h2>
      <p className="text-gray-600 mb-6 font-normal">Select all industries that interest you</p>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search industries..."
          className="h-12 pl-11 rounded-xl bg-gray-50 border-gray-200"
        />
      </div>

      {/* Industries List */}
      <div className="max-h-[400px] overflow-y-auto mb-4 border border-gray-200 rounded-xl p-4 bg-gray-50">
        <div className="space-y-3">
          {filteredIndustries.map((industry) => {
            const isSelected = selected.includes(industry);
            return (
              <div
                key={industry}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer"
                onClick={() => onToggle(industry)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggle(industry)}
                  className="border-2 border-gray-300 data-[state=checked]:bg-[#1E3A8A] data-[state=checked]:border-[#1E3A8A]"
                />
                <label className="flex-1 text-[#0B1121] font-normal cursor-pointer">
                  {industry}
                </label>
              </div>
            );
          })}
          
          {filteredIndustries.length === 0 && (
            <p className="text-center text-gray-500 py-4 font-normal">
              No industries found matching "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Other Input Field - Shows when "Other" is selected */}
      {selected.includes("Other") && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4"
        >
          <Input
            value={otherText}
            onChange={handleOtherTextChange}
            placeholder="Please specify your industry..."
            className="h-11 rounded-xl bg-white border-gray-300"
          />
        </motion.div>
      )}

      {/* Selected Count */}
      {selected.length > 0 && (
        <div className="mt-4 text-sm text-[#6B7280] font-normal">
          {selected.length} {selected.length === 1 ? "industry" : "industries"} selected
        </div>
      )}
    </motion.div>
  );
}