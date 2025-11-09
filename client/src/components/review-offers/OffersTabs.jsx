import React from "react";
import { motion } from "framer-motion";

export default function OffersTabs({ activeTab, setActiveTab, offers }) {
  const tabs = [
    { id: "all", label: "All Offers", count: offers.length },
    { id: "pending", label: "Pending", count: offers.filter(o => o.status === "pending").length },
    { id: "accepted", label: "Accepted", count: offers.filter(o => o.status === "accepted").length },
    { id: "declined", label: "Declined", count: offers.filter(o => o.status === "declined").length },
    { id: "expired", label: "Expired", count: offers.filter(o => o.status === "expired").length }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-2 border border-gray-200 mb-6 flex gap-2 overflow-x-auto"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-[#1E3A8A] text-white'
              : 'text-[#6B7280] hover:bg-gray-100'
          }`}
        >
          {tab.label}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            activeTab === tab.id
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 text-[#6B7280]'
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </motion.div>
  );
}