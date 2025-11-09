
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Globe, MapPin, Users, DollarSign, Calendar, Sparkles, Loader2, Camera, UserPlus, X } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Added import for Breadcrumbs
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

export default function EmployerProfile() {
  const navigate = useNavigate();
  
  // Form state - pre-filled with existing data
  const [companyName, setCompanyName] = useState("Acme Robotics");
  const [pitch, setPitch] = useState("Revolutionizing warehouse logistics with autonomous robotics.");
  const [description, setDescription] = useState("Acme Robotics builds advanced autonomous systems for warehouse logistics, enhancing efficiency and reducing operational costs.");
  const [website, setWebsite] = useState("https://acmerobotics.com");
  const [headquarters, setHeadquarters] = useState("San Francisco, CA");
  const [customHeadquarters, setCustomHeadquarters] = useState("");
  const [companySize, setCompanySize] = useState("51-200");
  const [industry, setIndustry] = useState("robotics");
  const [customIndustry, setCustomIndustry] = useState("");
  const [fundingStage, setFundingStage] = useState("series-a");
  const [foundedYear, setFoundedYear] = useState("2020");
  const [logoUrl, setLogoUrl] = useState(null);
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [headquartersOpen, setHeadquartersOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const industries = [
    { value: "technology", label: "Technology" },
    { value: "fintech", label: "FinTech" },
    { value: "healthcare", label: "Healthcare" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "biotech", label: "Biotech" },
    { value: "edtech", label: "EdTech" },
    { value: "ai-ml", label: "AI/Machine Learning" },
    { value: "robotics", label: "Robotics" },
    { value: "saas", label: "SaaS" },
    { value: "consumer", label: "Consumer Products" },
    { value: "climate", label: "Climate Tech" },
    { value: "other", label: "Other" }
  ];

  const locations = [
    { value: "San Francisco, CA", label: "San Francisco, CA" },
    { value: "New York, NY", label: "New York, NY" },
    { value: "Los Angeles, CA", label: "Los Angeles, CA" },
    { value: "San Diego, CA", label: "San Diego, CA" },
    { value: "Austin, TX", label: "Austin, TX" },
    { value: "Boston, MA", label: "Boston, MA" },
    { value: "Seattle, WA", label: "Seattle, WA" },
    { value: "Chicago, IL", label: "Chicago, IL" },
    { value: "Denver, CO", label: "Denver, CO" },
    { value: "Miami, FL", label: "Miami, FL" },
    { value: "Atlanta, GA", label: "Atlanta, GA" },
    { value: "Portland, OR", label: "Portland, OR" },
    { value: "Remote", label: "Remote" },
    { value: "other", label: "Other location" }
  ];

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTeamMember = () => {
    if (!newMemberEmail) return;
    if (!newMemberEmail.includes('@') || !newMemberEmail.includes('.')) {
      alert('Please enter a valid email address');
      return;
    }
    if (teamMembers.includes(newMemberEmail)) {
      alert('This email has already been added');
      return;
    }
    
    setTeamMembers([...teamMembers, newMemberEmail]);
    setNewMemberEmail("");
  };

  const handleRemoveTeamMember = (email) => {
    setTeamMembers(teamMembers.filter(m => m !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Company profile updated:", {
        companyName,
        pitch,
        description,
        website,
        headquarters: headquarters === "other" ? customHeadquarters : headquarters,
        companySize,
        industry: industry === "other" ? customIndustry : industry,
        fundingStage,
        foundedYear,
        logo: logoUrl,
        teamMembers
      });
      
      setIsSubmitting(false);
      navigate("/EmployerDashboard");
    }, 1500);
  };

  const canContinue = companyName && pitch && description && logoUrl && (headquarters && (headquarters !== "other" || customHeadquarters)) && (industry && (industry !== "other" || customIndustry)) && companySize;

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Company Profile" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="EmployerProfile" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
              Edit your company profile
            </h1>
            <p className="text-xl text-[#6B7280] font-normal">
              Update your company information
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-xl font-semibold text-[#0B1121]">Basic Information</h2>
              </div>
              
              <div className="space-y-4">
                {/* Company Logo */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center overflow-hidden">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <label
                      htmlFor="logo-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[#FFFF00] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FFFF00]/90 transition-colors shadow-lg"
                    >
                      <Camera className="w-4 h-4 text-[#1E3A8A]" />
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0B1121] mb-1">Company Logo *</p>
                    <p className="text-xs text-[#6B7280] font-normal">
                      Upload your company logo
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    Company Name *
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Robotics"
                    className="h-12 rounded-xl bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Company Website
                  </label>
                  <Input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="h-12 rounded-xl bg-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Headquarters *
                    </label>
                    <Popover open={headquartersOpen} onOpenChange={setHeadquartersOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={headquartersOpen}
                          className="w-full h-12 justify-between rounded-xl bg-white"
                        >
                          {headquarters
                            ? locations.find((loc) => loc.value === headquarters)?.label
                            : "Select location"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search location..." />
                          <CommandEmpty>No location found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {locations.map((loc) => (
                              <CommandItem
                                key={loc.value}
                                value={loc.value}
                                onSelect={(currentValue) => {
                                  setHeadquarters(currentValue === headquarters ? "" : currentValue);
                                  setHeadquartersOpen(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    headquarters === loc.value ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                {loc.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {headquarters === "other" && (
                      <div className="mt-3">
                        <Input
                          value={customHeadquarters}
                          onChange={(e) => setCustomHeadquarters(e.target.value)}
                          placeholder="Enter your location (e.g. London, UK)"
                          className="h-12 rounded-xl bg-white"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Founded Year
                    </label>
                    <Input
                      type="number"
                      value={foundedYear}
                      onChange={(e) => setFoundedYear(e.target.value)}
                      placeholder="e.g. 2020"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="h-12 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    Industry *
                  </label>
                  <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={industryOpen}
                        className="w-full h-12 justify-between rounded-xl bg-white"
                      >
                        {industry
                          ? industries.find((ind) => ind.value === industry)?.label
                          : "Select your industry"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search industry..." />
                        <CommandEmpty>No industry found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {industries.map((ind) => (
                            <CommandItem
                              key={ind.value}
                              value={ind.value}
                              onSelect={(currentValue) => {
                                setIndustry(currentValue === industry ? "" : currentValue);
                                setIndustryOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  industry === ind.value ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {ind.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {industry === "other" && (
                    <div className="mt-3">
                      <Input
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        placeholder="Please specify your industry"
                        className="h-12 rounded-xl bg-white"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Company Size *
                    </label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger className="h-12 rounded-xl bg-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501+">501+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Funding Stage
                    </label>
                    <Select value={fundingStage} onValueChange={setFundingStage}>
                      <SelectTrigger className="h-12 rounded-xl bg-white">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                        <SelectItem value="pre-seed">Pre-seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B</SelectItem>
                        <SelectItem value="series-c+">Series C+</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Mission */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-xl font-semibold text-[#0B1121]">About Your Company</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    One-Sentence Pitch *
                  </label>
                  <Input
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="e.g. We build autonomous robots that streamline warehouse operations."
                    className="h-12 rounded-xl bg-white"
                    required
                  />
                  <p className="text-sm text-[#6B7280] mt-2 font-normal">
                    A quick elevator pitch of what your company does
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    Company Description *
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what your company does, what problems you solve, and what makes you unique..."
                    className="min-h-[100px] rounded-xl bg-white"
                    required
                  />
                  <p className="text-sm text-[#6B7280] mt-2 font-normal">
                    Provide more details about your company
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <UserPlus className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-xl font-semibold text-[#0B1121]">Invite Team Members (Optional)</h2>
              </div>
              
              <p className="text-sm text-[#6B7280] mb-4 font-normal">
                Add colleagues who will help manage hiring for your company. They'll receive an email invitation to join.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTeamMember();
                      }
                    }}
                    placeholder="colleague@company.com"
                    className="h-12 rounded-xl bg-white flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTeamMember}
                    disabled={!newMemberEmail}
                    className="h-12 px-6 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-medium"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {teamMembers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#0B1121]">
                      Team Members to Invite ({teamMembers.length})
                    </p>
                    {teamMembers.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-[#0B1121] font-normal">{email}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTeamMember(email)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-gray-500 text-center font-normal"
            >
              This information will be visible to students when they view your job listings
            </motion.p>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              <Button
                type="button"
                onClick={() => navigate("/EmployerDashboard")}
                variant="outline"
                className="h-12 px-8 text-base font-medium rounded-xl border-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canContinue || isSubmitting}
                className="h-12 px-8 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: canContinue ? '#FFFF00' : '#E5E5E5',
                  color: canContinue ? '#1E3A8A' : '#9CA3AF'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
