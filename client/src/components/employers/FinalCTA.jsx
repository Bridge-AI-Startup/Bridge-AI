
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting email:", email);
    
    setIsSubmitted(true);
    setEmail("");
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="relative py-20 px-6 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-12 lg:p-16 text-center overflow-hidden bg-gray-50 border border-gray-200"
        >
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-semibold mb-6 tracking-tight">
              <span className="text-[#0B1121]">Build your team without the</span>{" "}
              <span className="text-[#1E3A8A]">hiring headache</span>
            </h2>

            <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              Join the beta and start receiving AI-matched candidates every week
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-6 text-lg font-normal rounded-2xl border-2 border-gray-300 bg-white text-[#0B1121] placeholder:text-gray-400 focus:border-[#FFFF00] transition-all"
                required
              />
              <Button
                type="submit"
                className="h-14 px-8 text-lg font-medium rounded-2xl text-[#1E3A8A] shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                style={{ backgroundColor: '#FFFF00' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  "Joined! 🎉"
                ) : (
                  <>
                    Join Employer Beta <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-[#6B7280] text-sm mt-6 font-normal">
              No credit card required • Start receiving matches in 48 hours
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
