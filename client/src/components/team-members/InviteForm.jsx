import React from "react";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InviteForm({ email, setEmail, onSend, isSending }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-[#1E3A8A]" />
        <h2 className="text-xl font-semibold text-[#0B1121]">Invite Team Member</h2>
      </div>
      <div className="flex gap-3">
        <Input
          type="email"
          placeholder="colleague@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-xl flex-1"
        />
        <Button
          onClick={onSend}
          disabled={!email || isSending}
          className="h-12 px-6 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-medium"
        >
          {isSending ? "Sending..." : "Send Invite"}
        </Button>
      </div>
      <p className="text-sm text-[#6B7280] mt-3 font-normal">
        They'll receive an email invitation to join your company's hiring team
      </p>
    </div>
  );
}