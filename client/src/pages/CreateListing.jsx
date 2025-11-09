
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Sparkles, MapPin, Clock, Calendar, Users, Briefcase, DollarSign, Loader2, Link as LinkIcon, ArrowRight, ChevronsUpDown, Check, Info, Pencil } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Added Breadcrumbs import
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { base44 } from "@/api/base44Client";

const COMMON_SKILLS = [
  "React", "JavaScript", "TypeScript", "Python", "Java", "Node.js",
  "SQL", "MongoDB", "AWS", "Docker", "Git", "REST APIs",
  "Machine Learning", "Data Analysis", "TensorFlow", "PyTorch",
  "Figma", "Adobe Creative Suite", "UI/UX Design", "Product Management",
  "Agile", "Scrum", "Communication", "Problem Solving", "Team Collaboration"
];

const LOCATIONS = [
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
  { value: "other", label: "Other location" }
];

export default function CreateListing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldRestore = searchParams.get("restore") === "true";
  
  // Import state
  const [showImportOption, setShowImportOption] = useState(true);
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState([""]);
  const [qualifications, setQualifications] = useState([""]);
  const [skills, setSkills] = useState([]);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  
  const [locationType, setLocationType] = useState("remote");
  const [location, setLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [customLocation, setCustomLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [compensation, setCompensation] = useState("");
  const [compensationType, setCompensationType] = useState("unpaid");
  const [salaryPeriod, setSalaryPeriod] = useState("year"); // Default to 'year' for salary
  const [equity, setEquity] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingResponsibilities, setIsGeneratingResponsibilities] = useState(false);
  const [isGeneratingQualifications, setIsGeneratingQualifications] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Create Listing" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Only restore listing data if coming back from AssignProject (restore=true param)
    if (shouldRestore) {
      const pendingData = sessionStorage.getItem('pendingListing');
      if (pendingData) {
        const data = JSON.parse(pendingData);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setResponsibilities(data.responsibilities && data.responsibilities.length > 0 ? data.responsibilities : [""]);
        setQualifications(data.qualifications && data.qualifications.length > 0 ? data.qualifications : [""]);
        setSkills(data.skills || []);
        setLocationType(data.locationType || "remote");
        setLocation(data.location || "");
        setCustomLocation(""); // Clear custom location state on restore, as it's temporary for input
        setStartDate(data.startDate || "");
        setHoursPerWeek(data.hoursPerWeek || "");
        setCompensationType(data.compensationType || "unpaid");
        setCompensation(data.compensationType === "unpaid" ? "" : data.compensation || "");
        setSalaryPeriod(data.salaryPeriod || "year"); // Ensure salaryPeriod is restored
        setEquity(data.equity || "");
        setShowImportOption(false);
      }
    } else {
      // Clear any old cached data when starting fresh
      sessionStorage.removeItem('pendingListing');
    }
  }, [shouldRestore]);

  const handleImportListing = async () => {
    if (!importUrl) {
      alert("Please enter a job listing URL");
      return;
    }

    setIsImporting(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Extract job listing information from this URL: ${importUrl}

Return a JSON object with the following fields:
- title: Job title
- description: Full job description (2-3 paragraphs)
- responsibilities: Array of 5-7 key responsibilities
- qualifications: Array of 5-7 required qualifications
- skills: Array of 8-12 required skills (technical and soft skills)
- locationType: "remote", "onsite", or "hybrid"
- location: Office location if applicable (e.g., "San Francisco, CA")
- hoursPerWeek: "10-15", "15-20", "20-30", or "30-40"
- compensationType: "unpaid" or "salary"
- compensation: Compensation amount if paid (e.g., "20" or "30000") - just the number
- salaryPeriod: "hour", "month", or "year" (only if compensationType is "salary")
- equity: Equity offer if applicable (e.g., "0.1%" or "1000 shares")

Return ONLY the JSON object with these exact keys.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            responsibilities: { type: "array", items: { type: "string" } },
            qualifications: { type: "array", items: { type: "string" } },
            skills: { type: "array", items: { type: "string" } },
            locationType: { type: "string" },
            location: { type: "string" },
            hoursPerWeek: { type: "string" },
            compensationType: { type: "string" },
            compensation: { type: "string" },
            salaryPeriod: { type: "string" }, // New field in schema
            equity: { type: "string" }
          },
          required: ["title", "description"]
        }
      });

      if (result) {
        setTitle(result.title || "");
        setDescription(result.description || "");
        setResponsibilities(result.responsibilities && result.responsibilities.length > 0 ? result.responsibilities : [""]);
        setQualifications(result.qualifications && result.qualifications.length > 0 ? result.qualifications : [""]);
        setSkills(result.skills && result.skills.length > 0 ? result.skills : []);
        setLocationType(result.locationType || "remote");
        setLocation(result.location || "");
        setCustomLocation(""); 
        setStartDate(result.startDate || "");
        setHoursPerWeek(result.hoursPerWeek || "");
        
        let importedCompensationType = result.compensationType || "unpaid";
        // Ensure compensationType is 'salary' if it was 'hourly' or 'stipend' before
        if (importedCompensationType === "hourly" || importedCompensationType === "stipend") {
          importedCompensationType = "salary";
        }
        setCompensationType(importedCompensationType);
        
        setCompensation(importedCompensationType === "unpaid" ? "" : result.compensation || ""); 
        setSalaryPeriod(result.salaryPeriod || "year"); // Use explicit salaryPeriod from AI
        setEquity(result.equity || "");
        
        setShowImportOption(false);
      } else {
        alert("Could not extract job listing information. Please try again or create manually.");
      }
    } catch (error) {
      console.error("Error importing listing:", error);
      alert("Failed to import job listing. Please try again or create manually.");
    } finally {
      setIsImporting(false);
    }
  };

  const addResponsibility = () => {
    setResponsibilities([...responsibilities, ""]);
  };

  const removeResponsibility = (index) => {
    if (responsibilities.length > 1) {
      setResponsibilities(responsibilities.filter((_, i) => i !== index));
    }
  };

  const updateResponsibility = (index, value) => {
    const updated = [...responsibilities];
    updated[index] = value;
    setResponsibilities(updated);
  };

  const addQualification = () => {
    setQualifications([...qualifications, ""]);
  };

  const removeQualification = (index) => {
    if (qualifications.length > 1) {
      setQualifications(qualifications.filter((_, i) => i !== index));
    }
  };

  const updateQualification = (index, value) => {
    const updated = [...qualifications];
    updated[index] = value;
    setQualifications(updated);
  };

  const addSkill = (skill) => {
    if (skill === "other") {
      setShowCustomSkillInput(true);
      setSkillsOpen(false);
    } else if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillsOpen(false);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill("");
      setShowCustomSkillInput(false);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const generateResponsibilities = async () => {
    if (!title || !description) {
      alert("Please fill in the role title and description first to use AI generation.");
      return;
    }

    setIsGeneratingResponsibilities(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this job role information, generate 5-7 key responsibilities for this position:
        
Role Title: ${title}
Description: ${description}

Return only a JSON object with a single key 'responsibilities' which is an array of responsibility strings, nothing else. Example: {"responsibilities": ["Lead feature development", "Collaborate with team"]}`,
        response_json_schema: {
          type: "object",
          properties: {
            responsibilities: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["responsibilities"]
        }
      });

      if (result && result.responsibilities && result.responsibilities.length > 0) {
        setResponsibilities(result.responsibilities);
      } else {
        alert("AI could not generate responsibilities. Please try refining your input or add them manually.");
      }
    } catch (error) {
      console.error("Error generating responsibilities:", error);
      alert("Failed to generate responsibilities. Please try again.");
    } finally {
      setIsGeneratingResponsibilities(false);
    }
  };

  const generateQualifications = async () => {
    if (!title || !description) {
      alert("Please fill in the role title and description first to use AI generation.");
      return;
    }

    setIsGeneratingQualifications(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this job role information, generate 5-7 key qualifications for this position:
        
Role Title: ${title}
Description: ${description}

Return only a JSON object with a single key 'qualifications' which is an array of qualification strings, nothing else. Example: {"qualifications": ["Currently pursuing CS degree", "Strong problem-solving skills"]}`,
        response_json_schema: {
          type: "object",
          properties: {
            qualifications: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["qualifications"]
        }
      });

      if (result && result.qualifications && result.qualifications.length > 0) {
        setQualifications(result.qualifications);
      } else {
        alert("AI could not generate qualifications. Please try refining your input or add them manually.");
      }
    } catch (error) {
      console.error("Error generating qualifications:", error);
      alert("Failed to generate qualifications. Please try again.");
    } finally {
      setIsGeneratingQualifications(false);
    }
  };

  const generateSkills = async () => {
    if (!title || !description) {
      alert("Please fill in the role title and description first to use AI generation.");
      return;
    }

    setIsGeneratingSkills(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this job role information, generate 8-12 specific technical and soft skills required for this position:
        
Role Title: ${title}
Description: ${description}

Return only a JSON object with a single key 'skills' which is an array of skill strings (like "React", "Python", "Communication"), nothing else. Example: {"skills": ["JavaScript", "Teamwork", "SQL"]}`,
        response_json_schema: {
          type: "object",
          properties: {
            skills: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["skills"]
        }
      });

      if (result && result.skills && result.skills.length > 0) {
        setSkills(result.skills.filter(s => s.trim() !== ''));
      } else {
        alert("AI could not generate skills. Please try refining your input or add them manually.");
      }
    } catch (error) {
      console.error("Error generating skills:", error);
      alert("Failed to generate skills. Please try again.");
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Store listing data in sessionStorage to pass to AssignProjects page
    const listingData = {
      title,
      description,
      responsibilities: responsibilities.filter(r => r.trim()),
      qualifications: qualifications.filter(q => q.trim()),
      skills,
      locationType,
      location: location === "other" ? customLocation : location, 
      startDate,
      hoursPerWeek,
      compensation: compensationType === "unpaid" ? "Unpaid" : compensation, 
      compensationType,
      salaryPeriod: compensationType === "unpaid" ? null : salaryPeriod, // Only save salaryPeriod if compensationType is not unpaid
      equity: equity.trim() || null
    };
    
    sessionStorage.setItem('pendingListing', JSON.stringify(listingData));
    navigate('/AssignProject?mode=listing');
  };

  // Validation check for required fields
  const isFormValid = () => {
    // Basic Information
    if (!title.trim()) return false;
    if (!description.trim()) return false;
    
    // Skills - must have at least one
    if (skills.length === 0) return false;

    // Location & Work Details
    if (!locationType) return false;
    if ((locationType === "onsite" || locationType === "hybrid")) {
      if (!location) return false;
      if (location === "other" && !customLocation.trim()) return false;
    }
    if (!hoursPerWeek) return false;

    // Compensation
    if (compensationType !== "unpaid" && !compensation.trim()) return false;
    
    return true;
  };

  // The original handleLocationSelect is no longer used by CommandItem directly,
  // but keeping it here for reference or if other parts of the UI might still use it.
  // The CommandItem onSelect logic is updated directly as per the request.
  const handleLocationSelect = (selectedLocation) => {
    if (selectedLocation === "other") {
      setLocation("other"); 
      setCustomLocation(""); 
    } else {
      setLocation(selectedLocation);
      setCustomLocation(""); 
    }
    setLocationOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="EmployerDashboard" />
      
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
              Create Job Listing
            </h1>
            <p className="text-xl text-[#6B7280] font-normal">
              Tell us about the role you're hiring for
            </p>
          </motion.div>

          {showImportOption ? (
            /* Import-only view */
            <>
              {/* Original "Back to Dashboard" button and "Create New Listing" heading are replaced by Breadcrumbs and the unified heading above. */}

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Import from URL Card */}
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
                        Import your Job Post
                      </h2>
                      <p className="text-white/90 font-normal mb-6">
                        Have a job listing on LinkedIn, Indeed, or another site? Drop in a link and we’ll autofill everything in seconds so you can personalize it and go live.
                      </p>

                      <Input
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        placeholder="https://linkedin.com/jobs/..."
                        className="h-12 rounded-xl bg-white/20 border-white/30 text-white placeholder:text-white/60 text-base mb-4"
                      />
                    </div>

                    <Button
                      onClick={handleImportListing}
                      disabled={!importUrl || isImporting}
                      className="w-full h-12 bg-white hover:bg-white/90 text-[#1E3A8A] rounded-xl font-medium disabled:opacity-50"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Importing Listing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Import Listing
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>

                {/* Create from Scratch Card */}
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
                        Create from Scratch
                      </h2>
                      <p className="text-[#6B7280] font-normal mb-6">
                        Build your listing from the ground up, filling in all the details manually.
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => setShowImportOption(false)}
                      variant="outline"
                      className="w-full h-12 mt-6 border-2 border-[#0B1121] text-[#0B1121] hover:bg-[#0B1121] hover:text-white rounded-xl font-medium"
                    >
                      Create Manually
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center text-sm text-[#6B7280] font-normal"
              >
                We support importing from LinkedIn, Indeed, Glassdoor, and most job boards
              </motion.p>
            </>
          ) : (
            /* Manual entry form view */
            <>
              {/* Original "Back to Dashboard" button and "Create New Listing" heading are replaced by Breadcrumbs and the unified heading above. */}
              {/* The "Import Instead" button needs to be re-added below the unified heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex justify-end mb-8"
              >
                <Button
                  onClick={() => setShowImportOption(true)}
                  variant="outline"
                  className="h-11 px-5 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A]"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Import Instead
                </Button>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <h2 className="text-2xl font-semibold text-[#0B1121] mb-6">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                        Role Title *
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Full-Stack Engineer Intern"
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                        Role Description *
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the role, what the intern will work on, and what they'll learn..."
                        className="min-h-[120px] rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-[#0B1121]">Key Responsibilities</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={generateResponsibilities}
                        disabled={isGeneratingResponsibilities || !title || !description}
                        variant="outline"
                        className="flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] disabled:opacity-50"
                      >
                        {isGeneratingResponsibilities ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            AI Generate
                          </>
                        )}
                      </Button>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors cursor-help"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Info className="w-3 h-3 text-[#6B7280]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="text-sm">AI will generate suggestions based on the Role Title and Description you've provided above.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="max-h-[250px] overflow-y-auto mb-4 pr-2">
                    <div className="space-y-3">
                      {responsibilities.map((resp, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Input
                            value={resp}
                            onChange={(e) => updateResponsibility(index, e.target.value)}
                            placeholder="e.g. Build and maintain React components"
                            className="h-12 rounded-xl flex-1"
                          />
                          {responsibilities.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeResponsibility(index)}
                              className="h-12 w-12 rounded-xl border-2 border-gray-200"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addResponsibility}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Responsibility
                  </Button>
                </div>

                {/* Qualifications */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-[#0B1121]">Qualifications</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={generateQualifications}
                        disabled={isGeneratingQualifications || !title || !description}
                        variant="outline"
                        className="flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] disabled:opacity-50"
                      >
                        {isGeneratingQualifications ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            AI Generate
                          </>
                        )}
                      </Button>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors cursor-help"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Info className="w-3 h-3 text-[#6B7280]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="text-sm">AI will generate suggestions based on the Role Title and Description you've provided above.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="max-h-[250px] overflow-y-auto mb-4 pr-2">
                    <div className="space-y-3">
                      {qualifications.map((qual, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Input
                            value={qual}
                            onChange={(e) => updateQualification(index, e.target.value)}
                            placeholder="e.g. Currently pursuing CS degree"
                            className="h-12 rounded-xl flex-1"
                          />
                          {qualifications.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeQualification(index)}
                              className="h-12 w-12 rounded-xl border-2 border-gray-200"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addQualification}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Qualification
                  </Button>
                </div>

                {/* Required Skills */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-[#0B1121]">Required Skills *</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={generateSkills}
                        disabled={isGeneratingSkills || !title || !description}
                        variant="outline"
                        className="flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] disabled:opacity-50"
                      >
                        {isGeneratingSkills ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            AI Generate
                          </>
                        )}
                      </Button>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors cursor-help"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Info className="w-3 h-3 text-[#6B7280]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="text-sm">AI will generate suggestions based on the Role Title and Description you've provided above.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                        Add Skills
                      </label>
                      <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={skillsOpen}
                            className="w-full h-12 justify-between rounded-xl"
                          >
                            Select a skill to add
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search skills..." />
                            <CommandEmpty>No skill found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {COMMON_SKILLS.filter(skill => !skills.includes(skill)).map((skill) => (
                                <CommandItem
                                  key={skill}
                                  value={skill}
                                  onSelect={() => addSkill(skill)}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 opacity-0`}
                                  />
                                  {skill}
                                </CommandItem>
                              ))}
                              <CommandItem
                                value="other"
                                onSelect={() => addSkill("other")}
                                className="border-t"
                              >
                                <Check className={`mr-2 h-4 w-4 opacity-0`} />
                                Other (custom skill)
                              </CommandItem>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {showCustomSkillInput && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-2"
                      >
                        <Input
                          value={customSkill}
                          onChange={(e) => setCustomSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCustomSkill();
                            }
                          }}
                          placeholder="Enter custom skill"
                          className="h-12 rounded-xl flex-1"
                          autoFocus
                        />
                        <Button
                          type="button"
                          onClick={addCustomSkill}
                          disabled={!customSkill.trim()}
                          className="h-12 px-6 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowCustomSkillInput(false);
                            setCustomSkill("");
                          }}
                          className="h-12 px-4 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    )}
                  </div>

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 bg-gray-100 text-[#0B1121] rounded-lg flex items-center gap-2 font-normal"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location & Work Details */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <h2 className="text-2xl font-semibold text-[#0B1121] mb-6">Work Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location Type *
                      </label>
                      <Select value={locationType} onValueChange={setLocationType} required>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="onsite">On-site</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(locationType === "onsite" || locationType === "hybrid") && (
                      <div>
                        <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                          Office Location *
                        </label>
                        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={locationOpen}
                              className="w-full h-12 justify-between rounded-xl"
                            >
                              {location
                                ? LOCATIONS.find((loc) => loc.value === location)?.label
                                : "Select location"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search location..." />
                              <CommandEmpty>No location found.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                {LOCATIONS.map((loc) => (
                                  <CommandItem
                                    key={loc.value}
                                    value={loc.value}
                                    onSelect={(currentValue) => {
                                      setLocation(currentValue === location ? "" : currentValue);
                                      setLocationOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        location === loc.value ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                    {loc.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        
                        {location === "other" && (
                          <div className="mt-3">
                            <Input
                              value={customLocation}
                              onChange={(e) => setCustomLocation(e.target.value)}
                              placeholder="Enter your location (e.g. London, UK)"
                              className="h-12 rounded-xl"
                              required
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Start Date (Optional)
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
                          <Clock className="w-4 h-4 inline mr-1" />
                          Hours Per Week *
                        </label>
                        <Select value={hoursPerWeek} onValueChange={setHoursPerWeek} required>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select hours" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10-15">10-15 hours/week</SelectItem>
                            <SelectItem value="15-20">15-20 hours/week</SelectItem>
                            <SelectItem value="20-30">20-30 hours/week</SelectItem>
                            <SelectItem value="30-40">30-40 hours/week (Full-time)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compensation */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <h2 className="text-2xl font-semibold text-[#0B1121] mb-6">
                    <DollarSign className="w-6 h-6 inline mr-2" />
                    Compensation
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                        Compensation Type *
                      </label>
                      <Select value={compensationType} onValueChange={setCompensationType} required>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">Unpaid (for credit)</SelectItem>
                          <SelectItem value="salary">Cash Compensation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {compensationType !== "unpaid" && (
                      <div>
                        <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                          Amount *
                        </label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-medium text-base">
                              $
                            </span>
                            <Input
                              type="number"
                              value={compensation}
                              onChange={(e) => setCompensation(e.target.value)}
                              placeholder={
                                salaryPeriod === "hour" ? "20" :
                                salaryPeriod === "year" ? "30000" : "2500"
                              }
                              className="h-12 rounded-xl pl-8 pr-4"
                              min="0"
                              step={salaryPeriod === "hour" ? "0.5" : "100"}
                              required
                            />
                          </div>
                          
                          <Select value={salaryPeriod} onValueChange={setSalaryPeriod}>
                            <SelectTrigger className="w-[140px] h-12 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hour">per hour</SelectItem>
                              <SelectItem value="month">per month</SelectItem>
                              <SelectItem value="year">per year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                        Equity Offer (Optional)
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={equity}
                          onChange={(e) => setEquity(e.target.value)}
                          placeholder="0.1"
                          className="h-12 rounded-xl pr-10"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-medium text-base">
                          %
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] font-normal mt-1">
                        Enter equity percentage (e.g., 0.1% or 0.5%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Enhancement Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#0B1121] mb-1">AI-Powered Matching</h3>
                      <p className="text-sm text-[#6B7280] font-normal leading-relaxed">
                        Our AI will analyze your listing and automatically match it with qualified candidates based on skills, experience, and interests. You'll start receiving matches within 24 hours of posting.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/EmployerDashboard")}
                    className="flex-1 h-14 rounded-xl border-2 border-gray-200 text-[#0B1121] font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className="flex-1 h-14 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: isFormValid() ? '#FFFF00' : '#E5E5E5',
                      color: isFormValid() ? '#1E3A8A' : '#9CA3AF'
                    }}
                  >
                    {isSubmitting ? 'Processing...' : 'Continue to Project Selection'}
                  </Button>
                </div>
              </motion.form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

