import React from "react";
import { motion } from "framer-motion";
import { Search, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FiltersBar({ filters, setFilters, onSelectAll }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl p-6 border border-gray-200"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select value={filters.role} onValueChange={(value) => setFilters({...filters, role: value})}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="engineer">Full-Stack Engineer</SelectItem>
            <SelectItem value="ml">ML Engineer</SelectItem>
            <SelectItem value="designer">Product Designer</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.week} onValueChange={(value) => setFilters({...filters, week: value})}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">This Week</SelectItem>
            <SelectItem value="last">Last Week</SelectItem>
            <SelectItem value="twoweeks">Last 2 Weeks</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            placeholder="Search candidates..."
            className="h-11 pl-12 rounded-xl"
          />
        </div>

        <Button
          onClick={onSelectAll}
          variant="outline"
          className="h-11 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white font-medium"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Select All
        </Button>
      </div>
    </motion.div>
  );
}