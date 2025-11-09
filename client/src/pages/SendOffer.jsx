import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Award, DollarSign, Calendar, Briefcase, CheckCircle, Plus, X } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function SendOffer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get candidate info from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const candidateName = urlParams.get('candidate') || 'Maya Johnson';
  const roleTitle = urlParams.get('role') || 'Full-Stack Engineer Intern';
  const fromPage = urlParams.get('from');

  // Offer form state
  const [hourlyRate, setHourlyRate] = useState('25');
  const [durationType, setDurationType] = useState('3-months');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [workArrangement, setWorkArrangement] = useState('hybrid');
  const [expiryDays, setExpiryDays] = useState('14');
  const [selectedBenefits, setSelectedBenefits] = useState(['mentorship', 'learning-budget']);
  const [customBenefit, setCustomBenefit] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const benefitOptions = [
    { id: 'remote', label: 'Remote work' },
    { id: 'hybrid', label: 'Hybrid work' },
    { id: 'mentorship', label: 'Mentorship program' },
    { id: 'learning-budget', label: 'Learning budget' },
    { id: 'team-events', label: 'Team events' },
    { id: 'health', label: 'Health benefits' },
    { id: 'equipment', label: 'Equipment provided' },
    { id: 'snacks', label: 'Snacks & meals' }
  ];

  const toggleBenefit = (benefitId) => {
    setSelectedBenefits(prev => 
      prev.includes(benefitId) 
        ? prev.filter(id => id !== benefitId)
        : [...prev, benefitId]
    );
  };

  const addCustomBenefit = () => {
    if (customBenefit.trim()) {
      setSelectedBenefits(prev => [...prev, `custom-${Date.now()}`]);
      setCustomBenefit('');
    }
  };

  const handleSendOffer = () => {
    const offerData = {
      candidate: candidateName,
      role: roleTitle,
      hourlyRate: parseFloat(hourlyRate),
      durationType,
      startDate,
      endDate,
      workArrangement,
      expiryDays: parseInt(expiryDays),
      benefits: selectedBenefits.map(id => {
        const benefit = benefitOptions.find(b => b.id === id);
        return benefit ? benefit.label : id;
      }),
      additionalNotes
    };

    console.log('Sending offer:', offerData);
    setShowSuccess(true);

    setTimeout(() => {
      toast({
        title: "Offer sent successfully!",
        description: `Your offer has been sent to ${candidateName}.`,
        duration: 3000,
      });
      navigate('/ReviewOffers');
    }, 2000);
  };

  const canSend = hourlyRate && durationType && startDate && expiryDays;

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: roleTitle, path: `JobListingDashboard?id=fullstack-engineer` },
    { label: "Send Offer" }
  ];

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="EmployerDashboard" />
        
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              
              <h2 className="text-3xl font-semibold text-[#0B1121] mb-3">
                Offer Sent Successfully! 🎉
              </h2>
              <p className="text-lg text-[#6B7280] font-normal mb-6">
                Your offer has been sent to <span className="font-semibold text-[#0B1121]">{candidateName}</span>
              </p>
              
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 mb-6">
                <p className="text-sm text-[#6B7280] font-normal">
                  The candidate will receive an email notification and has <span className="font-semibold text-[#0B1121]">{expiryDays} days</span> to respond.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => navigate('/ReviewOffers')}
                  className="h-12 px-8 rounded-xl font-medium"
                  style={{ backgroundColor: '#FFFF00', color: '#1E3A8A' }}
                >
                  View All Offers
                </Button>
                <Button
                  onClick={() => navigate('/EmployerDashboard')}
                  variant="outline"
                  className="h-12 px-8 rounded-xl border-2"
                >
                  Back to Dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
              Send Job Offer
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Extend an offer to {candidateName} for {roleTitle}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Candidate Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">
                      {candidateName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B1121]">{candidateName}</h3>
                    <p className="text-sm text-[#6B7280] font-normal">Candidate</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#0B1121]">Position</p>
                      <p className="text-sm text-[#6B7280] font-normal">{roleTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#0B1121]">Match Score</p>
                      <p className="text-sm text-[#6B7280] font-normal">95% Match</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-[#6B7280] font-normal mb-3">Quick Actions</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate(`/ApplicantProfile?name=${encodeURIComponent(candidateName)}`)}
                      variant="outline"
                      className="w-full h-10 rounded-xl border-2"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Offer Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Compensation */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-[#1E3A8A]" />
                  <h3 className="text-xl font-semibold text-[#0B1121]">Compensation</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      Hourly Rate *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
                      <Input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="25"
                        className="h-12 rounded-xl pl-8"
                        min="0"
                        step="0.50"
                      />
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1 font-normal">
                      ~${(parseFloat(hourlyRate || 0) * 40 * 52).toLocaleString()}/year
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      Duration *
                    </label>
                    <Select value={durationType} onValueChange={setDurationType}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-months">3 months (Summer)</SelectItem>
                        <SelectItem value="6-months">6 months</SelectItem>
                        <SelectItem value="12-months">12 months</SelectItem>
                        <SelectItem value="full-time">Full-time conversion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-[#1E3A8A]" />
                  <h3 className="text-xl font-semibold text-[#0B1121]">Dates</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      End Date (Optional)
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    Offer Expiry *
                  </label>
                  <Select value={expiryDays} onValueChange={setExpiryDays}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="21">21 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-[#6B7280] mt-1 font-normal">
                    Candidate must respond within this timeframe
                  </p>
                </div>
              </div>

              {/* Work Arrangement */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="w-5 h-5 text-[#1E3A8A]" />
                  <h3 className="text-xl font-semibold text-[#0B1121]">Work Arrangement</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setWorkArrangement('remote')}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      workArrangement === 'remote'
                        ? 'border-[#1E3A8A] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#0B1121]">Remote</p>
                    <p className="text-xs text-[#6B7280] font-normal mt-1">100% remote</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setWorkArrangement('hybrid')}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      workArrangement === 'hybrid'
                        ? 'border-[#1E3A8A] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#0B1121]">Hybrid</p>
                    <p className="text-xs text-[#6B7280] font-normal mt-1">2-3 days/week</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setWorkArrangement('onsite')}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      workArrangement === 'onsite'
                        ? 'border-[#1E3A8A] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#0B1121]">On-site</p>
                    <p className="text-xs text-[#6B7280] font-normal mt-1">Full-time office</p>
                  </button>
                </div>
              </div>

              {/* Benefits & Perks */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-5 h-5 text-[#1E3A8A]" />
                  <h3 className="text-xl font-semibold text-[#0B1121]">Benefits & Perks</h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {benefitOptions.map(benefit => (
                    <button
                      key={benefit.id}
                      type="button"
                      onClick={() => toggleBenefit(benefit.id)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        selectedBenefits.includes(benefit.id)
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                          : 'bg-white text-[#0B1121] border-gray-200 hover:border-[#1E3A8A]'
                      }`}
                    >
                      {benefit.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={customBenefit}
                    onChange={(e) => setCustomBenefit(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomBenefit()}
                    placeholder="Add custom benefit..."
                    className="h-10 rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={addCustomBenefit}
                    variant="outline"
                    className="h-10 px-4 rounded-xl border-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-[#0B1121] mb-4">
                  Additional Notes (Optional)
                </h3>
                <Textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Add any additional information about the offer, team, or role expectations..."
                  className="min-h-[120px] rounded-xl"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="h-12 px-8 rounded-xl border-2"
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={handleSendOffer}
                  disabled={!canSend}
                  className="h-12 px-8 rounded-xl font-medium disabled:opacity-50"
                  style={{ 
                    backgroundColor: canSend ? '#FFFF00' : '#E5E5E5',
                    color: canSend ? '#1E3A8A' : '#9CA3AF'
                  }}
                >
                  Send Offer
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}