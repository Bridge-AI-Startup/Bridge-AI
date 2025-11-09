import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, MapPin, Users, DollarSign, Calendar, Building2, Briefcase } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import CompanyLogo from "../components/dashboard/CompanyLogo";
import { Button } from "@/components/ui/button";

export default function CompanyProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const companyName = urlParams.get("company") || "Nova Robotics";
  
  // Get navigation source from state
  const from = location.state?.from;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock company data - in a real app, this would come from an API
  const companyData = {
    name: companyName,
    logo: "nova",
    pitch: "Building autonomous systems for warehouse logistics",
    description: "Nova Robotics is at the forefront of warehouse automation technology. We develop cutting-edge autonomous systems that revolutionize how warehouses operate, improving efficiency by up to 300% while reducing operational costs. Our robots use advanced machine learning algorithms to navigate complex warehouse environments, optimize picking routes, and seamlessly integrate with existing warehouse management systems.",
    website: "https://novarobotics.com",
    headquarters: "San Diego, CA",
    foundedYear: "2020",
    industry: "Robotics",
    companySize: "51-200",
    fundingStage: "Series A",
    values: [
      "Innovation-first mindset",
      "Collaborative team culture",
      "Work-life balance",
      "Rapid growth opportunities"
    ],
    openPositions: [
      {
        title: "Data Science Intern",
        department: "Engineering",
        location: "San Diego, CA",
        type: "Internship"
      },
      {
        title: "ML Engineer Intern",
        department: "Machine Learning",
        location: "Remote",
        type: "Internship"
      },
      {
        title: "Software Engineer Intern",
        department: "Engineering",
        location: "San Diego, CA",
        type: "Internship"
      }
    ]
  };

  // Build breadcrumb items dynamically
  const breadcrumbItems = [
    { label: "Dashboard", path: "StudentDashboard" }
  ];

  if (from === "StudentPipeline") {
    breadcrumbItems.push({ label: "My Applications", path: "StudentPipeline" });
  }

  breadcrumbItems.push({ label: companyData.name });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Dashboard" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#0B1121] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-normal">Back</span>
          </motion.button>

          {/* Company Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-6"
          >
            <div className="flex items-start gap-6">
              <CompanyLogo type={companyData.logo} size="large" />
              <div className="flex-1">
                <h1 className="text-4xl font-semibold text-[#0B1121] mb-3">
                  {companyData.name}
                </h1>
                <p className="text-xl text-[#6B7280] font-normal mb-6">
                  {companyData.pitch}
                </p>
                {companyData.website && (
                  <a
                    href={companyData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#1E3A8A] hover:text-[#1E3A8A]/80 font-medium transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h2 className="text-2xl font-semibold text-[#0B1121] mb-4">
                  About {companyData.name}
                </h2>
                <p className="text-[#6B7280] leading-relaxed font-normal">
                  {companyData.description}
                </p>
              </motion.div>

              {/* Values & Culture */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h2 className="text-2xl font-semibold text-[#0B1121] mb-4">
                  Values & Culture
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {companyData.values.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
                      <span className="text-sm text-[#0B1121] font-normal">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Open Positions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h2 className="text-2xl font-semibold text-[#0B1121] mb-4">
                  Open Positions ({companyData.openPositions.length})
                </h2>
                <div className="space-y-3">
                  {companyData.openPositions.map((position, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#1E3A8A] transition-all cursor-pointer group"
                    >
                      <h3 className="text-lg font-semibold text-[#0B1121] group-hover:text-[#1E3A8A] mb-2 transition-colors">
                        {position.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[#0B1121] mb-4">
                  Company Info
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[#6B7280] mb-1">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm font-normal">Industry</span>
                    </div>
                    <p className="text-[#0B1121] font-medium ml-6">{companyData.industry}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[#6B7280] mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-normal">Headquarters</span>
                    </div>
                    <p className="text-[#0B1121] font-medium ml-6">{companyData.headquarters}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[#6B7280] mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-normal">Company Size</span>
                    </div>
                    <p className="text-[#0B1121] font-medium ml-6">{companyData.companySize} employees</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[#6B7280] mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-normal">Funding Stage</span>
                    </div>
                    <p className="text-[#0B1121] font-medium ml-6">{companyData.fundingStage}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[#6B7280] mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-normal">Founded</span>
                    </div>
                    <p className="text-[#0B1121] font-medium ml-6">{companyData.foundedYear}</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-2xl p-6 text-white"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Interested in joining?
                </h3>
                <p className="text-sm text-white/80 font-normal mb-4">
                  View all open positions and apply directly.
                </p>
                <Button
                  onClick={() => navigate("/StudentDashboard")}
                  className="w-full h-11 bg-white text-[#1E3A8A] hover:bg-white/90 rounded-xl font-medium"
                >
                  View Opportunities
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}