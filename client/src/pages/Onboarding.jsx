import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/navigation/Header";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import UploadResumeCard from "../components/onboarding/UploadResumeCard";
import LinkedInCard from "../components/onboarding/LinkedInCard";
import OnboardingActions from "../components/onboarding/OnboardingActions";

export default function Onboarding() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.includes("document"))) {
      setResumeFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.includes("document"))) {
      setResumeFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const isLinkedinValid = linkedinUrl.includes("linkedin.com/in/");
  const canContinue = resumeFile !== null || isLinkedinValid;

  const handleContinue = () => {
    const payload = {
      resume: resumeFile ? { name: resumeFile.name, size: resumeFile.size } : null,
      linkedin: isLinkedinValid ? linkedinUrl : null,
    };
    console.log("Onboarding payload:", payload);
    navigate("/OnboardingParse");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="Onboarding" />
      
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-[720px] mx-auto">
          <OnboardingHeader />

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <UploadResumeCard
              resumeFile={resumeFile}
              isDragging={isDragging}
              onFileChange={handleFileChange}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            />

            <LinkedInCard
              linkedinUrl={linkedinUrl}
              isLinkedinValid={isLinkedinValid}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>

          <OnboardingActions
            canContinue={canContinue}
            onContinue={handleContinue}
          />
        </div>
      </div>
    </div>
  );
}