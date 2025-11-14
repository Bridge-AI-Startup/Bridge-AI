import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, MapPin, Calendar, DollarSign, FileText, Settings, Loader2, Plus, X, Edit2, Check } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

export default function CreateJobListing() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Basic Info
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [roleDescription, setRoleDescription] = useState("");

  // Responsibilities & Qualifications
  const [keyResponsibilities, setKeyResponsibilities] = useState([]);
  const [qualifications, setQualifications] = useState([]);

  // Skills
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);

  // Work Details
  const [locationType, setLocationType] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("United States");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [schedule, setSchedule] = useState("");

  // Compensation
  const [compensationType, setCompensationType] = useState("paid");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState("hourly");
  const [hasEquity, setHasEquity] = useState(false);
  const [equityPercentage, setEquityPercentage] = useState("");
  const [benefits, setBenefits] = useState([]);

  // Application Settings
  const [requireResume, setRequireResume] = useState(true);
  const [requireCoverLetter, setRequireCoverLetter] = useState(false);

  // Status & Visibility
  const [status, setStatus] = useState("draft");
  const [visibility, setVisibility] = useState("public");
  const [applicationDeadline, setApplicationDeadline] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit mode tracking for items
  const [editingResponsibility, setEditingResponsibility] = useState(null);
  const [editingQualification, setEditingQualification] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [editingPreferredSkill, setEditingPreferredSkill] = useState(null);

  // Temporary input values for new items
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newQualification, setNewQualification] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newPreferredSkill, setNewPreferredSkill] = useState("");

  const addItem = (setter, currentArray) => {
    setter([...currentArray, ""]);
  };

  const removeItem = (setter, currentArray, index) => {
    setter(currentArray.filter((_, i) => i !== index));
  };

  const updateItem = (setter, currentArray, index, value) => {
    const newArray = [...currentArray];
    newArray[index] = value;
    setter(newArray);
  };

  const addSkill = () => {
    setRequiredSkills([...requiredSkills, { skillName: "", proficiencyLevel: "intermediate" }]);
  };

  const removeSkill = (index) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
  };

  const updateSkill = (index, field, value) => {
    const newSkills = [...requiredSkills];
    newSkills[index][field] = value;
    setRequiredSkills(newSkills);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!roleTitle || !roleDescription || !locationType) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in role title, description, and location type",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/EmployerSignIn');
        return;
      }

      // Build compensation object
      const compensationData = {
        type: compensationType
      };

      if (compensationType === 'paid' || compensationType === 'stipend') {
        compensationData.salary = {
          min: salaryMin ? Number(salaryMin) : undefined,
          max: salaryMax ? Number(salaryMax) : undefined,
          currency: 'USD',
          period: salaryPeriod
        };
      }

      if (hasEquity) {
        compensationData.equityOffer = {
          hasEquity: true,
          percentage: equityPercentage ? Number(equityPercentage) : undefined
        };
      }

      compensationData.benefits = benefits.filter(b => b.trim() !== '');

      // Build office location if not remote
      const officeLocationData = locationType !== 'remote' ? {
        city,
        state,
        country
      } : undefined;

      const jobListingData = {
        roleTitle,
        department,
        roleDescription,
        keyResponsibilities: keyResponsibilities.filter(r => r.trim() !== ''),
        qualifications: qualifications.filter(q => q.trim() !== ''),
        requiredSkills: requiredSkills.filter(s => s.skillName.trim() !== ''),
        preferredSkills: preferredSkills.filter(s => s.trim() !== ''),
        locationType,
        officeLocation: officeLocationData,
        startDate: startDate || undefined,
        duration,
        hoursPerWeek: hoursPerWeek ? Number(hoursPerWeek) : undefined,
        schedule,
        compensation: compensationData,
        applicationSettings: {
          requireResume,
          requireCoverLetter,
          customQuestions: []
        },
        status,
        visibility,
        applicationDeadline: applicationDeadline || undefined
      };

      const response = await fetch(`${API_URL}/api/job-listings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobListingData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create job listing');
      }

      toast({
        title: "Job Listing Created",
        description: `"${roleTitle}" has been created successfully`,
      });

      // Navigate back to employer dashboard or job listings page
      navigate('/EmployerDashboard');

    } catch (error) {
      console.error('Create job listing error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create job listing',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Create Job Listing" />

      <div className="pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[
            { label: "Dashboard", path: "EmployerDashboard" },
            { label: "Create Job Listing" }
          ]} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-[#0B1121] mb-4">Create Job Listing</h1>
            <p className="text-lg text-gray-600 font-normal">Fill in the details for your new position</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#0B1121]">Basic Information</h2>
                  <p className="text-sm text-gray-600 font-normal">Role title and overview</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0B1121] mb-2">
                    Role Title *
                  </label>
                  <Input
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g., Software Engineering Intern"
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0B1121] mb-2">
                    Department
                  </label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Engineering, Marketing, Product"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0B1121] mb-2">
                    Role Description *
                  </label>
                  <Textarea
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Describe the role, what the intern will work on, and what they'll learn..."
                    className="min-h-[120px] rounded-xl"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Key Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#0B1121]">Key Responsibilities</h2>
                  <p className="text-sm text-gray-600 font-normal">What will they be doing?</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Input field and Add button */}
                <div className="flex gap-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Add a responsibility..."
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#1E3A8A]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newResponsibility.trim()) {
                        e.preventDefault();
                        setKeyResponsibilities([...keyResponsibilities, newResponsibility.trim()]);
                        setNewResponsibility("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newResponsibility.trim()) {
                        setKeyResponsibilities([...keyResponsibilities, newResponsibility.trim()]);
                        setNewResponsibility("");
                      }
                    }}
                    disabled={!newResponsibility.trim()}
                    className="h-12 px-6 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Display added responsibilities as read-only chips with edit button */}
                {keyResponsibilities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {keyResponsibilities.map((resp, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                        {editingResponsibility === index ? (
                          <>
                            <Input
                              value={resp}
                              onChange={(e) => updateItem(setKeyResponsibilities, keyResponsibilities, index, e.target.value)}
                              className="h-8 text-sm rounded-lg w-64 border-2 border-gray-200 focus:border-[#1E3A8A]"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') setEditingResponsibility(null);
                                if (e.key === 'Escape') setEditingResponsibility(null);
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => setEditingResponsibility(null)}
                              className="h-8 w-8 p-0 rounded-lg"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-700">{resp}</span>
                            <button
                              type="button"
                              onClick={() => setEditingResponsibility(index)}
                              className="p-1 hover:bg-gray-300 rounded"
                            >
                              <Edit2 className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(setKeyResponsibilities, keyResponsibilities, index)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Qualifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#0B1121]">Qualifications</h2>
                  <p className="text-sm text-gray-600 font-normal">Required qualifications</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Input field and Add button */}
                <div className="flex gap-2">
                  <Input
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    placeholder="Add a qualification..."
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#1E3A8A]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newQualification.trim()) {
                        e.preventDefault();
                        setQualifications([...qualifications, newQualification.trim()]);
                        setNewQualification("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newQualification.trim()) {
                        setQualifications([...qualifications, newQualification.trim()]);
                        setNewQualification("");
                      }
                    }}
                    disabled={!newQualification.trim()}
                    className="h-12 px-6 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Display added qualifications as read-only chips with edit button */}
                {qualifications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {qualifications.map((qual, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                        {editingQualification === index ? (
                          <>
                            <Input
                              value={qual}
                              onChange={(e) => updateItem(setQualifications, qualifications, index, e.target.value)}
                              className="h-8 text-sm rounded-lg w-64 border-2 border-gray-200 focus:border-[#1E3A8A]"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') setEditingQualification(null);
                                if (e.key === 'Escape') setEditingQualification(null);
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => setEditingQualification(null)}
                              className="h-8 w-8 p-0 rounded-lg"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-700">{qual}</span>
                            <button
                              type="button"
                              onClick={() => setEditingQualification(index)}
                              className="p-1 hover:bg-gray-300 rounded"
                            >
                              <Edit2 className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(setQualifications, qualifications, index)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Required Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#0B1121]">Required Skills</h2>
                  <p className="text-sm text-gray-600 font-normal">Technical and soft skills needed</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Input field and Add button */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Skill name (e.g., React, Python)"
                    className="h-12 rounded-xl flex-1 border-2 border-gray-200 focus:border-[#1E3A8A]"
                    id="skillInput"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (e.target.value.trim()) {
                          setRequiredSkills([...requiredSkills, { skillName: e.target.value.trim(), proficiencyLevel: "intermediate" }]);
                          e.target.value = "";
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('skillInput');
                      if (input && input.value.trim()) {
                        setRequiredSkills([...requiredSkills, { skillName: input.value.trim(), proficiencyLevel: "intermediate" }]);
                        input.value = "";
                      }
                    }}
                    className="h-12 px-6 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Skills default to "Intermediate" level. Click edit to change.</p>

                {/* Display added skills as read-only chips with edit button */}
                {requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {requiredSkills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                        {editingSkill === index ? (
                          <>
                            <Input
                              value={skill.skillName}
                              onChange={(e) => updateSkill(index, 'skillName', e.target.value)}
                              className="h-8 text-sm rounded-lg w-40 border-2 border-gray-200 focus:border-[#1E3A8A]"
                              placeholder="Skill name"
                              autoFocus
                            />
                            <Select
                              value={skill.proficiencyLevel}
                              onValueChange={(value) => updateSkill(index, 'proficiencyLevel', value)}
                            >
                              <SelectTrigger className="h-8 rounded-lg w-32 text-sm border-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => setEditingSkill(null)}
                              className="h-8 w-8 p-0 rounded-lg"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm font-medium text-gray-700">{skill.skillName}</span>
                            <span className="text-xs px-2 py-1 bg-white rounded-lg text-gray-600 capitalize">{skill.proficiencyLevel}</span>
                            <button
                              type="button"
                              onClick={() => setEditingSkill(index)}
                              className="p-1 hover:bg-gray-300 rounded"
                            >
                              <Edit2 className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Work Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#0B1121]">Work Details</h2>
                  <p className="text-sm text-gray-600 font-normal">Location and schedule</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0B1121] mb-2">
                    Location Type *
                  </label>
                  <Select value={locationType} onValueChange={setLocationType} required>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="in_person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {locationType !== 'remote' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-[#0B1121] mb-2">
                        City
                      </label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="San Francisco"
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-[#0B1121] mb-2">
                        State
                      </label>
                      <Input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="CA"
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-[#0B1121] mb-2">
                        Country
                      </label>
                      <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0B1121] mb-2">
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
                    <label className="block text-sm font-medium text-[#0B1121] mb-2">
                      Duration
                    </label>
                    <Input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 3 months, Summer 2025"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0B1121] mb-2">
                      Hours Per Week
                    </label>
                    <Input
                      type="number"
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(e.target.value)}
                      placeholder="40"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0B1121] mb-2">
                      Schedule
                    </label>
                    <Input
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      placeholder="e.g., Monday-Friday, Flexible"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Compensation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#0B1121]">Compensation</h2>
                  <p className="text-sm text-gray-600 font-normal">Salary and benefits</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0B1121] mb-2">
                    Compensation Type
                  </label>
                  <Select value={compensationType} onValueChange={setCompensationType}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="for_credit">For Credit</SelectItem>
                      <SelectItem value="stipend">Stipend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(compensationType === 'paid' || compensationType === 'stipend') && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0B1121] mb-2">
                          Min Salary
                        </label>
                        <Input
                          type="number"
                          value={salaryMin}
                          onChange={(e) => setSalaryMin(e.target.value)}
                          placeholder="20"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0B1121] mb-2">
                          Max Salary
                        </label>
                        <Input
                          type="number"
                          value={salaryMax}
                          onChange={(e) => setSalaryMax(e.target.value)}
                          placeholder="30"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0B1121] mb-2">
                          Period
                        </label>
                        <Select value={salaryPeriod} onValueChange={setSalaryPeriod}>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Per Hour</SelectItem>
                            <SelectItem value="weekly">Per Week</SelectItem>
                            <SelectItem value="monthly">Per Month</SelectItem>
                            <SelectItem value="total">Total</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="hasEquity"
                        checked={hasEquity}
                        onChange={(e) => setHasEquity(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <label htmlFor="hasEquity" className="text-sm font-medium text-[#0B1121]">
                        Offer Equity
                      </label>
                      {hasEquity && (
                        <Input
                          type="number"
                          value={equityPercentage}
                          onChange={(e) => setEquityPercentage(e.target.value)}
                          placeholder="0.5"
                          step="0.01"
                          className="h-10 rounded-xl w-32"
                        />
                      )}
                      {hasEquity && <span className="text-sm text-gray-600">%</span>}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#0B1121] mb-2">
                    Benefits (Optional)
                  </label>
                  <div className="space-y-4">
                    {/* Input field and Add button */}
                    <div className="flex gap-2">
                      <Input
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="Add a benefit (e.g., Health insurance, 401k)"
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#1E3A8A]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newBenefit.trim()) {
                            e.preventDefault();
                            setBenefits([...benefits, newBenefit.trim()]);
                            setNewBenefit("");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newBenefit.trim()) {
                            setBenefits([...benefits, newBenefit.trim()]);
                            setNewBenefit("");
                          }
                        }}
                        disabled={!newBenefit.trim()}
                        className="h-12 px-6 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {/* Display added benefits as read-only chips with edit button */}
                    {benefits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                            {editingBenefit === index ? (
                              <>
                                <Input
                                  value={benefit}
                                  onChange={(e) => updateItem(setBenefits, benefits, index, e.target.value)}
                                  className="h-8 text-sm rounded-lg w-64 border-2 border-gray-200 focus:border-[#1E3A8A]"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') setEditingBenefit(null);
                                    if (e.key === 'Escape') setEditingBenefit(null);
                                  }}
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => setEditingBenefit(null)}
                                  className="h-8 w-8 p-0 rounded-lg"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="text-sm text-gray-700">{benefit}</span>
                                <button
                                  type="button"
                                  onClick={() => setEditingBenefit(index)}
                                  className="p-1 hover:bg-gray-300 rounded"
                                >
                                  <Edit2 className="w-3 h-3 text-gray-600" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeItem(setBenefits, benefits, index)}
                                  className="p-1 hover:bg-red-100 rounded"
                                >
                                  <X className="w-3 h-3 text-red-600" />
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Application Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#0B1121]">Application Settings</h2>
                  <p className="text-sm text-gray-600 font-normal">Configure application requirements</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="requireResume"
                    checked={requireResume}
                    onChange={(e) => setRequireResume(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="requireResume" className="text-sm font-medium text-[#0B1121]">
                    Require Resume
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="requireCoverLetter"
                    checked={requireCoverLetter}
                    onChange={(e) => setRequireCoverLetter(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="requireCoverLetter" className="text-sm font-medium text-[#0B1121]">
                    Require Cover Letter
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0B1121] mb-2">
                    Application Deadline (Optional)
                  </label>
                  <Input
                    type="date"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0B1121] mb-2">
                      Status
                    </label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0B1121] mb-2">
                      Visibility
                    </label>
                    <Select value={visibility} onValueChange={setVisibility}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="invite_only">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4"
            >
              <Button
                type="button"
                onClick={() => navigate('/EmployerDashboard')}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Job Listing'
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
