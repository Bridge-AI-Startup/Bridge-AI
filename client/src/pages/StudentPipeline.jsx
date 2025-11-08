
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Calendar, Code, CheckCircle, Award, User, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import KanbanBoard from "../components/candidate-tracking/KanbanBoard";
import StudentApplicationModal from "../components/candidate-tracking/StudentApplicationModal";

export default function StudentPipeline() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState(null);

  const stages = [
    { id: "new", label: "Matches", color: "blue" },
    { id: "interview", label: "Interview", color: "purple" },
    { id: "offer", label: "Offers", color: "fuchsia" }
  ];

  const applications = {
    "new": [
      { 
        id: 2, 
        name: "Seedify Labs", 
        role: "Product Intern", 
        location: "Remote", 
        match: "89%", 
        date: "Dec 15", 
        logo: "seedify",
        assessmentStarted: true,
        hoursLeft: 2,
        completionTimeAllowedHours: 4,
        description: "Early-stage fintech startup revolutionizing investment tools. Need a product intern to help shape our roadmap and work closely with design and engineering.",
        skills: ["React", "Figma", "Product Strategy", "User Research"],
        industry: "FinTech",
        companySize: "11-50",
        fundingStage: "Seed"
      },
      { 
        id: 4, 
        name: "CloudVentures", 
        role: "Frontend Engineer Intern", 
        location: "Seattle, WA", 
        match: "88%", 
        date: "Dec 18", 
        logo: "cloudstream",
        assessmentStarted: true,
        hoursLeft: 0,
        completionTimeAllowedHours: 4,
        assessmentStatus: "completed",
        completedDate: "Dec 18, 2024",
        description: "Building next-generation cloud storage solutions for developers. Looking for a frontend engineer passionate about user experience and performance.",
        skills: ["React", "TypeScript", "Tailwind CSS", "GraphQL"],
        industry: "Cloud Infrastructure",
        companySize: "201-500",
        fundingStage: "Series C"
      },
      { 
        id: 1, 
        name: "Nova Robotics", 
        role: "Data Science Intern", 
        location: "San Diego, CA", 
        match: "94%", 
        date: "Dec 15", 
        logo: "nova",
        assessmentStarted: false,
        completionTimeAllowedHours: 4,
        description: "Building autonomous systems for warehouse logistics. Looking for a data science intern to optimize ML models and improve robot navigation algorithms.",
        skills: ["Python", "TensorFlow", "Data Analysis", "Machine Learning", "Statistics"],
        industry: "Robotics",
        companySize: "51-200",
        fundingStage: "Series A"
      }
    ].sort((a, b) => {
      // Sort order: in progress (0), then not started (1), then completed (2)
      const getOrder = (app) => {
        if (app.assessmentStarted && app.hoursLeft > 0 && !app.assessmentStatus) return 0; // In Progress
        if (!app.assessmentStarted) return 1; // Not Started
        if (app.assessmentStatus === "completed") return 2; // Completed
        return 3; // Fallback for any other state
      };
      return getOrder(a) - getOrder(b);
    }),
    "interview": [
      { 
        id: 5, 
        name: "CloudStream", 
        role: "Backend Engineer Intern", 
        location: "San Francisco, CA", 
        match: "87%", 
        date: "Dec 22, 2pm", 
        logo: "cloudstream",
        interviewStatus: "scheduled",
        description: "Real-time streaming platform serving millions of users. Looking for backend engineers passionate about scale.",
        skills: ["Node.js", "PostgreSQL", "AWS", "Microservices"],
        industry: "Technology",
        companySize: "201-500",
        fundingStage: "Series B"
      },
      { 
        id: 7, 
        name: "QuantumAI", 
        role: "Software Engineer Intern", 
        location: "New York, NY", 
        match: "90%", 
        date: "Pending", 
        logo: "nova",
        interviewStatus: "needsScheduling",
        description: "Pioneering quantum computing applications for enterprise. Need software engineers to build quantum algorithms and simulations.",
        skills: ["Python", "Quantum Computing", "Mathematics", "C++"],
        industry: "AI/ML",
        companySize: "11-50",
        fundingStage: "Seed"
      },
      { 
        id: 6, 
        name: "DataFlow", 
        role: "ML Engineer Intern", 
        location: "Boston, MA", 
        match: "85%", 
        date: "Completed Dec 5", 
        logo: "dataflow",
        interviewStatus: "completed",
        description: "Building data infrastructure for modern enterprises. Looking for ML engineers to improve our data pipeline and analytics.",
        skills: ["Python", "Apache Spark", "MLOps", "AWS"],
        industry: "Data Infrastructure",
        companySize: "51-200",
        fundingStage: "Series A"
      }
    ],
    "offer": [
      { 
        id: 8, 
        name: "Stripe", 
        role: "Software Engineer Intern", 
        location: "San Francisco, CA", 
        match: "96%", 
        date: "Received Dec 10", 
        logo: "stripe", 
        offerStatus: "waiting",
        description: "Building economic infrastructure for the internet. Join our payments infrastructure team.",
        skills: ["Ruby", "JavaScript", "API Design", "Distributed Systems"],
        industry: "FinTech",
        companySize: "501+",
        fundingStage: "Public"
      },
      { 
        id: 9, 
        name: "Airbnb", 
        role: "Product Design Intern", 
        location: "Remote", 
        match: "92%", 
        date: "Received Dec 8", 
        logo: "airbnb", 
        offerStatus: "accepted",
        description: "Reimagining travel and hospitality. Looking for product designers to work on our host experience.",
        skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
        industry: "Marketplace",
        companySize: "501+",
        fundingStage: "Public"
      }
    ]
  };

  // Filter applications by search query
  const filterApplications = (appsList) => {
    if (!searchQuery) return appsList;
    return appsList.filter(app =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredApplications = Object.keys(applications).reduce((acc, stageId) => {
    acc[stageId] = filterApplications(applications[stageId]);
    return acc;
  }, {});

  const totalApplications = Object.values(applications).reduce((sum, arr) => sum + arr.length, 0);

  // Calculate insights for the new overview section
  const avgMatchScore = applications["new"].length > 0 
    ? Math.round(applications["new"].reduce((sum, app) => sum + parseInt(app.match), 0) / applications["new"].length)
    : 0;

  const getNextDeadline = () => {
    const tasks = [];
    // Add assessment deadlines
    applications["new"].forEach(app => {
      if (app.assessmentStarted && app.hoursLeft > 0) {
        tasks.push({ type: 'assessment', company: app.name, hours: app.hoursLeft });
      }
    });
    // Add interview scheduling needs
    applications["interview"].forEach(app => {
      if (app.interviewStatus === "needsScheduling") {
        tasks.push({ type: 'schedule', company: app.name, hours: 48 }); // Assume 48h default for scheduling
      }
    });
    if (tasks.length === 0) return null;
    // Sort tasks by hours remaining to find the soonest
    const soonest = tasks.reduce((min, task) => task.hours < min.hours ? task : min);
    return soonest;
  };

  const nextDeadline = getNextDeadline();
  const applicationsNeedingAction = applications["new"].filter(app => 
    !app.assessmentStarted || (app.assessmentStarted && app.hoursLeft > 0 && !app.assessmentStatus)
  ).length;
  const interviewsNeedingBooking = applications["interview"].filter(app => 
    app.interviewStatus === "needsScheduling"
  ).length;


  const handleViewAll = (stageId) => {
    switch(stageId) {
      case "new":
        navigate('/StudentNewMatches');
        break;
      case "interview":
        navigate('/StudentInterviews');
        break;
      case "offer":
        navigate('/StudentOffers');
        break;
      default:
        break;
    }
  };

  const handleOpenModal = (app, stageId) => {
    setSelectedApplication(app);
    setSelectedStageId(stageId);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
    setSelectedStageId(null);
  };

  const handleNext = () => {
    if (!selectedApplication || !selectedStageId || !filteredApplications[selectedStageId]) return;
    const currentStage = filteredApplications[selectedStageId];
    const currentIndex = currentStage.findIndex(a => a.id === selectedApplication.id);
    if (currentIndex !== -1 && currentIndex < currentStage.length - 1) {
      setSelectedApplication(currentStage[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!selectedApplication || !selectedStageId || !filteredApplications[selectedStageId]) return;
    const currentStage = filteredApplications[selectedStageId];
    const currentIndex = currentStage.findIndex(a => a.id === selectedApplication.id);
    if (currentIndex > 0) {
      setSelectedApplication(currentStage[currentIndex - 1]);
    }
  };

  const hasNext = selectedApplication && selectedStageId && filteredApplications[selectedStageId] ? 
    filteredApplications[selectedStageId].findIndex(a => a.id === selectedApplication.id) < filteredApplications[selectedStageId].length - 1 : false;
  
  const hasPrev = selectedApplication && selectedStageId && filteredApplications[selectedStageId] ? 
    filteredApplications[selectedStageId].findIndex(a => a.id === selectedApplication.id) > 0 : false;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <Header currentPage="StudentDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={[
            { label: "Dashboard", path: "StudentDashboard" },
            { label: "My Applications" }
          ]} />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-[#0B1121] mb-1">
                  My Applications
                </h1>
                <p className="text-base text-[#6B7280] font-normal">
                  Track all your opportunities • {totalApplications} applications in pipeline
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate("/StudentCalendar", { state: { from: "StudentPipeline" } })}
                  variant="outline"
                  className="h-11 px-5 rounded-xl border border-gray-300 hover:border-[#1E3A8A] hover:shadow-sm transition-all"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button
                  onClick={() => navigate("/Profile", { state: { from: "StudentPipeline" } })}
                  variant="outline"
                  className="h-11 px-5 rounded-xl border border-gray-300 hover:border-[#1E3A8A] hover:shadow-sm transition-all"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Progress Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8"
          >
            <h2 className="text-lg font-semibold text-[#0B1121] mb-5">Progress Overview</h2>
            <div className="grid grid-cols-4 gap-4">
              {/* Avg Match Score */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#1E3A8A]" />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-[#0B1121] mb-1">
                  {avgMatchScore}%
                </p>
                <p className="text-sm text-[#6B7280] font-normal">
                  Avg Match Score
                </p>
              </div>

              {/* Next Deadline */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-[#0B1121] mb-1">
                  {nextDeadline ? `${nextDeadline.hours}h` : '—'}
                </p>
                <p className="text-sm text-[#6B7280] font-normal">
                  {nextDeadline ? `Project Deadline: ${nextDeadline.company}` : 'No deadlines'}
                </p>
              </div>

              {/* Applications Needing Action */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Code className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-[#0B1121] mb-1">
                  {applicationsNeedingAction}
                </p>
                <p className="text-sm text-[#6B7280] font-normal">
                  Projects to complete
                </p>
              </div>

              {/* Interviews Needing Booking */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-[#0B1121] mb-1">
                  {interviewsNeedingBooking}
                </p>
                <p className="text-sm text-[#6B7280] font-normal">
                  Interviews to book
                </p>
              </div>
            </div>
          </motion.div>

          {/* Application Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-semibold text-[#0B1121] mb-6">
              Application Pipeline
            </h2>

            <KanbanBoard
              stages={stages}
              filteredCandidates={filteredApplications}
              onReviewAssessment={() => {}}
              onViewAll={handleViewAll}
              onOpenModal={handleOpenModal}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showViewDashboard={false}
            />
          </motion.div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedApplication && (
        <StudentApplicationModal
          application={selectedApplication}
          stageId={selectedStageId}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      )}
    </motion.div>
  );
}
