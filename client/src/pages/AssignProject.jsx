
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import Header from "../components/navigation/Header";
import ProjectsList from "../components/assign-project/ProjectsList";
import ProjectDetailModal from "../components/assign-project/ProjectDetailModal";
import AssignConfirmationModal from "../components/assign-project/AssignConfirmationModal";
import PostingSuccessModal from "../components/assign-project/PostingSuccessModal";
import Breadcrumbs from "../components/navigation/Breadcrumbs";

export default function AssignProject() {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedProject, setRecommendedProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProjects();
  }, []);

  const loadProjects = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const generatedProjects = generateMockProjects();
      setProjects(generatedProjects);
      setRecommendedProject(generatedProjects[0]); // First project is recommended
      setIsLoading(false);
    }, 1000);
  };

  const generateMockProjects = () => {
    return [
      {
        id: 1,
        title: "Real-Time Chat Application",
        description: "Build a real-time chat application with WebSocket support, user authentication, and message persistence.",
        shortDescription: "Real-time messaging system with authentication",
        whyCurated: "Tests real-time architecture and WebSocket implementation — essential skills for your role. Will help identify candidates who can handle concurrent connections and state synchronization.",
        skills: ["React", "Node.js", "WebSocket", "MongoDB", "Authentication"],
        difficulty: "Intermediate",
        estimatedTime: "3 hours",
        requirements: [
          "User registration and login system",
          "Real-time message sending and receiving",
          "Chat room creation and management",
          "Message history persistence",
          "Online/offline user status indicators"
        ],
        acceptanceCriteria: [
          "Messages appear instantly without page refresh",
          "Users can see who's online",
          "Chat history persists across sessions",
          "Clean, responsive UI",
          "No security vulnerabilities"
        ],
        gradingRubric: [
          { category: "Functionality", description: "Core features work correctly (messaging, auth, persistence)", defaultEmphasis: 85 },
          { category: "Code Quality", description: "Clean, well-organized code following best practices", defaultEmphasis: 70 },
          { category: "Real-time Performance", description: "Messages appear instantly, no lag or delays", defaultEmphasis: 75 },
          { category: "UI/UX Design", description: "Intuitive interface, responsive design", defaultEmphasis: 50 },
          { category: "Error Handling", description: "Graceful handling of edge cases and errors", defaultEmphasis: 60 }
        ]
      },
      {
        id: 2,
        title: "E-Commerce Product Dashboard",
        description: "Create an admin dashboard for managing products, inventory, and sales analytics with data visualization.",
        shortDescription: "Admin dashboard with analytics and product management",
        whyCurated: "Evaluates data visualization and complex state management — key competencies for this role. Tests ability to build admin-facing tools with multiple data sources.",
        skills: ["React", "TypeScript", "REST API", "Charts", "State Management"],
        difficulty: "Intermediate",
        estimatedTime: "4 hours",
        requirements: [
          "Product CRUD operations",
          "Inventory tracking system",
          "Sales analytics with charts",
          "Search and filter functionality",
          "Responsive table views"
        ],
        acceptanceCriteria: [
          "All CRUD operations work correctly",
          "Charts accurately represent data",
          "Fast search and filtering",
          "Mobile-responsive design",
          "Data validation on all inputs"
        ],
        gradingRubric: [
          { category: "CRUD Operations", description: "All create, read, update, delete functions work correctly", defaultEmphasis: 80 },
          { category: "Data Visualization", description: "Charts are accurate, interactive, and insightful", defaultEmphasis: 75 },
          { category: "TypeScript Usage", description: "Proper type definitions and type safety", defaultEmphasis: 65 },
          { category: "UI/UX", description: "Clean interface, mobile responsive, easy to navigate", defaultEmphasis: 55 },
          { category: "Performance", description: "Fast search/filter, optimized rendering", defaultEmphasis: 70 }
        ]
      },
      {
        id: 3,
        title: "Task Automation CLI Tool",
        description: "Develop a command-line tool that automates common development tasks like file processing, API testing, and deployment.",
        shortDescription: "CLI tool for development automation",
        whyCurated: "Assesses backend tooling and CLI design — important for this position. Will reveal candidates' systems thinking and ability to build developer tools.",
        skills: ["Python", "CLI", "File Processing", "API Integration", "Scripting"],
        difficulty: "Advanced",
        estimatedTime: "3 hours",
        requirements: [
          "Command-line argument parsing",
          "File batch processing capabilities",
          "HTTP request testing functionality",
          "Configuration file support",
          "Error handling and logging"
        ],
        acceptanceCriteria: [
          "Clear command documentation",
          "Handles edge cases gracefully",
          "Efficient file processing",
          "Helpful error messages",
          "Easy to install and use"
        ],
        gradingRubric: [
          { category: "Functionality", description: "All commands work as expected with proper arguments", defaultEmphasis: 85 },
          { category: "Code Architecture", description: "Modular, maintainable code structure", defaultEmphasis: 75 },
          { category: "Error Handling", description: "Clear error messages, graceful failure handling", defaultEmphasis: 70 },
          { category: "Documentation", description: "Clear README with usage examples", defaultEmphasis: 60 },
          { category: "User Experience", description: "Intuitive commands, helpful output", defaultEmphasis: 55 }
        ]
      },
      {
        id: 4,
        title: "Weather Forecast Widget",
        description: "Build a weather widget that displays current conditions and forecasts using a public weather API.",
        shortDescription: "Weather widget with forecast and location search",
        whyCurated: "Tests third-party API integration and error handling — valuable skills for this role. Will assess ability to work with external data sources and handle API failures.",
        skills: ["JavaScript", "API Integration", "UI/UX", "Geolocation"],
        difficulty: "Beginner",
        estimatedTime: "2 hours",
        requirements: [
          "Current weather display",
          "5-day forecast view",
          "Location search functionality",
          "Geolocation support",
          "Temperature unit toggle (F/C)"
        ],
        acceptanceCriteria: [
          "Accurate weather data",
          "Smooth animations",
          "Clean, intuitive interface",
          "Works on mobile devices",
          "Handles API errors gracefully"
        ],
        gradingRubric: [
          { category: "API Integration", description: "Correct API usage, data fetching and parsing", defaultEmphasis: 80 },
          { category: "UI Design", description: "Clean, attractive interface with smooth animations", defaultEmphasis: 65 },
          { category: "Feature Completeness", description: "All required features implemented and working", defaultEmphasis: 75 },
          { category: "Error Handling", description: "Handles API errors and invalid inputs gracefully", defaultEmphasis: 60 },
          { category: "Responsiveness", description: "Works well on mobile and desktop", defaultEmphasis: 50 }
        ]
      },
      {
        id: 5,
        title: "Data Visualization Dashboard",
        description: "Create an interactive dashboard that visualizes complex datasets with multiple chart types and filtering options.",
        shortDescription: "Interactive dashboard with data visualizations",
        whyCurated: "Challenges advanced data visualization and interaction design — critical for this position. Will test ability to make complex data accessible and actionable.",
        skills: ["React", "D3.js", "Data Analysis", "TypeScript", "Responsive Design"],
        difficulty: "Advanced",
        estimatedTime: "4 hours",
        requirements: [
          "Multiple chart types (bar, line, pie)",
          "Interactive filtering system",
          "Data export functionality",
          "Responsive grid layout",
          "Real-time data updates"
        ],
        acceptanceCriteria: [
          "Charts are interactive and responsive",
          "Filters update visualizations instantly",
          "Data exports correctly",
          "Performance is optimized",
          "Accessible to screen readers"
        ],
        gradingRubric: [
          { category: "Visualization Quality", description: "Charts are clear, accurate, and interactive", defaultEmphasis: 85 },
          { category: "Interactivity", description: "Filters update instantly, smooth user interactions", defaultEmphasis: 75 },
          { category: "Code Quality", description: "Clean, optimized, well-structured code", defaultEmphasis: 70 },
          { category: "Design", description: "Professional appearance, responsive layout", defaultEmphasis: 60 },
          { category: "Accessibility", description: "Screen reader support, keyboard navigation", defaultEmphasis: 55 }
        ]
      }
    ];
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const handleAssignProject = () => {
    setShowDetailModal(false);
    setShowConfirmModal(true);
  };

  const handleQuickAssign = () => {
    if (recommendedProject) {
      setSelectedProject(recommendedProject);
      setShowConfirmModal(true);
    }
  };

  const confirmAssignment = () => {
    setShowConfirmModal(false);
    
    // Post the listing with the selected project
    const listingData = JSON.parse(sessionStorage.getItem('pendingListing') || '{}');
    console.log('Posting listing with project:', {
      ...listingData,
      projectId: selectedProject.id,
      projectTitle: selectedProject.title
    });
    
    sessionStorage.removeItem('pendingListing');
    
    // Show success modal instead of alert
    setShowSuccessModal(true);
  };

  const handleViewDashboard = () => {
    setShowSuccessModal(false);
    navigate("/EmployerDashboard");
  };

  const handleLearnMore = () => {
    setShowSuccessModal(false);
    navigate("/HowMatchingWorks");
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Create Listing", path: "CreateListing?restore=true" },
    { label: "Assign Project" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
              Assign Assessment Project
            </h1>
            <p className="text-xl text-[#6B7280] font-normal">
              Choose a project for candidates to complete — then your listing goes live
            </p>
          </motion.div>

          {/* Projects List */}
          <ProjectsList
            projects={projects}
            onProjectSelect={handleProjectSelect}
            isLoading={isLoading}
            recommendedProjectId={recommendedProject?.id}
          />
        </div>
      </div>

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setShowDetailModal(false)}
          onAssign={handleAssignProject}
          onUpdateProject={setSelectedProject}
        />
      )}

      {/* Assignment Confirmation Modal */}
      {showConfirmModal && selectedProject && (
        <AssignConfirmationModal
          project={selectedProject}
          onConfirm={confirmAssignment}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedProject && (
        <PostingSuccessModal
          projectTitle={selectedProject.title}
          onViewDashboard={handleViewDashboard}
          onLearnMore={handleLearnMore}
        />
      )}
    </div>
  );
}
