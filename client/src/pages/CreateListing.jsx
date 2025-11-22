
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
import { API_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

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
  const editingListingId = searchParams.get("id"); // Get ID for editing mode
  const isEditMode = !!editingListingId;
  const { toast } = useToast();

  // Loading state for fetching existing listing
  const [isLoadingListing, setIsLoadingListing] = useState(false);

  // Import state
  const [showImportOption, setShowImportOption] = useState(true);
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState([]);
  const [newResponsibility, setNewResponsibility] = useState("");
  const [editingResponsibility, setEditingResponsibility] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [newQualification, setNewQualification] = useState("");
  const [editingQualification, setEditingQualification] = useState(null);
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
    { label: isEditMode ? "Edit Listing" : "Create Listing" }
  ];

  // Fetch existing listing data when in edit mode
  useEffect(() => {
    const fetchListing = async () => {
      if (!isEditMode || !editingListingId) return;

      setIsLoadingListing(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast({
            title: "Authentication Required",
            description: "Please log in to edit listings.",
            variant: "destructive",
          });
          navigate('/signin');
          return;
        }

        const response = await fetch(`${API_URL}/api/job-listings/${editingListingId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job listing');
        }

        const data = await response.json();
        if (data.success && data.data.jobListing) {
          const listing = data.data.jobListing;

          // Populate form with existing data
          setTitle(listing.roleTitle || "");
          setDescription(listing.roleDescription || "");
          setResponsibilities(listing.keyResponsibilities || []);
          setQualifications(listing.qualifications || []);
          setSkills(listing.requiredSkills?.map(s => s.skillName) || []);

          // Map locationType from backend
          let mappedLocationType = listing.locationType || "remote";
          if (mappedLocationType === "in_person") {
            mappedLocationType = "onsite";
          }
          setLocationType(mappedLocationType);

          // Set location
          if (listing.officeLocation && listing.officeLocation.city) {
            const locationStr = `${listing.officeLocation.city}, ${listing.officeLocation.state}`;
            // Check if it's in our predefined locations
            const predefinedLocation = LOCATIONS.find(opt => opt.value === locationStr);
            if (predefinedLocation) {
              setLocation(locationStr);
            } else {
              setLocation("other");
              setCustomLocation(locationStr);
            }
          }

          // Set dates and hours
          if (listing.startDate) {
            const date = new Date(listing.startDate);
            setStartDate(date.toISOString().split('T')[0]);
          }

          // Convert hoursPerWeek number to range string
          const getHoursPerWeekRange = (hours) => {
            if (hours <= 12.5) return "10-15";
            if (hours <= 17.5) return "15-20";
            if (hours <= 25) return "20-30";
            return "30-40";
          };
          setHoursPerWeek(listing.hoursPerWeek ? getHoursPerWeekRange(listing.hoursPerWeek) : "");

          // Set compensation
          if (listing.compensation) {
            const compType = listing.compensation.type;
            if (compType === "unpaid") {
              setCompensationType("unpaid");
              setCompensation("");
            } else if (listing.compensation.salary) {
              setCompensationType("salary");
              setCompensation(listing.compensation.salary.min?.toString() || "");

              // Map period
              const period = listing.compensation.salary.period;
              if (period === "hourly") setSalaryPeriod("hour");
              else if (period === "monthly") setSalaryPeriod("month");
              else setSalaryPeriod("year");
            }

            // Set equity
            if (listing.compensation.equityOffer?.hasEquity) {
              setEquity(listing.compensation.equityOffer.percentage?.toString() || "");
            }
          }

          // Hide import option when editing
          setShowImportOption(false);
        }
      } catch (error) {
        console.error('Error fetching job listing:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load job listing. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingListing(false);
      }
    };

    fetchListing();
  }, [isEditMode, editingListingId, navigate, toast]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Only restore listing data if coming back from AssignProject (restore=true param)
    if (shouldRestore) {
      const pendingData = sessionStorage.getItem('pendingListing');
      if (pendingData) {
        const data = JSON.parse(pendingData);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setResponsibilities(data.responsibilities && data.responsibilities.length > 0 ? data.responsibilities : []);
        setQualifications(data.qualifications && data.qualifications.length > 0 ? data.qualifications : []);
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
      toast({
        title: "URL Required",
        description: "Please enter a job listing URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to use AI features.",
          variant: "destructive",
        });
        navigate('/signin');
        return;
      }

      const response = await fetch(`${API_URL}/api/job-listings/ai/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: importUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to import job listing");
      }

      const result = data.data;
      if (result) {
        setTitle(result.title || "");
        setDescription(result.description || "");
        setResponsibilities(result.responsibilities && result.responsibilities.length > 0 ? result.responsibilities : []);
        setQualifications(result.qualifications && result.qualifications.length > 0 ? result.qualifications : []);
        setSkills(result.skills && result.skills.length > 0 ? result.skills : []);

        // Map locationType from backend
        let mappedLocationType = result.locationType || "remote";
        if (mappedLocationType === "in_person") {
          mappedLocationType = "onsite";
        }
        setLocationType(mappedLocationType);

        setLocation(result.location || "");
        setCustomLocation("");
        setStartDate(result.startDate || "");
        setHoursPerWeek(result.hoursPerWeek || "");

        let importedCompensationType = result.compensationType || "unpaid";
        // Map to match frontend options
        if (importedCompensationType === "paid") {
          importedCompensationType = "salary";
        }
        setCompensationType(importedCompensationType);

        setCompensation(importedCompensationType === "unpaid" ? "" : result.compensation || "");
        setSalaryPeriod(result.salaryPeriod || "year");
        setEquity(result.equity || "");

        setShowImportOption(false);
        toast({
          title: "Success!",
          description: "Job listing imported successfully",
        });
      } else {
        toast({
          title: "Import Failed",
          description: "Could not extract job listing information. Please try again or create manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error importing listing:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to import job listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setResponsibilities([...responsibilities, newResponsibility.trim()]);
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
    if (editingResponsibility === index) {
      setEditingResponsibility(null);
    }
  };

  const startEditResponsibility = (index) => {
    setEditingResponsibility(index);
  };

  const saveEditResponsibility = (index, value) => {
    if (value.trim()) {
      const updated = [...responsibilities];
      updated[index] = value.trim();
      setResponsibilities(updated);
    }
    setEditingResponsibility(null);
  };

  const cancelEditResponsibility = () => {
    setEditingResponsibility(null);
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setQualifications([...qualifications, newQualification.trim()]);
      setNewQualification("");
    }
  };

  const removeQualification = (index) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
    if (editingQualification === index) {
      setEditingQualification(null);
    }
  };

  const startEditQualification = (index) => {
    setEditingQualification(index);
  };

  const saveEditQualification = (index, value) => {
    if (value.trim()) {
      const updated = [...qualifications];
      updated[index] = value.trim();
      setQualifications(updated);
    }
    setEditingQualification(null);
  };

  const cancelEditQualification = () => {
    setEditingQualification(null);
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
      toast({
        title: "Information Required",
        description: "Please fill in the role title and description first to use AI generation.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingResponsibilities(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to use AI features.",
          variant: "destructive",
        });
        navigate('/signin');
        return;
      }

      const response = await fetch(`${API_URL}/api/job-listings/ai/generate-responsibilities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleTitle: title,
          roleDescription: description
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate responsibilities");
      }

      if (data.data && data.data.responsibilities && data.data.responsibilities.length > 0) {
        setResponsibilities(data.data.responsibilities);
        toast({
          title: "Success!",
          description: "Responsibilities generated successfully",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "AI could not generate responsibilities. Please try refining your input or add them manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating responsibilities:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate responsibilities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingResponsibilities(false);
    }
  };

  const generateQualifications = async () => {
    if (!title || !description) {
      toast({
        title: "Information Required",
        description: "Please fill in the role title and description first to use AI generation.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingQualifications(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to use AI features.",
          variant: "destructive",
        });
        navigate('/signin');
        return;
      }

      const response = await fetch(`${API_URL}/api/job-listings/ai/generate-qualifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleTitle: title,
          roleDescription: description,
          responsibilities: responsibilities
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate qualifications");
      }

      if (data.data && data.data.qualifications && data.data.qualifications.length > 0) {
        setQualifications(data.data.qualifications);
        toast({
          title: "Success!",
          description: "Qualifications generated successfully",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "AI could not generate qualifications. Please try refining your input or add them manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating qualifications:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate qualifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQualifications(false);
    }
  };

  const generateSkills = async () => {
    if (!title || !description) {
      toast({
        title: "Information Required",
        description: "Please fill in the role title and description first to use AI generation.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSkills(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to use AI features.",
          variant: "destructive",
        });
        navigate('/signin');
        return;
      }

      const response = await fetch(`${API_URL}/api/job-listings/ai/generate-skills`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleTitle: title,
          roleDescription: description,
          responsibilities: responsibilities
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate skills");
      }

      if (data.data && data.data.skills && data.data.skills.length > 0) {
        setSkills(data.data.skills.filter(s => s.trim() !== ''));
        toast({
          title: "Success!",
          description: "Skills generated successfully",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "AI could not generate skills. Please try refining your input or add them manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating skills:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate skills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a job listing.",
          variant: "destructive",
        });
        navigate('/signin');
        return;
      }

      // Convert hoursPerWeek string range to midpoint number
      const getHoursPerWeekNumber = (range) => {
        const mapping = {
          "10-15": 12.5,
          "15-20": 17.5,
          "20-30": 25,
          "30-40": 35
        };
        return mapping[range] || 0;
      };

      // Convert locationType to match schema
      const getLocationType = (type) => {
        if (type === "onsite") return "in_person";
        return type; // "remote" or "hybrid" stay the same
      };

      // Parse location string into city, state
      const parseLocation = (locationString) => {
        if (!locationString || locationString === "other") return null;
        const parts = locationString.split(', ');
        return {
          city: parts[0] || '',
          state: parts[1] || '',
          country: 'United States'
        };
      };

      // Prepare job listing data for backend API
      const jobListingPayload = {
        roleTitle: title,
        roleDescription: description,
        keyResponsibilities: responsibilities,
        qualifications: qualifications,
        requiredSkills: skills.map(skill => ({
          skillName: skill,
          proficiencyLevel: 'intermediate'
        })),
        locationType: getLocationType(locationType),
        officeLocation: (locationType === "onsite" || locationType === "hybrid")
          ? parseLocation(location === "other" ? customLocation : location)
          : undefined,
        startDate: startDate || undefined,
        hoursPerWeek: getHoursPerWeekNumber(hoursPerWeek),
        compensation: {
          type: compensationType === "unpaid" ? "unpaid" : "paid",
          salary: compensationType === "unpaid" ? undefined : {
            min: parseFloat(compensation),
            max: parseFloat(compensation),
            currency: 'USD',
            period: salaryPeriod === "hour" ? "hourly" : salaryPeriod === "month" ? "monthly" : "total"
          },
          equityOffer: equity.trim() ? {
            hasEquity: true,
            percentage: parseFloat(equity)
          } : undefined
        },
        status: 'active', // Make listing active immediately
        visibility: 'public'
      };

      // Determine if we're creating or updating
      const url = isEditMode
        ? `${API_URL}/api/job-listings/${editingListingId}`
        : `${API_URL}/api/job-listings`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobListingPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${isEditMode ? 'update' : 'create'} job listing`);
      }

      toast({
        title: "Success!",
        description: `Job listing ${isEditMode ? 'updated' : 'created'} successfully.`,
      });

      // Clear sessionStorage
      sessionStorage.removeItem('pendingListing');

      // Navigate back to the job listing dashboard if editing, otherwise to assessment creation
      if (isEditMode) {
        navigate(`/JobListingDashboard?id=${editingListingId}`);
      } else {
        // Navigate to AssignProject page to create assessment
        const createdJobId = result.data?.jobListing?._id;
        if (createdJobId) {
          navigate(`/AssignProject?jobId=${createdJobId}`);
        } else {
          navigate('/EmployerDashboard');
        }
      }

    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} job listing:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} job listing. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    if (compensationType !== "unpaid" && !String(compensation).trim()) return false;
    
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
              {isEditMode ? 'Edit Job Listing' : 'Create Job Listing'}
            </h1>
            <p className="text-xl text-[#6B7280] font-normal">
              {isEditMode ? 'Update the details of your job listing' : 'Tell us about the role you\'re hiring for'}
            </p>
          </motion.div>

          {/* Show loading state when fetching listing in edit mode */}
          {isLoadingListing ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" />
                <p className="text-[#6B7280]">Loading job listing...</p>
              </div>
            </div>
          ) : showImportOption && !isEditMode ? (
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
                        className="h-12 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder:text-white/60 text-base mb-4"
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
              {!isEditMode && (
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
              )}

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
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#1E3A8A]"
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
                        className="min-h-[120px] rounded-xl border-2 border-gray-200 focus:border-[#1E3A8A]"
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

                  <div className="space-y-4">
                    {/* Input field with Add button */}
                    <div className="flex items-start gap-2">
                      <Input
                        value={newResponsibility}
                        onChange={(e) => setNewResponsibility(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addResponsibility();
                          }
                        }}
                        placeholder="e.g. Build and maintain React components"
                        className="h-12 rounded-xl flex-1 border-2 border-gray-200 focus:border-[#1E3A8A]"
                      />
                      <Button
                        type="button"
                        onClick={addResponsibility}
                        disabled={!newResponsibility.trim()}
                        className="h-12 px-6 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {/* Display added responsibilities as chips */}
                    {responsibilities.length > 0 && (
                      <div className="max-h-[250px] overflow-y-auto pr-2">
                        <div className="space-y-2">
                          {responsibilities.map((resp, index) => (
                            <div key={index}>
                              {editingResponsibility === index ? (
                                <div className="flex items-start gap-2">
                                  <Input
                                    defaultValue={resp}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        saveEditResponsibility(index, e.target.value);
                                      }
                                    }}
                                    placeholder="e.g. Build and maintain React components"
                                    className="h-12 rounded-xl flex-1 border-2 border-gray-200 focus:border-[#1E3A8A]"
                                    autoFocus
                                  />
                                  <Button
                                    type="button"
                                    onClick={(e) => saveEditResponsibility(index, e.currentTarget.previousElementSibling.value)}
                                    className="h-12 px-4 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cancelEditResponsibility}
                                    className="h-12 px-4 rounded-xl border-2 border-gray-200"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                                  <span className="flex-1 text-[#0B1121]">{resp}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => startEditResponsibility(index)}
                                    className="h-8 w-8 rounded-lg hover:bg-gray-200"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeResponsibility(index)}
                                    className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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

                  <div className="space-y-4">
                    {/* Input field with Add button */}
                    <div className="flex items-start gap-2">
                      <Input
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addQualification();
                          }
                        }}
                        placeholder="e.g. Currently pursuing CS degree"
                        className="h-12 rounded-xl flex-1 border-2 border-gray-200 focus:border-[#1E3A8A]"
                      />
                      <Button
                        type="button"
                        onClick={addQualification}
                        disabled={!newQualification.trim()}
                        className="h-12 px-6 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {/* Display added qualifications as chips */}
                    {qualifications.length > 0 && (
                      <div className="max-h-[250px] overflow-y-auto pr-2">
                        <div className="space-y-2">
                          {qualifications.map((qual, index) => (
                            <div key={index}>
                              {editingQualification === index ? (
                                <div className="flex items-start gap-2">
                                  <Input
                                    defaultValue={qual}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        saveEditQualification(index, e.target.value);
                                      }
                                    }}
                                    placeholder="e.g. Currently pursuing CS degree"
                                    className="h-12 rounded-xl flex-1 border-2 border-gray-200 focus:border-[#1E3A8A]"
                                    autoFocus
                                  />
                                  <Button
                                    type="button"
                                    onClick={(e) => saveEditQualification(index, e.currentTarget.previousElementSibling.value)}
                                    className="h-12 px-4 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cancelEditQualification}
                                    className="h-12 px-4 rounded-xl border-2 border-gray-200"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                                  <span className="flex-1 text-[#0B1121]">{qual}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => startEditQualification(index)}
                                    className="h-8 w-8 rounded-lg hover:bg-gray-200"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeQualification(index)}
                                    className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                          className="h-12 rounded-xl flex-1 border-2 border-gray-200 focus:border-[#1E3A8A]"
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
                              className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#1E3A8A]"
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
                          className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#1E3A8A]"
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
                              className="h-12 rounded-xl pl-8 pr-4 border-2 border-gray-200 focus:border-[#1E3A8A]"
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
                          className="h-12 rounded-xl pr-10 border-2 border-gray-200 focus:border-[#1E3A8A]"
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
                    {isSubmitting
                      ? (isEditMode ? 'Updating Listing...' : 'Creating Listing...')
                      : (isEditMode ? 'Update Job Listing' : 'Create Job Listing')
                    }
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

