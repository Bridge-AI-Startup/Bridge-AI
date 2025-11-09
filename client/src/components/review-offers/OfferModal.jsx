
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, DollarSign, Calendar, Clock, Award, CheckCircle, XCircle, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function OfferModal({ offer, onClose, onNext, onPrev, hasNext, hasPrev }) {
  const [notes, setNotes] = useState(offer.notes || "");
  const { toast } = useToast();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "accepted":
        return "bg-green-50 border-green-200 text-green-700";
      case "declined":
        return "bg-red-50 border-red-200 text-red-700";
      case "expired":
        return "bg-gray-50 border-gray-200 text-gray-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const handleSendReminder = () => {
    toast({
      title: "Reminder sent",
      description: `A reminder email has been sent to ${offer.candidateName}.`,
      duration: 3000,
    });
  };

  const handleWithdrawOffer = () => {
    toast({
      title: "Offer withdrawn",
      description: `The offer to ${offer.candidateName} has been withdrawn.`,
      duration: 3000,
    });
  };

  const handleSaveNotes = () => {
    toast({
      title: "Notes saved",
      description: "Your notes have been saved successfully.",
      duration: 3000,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#0B1121]">{offer.candidateName}</h2>
            <p className="text-[#6B7280] font-normal">{offer.role} • {offer.match} match</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Offer Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Banner */}
              <div className={`rounded-xl p-5 border-2 ${getStatusColor(offer.status)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold mb-1">Offer Status: {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}</p>
                    <p className="text-sm font-normal">
                      {offer.status === "pending" && `Expires on ${offer.expiryDate}`}
                      {offer.status === "accepted" && `Accepted on ${offer.acceptedDate}`}
                      {offer.status === "declined" && `Declined on ${offer.declinedDate}`}
                      {offer.status === "expired" && `Expired on ${offer.expiryDate}`}
                    </p>
                  </div>
                  {offer.status === "pending" && <Clock className="w-8 h-8" />}
                  {offer.status === "accepted" && <CheckCircle className="w-8 h-8" />}
                  {offer.status === "declined" && <XCircle className="w-8 h-8" />}
                </div>
              </div>

              {/* Compensation Details */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#1E3A8A]" />
                  Compensation & Duration
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#6B7280] font-normal mb-1">Hourly Rate</p>
                    <p className="text-lg font-semibold text-[#0B1121]">{offer.salary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] font-normal mb-1">Duration</p>
                    <p className="font-semibold text-[#0B1121]">{offer.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] font-normal mb-1">Start Date</p>
                    <p className="font-semibold text-[#0B1121]">{offer.startDate}</p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#1E3A8A]" />
                  Benefits & Perks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {offer.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#1E3A8A] text-white text-sm font-medium rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3">Internal Notes</h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this offer..."
                  className="min-h-[120px] rounded-xl bg-white"
                />
                <Button 
                  onClick={handleSaveNotes}
                  className="mt-3 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
                >
                  Save Notes
                </Button>
              </div>
            </div>

            {/* Right Column - Timeline & Actions */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#1E3A8A]" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#1E3A8A] mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-[#0B1121]">Offer Sent</p>
                      <p className="text-xs text-[#6B7280] font-normal">{offer.sentDate}</p>
                    </div>
                  </div>
                  {offer.acceptedDate && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-semibold text-[#0B1121]">Offer Accepted</p>
                        <p className="text-xs text-[#6B7280] font-normal">{offer.acceptedDate}</p>
                      </div>
                    </div>
                  )}
                  {offer.declinedDate && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-semibold text-[#0B1121]">Offer Declined</p>
                        <p className="text-xs text-[#6B7280] font-normal">{offer.declinedDate}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-[#0B1121]">Expires</p>
                      <p className="text-xs text-[#6B7280] font-normal">{offer.expiryDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {offer.status === "pending" && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-semibold text-[#0B1121] mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      onClick={handleSendReminder}
                      className="w-full h-10 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button
                      onClick={handleWithdrawOffer}
                      variant="outline"
                      className="w-full h-10 border-2"
                    >
                      Withdraw Offer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              onClick={onPrev}
              disabled={!hasPrev}
              variant="outline"
              className="h-11 px-4 border-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={onNext}
              disabled={!hasNext}
              variant="outline"
              className="h-11 px-4 border-2"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="h-11 px-6 border-2"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
