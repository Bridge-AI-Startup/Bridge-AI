
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Settings as SettingsIcon, FileText, Camera, Linkedin, Github, CheckCircle2, Trash2, Lock } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullName] = useState("Alex Johnson");
  const [email] = useState("alex.johnson@ucsd.edu");
  const [university, setUniversity] = useState("UC San Diego");
  const [major, setMajor] = useState("Computer Science");
  const [gradYear, setGradYear] = useState("2026");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [linkedinConnected, setLinkedinConnected] = useState(true);
  const [githubConnected, setGithubConnected] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Get navigation source from state
  const from = location.state?.from;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const completionSections = {
    resume: true,
    projects: true,
    preferences: false
  };
  const completedCount = Object.values(completionSections).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / 3) * 100);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBasics = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
      alert("Password changed successfully!");
    }, 1500);
  };

  const onboardingSections = [
    {
      icon: FileText,
      title: "Resume / LinkedIn",
      description: "Update your experience and education automatically.",
      route: "/Onboarding",
      completed: completionSections.resume
    },
    {
      icon: Briefcase,
      title: "Projects",
      description: "Show what you've built — upload code, links, or files.",
      route: "/AddProjects",
      completed: completionSections.projects
    },
    {
      icon: SettingsIcon,
      title: "Work Preferences",
      description: "Pick industries, company size, and work style.",
      route: "/CompanyPreferences",
      completed: completionSections.preferences
    }
  ];

  // Build breadcrumb items dynamically
  const breadcrumbItems = [
    { label: "Dashboard", path: "StudentDashboard" }
  ];

  if (from === "StudentPipeline") {
    breadcrumbItems.push({ label: "My Applications", path: "StudentPipeline" });
  }

  breadcrumbItems.push({ label: "Profile" });


  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Profile" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
              Complete Your Profile
            </h1>
            <p className="text-lg text-[#6B7280] font-normal mb-6">
              Improve your matches by keeping your information up to date.
            </p>

            {/* Profile Completion Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#0B1121]">Profile Completion</h3>
                  <p className="text-sm text-[#6B7280] font-normal">{completedCount} of 3 sections completed</p>
                </div>
                <div className="text-3xl font-semibold text-[#1E3A8A]">{completionPercentage}%</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div
                  className="bg-[#1E3A8A] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {onboardingSections.map((section, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border-2 ${
                      section.completed 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <section.icon className="w-5 h-5" />
                      <h4 className="font-semibold text-[#0B1121]">{section.title}</h4>
                      {section.completed && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280] font-normal">{section.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#0B1121]">Update Your Info</h2>
              
              {onboardingSections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#1E3A8A] transition-all group cursor-pointer"
                  onClick={() => navigate(section.route)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform bg-gray-100">
                      <section.icon className="w-6 h-6 text-[#0B1121]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-[#0B1121]">{section.title}</h3>
                        {section.completed && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-[#6B7280] font-normal">{section.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Connected Accounts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-[#0B1121] mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  {/* LinkedIn */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0B1121]">LinkedIn</p>
                        <p className="text-xs text-[#6B7280] font-normal">
                          {linkedinConnected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setLinkedinConnected(!linkedinConnected)}
                      variant={linkedinConnected ? "outline" : "default"}
                      className="h-9"
                    >
                      {linkedinConnected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0B1121] flex items-center justify-center">
                        <Github className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0B1121]">GitHub</p>
                        <p className="text-xs text-[#6B7280] font-normal">
                          {githubConnected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setGithubConnected(!githubConnected)}
                      variant={githubConnected ? "outline" : "default"}
                      className="h-9"
                    >
                      {githubConnected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#0B1121]">Account Settings</h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-[#0B1121] mb-6">Profile Basics</h3>
                
                {/* Profile Avatar */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-3xl font-semibold">
                          {fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[#FFFF00] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FFFF00]/90 transition-colors shadow-lg"
                    >
                      <Camera className="w-4 h-4 text-[#1E3A8A]" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-[#0B1121] font-semibold mb-1">{fullName}</p>
                    <p className="text-sm text-[#6B7280] font-normal">{email}</p>
                  </div>
                </div>

                {/* Basic Info Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      Full Name
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      Email
                    </label>
                    <Input
                      value={email}
                      disabled
                      className="h-12 rounded-xl bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      Password
                    </label>
                    <Button
                      onClick={() => setShowPasswordModal(true)}
                      variant="outline"
                      className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] text-[#0B1121] justify-start"
                    >
                      Change Password
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                      University
                    </label>
                    <Input
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                        Major
                      </label>
                      <Input
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                        Grad Year
                      </label>
                      <Input
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveBasics}
                    disabled={isSaving}
                    className="w-full h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-medium"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </motion.div>

              {/* Danger Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-red-50 rounded-2xl p-6 border-2 border-red-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
                </div>
                <p className="text-sm text-red-800 font-normal mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="outline"
                  className="w-full h-11 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-medium"
                >
                  Delete Account
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-semibold text-[#0B1121] mb-6">
              Change Password
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="flex-1 h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl"
              >
                {isSaving ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-semibold text-[#0B1121] mb-4">
              Delete Account?
            </h3>
            <p className="text-[#6B7280] font-normal mb-6">
              This action cannot be undone. All your data, matches, and preferences will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  alert("Account deleted permanently.");
                }}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Delete Forever
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
