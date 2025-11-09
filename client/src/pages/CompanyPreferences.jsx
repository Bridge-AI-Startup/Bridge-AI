
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/navigation/Header";
import PreferencesHeader from "../components/preferences/PreferencesHeader";
import CompanyStageSection from "../components/preferences/CompanyStageSection";
import IndustrySection from "../components/preferences/IndustrySection";
import WorkStyleSection from "../components/preferences/WorkStyleSection";
import VideoSection from "../components/preferences/VideoSection";
import PreferencesActions from "../components/preferences/PreferencesActions";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function CompanyPreferences() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [preferences, setPreferences] = useState({
    companyStage: "",
    industries: [],
    workStyle: "",
    videoRecorded: false,
    needsVisa: null
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hasAllSelections = () => {
    return (
      preferences.companyStage &&
      preferences.industries.length > 0 &&
      preferences.workStyle &&
      preferences.needsVisa !== null
    );
  };

  const handleSave = () => {
    if (!hasAllSelections()) {
      toast({
        title: "Incomplete preferences",
        description: "Please complete all preference sections to continue",
        variant: "destructive"
      });
      return;
    }

    setTimeout(() => {
      navigate("/PreferencesParse");
    }, 100);
  };

  const handleBack = () => {
    navigate("/AddProjects");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Preferences" />
      
      <div className="pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <PreferencesHeader />

          <div className="space-y-8">
            <CompanyStageSection
              selected={preferences.companyStage}
              onSelect={(value) => setPreferences({...preferences, companyStage: value})}
              accentColor="#1E3A8A"
            />

            <IndustrySection
              selected={preferences.industries}
              onToggle={(value) => {
                const newIndustries = preferences.industries.includes(value)
                  ? preferences.industries.filter(i => i !== value)
                  : [...preferences.industries, value];
                setPreferences({...preferences, industries: newIndustries});
              }}
              accentColor="#1E3A8A"
            />

            <WorkStyleSection
              selected={preferences.workStyle}
              onSelect={(value) => setPreferences({...preferences, workStyle: value})}
              accentColor="#1E3A8A"
            />

            {/* Visa Question */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">Work Authorization</h2>
              <p className="text-gray-600 mb-6 font-normal">Will you need visa sponsorship to work in the US?</p>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPreferences({...preferences, needsVisa: true})}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    preferences.needsVisa === true
                      ? "border-[#1E3A8A] bg-[#1E3A8A]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-semibold text-[#0B1121] mb-2">Yes, I need visa sponsorship</h3>
                  <p className="text-sm text-gray-600 font-normal">I will require visa sponsorship to work in the United States</p>
                </button>

                <button
                  onClick={() => setPreferences({...preferences, needsVisa: false})}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    preferences.needsVisa === false
                      ? "border-[#1E3A8A] bg-[#1E3A8A]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-semibold text-[#0B1121] mb-2">No, I don't need sponsorship</h3>
                  <p className="text-sm text-gray-600 font-normal">I'm authorized to work in the US without sponsorship</p>
                </button>
              </div>
            </motion.div>

            <VideoSection />
          </div>

          <PreferencesActions
            hasSelection={hasAllSelections()}
            onSave={handleSave}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}
