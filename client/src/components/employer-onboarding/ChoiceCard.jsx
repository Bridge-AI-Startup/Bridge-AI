import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function ChoiceCard({ 
  type, 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onClick,
  gradient,
  inputs,
  onInputChange,
  isLoading 
}) {
  const isAI = type === "ai";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: isAI ? 0.1 : 0.2 }}
      className="h-full"
    >
      <div className={`flex flex-col h-full min-h-[320px] rounded-3xl p-8 ${
        isAI 
          ? gradient 
          : 'bg-gray-50 border-2 border-gray-300 hover:border-[#1E3A8A]'
      } transition-all`}>
        <div className="flex-1">
          <Icon className={`w-12 h-12 mb-4 ${isAI ? 'text-white' : 'text-[#0B1121]'}`} />
          <h2 className={`text-2xl font-semibold mb-3 ${isAI ? 'text-white' : 'text-[#0B1121]'}`}>
            {title}
          </h2>
          <p className={`mb-6 font-normal ${isAI ? 'text-white/90' : 'text-[#6B7280]'}`}>
            {description}
          </p>
          
          {inputs && (
            <div className="space-y-3">
              {inputs.map((input, idx) => (
                <Input
                  key={idx}
                  value={input.value}
                  onChange={(e) => onInputChange(input.name, e.target.value)}
                  placeholder={input.placeholder}
                  type={input.type || "text"}
                  className={`h-12 rounded-xl ${
                    isAI 
                      ? 'bg-white/20 border-white/30 text-white placeholder:text-white/60'
                      : 'bg-white'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        <Button
          onClick={onClick}
          disabled={isLoading}
          className={`w-full h-12 mt-6 rounded-xl font-medium ${
            isAI
              ? 'bg-[#FFFF00] hover:bg-[#FFFF00]/90 text-[#1E3A8A]'
              : 'border-2 border-[#0B1121] text-[#0B1121] hover:bg-[#0B1121] hover:text-white'
          }`}
          variant={isAI ? "default" : "outline"}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Icon className="w-5 h-5 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}