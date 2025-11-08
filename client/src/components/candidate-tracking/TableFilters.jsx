import React from "react";
import { Search, Filter, Download, Mail, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TableFilters({
  searchQuery,
  setSearchQuery,
  stageFilter,
  setStageFilter,
  roleFilter,
  setRoleFilter,
  selectedCount,
  onClearSelection
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, skills, or university..."
            className="h-12 pl-12 rounded-xl"
          />
        </div>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full lg:w-[200px] h-12 rounded-xl">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="interview">Interview Scheduled</SelectItem>
            <SelectItem value="assessment">Assessment</SelectItem>
            <SelectItem value="interviewed">Interviewed</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full lg:w-[200px] h-12 rounded-xl">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="engineer">Full-Stack Engineer</SelectItem>
            <SelectItem value="ml">ML Engineer</SelectItem>
            <SelectItem value="designer">Product Designer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <span className="text-sm font-semibold text-[#0B1121]">
            {selectedCount} selected
          </span>
          <Button 
            onClick={onClearSelection}
            variant="outline" 
            size="sm" 
            className="h-9 rounded-lg"
          >
            Clear
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-lg">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-lg">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-lg">
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-lg ml-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      )}
    </div>
  );
}