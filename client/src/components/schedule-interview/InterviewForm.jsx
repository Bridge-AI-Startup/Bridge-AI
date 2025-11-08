import React from "react";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function InterviewForm({ 
  date, 
  setDate, 
  time, 
  setTime, 
  duration, 
  setDuration, 
  interviewers, 
  setInterviewers, 
  meetingLink, 
  setMeetingLink, 
  notes, 
  setNotes 
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-[#0B1121] mb-6">Interview Details</h3>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0B1121] mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date *
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B1121] mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Time *
            </label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0B1121] mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Duration *
          </label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0B1121] mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Interviewers *
          </label>
          <Input
            value={interviewers}
            onChange={(e) => setInterviewers(e.target.value)}
            placeholder="John Doe, Jane Smith"
            className="h-12 rounded-xl"
            required
          />
          <p className="text-xs text-[#6B7280] mt-1 font-normal">
            Comma-separated list of interviewer names
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0B1121] mb-2">
            <Video className="w-4 h-4 inline mr-1" />
            Meeting Link *
          </label>
          <Input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/..."
            className="h-12 rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0B1121] mb-2">
            Additional Notes
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions or topics to cover..."
            className="min-h-[100px] rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}