import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CompanyFormSection({ 
  icon: Icon, 
  title, 
  fields 
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Icon className="w-5 h-5 text-[#1E3A8A]" />
        <h2 className="text-xl font-semibold text-[#0B1121]">{title}</h2>
      </div>
      
      <div className="space-y-4">
        {fields.map((field, idx) => (
          <div key={idx} className={field.gridCols ? `grid ${field.gridCols} gap-4` : ""}>
            {field.items ? field.items.map((item, itemIdx) => (
              <FormField key={itemIdx} {...item} />
            )) : (
              <FormField {...field} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormField({ 
  label, 
  icon: Icon, 
  type, 
  value, 
  onChange, 
  placeholder, 
  required, 
  options, 
  helperText,
  min,
  max,
  rows 
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-1" />}
        {label} {required && "*"}
      </label>
      
      {type === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-12 rounded-xl bg-white">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt, i) => (
              <SelectItem key={i} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type === "textarea" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`rounded-xl bg-white ${rows ? `min-h-[${rows * 25}px]` : 'min-h-[100px]'}`}
          required={required}
        />
      ) : (
        <Input
          type={type || "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 rounded-xl bg-white"
          required={required}
          min={min}
          max={max}
        />
      )}
      
      {helperText && (
        <p className="text-sm text-[#6B7280] mt-2 font-normal">
          {helperText}
        </p>
      )}
    </div>
  );
}