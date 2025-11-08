
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Globe, MapPin, Users, DollarSign, Calendar, Sparkles, Loader2, Pencil, UserPlus, X, Check, ChevronsUpDown, Camera } from "lucide-react";
import Header from "../components/navigation/Header";
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
import { base44 } from "@/api/base44Client";

export default function EmployerOnboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const skipChoice = searchParams.get("manual") === "true";
  
  // AI generation state
  const [useAI, setUseAI] = useState(!isEditMode);
  const [aiCompanyName, setAiCompanyName] = useState("");
  const [aiWebsite, setAiWebsite] = useState("");
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  
  // Form state
  const [companyName, setCompanyName] = useState(isEditMode ? "Acme Robotics" : "");
  const [pitch, setPitch] = useState(isEditMode ? "Revolutionizing warehouse logistics with autonomous robotics." : "");
  const [description, setDescription] = useState(isEditMode ? "Acme Robotics builds advanced autonomous systems for warehouse logistics, enhancing efficiency and reducing operational costs." : "");
  const [website, setWebsite] = useState(isEditMode ? "https://acmerobotics.com" : "");
  const [headquarters, setHeadquarters] = useState(isEditMode ? "San Francisco, CA" : "");
  const [customHeadquarters, setCustomHeadquarters] = useState(""); // New state for custom headquarters
  const [companySize, setCompanySize] = useState(isEditMode ? "51-200" : "");
  const [industry, setIndustry] = useState(isEditMode ? "robotics" : "");
  const [customIndustry, setCustomIndustry] = useState("");
  const [fundingStage, setFundingStage] = useState(isEditMode ? "series-a" : "");
  const [foundedYear, setFoundedYear] = useState(isEditMode ? "2020" : "");
  const [logoUrl, setLogoUrl] = useState(null);
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(isEditMode || skipChoice);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [headquartersOpen, setHeadquartersOpen] = useState(false); // New state for headquarters popover

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const generateFullProfile = async () => {
    if (!aiCompanyName || !aiWebsite) {
      alert("Please enter both company name and website.");
      return;
    }

    setIsGeneratingProfile(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are helping to create a company profile for internship recruiting. Given the company name and website, research and generate a complete company profile.

Company Name: ${aiCompanyName}
Website: ${aiWebsite}

Generate a comprehensive JSON object with the following fields:
- pitch: 1 sentence elevator pitch of what the company does
- description: 2-3 sentence compelling description of what the company does
- headquarters: City, State/Country where they're based
- companySize: Choose from "1-10", "11-50", "51-200", "201-500", "501+"
- industry: Choose from "technology", "fintech", "healthcare", "ecommerce", "biotech", "edtech", "ai-ml", "robotics", "saas", "consumer", "climate", "other"
- fundingStage: Choose from "bootstrapped", "pre-seed", "seed", "series-a", "series-b", "series-c+", "public"
- foundedYear: Year as a string (e.g. "2020")

Return ONLY the JSON object with these exact keys.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            pitch: { type: "string" },
            description: { type: "string" },
            headquarters: { type: "string" },
            companySize: { type: "string" },
            industry: { type: "string" },
            fundingStage: { type: "string" },
            foundedYear: { type: "string" }
          },
          required: ["pitch", "description", "headquarters", "companySize", "industry"]
        }
      });

      if (result) {
        setCompanyName(aiCompanyName);
        setWebsite(aiWebsite);
        setPitch(result.pitch || "");
        setDescription(result.description || "");
        setHeadquarters(result.headquarters || "");
        setCompanySize(result.companySize || "");
        setIndustry(result.industry || "");
        setFundingStage(result.fundingStage || "");
        setFoundedYear(result.foundedYear || "");
        setShowForm(true);
      } else {
        alert("Could not generate profile. Please try manual entry.");
      }
    } catch (error) {
      console.error("Error generating profile:", error);
      alert("Failed to generate profile. Please try manual entry instead.");
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  const handleManualEntry = () => {
    setUseAI(false);
    setShowForm(true);
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
      console.log("Company profile submitted:", {
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
      if (isEditMode) {
        navigate("/EmployerProfile");
      } else {
        navigate("/CreateListing");
      }
    }, 1500);
  };

  const canContinue = companyName && pitch && description && logoUrl && (headquarters && (headquarters !== "other" || customHeadquarters)) && (industry && (industry !== "other" || customIndustry)) && companySize;

  // Initial choice view
  if (!showForm && !isEditMode && !skipChoice) {
    return (
      <div className="min-h-screen bg-white">
        <Header currentPage="EmployerOnboarding" />
        
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-[720px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
                Set up your company profile
              </h1>
              <p className="text-xl text-[#6B7280] font-normal">
                Choose how you'd like to get started
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* AI Generation Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="h-full"
              >
                <div className="flex flex-col h-full min-h-[320px] bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-3xl p-8">
                  <div className="flex-1">
                    <Sparkles className="w-12 h-12 text-white mb-4" />
                    <h2 className="text-2xl font-semibold text-white mb-3">
                      Let AI do the setup
                    </h2>
                    <p className="text-white/90 font-normal mb-6">
                      Provide your company name and website — we’ll auto-fill your profile for you to review immediately
                    </p>
                    
                    <div className="space-y-3">
                      <Input
                        value={aiCompanyName}
                        onChange={(e) => setAiCompanyName(e.target.value)}
                        placeholder="Company name"
                        className="h-12 rounded-xl bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      />
                      <Input
                        type="url"
                        value={aiWebsite}
                        onChange={(e) => setAiWebsite(e.target.value)}
                        placeholder="yourcompany.com"
                        className="h-12 rounded-xl bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={generateFullProfile}
                    disabled={!aiCompanyName || !aiWebsite || isGeneratingProfile}
                    className="w-full h-12 mt-6 bg-white hover:bg-white/90 text-[#1E3A8A] rounded-xl font-medium disabled:opacity-50"
                  >
                    {isGeneratingProfile ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Profile
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Manual Entry Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-full"
              >
                <div className="flex flex-col h-full min-h-[320px] bg-gray-50 border-2 border-gray-300 rounded-3xl p-8">
                  <div className="flex-1">
                    <Pencil className="w-12 h-12 text-[#0B1121] mb-4" />
                    <h2 className="text-2xl font-semibold text-[#0B1121] mb-3">
                      Manual Entry
                    </h2>
                    <p className="text-[#6B7280] font-normal mb-6">
                      Prefer to fill everything out yourself? Take full control and craft your company profile from scratch.
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleManualEntry}
                    variant="outline"
                    className="w-full h-12 mt-6 border-2 border-[#0B1121] text-[#0B1121] hover:bg-[#0B1121] hover:text-white rounded-xl font-medium"
                  >
                    Enter Manually
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-gray-500 text-center font-normal"
            >
              You can always edit your profile later
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="EmployerOnboarding" />
      
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {!isEditMode && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => skipChoice ? navigate("/EmployerDashboard") : setShowForm(false)}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#0B1121] mb-8 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              <span className="font-normal">{skipChoice ? "Back to Dashboard" : "Back"}</span>
            </motion.button>
          )}

          {isEditMode && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate("/EmployerProfile")}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#0B1121] mb-8 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              <span className="font-normal">Back to Profile</span>
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
              {isEditMode ? "Edit your company profile" : useAI ? "Review your profile" : "Tell us about your company"}
            </h1>
            <p className="text-xl text-[#6B7280] font-normal">
              {isEditMode ? "Update your company information" : useAI ? "Make any changes before publishing" : "Show students what makes your startup worth joining."}
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

                <div className="grid md::grid-cols-2 gap-4">
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
                          required // Make custom headquarters required if "other" is selected
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
                        required // Make custom industry required if "other" is selected
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
            {!isEditMode && (
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
            )}

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
              className="flex justify-center"
            >
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
                    {isEditMode ? "Saving Changes..." : "Creating Profile..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? "Save Changes" : "Complete Setup"} <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
