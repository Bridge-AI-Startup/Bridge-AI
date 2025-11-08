import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function SendOfferModal({ isOpen, onClose, candidateName, role }) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSendOffer = async () => {
    setIsSending(true);
    
    // Simulate sending offer
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      
      // Close modal after showing success
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
        >
          {showSuccess ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              
              <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">
                Offer Sent! 🎉
              </h2>
              <p className="text-[#6B7280] font-normal">
                {candidateName} will be notified via email
              </p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#0B1121]">Send Offer</h2>
                <button
                  onClick={onClose}
                  disabled={isSending}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {candidateName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B1121]">{candidateName}</h3>
                    <p className="text-sm text-[#6B7280] font-normal">{role}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#0B1121] mb-1">
                        Ready to send offer?
                      </p>
                      <p className="text-sm text-[#6B7280] font-normal">
                        The candidate will receive an email with your offer details and next steps.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={onClose}
                    disabled={isSending}
                    variant="outline"
                    className="flex-1 h-11 rounded-xl border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendOffer}
                    disabled={isSending}
                    className="flex-1 h-11 rounded-xl font-medium"
                    style={{ backgroundColor: '#FFFF00', color: '#1E3A8A' }}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Offer'
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}