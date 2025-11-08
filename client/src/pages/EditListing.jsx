
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Sparkles, MapPin, Clock, Calendar, Users, Briefcase, DollarSign, Loader2, Check, ChevronsUpDown } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs"; // Assuming this path for Breadcrumbs component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { base44 } from "@/api/base44Client";

const COMMON_SKILLS = [
  "React", "JavaScript", "TypeScript", "Python", "Java", "Node.js",
  "SQL", "MongoDB", "AWS", "Docker", "Git", "REST APIs",
  "Machine Learning", "Data Analysis", "TensorFlow", "PyTorch",
  "Figma", "Adobe Creative Suite", "UI/UX Design", "Product Management",
  "Agile", "Scrum", "Communication", "Problem Solving", "Team Collaboration"
];

export default function EditListing() {
  const navigate = useNavigate();
  const loc = useLocation(); // Changed from 'location' to 'loc'
  const urlParams = new URLSearchParams(loc.search);
  const listingId = urlParams.get("id") || "fullstack-engineer"; // Changed jobId to listingId

  // Mock existing job data - in production this would come from API
  const existingJobData = {
    title: "Full-Stack Engineer Intern",
    department: "Engineering",
    description: "We're looking for a talented full-stack engineer intern to join our team and help build cutting-edge web applications.",
    responsibilities: [
      "Build and maintain React components",
      "Develop RESTful APIs with Node.js",
      "Collaborate with design team on UI/UX",
      "Write clean, maintainable code",
      "Participate in code reviews"
    ],
    qualifications: [
      "Currently pursuing CS degree",
      "Strong JavaScript fundamentals",
      "Experience with React or similar framework",
      "Good communication skills",
      "Passion for learning"
    ],
    skills: ["React", "JavaScript", "Node.js", "Git", "TypeScript"],
    locationType: "remote",
    location: "",
    listingDuration: "2-months",
    startDate: "2025-02-01",
    hoursPerWeek: "20-30",
    compensation: "30", // Updated to just the number
    compensationType: "salary", // Updated from 'hourly' to 'salary'
    salaryPeriod: "hour", // New field
    equity: "0.1", // New field
  };
  
  const [title, setTitle] = useState(existingJobData.title);
  const [department, setDepartment] = useState(existingJobData.department);
  const [description, setDescription] = useState(existingJobData.description);
  const [responsibilities, setResponsibilities] = useState(existingJobData.responsibilities);
  const [qualifications, setQualifications] = useState(existingJobData.qualifications);
  const [skills, setSkills] = useState(existingJobData.skills);
  const [newSkill, setNewSkill] = useState("");
  // selectedCommonSkill is no longer directly used due to Popover/Command implementation, but kept as per outline comment.
  // It's effectively replaced by the CommandItem's onSelect.
  const [selectedCommonSkill, setSelectedCommonSkill] = useState("");
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false); // NEW
  const [skillsOpen, setSkillsOpen] = useState(false); // NEW
  
  const [locationType, setLocationType] = useState(existingJobData.locationType);
  const [location, setLocation] = useState(existingJobData.location);
  const [listingDuration, setListingDuration] = useState(existingJobData.listingDuration);
  const [startDate, setStartDate] = useState(existingJobData.startDate);
  const [hoursPerWeek, setHoursPerWeek] = useState(existingJobData.hoursPerWeek);
  const [compensation, setCompensation] = useState(existingJobData.compensation);
  const [compensationType, setCompensationType] = useState(existingJobData.compensationType);
  const [salaryPeriod, setSalaryPeriod] = useState(existingJobData.salaryPeriod); // New state
  const [equity, setEquity] = useState(existingJobData.equity); // New state
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingResponsibilities, setIsGeneratingResponsibilities] = useState(false);
  const [isGeneratingQualifications, setIsGeneratingQualifications] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Replaced original addSkill logic with addCustomSkill
  // This addSkill function is not directly used anymore for a general 'add skill' button
  // as the UI flow changed to Popover/Command.
  // The outline still included an addSkill definition, so I'm keeping it for the onKeyPress in newSkill input.
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const addCommonSkill = (skill) => {
    if (skill === "other") {
      setShowCustomSkillInput(true);
      setSkillsOpen(false); // Close the popover
      setNewSkill(""); // Clear any previous custom skill input
    } else if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillsOpen(false); // Close the popover after adding
    }
  };

  const addCustomSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setShowCustomSkillInput(false); // Hide the custom skill input after adding
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const generateResponsibilities = async () => {
    if (!title || !department || !description) {
      alert("Please fill in the role title, department, and description first to use AI generation.");
      return;
    }

    setIsGeneratingResponsibilities(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this job role information, generate 5-7 key responsibilities for this position:
        
Role Title: ${title}
Department: ${department}
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
    if (!title || !department || !description) {
      alert("Please fill in the role title, department, and description first to use AI generation.");
      return;
    }

    setIsGeneratingQualifications(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this job role information, generate 5-7 key qualifications for this position:
        
Role Title: ${title}
Department: ${department}
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
    if (!title || !department || !description) {
      alert("Please fill in the role title, department, and description first to use AI generation.");
      return;
    }

    setIsGeneratingSkills(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this job role information, generate 8-12 specific technical and soft skills required for this position:
        
Role Title: ${title}
Department: ${department}
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
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Updating job listing:", {
        listingId, // Changed jobId to listingId
        title,
        department,
        description,
        responsibilities: responsibilities.filter(r => r.trim()),
        qualifications: qualifications.filter(q => q.trim()),
        skills,
        locationType,
        location,
        listingDuration,
        startDate,
        hoursPerWeek,
        compensation: compensationType === "unpaid" ? "Unpaid" : parseFloat(compensation),
        compensationType,
        salaryPeriod: compensationType === "unpaid" ? undefined : salaryPeriod,
        equity: equity !== "" ? parseFloat(equity) : undefined,
      });
      
      setIsSubmitting(false);
      navigate(`/JobListingDashboard?id=${listingId}`); // Changed jobId to listingId
    }, 1500);
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" }, // Updated path
    { label: "Full-Stack Engineer Intern", path: `JobListingDashboard?id=${listingId}` }, // Updated path
    { label: "Edit Listing" }
  ];

  return (
    <div className="min-h-screen bg-white"> {/* Changed bg-gray-50 to bg-white */}
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto"> {/* Changed max-w-4xl to max-w-3xl */}
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12" // Centered and adjusted margin
          >
            <h1 className="text-5xl font-semibold text-[#0B1121] mb-4"> {/* Changed text-4xl to text-5xl, added margin */}
              Edit Job Listing
            </h1>
            <p className="text-xl text-[#6B7280] font-normal"> {/* Changed text-lg to text-xl */}
              Update your job listing details
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
                    Department *
                  </label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Engineering, Product, Design"
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
                <Button
                  type="button"
                  onClick={generateResponsibilities}
                  disabled={isGeneratingResponsibilities || !title || !department || !description}
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
              </div>
              
              <div className="space-y-3 mb-4">
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
                <Button
                  type="button"
                  onClick={generateQualifications}
                  disabled={isGeneratingQualifications || !title || !department || !description}
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
              </div>
              
              <div className="space-y-3 mb-4">
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
                <Button
                  type="button"
                  onClick={generateSkills}
                  disabled={isGeneratingSkills || !title || !department || !description}
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
              </div>
              
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    Add Skills
                  </label>
                  <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
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
                              onSelect={() => addCommonSkill(skill)}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 opacity-0`}
                              />
                              {skill}
                            </CommandItem>
                          ))}
                          <CommandItem
                            value="other"
                            onSelect={() => addCommonSkill("other")}
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
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
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
                      disabled={!newSkill.trim()}
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
                        setNewSkill("");
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
              <h2 className="text-2xl font-semibold text-[#0B1121] mb-6">
                <MapPin className="w-6 h-6 inline mr-2" /> {/* Added MapPin icon */}
                Work Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    Location Type *
                  </label>
                  <Select value={locationType} onValueChange={setLocationType}>
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
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Start Date
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
                    <Select value={hoursPerWeek} onValueChange={setHoursPerWeek}>
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

                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Listing Duration *
                  </label>
                  <Select value={listingDuration} onValueChange={setListingDuration}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="How long will this listing be active?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-week">1 week</SelectItem>
                      <SelectItem value="2-weeks">2 weeks</SelectItem>
                      <SelectItem value="1-month">1 month</SelectItem>
                      <SelectItem value="2-months">2 months</SelectItem>
                      <SelectItem value="3-months">3 months</SelectItem>
                      <SelectItem value="until-filled">Until filled</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select value={compensationType} onValueChange={setCompensationType}>
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

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/JobListingDashboard?id=${listingId}`)}
                className="flex-1 h-14 rounded-xl border-2 border-gray-200 text-[#0B1121] font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-14 rounded-xl font-medium"
                style={{ backgroundColor: '#FFFF00', color: '#1E3A8A' }}
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
