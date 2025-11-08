import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlertCard({ title, alerts, onNotify }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-red-200 p-5 mb-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="text-base font-semibold text-[#0B1121]">{title}</h3>
      </div>
      
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex-1">
              <p className="font-semibold text-[#0B1121] text-sm">{alert.name}</p>
              <p className="text-xs text-red-700 mt-0.5">{alert.message}</p>
            </div>
            {onNotify && (
              <Button
                onClick={() => onNotify(alert.id)}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-100"
              >
                <Bell className="w-3.5 h-3.5 mr-1" />
                Notify
              </Button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}