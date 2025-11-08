import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
          --neon-yellow: #FFFF00;
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 300;
        }
        
        body {
          font-weight: 300;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-weight: 300;
          letter-spacing: -0.02em;
        }
        
        strong, b, .font-semibold {
          font-weight: 500;
        }
        
        .font-medium {
          font-weight: 400;
        }
        
        .font-normal {
          font-weight: 300;
        }
        
        button {
          font-weight: 400;
        }
        
        .bg-neon-yellow {
          background-color: #FFFF00;
        }
        
        .text-neon-yellow {
          color: #FFFF00;
        }
        
        .border-neon-yellow {
          border-color: #FFFF00;
        }
      `}</style>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <Toaster />
    </>
  );
}