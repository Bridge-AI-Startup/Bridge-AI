
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Award, CheckCircle, XCircle, Clock } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import OffersTabs from "../components/review-offers/OffersTabs";
import OffersTable from "../components/review-offers/OffersTable";
import OfferModal from "../components/review-offers/OfferModal";
import BridgeAIButton from "../components/bridge-ai/BridgeAIButton";
import BridgeAIPanel from "../components/bridge-ai/BridgeAIPanel";
import { Toaster } from "@/components/ui/toaster";

export default function ReviewOffers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(null); // New state
  const [isPanelOpen, setIsPanelOpen] = useState(false); // New state

  const offers = [
    {
      id: 1,
      candidateName: "Riley Brown",
      role: "Full-Stack Engineer Intern",
      match: "95%",
      matchScore: 95, // Added for AI context
      sentDate: "Dec 10, 2024",
      expiryDate: "Dec 24, 2024",
      status: "pending",
      salary: 52000, // Changed to yearly numeric value for AI context
      offerType: "Internship", // Added for AI context
      duration: "3 months (Summer 2025)",
      startDate: "June 1, 2025",
      benefits: ["Remote work", "Mentorship program", "Learning budget"],
      notes: "Top candidate from interview process. Strong technical skills and culture fit."
    },
    {
      id: 2,
      candidateName: "Sarah Mitchell",
      role: "Full-Stack Engineer Intern",
      match: "93%",
      matchScore: 93, // Added for AI context
      sentDate: "Dec 8, 2024",
      expiryDate: "Dec 22, 2024",
      status: "accepted",
      acceptedDate: "Dec 12, 2024",
      salary: 49920, // Changed to yearly numeric value
      offerType: "Internship", // Added for AI context
      duration: "3 months (Summer 2025)",
      startDate: "June 1, 2025",
      benefits: ["Hybrid work", "Mentorship program"],
      notes: "Excellent communication skills. Accepted offer within 4 days."
    },
    {
      id: 3,
      candidateName: "Michael Chen",
      role: "ML Engineer Intern",
      match: "91%",
      matchScore: 91, // Added for AI context
      sentDate: "Dec 5, 2024",
      expiryDate: "Dec 19, 2024",
      status: "declined",
      declinedDate: "Dec 11, 2024",
      salary: 54080, // Changed to yearly numeric value
      offerType: "Internship", // Added for AI context
      duration: "3 months (Summer 2025)",
      startDate: "June 1, 2025",
      benefits: ["Remote work", "Mentorship program", "Learning budget"],
      notes: "Candidate declined due to competing offer with higher compensation."
    },
    {
      id: 4,
      candidateName: "Emma Davis",
      role: "Product Designer Intern",
      match: "89%",
      matchScore: 89, // Added for AI context
      sentDate: "Nov 28, 2024",
      expiryDate: "Dec 12, 2024",
      status: "expired",
      salary: 47840, // Changed to yearly numeric value
      offerType: "Internship", // Added for AI context
      duration: "3 months (Summer 2025)",
      startDate: "June 1, 2025",
      benefits: ["Hybrid work", "Mentorship program"],
      notes: "Offer expired without response. Candidate may have accepted elsewhere."
    }
  ];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.candidateName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || offer.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter;
    const matchesTab = activeTab === "all" || offer.status === activeTab;
    
    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });

  const handleViewOffer = (offer) => {
    const index = filteredOffers.findIndex(o => o.id === offer.id);
    setSelectedOfferIndex(index);
    setSelectedOffer(offer);
  };

  const handleNext = () => {
    if (selectedOfferIndex !== null && selectedOfferIndex < filteredOffers.length - 1) {
      const nextIndex = selectedOfferIndex + 1;
      setSelectedOfferIndex(nextIndex);
      setSelectedOffer(filteredOffers[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (selectedOfferIndex !== null && selectedOfferIndex > 0) {
      const prevIndex = selectedOfferIndex - 1;
      setSelectedOfferIndex(prevIndex);
      setSelectedOffer(filteredOffers[prevIndex]);
    }
  };

  const handleViewProfile = (offer) => {
    navigate(`/ApplicantProfile?candidate=${encodeURIComponent(offer.candidateName)}&from=review-offers`);
  };

  const aiContext = {
    roleTitle: "All Roles",
    stage: "Offers",
    totals: {
      candidates: offers.length,
      pending: offers.filter(o => o.status === "pending").length,
      accepted: offers.filter(o => o.status === "accepted").length,
      declined: offers.filter(o => o.status === "declined").length
    },
    candidates: offers.map(o => ({
      id: String(o.id),
      name: o.candidateName,
      status: o.status === "accepted" ? "accepted" : o.status === "declined" ? "declined" : "pending",
      matchScore: o.matchScore,
      rationale: `${o.role} • ${o.offerType} • $${o.salary.toLocaleString()}/yr`
    }))
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Full-Stack Engineer Intern", path: "JobListingDashboard?id=fullstack-engineer" },
    { label: "Offers" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
              Review Offers
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Track and manage all extended offers
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by candidate name..."
                  className="h-12 pl-12 rounded-xl"
                />
              </div>

            </div>
          </motion.div>

          {/* Tabs */}
          <OffersTabs activeTab={activeTab} setActiveTab={setActiveTab} offers={offers} />

          {/* Offers Table */}
          <OffersTable 
            offers={filteredOffers}
            onViewOffer={handleViewOffer}
            onViewProfile={handleViewProfile}
          />

          {/* Offer Modal */}
          {selectedOffer && (
            <OfferModal
              offer={selectedOffer}
              onClose={() => {
                setSelectedOffer(null);
                setSelectedOfferIndex(null);
              }}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={selectedOfferIndex !== null && selectedOfferIndex < filteredOffers.length - 1}
              hasPrev={selectedOfferIndex !== null && selectedOfferIndex > 0}
            />
          )}
        </div>
      </div>

      {/* Bridge AI Components */}
      <BridgeAIButton
        hasUpdates={offers.filter(o => o.status === "pending").length > 0}
        onOpen={() => setIsPanelOpen(true)}
        isOpen={isPanelOpen}
      />

      <BridgeAIPanel
        isOpen={isPanelOpen}
        context={aiContext}
        onClose={() => setIsPanelOpen(false)}
        onPromptRun={(prompt) => console.log("Prompt:", prompt)}
        onFreeformPrompt={(text) => console.log("Freeform:", text)}
        onViewCandidate={(id) => {
          const offer = offers.find(o => String(o.id) === id);
          if (offer) handleViewOffer(offer);
        }}
        onInvite={(id) => console.log("Invite:", id)}
        onSendReminder={(id) => console.log("Reminder:", id)}
        onFlag={(id) => console.log("Flag:", id)}
      />

      <Toaster />
    </div>
  );
}
