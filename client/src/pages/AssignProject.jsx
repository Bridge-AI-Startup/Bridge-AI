
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/navigation/Header";
import ProjectsList from "../components/assign-project/ProjectsList";
import ProjectDetailModal from "../components/assign-project/ProjectDetailModal";
import AssignConfirmationModal from "../components/assign-project/AssignConfirmationModal";
import PostingSuccessModal from "../components/assign-project/PostingSuccessModal";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { API_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

export default function AssignProject() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const jobListingId = searchParams.get("jobId");

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedProject, setRecommendedProject] = useState(null);
  const [jobListing, setJobListing] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadJobAndGenerateProjects();
  }, []);

  const loadJobAndGenerateProjects = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      // If we have a job ID, fetch it and generate AI assessments
      if (jobListingId) {
        // Fetch job listing details
        const jobResponse = await fetch(`${API_URL}/api/job-listings/${jobListingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const jobData = await jobResponse.json();
        if (jobData.success) {
          setJobListing(jobData.data.jobListing);

          // Generate 3 general AI assessments
          await generateAIAssessments(jobData.data.jobListing, token);
        }
      } else {
        // No job ID - redirect to dashboard
        toast({
          title: "Missing Job ID",
          description: "Please create a job listing first",
          variant: "destructive",
        });
        navigate('/EmployerDashboard');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to generate assessments. Please try again.",
        variant: "destructive",
      });
      // No fallback - show error state
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIAssessments = async (listing, token, previousAssessments = []) => {
    try {
      // Start showing progressive loading
      setProjects([]);

      // Simulate progressive updates by showing each assessment as it "arrives"
      // This creates a better UX even though they're generated in batch
      const response = await fetch(`${API_URL}/api/assessments/ai/generate-batch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobListingId: listing._id,
          previousAssessments: previousAssessments.length > 0 ? previousAssessments : undefined
        })
      });

      const data = await response.json();

      console.log('✅ AI batch assessments generated:', data);

      if (data.success && data.data.assessments && Array.isArray(data.data.assessments)) {
        const difficultyMap = { easy: 'Beginner', medium: 'Intermediate', hard: 'Advanced' };

        // Add each assessment with a progressive delay for better UX
        for (let index = 0; index < data.data.assessments.length; index++) {
          const assessment = data.data.assessments[index];
          const assessmentType = assessment.assessmentType || 'coding';

          const project = {
            id: index + 1,
            title: assessment.title,
            description: assessment.description,
            shortDescription: assessment.description,
            whyCurated: assessment.whyCurated || `AI-generated ${assessmentType.replace('_', ' ')} assessment tailored for ${listing.roleTitle}`,
            skills: listing.requiredSkills?.map(s => s.skillName) || [],
            difficulty: difficultyMap[assessment.difficulty] || assessment.difficulty || 'Intermediate',
            estimatedTime: `${Math.floor(assessment.timeLimit / 60)} hour${Math.floor(assessment.timeLimit / 60) !== 1 ? 's' : ''}`,
            requirements: assessment.requirements || [],
            acceptanceCriteria: assessment.acceptanceCriteria || assessment.evaluationCriteria || [],
            gradingRubric: [
              { category: "Functionality", description: "Core features work correctly", defaultEmphasis: 85 },
              { category: "Code Quality", description: "Clean, well-organized code", defaultEmphasis: 70 },
              { category: "Problem Solving", description: "Effective approach and logic", defaultEmphasis: 75 },
              { category: "Completeness", description: "All requirements met", defaultEmphasis: 80 }
            ],
            aiGenerated: true,
            assessmentType: assessmentType,
            assessmentData: assessment // Store full assessment data for later
          };

          // Update state progressively with a delay for visual effect
          // Use callback form to ensure we're always working with the latest state
          await new Promise(resolve => setTimeout(resolve, 800));
          setProjects(prevProjects => [...prevProjects, project]);

          if (index === 0) {
            setRecommendedProject(project);
          }
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating batch assessments:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI assessments. Please try again.",
        variant: "destructive",
      });
      setProjects([]);
    }
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

  const confirmAssignment = async () => {
    setShowConfirmModal(false);

    try {
      const token = localStorage.getItem('token');

      // If this is an AI-generated assessment, save it to the database
      if (selectedProject.aiGenerated && selectedProject.assessmentData) {
        const assessment = selectedProject.assessmentData;
        const type = selectedProject.assessmentType;

        // Prepare assessment payload
        let assessmentPayload = {
          title: assessment.title,
          description: assessment.description,
          assessmentType: type,
          timeLimit: assessment.timeLimit,
          jobListingId: jobListingId
        };

        // Add type-specific data
        if (type === 'coding') {
          assessmentPayload.codingChallenge = {
            problemStatement: assessment.problemStatement,
            starterCode: assessment.starterCode || '',
            testCases: assessment.testCases || [],
            allowedLanguages: assessment.allowedLanguages || ['JavaScript', 'Python'],
            difficulty: assessment.difficulty || 'medium'
          };
          assessmentPayload.totalPoints = 100;
          assessmentPayload.passingScore = 70;
        } else if (type === 'technical_quiz' || type === 'case_study') {
          assessmentPayload.questions = assessment.questions || [];
          assessmentPayload.totalPoints = assessment.totalPoints || 100;
          assessmentPayload.passingScore = assessment.passingScore || 70;
        }

        // Save assessment to database
        const response = await fetch(`${API_URL}/api/assessments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(assessmentPayload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to save assessment');
        }

        toast({
          title: "Success!",
          description: "Assessment has been created and linked to your job listing",
        });
      }

      // Clear any pending listing data
      sessionStorage.removeItem('pendingListing');

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDashboard = () => {
    setShowSuccessModal(false);
    navigate("/EmployerDashboard");
  };

  const handleLearnMore = () => {
    setShowSuccessModal(false);
    navigate("/HowMatchingWorks");
  };

  const handleRefreshAssessments = async () => {
    if (!jobListing) return;

    // Capture current assessments to pass as "previous" to avoid duplicates
    const previousAssessmentData = projects.map(p => ({
      title: p.title,
      description: p.description,
      primaryFocus: p.assessmentData?.primaryFocus || p.whyCurated,
      difficulty: p.difficulty
    }));

    // Clear projects and recommended project BEFORE setting loading
    setProjects([]);
    setRecommendedProject(null);

    // Small delay to ensure state updates are processed
    await new Promise(resolve => setTimeout(resolve, 50));

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      await generateAIAssessments(jobListing, token, previousAssessmentData);

      toast({
        title: "Assessments Regenerated",
        description: "New AI assessments have been generated successfully",
      });
    } catch (error) {
      console.error('Error regenerating assessments:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate assessments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <p className="text-xl text-[#6B7280] font-normal mb-6">
              Choose a project for candidates to complete — then your listing goes live
            </p>

            {/* Refresh Button */}
            {!isLoading && projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={handleRefreshAssessments}
                  variant="outline"
                  className="gap-2 rounded-xl h-11 px-6 border-2 hover:border-[#6366F1] hover:bg-[#6366F1]/5 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerate Assessments</span>
                </Button>
              </motion.div>
            )}
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
