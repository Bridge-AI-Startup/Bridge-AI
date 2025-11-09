import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PostingSuccessModal({ projectTitle, onViewDashboard, onLearnMore }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-semibold text-[#0B1121] mb-3">
            Your Listing is Live! 🎉
          </h2>
          <p className="text-lg text-[#6B7280] font-normal">
            Your job listing has been successfully posted with the project:
          </p>
          <p className="text-lg font-semibold text-[#1E3A8A] mt-2">
            "{projectTitle}"
          </p>
        </motion.div>

        {/* What's Next Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-200"
        >
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-[#1E3A8A] flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#0B1121] mb-2">What happens next?</h3>
              <p className="text-sm text-[#6B7280] font-normal leading-relaxed">
                Bridge AI is now analyzing student profiles to find your best matches. You'll receive your first batch of qualified candidates who will complete your selected project.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-200">
            <Calendar className="w-10 h-10 text-[#1E3A8A] flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#0B1121]">First matches arrive Monday, 9:00 AM</p>
              <p className="text-sm text-[#6B7280] font-normal">
                We'll email you when new candidates are matched
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            onClick={onLearnMore}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A]"
          >
            Learn About Matching
          </Button>
          <Button
            onClick={onViewDashboard}
            className="flex-1 h-12 rounded-xl font-medium"
            style={{ backgroundColor: '#FFFF00', color: '#1E3A8A' }}
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}