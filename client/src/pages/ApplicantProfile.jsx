
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Code, Mail, MapPin, Github, Linkedin, ExternalLink, Sparkles, Award, Briefcase, GraduationCap, Star, TrendingUp, FileCheck, CheckCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";

export default function ApplicantProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidate");
  const jobId = searchParams.get("job");
  const fromPage = searchParams.get("from");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock candidate data - in production, fetch based on candidateId
  // The 'assessments' array has been added to the existing candidate structure.
  const candidate = {
    name: "Maya Johnson",
    initials: "MJ",
    role: "Full-Stack Engineer Intern",
    email: "maya.johnson@stanford.edu",
    location: "Stanford, CA",
    university: "Stanford University",
    major: "Computer Science, BS",
    graduationYear: "May 2025",
    gpa: "3.9",
    matchScore: 94,
    bgColor: "bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]",
    summary: "Passionate full-stack engineer with strong React and Node.js experience. Led development of 3 major university projects with 10K+ users. Previous internship at early-stage startup building real-time collaboration tools. Excited about working in fast-paced environments and building products that matter.",
    linkedin: "linkedin.com/in/mayajohnson",
    github: "github.com/mayajohnson",
    phone: "(555) 123-4567",
    
    whyMatch: "Maya's React projects and TypeScript expertise align perfectly with your tech stack. Her previous team leadership experience shows strong collaboration skills, and her focus on product engineering matches your company culture. She's built production applications at scale and has a proven track record of shipping high-quality code.",
    
    coursework: ["Algorithms", "Data Structures", "Web Development", "Databases", "Machine Learning"],
    awards: [
      "Dean's List - 3 consecutive years",
      "1st Place - Stanford Hackathon 2024",
      "Google Computer Science Scholar"
    ],
    
    // Interview data
    interviews: [
      {
        title: "Technical Interview",
        interviewer: "Sarah Chen",
        date: "Dec 12, 2024",
        duration: "60 min",
        status: "completed",
        rating: 9,
        notes: "Excellent problem-solving skills and clean code. Strong communication throughout the interview. Demonstrated deep understanding of React and system design concepts.",
        strengths: ["Problem Solving", "Code Quality", "Communication", "System Design"],
        concerns: [],
        recommendation: "Strong Hire"
      }
    ],
    
    assessments: [
      {
        title: "Real-time Chat Application",
        description: "Build a real-time chat application with user authentication, message persistence, and typing indicators using React and WebSockets.",
        status: "completed",
        completedDate: "Dec 8, 2024",
        aiScore: 86,
        timeAllowed: "4 hours"
      }
    ],
    assessmentHoursLeft: 48,
    interviewScheduled: true,
    interviewDate: "Dec 12, 2024",
    offerStatus: null,
    
    skills: [
      { name: "React.js", level: 95, category: "Frontend" },
      { name: "Node.js", level: 90, category: "Backend" },
      { name: "TypeScript", level: 88, category: "Language" },
      { name: "PostgreSQL", level: 85, category: "Database" },
      { name: "AWS", level: 80, category: "Cloud" },
      { name: "Docker", level: 82, category: "DevOps" }
    ],

    experience: [
      {
        title: "Software Engineering Intern",
        company: "TechCorp",
        duration: "Jun 2024 - Sep 2024",
        description: "Built and shipped a React-based dashboard used by 10K+ users. Improved page load times by 40% through code splitting and optimization. Collaborated with design team to implement new UI components.",
        achievements: [
          "Reduced API response times by 35% through query optimization",
          "Mentored 2 junior developers on React best practices",
          "Led migration of legacy codebase to TypeScript"
        ]
      },
      {
        title: "Teaching Assistant - Data Structures",
        company: "UC San Diego",
        duration: "Jan 2024 - Jun 2024",
        description: "Assisted in teaching data structures course to 300+ students. Held weekly office hours and graded assignments.",
        achievements: [
          "Received 4.8/5.0 student rating for clarity and helpfulness",
          "Developed automated testing framework for student assignments"
        ]
      }
    ],
    
    projects: [
      {
        name: "StudentHub",
        description: "A platform connecting students for study groups and project collaboration. Built with React, Node.js, and PostgreSQL.",
        impact: "Used by 5,000+ students across 12 universities",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
        github: "github.com/mayajohnson/studenthub",
        demo: "studenthub.app",
        highlights: [
          "Implemented real-time chat using WebSockets",
          "Built recommendation algorithm matching students by interests",
          "Achieved 99.9% uptime over 6 months"
        ]
      },
      {
        name: "CodeReview AI",
        description: "AI-powered code review tool that provides suggestions for improving code quality and performance.",
        impact: "500+ GitHub stars, featured in GitHub's trending repositories",
        technologies: ["Python", "OpenAI API", "TypeScript", "React"],
        github: "github.com/mayajohnson/codereview-ai",
        highlights: [
          "Integrated with GitHub Actions for automated reviews",
          "Built Chrome extension for inline code suggestions",
          "Processed 10K+ code reviews"
        ]
      },
      {
        name: "TaskFlow",
        description: "Modern task management app with focus on developer productivity. Features Kanban boards, time tracking, and integrations.",
        impact: "1,000+ active users, $5K MRR",
        technologies: ["Next.js", "Tailwind CSS", "Supabase", "Stripe"],
        demo: "taskflow.dev",
        highlights: [
          "Monetized with Stripe subscription integration",
          "Built custom drag-and-drop interface",
          "Integrated with Slack, GitHub, and Linear"
        ]
      }
    ]
  };

  const matchInsights = [
    { label: "Technical Skills Match", score: 96, icon: Code },
    { label: "Experience Level", score: 92, icon: Briefcase },
    { label: "Cultural Fit", score: 94, icon: Star },
    { label: "Project Complexity", score: 95, icon: Award }
  ];

  // Determine current stage
  const getCurrentStage = () => {
    const hasCompletedInterviews = candidate.interviews && candidate.interviews.some(i => i.status === "completed");
    const hasCompletedAssessments = candidate.assessments.some(a => a.status === "completed");
    const hasPendingAssessments = candidate.assessments.some(a => a.status === "pending");
    const hasOverdueAssessments = candidate.assessments.some(a => {
      // Assuming today is current date for overdue calculation
      // Note: The mock data for assessments does not include `dueDate`.
      // For a real application, you'd need `dueDate` in your assessment objects.
      // For now, this will only check `status`.
      return a.status === 'pending'; // Simplified due to missing dueDate in mock
    });

    if (hasCompletedInterviews) {
      return {
        label: "Interview Complete",
        color: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        icon: CheckCircle
      };
    } else if (hasCompletedAssessments) {
      return {
        label: "Assessment Complete",
        color: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        icon: CheckCircle
      };
    } else if (hasOverdueAssessments) {
      // This logic needs actual dueDate in candidate.assessments to be accurate
      return {
        label: "Assessment Overdue",
        color: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
        icon: Clock
      };
    } else if (hasPendingAssessments) {
      return {
        label: "Assessment In Progress",
        color: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
        icon: FileCheck
      };
    } else {
      return {
        label: "New Match",
        color: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        icon: CheckCircle
      };
    }
  };

  const currentStage = getCurrentStage();

  // Build breadcrumb items based on where user came from
  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Full-Stack Engineer Intern", path: "JobListingDashboard?id=fullstack-engineer" }
  ];

  // Add intermediate page if coming from a stage-specific dashboard
  if (fromPage === "review-matches") {
    breadcrumbItems.push({ label: "Review Matches", path: "ReviewMatches" });
  } else if (fromPage === "review-assessments") {
    breadcrumbItems.push({ label: "Review Assessments", path: "ReviewAssessments" });
  } else if (fromPage === "review-interviews") {
    breadcrumbItems.push({ label: "Review Interviews", path: "ReviewInterviews" });
  } else if (fromPage === "review-offers") {
    breadcrumbItems.push({ label: "Review Offers", path: "ReviewOffers" });
  } else if (fromPage === "calendar") {
    breadcrumbItems.push({ label: "Calendar", path: "InterviewCalendar" });
  }

  // Add current candidate as final breadcrumb
  breadcrumbItems.push({ label: candidate.name });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="EmployerDashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Page Header - Outside of box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-start gap-6 mb-4">
              <div className={`w-24 h-24 rounded-xl ${candidate.bgColor} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-3xl font-semibold">
                  {candidate.initials}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-semibold text-[#0B1121] leading-none">
                    {candidate.name}
                  </h1>
                  <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${currentStage.color} ${currentStage.borderColor} border-2`}>
                    <currentStage.icon className={`w-4 h-4 ${currentStage.textColor}`} />
                    <span className={currentStage.textColor}>{currentStage.label}</span>
                  </span>
                </div>
                <p className="text-xl text-[#6B7280] font-normal mb-3">
                  {candidate.role}
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-normal">{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-normal">{candidate.email}</span>
                  </div>
                  <div className="px-3 py-1 bg-gray-200 text-[#0B1121] text-sm font-semibold rounded-lg">
                    {candidate.matchScore}% Match
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <a
                    href={`https://${candidate.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1121] hover:bg-[#0B1121]/90 text-white transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                  <a
                    href={`https://${candidate.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077B5] hover:bg-[#0077B5]/90 text-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            <p className="text-[#6B7280] leading-relaxed font-normal text-base">
              {candidate.summary}
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="bg-white rounded-2xl p-4 border border-gray-200 mb-6"
          >
            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl font-medium transition-colors"
              >
                <Award className="w-4 h-4 mr-2" />
                Extend Offer
              </Button>
              <Button
                className="flex-1 h-12 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-medium transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Pass
              </Button>
            </div>
          </motion.div>

          {/* Match Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl p-5 border border-gray-200 mb-4"
          >
            <div className="flex items-start gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0B1121] mb-1">
                  Why This Is a Great Match
                </h2>
                <p className="text-[#6B7280] leading-relaxed font-normal text-sm">
                  {candidate.whyMatch}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {matchInsights.map((insight, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <insight.icon className="w-5 h-5 text-[#1E3A8A] mb-2" />
                  <p className="text-xs text-[#6B7280] mb-1 font-normal">{insight.label}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1E3A8A] rounded-full"
                        style={{ width: `${insight.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#0B1121]">{insight.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>


          {/* Education & Skills Side by Side */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-5 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-[#0B1121] mb-4">
                Skills & Expertise
              </h2>
              
              <div className="space-y-4">
                {candidate.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[#0B1121] font-semibold text-sm">{skill.name}</span>
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {skill.category}
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-[#1E3A8A]">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1E3A8A] rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bg-white rounded-2xl p-5 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                <h2 className="text-lg font-semibold text-[#0B1121]">Education</h2>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-base font-semibold text-[#0B1121]">{candidate.university}</p>
                  <p className="text-sm text-[#6B7280] font-normal">{candidate.major}</p>
                  <p className="text-xs text-[#6B7280] font-normal">
                    Expected Graduation: {candidate.graduationYear}
                  </p>
                  <p className="text-xs text-[#6B7280] font-normal">GPA: {candidate.gpa}</p>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-[#0B1121] mb-2">Relevant Coursework</p>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.coursework.map((course, i) => (
                      <Badge key={i} variant="outline" className="text-xs px-2 py-0">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interviews Section */}
          {candidate.interviews && candidate.interviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="bg-white rounded-2xl p-5 border border-gray-200 mb-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                <h2 className="text-lg font-semibold text-[#0B1121]">Interviews</h2>
              </div>
              
              <div className="space-y-3">
                {candidate.interviews.map((interview, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-xl border-2 ${
                      interview.status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#0B1121] text-sm">
                        {interview.title}
                      </h3>
                      {interview.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          {interview.rating && (
                            <div className="px-3 py-1 bg-[#1E3A8A] text-white rounded-full text-sm font-semibold">
                              {interview.rating}/10
                            </div>
                          )}
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-2">
                      <span>📅 {interview.date}</span>
                      <span>⏱️ {interview.duration}</span>
                      <span>👤 {interview.interviewer}</span>
                    </div>
                    
                    {interview.notes && (
                      <p className="text-sm text-[#6B7280] font-normal mb-2 mt-2">
                        {interview.notes}
                      </p>
                    )}
                    
                    {interview.strengths && interview.strengths.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-[#0B1121] mb-2">Strengths:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {interview.strengths.map((strength, j) => (
                            <span
                              key={j}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {interview.recommendation && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#0B1121]">Recommendation:</span>
                          <span className="text-sm font-semibold text-green-700">{interview.recommendation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Assessments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-5 border border-gray-200 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
                <FileCheck className="w-4 h-4 text-[#1E3A8A]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0B1121]">Assessments</h2>
            </div>
            
            <div className="space-y-3">
              {candidate.assessments.map((assessment, i) => {
                // To accurately calculate overdue, assessment.dueDate should be present in mock data.
                // For this mock, we'll assume a simplified overdue based on a non-existent dueDate or status.
                // If dueDate were present, it would look like:
                // const dueDate = assessment.dueDate ? new Date(assessment.dueDate) : null;
                // const now = new Date();
                // const isOverdue = dueDate && assessment.status === 'pending' && dueDate < now;
                // const daysRemaining = dueDate && assessment.status === 'pending' && dueDate > now 
                //   ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) 
                //   : 0;

                const isOverdue = false; // Simplified for mock data without dueDate
                const daysRemaining = 0; // Simplified for mock data without dueDate
                
                return (
                  <div key={i} className={`p-4 rounded-xl border-2 ${
                    assessment.status === 'completed' 
                      ? 'bg-green-50 border-green-200' 
                      : (isOverdue ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200')
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#0B1121] text-sm">
                        {assessment.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {assessment.status === 'completed' && (
                          <>
                            {assessment.aiScore && (
                              <div className="px-3 py-1 bg-[#1E3A8A] text-white rounded-full text-xs font-semibold">
                                AI Score: {assessment.aiScore}%
                              </div>
                            )}
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </div>
                          </>
                        )}
                        {isOverdue ? ( 
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-full text-xs font-semibold">
                            <Clock className="w-3 h-3" />
                            Overdue
                          </div>
                        ) : assessment.status === 'pending' && daysRemaining > 0 ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-[#1E3A8A] text-white rounded-full text-xs font-semibold">
                            <Clock className="w-3 h-3" />
                            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                          </div>
                        ) : assessment.status === 'pending' && assessment.timeAllowed && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                            <Clock className="w-3 h-3" />
                            {assessment.timeAllowed}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-[#6B7280] font-normal mb-2">
                      {assessment.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                      {assessment.status === 'completed' && assessment.completedDate && (
                        <span>Completed: {assessment.completedDate}</span>
                      )}
                      {/* {assessment.status === 'pending' && assessment.dueDate && (
                        <span>Due: {assessment.dueDate}</span>
                      )} */}
                      {assessment.timeAllowed && (
                        <span className="text-[#0B1121] font-medium">
                          Time Allowed: {assessment.timeAllowed}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-5 border border-gray-200 mb-4"
          >
            <h2 className="text-lg font-semibold text-[#0B1121] mb-4">
              Experience
            </h2>
            
            <div className="space-y-6">
              {candidate.experience.map((exp, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#1E3A8A]" />
                  <div className="mb-2">
                    <h3 className="text-base font-semibold text-[#0B1121]">{exp.title}</h3>
                    <p className="text-sm text-[#6B7280] font-normal">{exp.company}</p>
                    <p className="text-xs text-[#6B7280] font-normal">{exp.duration}</p>
                  </div>
                  <p className="text-[#6B7280] mb-2 font-normal text-sm">{exp.description}</p>
                  <ul className="space-y-1.5">
                    {exp.achievements.map((achievement, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-[#6B7280]">
                        <span className="text-[#1E3A8A] mt-0.5">•</span>
                        <span className="font-normal">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>


          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="bg-white rounded-2xl p-5 border border-gray-200 mb-4"
          >
            <h2 className="text-lg font-semibold text-[#0B1121] mb-4">
              Notable Projects
            </h2>
            
            <div className="space-y-4">
              {candidate.projects.map((project, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-[#0B1121]">{project.name}</h3>
                    <div className="flex gap-1.5">
                      {project.github && (
                        <a
                          href={`https://${project.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6B7280] hover:text-[#0B1121] transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={`https://${project.demo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6B7280] hover:text-[#0B1121] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-[#6B7280] mb-2 font-normal text-sm">{project.description}</p>
                  
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-lg mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs text-green-800 font-semibold">{project.impact}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.map((tech, j) => (
                      <Badge key={j} className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20 text-xs px-2 py-0">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <ul className="space-y-1.5">
                    {project.highlights.map((highlight, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-[#6B7280]">
                        <span className="text-[#1E3A8A] mt-0.5">✓</span>
                        <span className="font-normal">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Awards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="bg-white rounded-2xl p-5 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-[#1E3A8A]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0B1121]">Awards & Recognition</h2>
            </div>
            
            <ul className="space-y-2">
              {candidate.awards.map((award, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-[#1E3A8A] fill-[#1E3A8A] flex-shrink-0 mt-0.5" />
                  <span className="text-[#6B7280] font-normal text-sm">{award}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
