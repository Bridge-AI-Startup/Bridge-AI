import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../navigation/Header";

export default function SuccessState({ submittedAt, onBackToDashboard }) {
  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />
      
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-4">
              Assessment Submitted!
            </h1>
            <p className="text-lg text-[#6B7280] font-normal mb-8">
              Your work has been successfully submitted. The company will review it shortly and get back to you.
            </p>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8 inline-block">
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Calendar className="w-5 h-5" />
                <span className="font-normal">
                  Submitted on {formatTimestamp(submittedAt)}
                </span>
              </div>
            </div>

            <Button
              onClick={onBackToDashboard}
              className="h-14 px-10 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-semibold text-lg"
            >
              Return to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}