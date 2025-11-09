
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Shield } from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import InviteForm from "../components/team-members/InviteForm";
import MemberCard from "../components/team-members/MemberCard";

export default function TeamMembers() {
  const navigate = useNavigate();
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah@acmerobotics.com",
      role: "admin",
      joinedDate: "Jan 2024",
      isCurrentUser: true
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      email: "mike@acmerobotics.com",
      role: "member",
      joinedDate: "Feb 2024",
      isCurrentUser: false
    },
    {
      id: 3,
      name: "Emily Watson",
      email: "emily@acmerobotics.com",
      role: "member",
      joinedDate: "Mar 2024",
      isCurrentUser: false
    }
  ];

  const handleSendInvite = () => {
    if (!inviteEmail) {
      alert("Please enter an email address.");
      return;
    }

    setIsSendingInvite(true);
    setTimeout(() => {
      setIsSendingInvite(false);
      setInviteEmail("");
      
      const inviteLink = `${window.location.origin}/EmployerSignup?invite=abc123&company=Acme%20Robotics&email=${encodeURIComponent(inviteEmail)}`;
      alert(`Invitation sent to ${inviteEmail}\n\nInvite link: ${inviteLink}\n\n(In production, this would be sent via email)`);
    }, 1000);
  };

  const handleRemoveMember = (member) => {
    if (confirm(`Remove ${member.name} from the team?`)) {
      alert(`${member.name} has been removed from the team.`);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "EmployerDashboard" },
    { label: "Company Profile", path: "EmployerProfile" },
    { label: "Team Members" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="TeamMembers" />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
              Team Members
            </h1>
            <p className="text-lg text-[#6B7280] font-normal">
              Manage who has access to your company's hiring dashboard
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <InviteForm
              email={inviteEmail}
              setEmail={setInviteEmail}
              onSend={handleSendInvite}
              isSending={isSendingInvite}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-[#1E3A8A]" />
              <h2 className="text-xl font-semibold text-[#0B1121]">Current Team ({teamMembers.length})</h2>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  onRemove={handleRemoveMember}
                />
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#0B1121] mb-1">About Roles</p>
                  <p className="text-sm text-[#6B7280] font-normal">
                    <strong>Admin:</strong> Can manage team members, edit company profile, and all hiring activities.<br />
                    <strong>Member:</strong> Can view candidates, schedule interviews, and manage job listings.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
