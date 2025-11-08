import React from "react";
import StatsCard from "./StatsCard";

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat, i) => (
        <StatsCard
          key={i}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          delay={i * 0.1}
        />
      ))}
    </div>
  );
}