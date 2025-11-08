
import React, { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, DollarSign, Code, TrendingUp, CheckCircle2, Sparkles, Calendar, FileCheck, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";

export default function JobAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("company") || "Nova Robotics";
  const jobId = searchParams.get("job");

  // Get navigation source from state
  const from = location.state?.from;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock job data - in production this would come from job listing
  const jobData = {
    company: "Nova Robotics",
    role: "Data Science Intern",
    department: "Engineering",
    location: "San Diego, CA",
    locationType: "Hybrid",
    match: "94%",
    description: "Building autonomous systems for warehouse logistics. Looking for a data science intern to optimize ML models and work on cutting-edge robotics technology.",
    hoursPerWeek: "20-30 hours",
    startDate: "January 2025",
    compensation: "$25-30/hour",
    companySize: "15-25 employees",
    founded: "2022",
    funding: "Seed Stage ($2M)",
    teamSize: "5-10 people",
    skills: ["Python", "TensorFlow", "Data Analysis", "Machine Learning", "Statistics", "PyTorch", "SQL"],
    responsibilities: [
      "Develop and optimize machine learning models for robotic navigation",
      "Analyze large datasets to improve system efficiency",
      "Collaborate with engineering team to integrate ML solutions",
      "Contribute to research on autonomous decision-making",
      "Present findings and insights to technical and non-technical stakeholders"
    ],
    qualifications: [
      "Currently pursuing degree in Computer Science, Data Science, or related field",
      "Strong programming skills in Python",
      "Experience with machine learning frameworks (TensorFlow, PyTorch)",
      "Understanding of statistical analysis and data visualization",
      "Excellent problem-solving and analytical skills"
    ]
  };

  const matchInsights = {
    matchReason: "Your machine learning coursework and Python projects directly match their ML optimization needs. Your TensorFlow experience is exactly what they're looking for. Your academic research experience in data analysis aligns with their need for research-oriented thinking in autonomous systems. Your previous work on fast-paced projects shows you can thrive in their early-stage environment where you'll have real impact.",
    skillsOverlap: {
      yourSkills: ["Python", "TensorFlow", "Data Analysis", "Machine Learning", "Statistics"],
      theirNeeds: ["Python", "TensorFlow", "Data Analysis", "Machine Learning", "Statistics", "PyTorch", "SQL"],
      matchPercentage: 71
    },
    growthOpportunities: [
      "Learn PyTorch and expand your ML framework expertise",
      "Gain hands-on robotics experience",
      "Work with real-world autonomous systems at scale",
      "Develop SQL skills for production data pipelines"
    ]
  };

  // Build breadcrumb items dynamically based on navigation source
  const breadcrumbItems = [
    { label: "Dashboard", path: "StudentDashboard" }
  ];

  if (from === "StudentPipeline") {
    breadcrumbItems.push({ label: "My Applications", path: "StudentPipeline" });
  }

  breadcrumbItems.push({ label: `${jobData.company} - ${jobData.role}` });

  const handleBookInterview = () => {
    navigate("/BookInterview", {
      state: {
        from: "JobAnalysis",
        companyName: jobData.company,
        jobRole: jobData.role
      }
    });
  };

  const handleStartAssessment = () => {
    navigate("/StartAssessment", {
      state: {
        from: "JobAnalysis",
        companyName: jobData.company,
        jobRole: jobData.role
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 mb-6"
          >
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
                <div className="w-10 h-10 border-4 border-white rounded-full" />
                <div className="absolute w-3 h-3 bg-white rounded-full" style={{ marginTop: '-10px' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#0B1121] mb-2">
                      {jobData.role}
                    </h1>
                    <p className="text-lg text-[#6B7280] font-normal mb-3">
                      {jobData.company} • {jobData.department}
                    </p>
                  </div>
                  <div className="px-5 py-2 bg-[#1E3A8A] text-white text-lg font-semibold rounded-full flex-shrink-0">
                    {jobData.match} Match
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-normal">{jobData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-normal">{jobData.locationType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-normal">{jobData.hoursPerWeek}/week</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-normal">{jobData.compensation}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBookInterview}
                className="flex-1 h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-medium"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Interview
              </Button>
              <Button
                onClick={handleStartAssessment}
                variant="outline"
                className="flex-1 h-12 bg-white hover:bg-gray-50 text-[#0B1121] border-2 border-gray-200 hover:border-gray-300 rounded-xl font-medium"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Complete Assessment
              </Button>
            </div>
          </motion.div>

          {/* Why This Is a Great Match */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 mb-6"
          >
            <h2 className="text-2xl font-semibold text-[#0B1121] mb-4">
              Why This Is a Great Match
            </h2>
            
            <p className="text-[#6B7280] leading-relaxed font-normal">
              {matchInsights.matchReason}
            </p>
          </motion.div>          

          {/* About the Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 mb-6"
          >
            <h2 className="text-2xl font-semibold text-[#0B1121] mb-4">
              About the Role
            </h2>
            <p className="text-[#6B7280] leading-relaxed mb-6 font-normal">
              {jobData.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0B1121] mb-4">
                  Key Responsibilities
                </h3>
                <ul className="space-y-3">
                  {jobData.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B7280] font-normal">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#0B1121] mb-4">
                  Qualifications
                </h3>
                <ul className="space-y-3">
                  {jobData.qualifications.map((qual, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B7280] font-normal">{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* About the Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 mb-6"
          >
            <h2 className="text-2xl font-semibold text-[#0B1121] mb-6">
              About {jobData.company}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-[#6B7280]" />
                  <p className="text-xs text-[#6B7280] font-normal">Company Size</p>
                </div>
                <p className="text-base font-semibold text-[#0B1121]">{jobData.companySize}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                  <p className="text-xs text-[#6B7280] font-normal">Founded</p>
                </div>
                <p className="text-base font-semibold text-[#0B1121]">{jobData.founded}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#6B7280]" />
                  <p className="text-xs text-[#6B7280] font-normal">Funding</p>
                </div>
                <p className="text-base font-semibold text-[#0B1121]">{jobData.funding}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#6B7280]" />
                  <p className="text-xs text-[#6B7280] font-normal">Team Size</p>
                </div>
                <p className="text-base font-semibold text-[#0B1121]">{jobData.teamSize}</p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-[#6B7280] leading-relaxed font-normal">
                {jobData.company} is an early-stage startup building innovative solutions in the robotics space. 
                Join a small, focused team where you'll have significant impact and ownership over your work while 
                learning from experienced engineers and researchers.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
