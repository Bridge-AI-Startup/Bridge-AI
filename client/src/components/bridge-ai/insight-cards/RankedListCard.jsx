import React from "react";
import { motion } from "framer-motion";
import { Eye, UserPlus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RankedListCard({ title, items, onViewCandidate, onInvite, onSendReminder }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-5 mb-4"
    >
      <h3 className="text-base font-semibold text-[#0B1121] mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xs font-semibold">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#0B1121] text-sm">{item.name}</p>
              <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">{item.rationale}</p>
              {item.score && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                    <div 
                      className="h-full bg-[#1E3A8A] rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#0B1121]">{item.score}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                onClick={() => onViewCandidate?.(item.id)}
                variant="ghost"
                size="sm"
                className="h-7 px-2"
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
              {onInvite && (
                <Button
                  onClick={() => onInvite(item.id)}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                </Button>
              )}
              {onSendReminder && (
                <Button
                  onClick={() => onSendReminder(item.id)}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Bell className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}