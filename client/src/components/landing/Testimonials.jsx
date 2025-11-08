
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "CS Major, UCSD '25",
    image: "AC",
    text: "I got matched with a YC startup in under a week. No applications, no stress — just one interview and I got the offer.",
    rating: 5
  },
  {
    name: "Maya Patel",
    role: "Data Science, UCSD '24",
    image: "MP",
    text: "Finally a job app that doesn't waste time. The AI actually understood what I was looking for and matched me with companies I love.",
    rating: 5
  },
  {
    name: "Jordan Lee",
    role: "Product Design, UCSD '26",
    image: "JL",
    text: "I was skeptical at first, but the matches were spot on. Had 3 interviews in my first week and landed my dream internship.",
    rating: 5
  }
];

export default function Testimonials() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const employers = ["Stripe", "Notion", "Anthropic", "Scale AI", "Databricks"];

  return (
    <div className="relative py-16 md:py-20 px-6 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-semibold mb-6 tracking-tight">
            <span className="text-[#0B1121]">Loved by</span>{" "}
            <span className="text-[#1E3A8A]">students</span>
          </h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed font-normal">
            Join hundreds of students who've already found their perfect startup match
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <p className="text-[#0B1121] mb-6 leading-relaxed text-lg font-normal">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium bg-[#1E3A8A]">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-[#0B1121]">{testimonial.name}</p>
                  <p className="text-sm text-[#6B7280] font-normal">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-20 text-center"
        >
          <p className="text-gray-500 text-sm font-normal mb-8 uppercase tracking-wider">
            Trusted by employers from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {employers.map((employer, i) => (
              <div
                key={i}
                className="px-6 py-3 bg-gray-100 rounded-xl text-[#0B1121] font-semibold text-lg border border-gray-200"
              >
                {employer}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-12 lg:p-16 text-center overflow-hidden bg-gray-50 border border-gray-200"
        >
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-semibold mb-6 tracking-tight">
              <span className="text-[#0B1121]">Ready to stop applying and</span>{" "}
              <span className="text-[#1E3A8A]">start matching?</span>
            </h2>
            <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              Join the beta and be among the first UCSD students to experience AI-powered internship matching.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your .edu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-6 text-lg rounded-2xl border-2 border-gray-300 bg-white text-[#0B1121] placeholder:text-gray-400 focus:border-[#FFFF00] transition-all"
                required
              />
              <Button
                type="submit"
                className="h-14 px-8 text-lg font-medium rounded-2xl text-[#1E3A8A] shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                style={{ backgroundColor: '#FFFF00' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFF00'}
              >
                {isSubmitted ? (
                  "You're in! 🎉"
                ) : (
                  <>
                    Apply for Early Access <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-[#6B7280] text-sm mt-6 font-normal">
              No spam, just weekly match updates. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
