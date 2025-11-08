
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16 overflow-hidden bg-white">
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFFF00]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#1E3A8A]/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-gray-100">
            <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
            <span className="text-sm font-normal text-[#1E3A8A]">
              Beta launching at UCSD
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
            <span className="text-[#0B1121]">Weekly interviews.</span>{" "}
            <span className="text-[#1E3A8A]"><br/>No applications.</span>
          </h1>


          <p className="text-xl lg:text-2xl text-[#6B7280] leading-relaxed max-w-3xl mx-auto font-normal">
            We match your skills and experience with startups for direct internship interviews — no waiting, no applications.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your .edu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-16 px-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-[#FFFF00] transition-all"
              required
            />
            <Button
              type="submit"
              className="h-16 px-10 text-lg font-medium rounded-2xl text-[#1E3A8A] shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
              style={{ backgroundColor: '#FFFF00' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
            >
              {isSubmitted ? (
                "Added! 🎉"
              ) : (
                <>
                  Join Waitlist <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span>347+ students signed up</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
