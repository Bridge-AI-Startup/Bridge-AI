import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/navigation/Header";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import UploadResumeCard from "../components/onboarding/UploadResumeCard";
import LinkedInCard from "../components/onboarding/LinkedInCard";
import OnboardingActions from "../components/onboarding/OnboardingActions";
import { API_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    // Load existing onboarding data
    loadOnboardingStatus();
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

  const loadOnboardingStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/onboarding/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success && data.data.user) {
        // Pre-fill LinkedIn URL if already exists
        if (data.data.user.linkedinUrl) {
          setLinkedinUrl(data.data.user.linkedinUrl);
        }
      }
    } catch (error) {
      console.error('Error loading onboarding status:', error);
    }
  };

  const isLinkedinValid = linkedinUrl.includes("linkedin.com/in/");
  const canContinue = resumeFile !== null || isLinkedinValid;

  const handleContinue = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/StudentSignIn');
        return;
      }

      // Upload resume if provided
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);

        const resumeResponse = await fetch(`${API_URL}/api/onboarding/resume`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const resumeData = await resumeResponse.json();
        if (!resumeData.success) {
          throw new Error(resumeData.message || 'Failed to upload resume');
        }

        toast({
          title: "Resume uploaded",
          description: "Your resume has been uploaded successfully.",
        });
      }

      // Update LinkedIn URL if provided and valid
      if (isLinkedinValid) {
        const linkedinResponse = await fetch(`${API_URL}/api/onboarding/linkedin`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ linkedinUrl })
        });

        const linkedinData = await linkedinResponse.json();
        if (!linkedinData.success) {
          throw new Error(linkedinData.message || 'Failed to update LinkedIn URL');
        }

        toast({
          title: "LinkedIn updated",
          description: "Your LinkedIn profile has been saved.",
        });
      }

      // Navigate to parsing page
      navigate("/OnboardingParse");
    } catch (error) {
      console.error('Onboarding error:', error);
      setError(error.message || 'Failed to save onboarding data');
      toast({
        title: "Error",
        description: error.message || 'Failed to save onboarding data',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <OnboardingActions
            canContinue={canContinue && !isSubmitting}
            onContinue={handleContinue}
          />
        </div>
      </div>
    </div>
  );
}