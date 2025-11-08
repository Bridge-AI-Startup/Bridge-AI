
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Header({ currentPage }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="text-xl font-semibold text-[#1E3A8A]">
            Bridge
          </Link>

          <nav className="flex items-center gap-4">
            {/* Student Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 px-3 hover:bg-gray-100 rounded-lg">
                  <Menu className="w-4 h-4" />
                  <span className="text-sm font-normal">Student</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Student Pages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("Home")} 
                    className={`cursor-pointer ${currentPage === "Home" ? "bg-gray-100" : ""}`}
                  >
                    For Students
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("StudentSignup")} 
                    className={`cursor-pointer ${currentPage === "StudentSignup" ? "bg-gray-100" : ""}`}
                  >
                    Student Signup
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("StudentSignIn")} 
                    className={`cursor-pointer ${currentPage === "StudentSignIn" ? "bg-gray-100" : ""}`}
                  >
                    Student Sign In
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("Onboarding")} 
                    className={`cursor-pointer ${currentPage === "Onboarding" ? "bg-gray-100" : ""}`}
                  >
                    Student Onboarding
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("StudentDashboard")} 
                    className={`cursor-pointer ${currentPage === "StudentDashboard" ? "bg-gray-100" : ""}`}
                  >
                    Student Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("Profile")} 
                    className={`cursor-pointer ${currentPage === "Profile" ? "bg-gray-100" : ""}`}
                  >
                    Student Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Employer Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 px-3 hover:bg-gray-100 rounded-lg">
                  <Menu className="w-4 h-4" />
                  <span className="text-sm font-normal">Employer</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Employer Pages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("Employers")} 
                    className={`cursor-pointer ${currentPage === "Employers" ? "bg-gray-100" : ""}`}
                  >
                    For Employers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("EmployerSignup")} 
                    className={`cursor-pointer ${currentPage === "EmployerSignup" ? "bg-gray-100" : ""}`}
                  >
                    Employer Signup
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("EmployerSignIn")} 
                    className={`cursor-pointer ${currentPage === "EmployerSignIn" ? "bg-gray-100" : ""}`}
                  >
                    Employer Sign In
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("EmployerOnboarding")} 
                    className={`cursor-pointer ${currentPage === "EmployerOnboarding" ? "bg-gray-100" : ""}`}
                  >
                    Company Onboarding
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("EmployerDashboard")} 
                    className={`cursor-pointer ${currentPage === "EmployerDashboard" ? "bg-gray-100" : ""}`}
                  >
                    Employer Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("HowMatchingWorks")} 
                    className={`cursor-pointer ${currentPage === "HowMatchingWorks" ? "bg-gray-100" : ""}`}
                  >
                    How Matching Works
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("EmployerProfile")} 
                    className={`cursor-pointer ${currentPage === "EmployerProfile" ? "bg-gray-100" : ""}`}
                  >
                    Employer Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("TeamMembers")} 
                    className={`cursor-pointer ${currentPage === "TeamMembers" ? "bg-gray-100" : ""}`}
                  >
                    Team Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Candidate Tracking</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("CandidateTrackingAnalysis")} 
                    className={`cursor-pointer ${currentPage === "CandidateTrackingAnalysis" ? "bg-gray-100" : ""}`}
                  >
                    Tracking Analysis
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("CandidateTrackingSolution1")} 
                    className={`cursor-pointer ${currentPage === "CandidateTrackingSolution1" ? "bg-gray-100" : ""}`}
                  >
                    Solution 1: Kanban
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("CandidateTrackingSolution2")} 
                    className={`cursor-pointer ${currentPage === "CandidateTrackingSolution2" ? "bg-gray-100" : ""}`}
                  >
                    Solution 2: Table
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("CandidateTrackingSolution3")} 
                    className={`cursor-pointer ${currentPage === "CandidateTrackingSolution3" ? "bg-gray-100" : ""}`}
                  >
                    Solution 3: Grouped
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("ReviewAssessments")} 
                    className={`cursor-pointer ${currentPage === "ReviewAssessments" ? "bg-gray-100" : ""}`}
                  >
                    Review Assessments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("ReviewInterviews")} 
                    className={`cursor-pointer ${currentPage === "ReviewInterviews" ? "bg-gray-100" : ""}`}
                  >
                    Review Interviews
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={createPageUrl("ReviewOffers")} 
                    className={`cursor-pointer ${currentPage === "ReviewOffers" ? "bg-gray-100" : ""}`}
                  >
                    Review Offers
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* System Flow Diagram Link */}
            <Link 
              to={createPageUrl("SystemFlowDiagram")}
              className={`text-sm font-normal text-[#6B7280] hover:text-[#1E3A8A] transition-colors ${
                currentPage === "SystemFlowDiagram" ? "text-[#1E3A8A] font-medium" : ""
              }`}
            >
              Flow Diagram
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
