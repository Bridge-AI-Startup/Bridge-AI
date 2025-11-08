import React from "react";
import { motion } from "framer-motion";
import { Mail, Shield, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MemberCard({ member, index, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#1E3A8A] transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[#0B1121]">{member.name}</p>
            {member.isCurrentUser && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                You
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B7280] font-normal">
            <Mail className="w-3.5 h-3.5" />
            <span>{member.email}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            {member.role === "admin" && (
              <Shield className="w-4 h-4 text-[#1E3A8A]" />
            )}
            <span className={`text-sm font-medium ${
              member.role === "admin" ? "text-[#1E3A8A]" : "text-[#6B7280]"
            }`}>
              {member.role === "admin" ? "Admin" : "Member"}
            </span>
          </div>
          <p className="text-xs text-[#6B7280] font-normal">
            Joined {member.joinedDate}
          </p>
        </div>

        {!member.isCurrentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onRemove(member)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
}