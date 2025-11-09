import React from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock } from "lucide-react";
import CompanyLogo from "../dashboard/CompanyLogo";

export default function CompanyCard({ company, role, location, duration }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 mb-8"
    >
      <div className="flex items-start gap-4">
        <CompanyLogo type={company.toLowerCase().replace(/\s+/g, '')} />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">
            {company}
          </h2>
          <p className="text-lg text-[#6B7280] font-normal mb-4">
            {role}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-normal">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="font-normal">Virtual Interview</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-normal">{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}