import React from "react";
import { motion } from "framer-motion";
import { X, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AssignConfirmationModal({ project, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#1E3A8A]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#0B1121]">
                Ready to Post Your Listing?
              </h2>
              <p className="text-[#6B7280] font-normal text-sm mt-1">
                This will make your job listing live with the selected project
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-2 border-gray-200">
          <h3 className="text-lg font-semibold text-[#0B1121] mb-3">
            Selected Assessment Project
          </h3>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-[#0B1121] mb-2">{project.title}</h4>
            <p className="text-sm text-[#6B7280] font-normal mb-3">{project.shortDescription}</p>
            <div className="flex flex-wrap gap-2">
              {project.skills.slice(0, 5).map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-gray-100 text-[#0B1121] rounded-lg text-xs font-normal"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#0B1121] mb-2">What happens next:</h3>
              <ul className="space-y-2 text-sm text-[#6B7280] font-normal">
                <li className="flex items-start gap-2">
                  <span className="text-[#1E3A8A] font-semibold">1.</span>
                  <span>Your job listing goes live immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1E3A8A] font-semibold">2.</span>
                  <span>Bridge AI starts matching qualified candidates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1E3A8A] font-semibold">3.</span>
                  <span>Matched candidates receive this project to complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1E3A8A] font-semibold">4.</span>
                  <span>You'll receive your first matches on Monday at 9 AM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-2 border-gray-200"
          >
            Go Back
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-xl font-medium"
            style={{ backgroundColor: '#FFFF00', color: '#1E3A8A' }}
          >
            Post Job Listing
          </Button>
        </div>
      </motion.div>
    </div>
  );
}