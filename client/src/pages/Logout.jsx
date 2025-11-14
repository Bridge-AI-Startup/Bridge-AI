import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { clearAuthData } from '@/services/authService';
import { signOut } from '@/lib/auth';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      // Clear all auth data from localStorage
      clearAuthData();

      // Sign out from Firebase
      await signOut();

      // Redirect to home after a short delay
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);

      return () => clearTimeout(timer);
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center mx-auto mb-6">
          <LogOut className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-semibold text-[#0B1121] mb-4">
          Logged out successfully
        </h1>
        <p className="text-lg text-[#6B7280]">
          Redirecting to home page...
        </p>
      </motion.div>
    </div>
  );
}
