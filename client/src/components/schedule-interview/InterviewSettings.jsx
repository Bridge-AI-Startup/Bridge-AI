import React from "react";
import { Video, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function InterviewSettings({ 
  duration, 
  setDuration, 
  locationType, 
  setLocationType, 
  locationDetails, 
  setLocationDetails,
  locationInputRef 
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-[#0B1121] mb-2">
            Duration
          </label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="h-12">
              <SelectValue />
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
            Location Type
          </label>
          <Select value={locationType} onValueChange={setLocationType}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video Call
                </div>
              </SelectItem>
              <SelectItem value="in-person">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  In Person
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {locationType === "in-person" && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#0B1121] mb-2">
            Meeting Location
          </label>
          <Input
            ref={locationInputRef}
            placeholder="Enter address or meeting location"
            value={locationDetails}
            onChange={(e) => setLocationDetails(e.target.value)}
            className="h-12"
          />
          <p className="text-xs text-[#6B7280] mt-1 font-normal">
            Start typing to search for addresses
          </p>
        </div>
      )}
    </>
  );
}