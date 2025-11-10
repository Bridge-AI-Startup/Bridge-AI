import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Building2, Globe, Briefcase } from "lucide-react";
import Header from "../components/navigation/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/config";
import { signUpWithEmail, signUpWithGoogle, deleteFirebaseUser } from "@/lib/auth";

export default function EmployerSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const companyNameParam = searchParams.get("company");
  const invitedEmail = searchParams.get("email");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workEmail, setWorkEmail] = useState(invitedEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState(companyNameParam || "");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!inviteToken && !companyName) {
      setError("Company name is required");
      return;
    }

    setIsSubmitting(true);

    let firebaseUser = null;
    try {
      // Step 1: Create Firebase user and get ID token
      const { idToken, user } = await signUpWithEmail(workEmail.toLowerCase().trim(), password);
      firebaseUser = user;

      // Step 2: Send ID token to backend
      const response = await fetch(`${API_URL}/api/auth/employer/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          firstName,
          lastName,
          companyName,
          companyWebsite,
          industry,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the JWT token
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (data.data.company) {
          localStorage.setItem('company', JSON.stringify(data.data.company));
        }

        // Navigate based on invite status
        if (inviteToken) {
          navigate("/EmployerDashboard");
        } else {
          navigate("/EmployerOnboarding?first=true");
        }
      } else {
        // Backend failed - delete the Firebase user
        if (firebaseUser) {
          await deleteFirebaseUser(firebaseUser);
        }
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);

      // If we created a Firebase user but backend failed, clean it up
      if (firebaseUser && !error.code?.startsWith('auth/')) {
        await deleteFirebaseUser(firebaseUser);
      }

      if (error.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please sign in instead.");
      } else if (error.code === 'auth/invalid-email') {
        setError("Invalid email address.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError(error.message || "Signup failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");

    // Validate required fields before Google signup
    if (!inviteToken && !companyName) {
      setError("Please enter your company name before signing up with Google.");
      return;
    }

    setIsSubmitting(true);

    let firebaseUser = null;
    try {
      // Step 1: Sign in with Google and get ID token
      const { idToken, user } = await signUpWithGoogle();
      firebaseUser = user;

      // Step 2: Send ID token to backend
      const response = await fetch(`${API_URL}/api/auth/employer/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          firstName,
          lastName,
          companyName,
          companyWebsite,
          industry,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the JWT token
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (data.data.company) {
          localStorage.setItem('company', JSON.stringify(data.data.company));
        }

        // Navigate based on invite status
        if (inviteToken) {
          navigate("/EmployerDashboard");
        } else {
          navigate("/EmployerOnboarding?first=true");
        }
      } else {
        // Backend failed - delete the Firebase user
        if (firebaseUser) {
          await deleteFirebaseUser(firebaseUser);
        }
        setError(data.message || "Google sign-up failed. Please try again.");
      }
    } catch (error) {
      console.error("Google signup error:", error);

      // If we created a Firebase user but backend failed, clean it up
      if (firebaseUser && !error.code?.startsWith('auth/')) {
        await deleteFirebaseUser(firebaseUser);
      }

      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-up cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        setError("Pop-up blocked. Please allow pop-ups for this site.");
      } else {
        setError(error.message || "Google sign-up failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = firstName && workEmail && password && confirmPassword &&
                    password === confirmPassword && (!inviteToken ? companyName : true);

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="EmployerSignup" />
      
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
              {inviteToken ? "Join Your Team" : "Join Bridge"}
            </h1>
            <p className="text-xl text-[#6B7280] font-normal">
              {inviteToken ? `You've been invited to join ${companyName || "the team"}` : "Create your employer account"}
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5"
          >
            <Button
              type="button"
              onClick={handleGoogleSignup}
              variant="outline"
              className="w-full h-12 text-base font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#6B7280] font-normal">Or sign up with email</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  First Name *
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Sarah"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Chen"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Work Email *
              </label>
              <Input
                type="email"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-12 rounded-xl"
                required
                disabled={!!invitedEmail}
              />
              {invitedEmail && (
                <p className="text-xs text-[#6B7280] mt-1 font-normal">
                  This is the email that received the invitation
                </p>
              )}
            </div>

            {!inviteToken && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Company Name *
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Company Website
                  </label>
                  <Input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://www.company.com"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Industry
                  </label>
                  <Input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Technology, Finance, etc."
                    className="h-12 rounded-xl"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Password *
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B1121] mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Confirm Password *
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 rounded-xl"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full h-12 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: canSubmit ? '#FFFF00' : '#E5E5E5',
                color: canSubmit ? '#1E3A8A' : '#9CA3AF'
              }}
            >
              {isSubmitting ? (
                "Creating Account..."
              ) : (
                <>
                  {inviteToken ? "Join Team" : "Create Account"} <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-[#6B7280] font-normal">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/EmployerSignIn")}
                className="text-[#1E3A8A] font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}