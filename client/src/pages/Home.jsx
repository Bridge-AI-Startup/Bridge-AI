import React, { useEffect } from "react";
import Header from "../components/navigation/Header";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import BeyondResumes from "../components/landing/BeyondResumes";
import DashboardMockup from "../components/landing/DashboardMockup";
import Testimonials from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";

export default function Home() {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleScroll = (e) => {
      if (e.target.tagName === 'A' && e.target.hash) {
        e.preventDefault();
        const element = document.querySelector(e.target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    document.addEventListener('click', handleScroll);
    return () => document.removeEventListener('click', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header currentPage="Home" />
      <Hero />
      <HowItWorks />
      <BeyondResumes />
      <DashboardMockup />
      <Testimonials />
      <Footer />
    </div>
  );
}