import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function BookingConfirmation({ 
  company, 
  role, 
  selectedDate, 
  selectedTime, 
  onBackToDashboard 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-semibold text-[#0B1121] mb-4">
          Interview Booked!
        </h2>
        
        <p className="text-lg text-[#6B7280] font-normal mb-8">
          Your interview with {company} has been successfully scheduled
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0B1121] mb-1">Date</p>
                <p className="text-[#6B7280] font-normal">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0B1121] mb-1">Time</p>
                <p className="text-[#6B7280] font-normal">{selectedTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0B1121] mb-1">Position</p>
                <p className="text-[#6B7280] font-normal">{role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 mb-8 border border-blue-200">
          <p className="text-sm text-[#1E3A8A] font-normal">
            📧 A calendar invite and interview details have been sent to your email
          </p>
        </div>

        <Button
          onClick={onBackToDashboard}
          className="w-full h-14 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-medium text-lg"
        >
          Back to Dashboard
        </Button>
      </div>
    </motion.div>
  );
}