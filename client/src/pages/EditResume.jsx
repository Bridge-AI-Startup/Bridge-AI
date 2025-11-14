import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import UploadResumeCard from "../components/onboarding/UploadResumeCard";
import LinkedInCard from "../components/onboarding/LinkedInCard";
import OnboardingActions from "../components/onboarding/OnboardingActions";
import { API_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

export default function EditResume() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const loadOnboardingStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/StudentSignIn');
        return;
      }

      const response = await fetch(`${API_URL}/api/onboarding/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      // Handle authentication errors
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Session expired",
            description: "Please sign in again",
            variant: "destructive"
          });
          navigate('/StudentSignIn');
          return;
        }
        throw new Error(data.message || 'Failed to load data');
      }

      if (data.success && data.data.user) {
        if (data.data.user.linkedinUrl) {
          setLinkedinUrl(data.data.user.linkedinUrl);
        }
      }
    } catch (error) {
      console.error('Error loading onboarding status:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to load your information',
        variant: "destructive"
      });
    }
  }, [navigate, toast]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadOnboardingStatus();
  }, [loadOnboardingStatus]);

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

      // Always return to Profile
      navigate("/Profile");
    } catch (error) {
      console.error('Edit resume error:', error);
      setError(error.message || 'Failed to save resume data');
      toast({
        title: "Error",
        description: error.message || 'Failed to save resume data',
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
          <Breadcrumbs items={[
            { label: "Profile", path: "Profile" },
            { label: "Resume & LinkedIn" }
          ]} />
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
