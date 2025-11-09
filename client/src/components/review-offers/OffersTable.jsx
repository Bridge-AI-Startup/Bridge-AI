
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Clock, AlertCircle, Mail, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function OffersTable({ offers, onViewOffer, onViewProfile }) {
  const { toast } = useToast();

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "declined":
        return <XCircle className="w-4 h-4" />;
      case "expired":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "accepted":
        return "text-green-700 bg-green-50 border-green-200";
      case "declined":
        return "text-red-700 bg-red-50 border-red-200";
      case "expired":
        return "text-gray-700 bg-gray-50 border-gray-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleSendReminder = (e, candidateName) => {
    e.stopPropagation();
    toast({
      title: "Reminder sent",
      description: `A reminder email has been sent to ${candidateName}.`,
      duration: 3000,
    });
  };

  const handleWithdrawOffer = (e, candidateName) => {
    e.stopPropagation();
    toast({
      title: "Offer withdrawn",
      description: `The offer to ${candidateName} has been withdrawn.`,
      duration: 3000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Candidate</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Sent</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Expires</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">View Offer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1121]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offers.map((offer, idx) => (
              <motion.tr
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                onClick={() => onViewProfile({ ...offer, from: 'review-offers' })}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {offer.candidateName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#0B1121] block">{offer.candidateName}</span>
                      <span className="text-sm text-[#6B7280] font-normal">{offer.match} match</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{offer.role}</td>
                <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{offer.sentDate}</td>
                <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{offer.expiryDate}</td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-semibold text-sm ${getStatusColor(offer.status)}`}>
                    {getStatusIcon(offer.status)}
                    {getStatusLabel(offer.status)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOffer(offer);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-9"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {offer.status === "pending" && (
                      <>
                        <Button
                          onClick={(e) => handleSendReminder(e, offer.candidateName)}
                          variant="ghost"
                          size="sm"
                          className="h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Remind
                        </Button>
                        <Button
                          onClick={(e) => handleWithdrawOffer(e, offer.candidateName)}
                          variant="ghost"
                          size="sm"
                          className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
