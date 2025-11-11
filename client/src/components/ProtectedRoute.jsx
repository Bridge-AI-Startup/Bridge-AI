import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication and role-based access control.
 * Checks for JWT token and userType in localStorage.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string} props.redirectTo - The sign-in page to redirect to (default: '/StudentSignIn')
 * @param {string} props.requiredUserType - Required user type ('student' or 'employer')
 */
const ProtectedRoute = ({ children, redirectTo = '/StudentSignIn', requiredUserType = null }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    // Scroll to top when the route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!token) {
    // Redirect to sign-in page, preserving the intended destination
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if the user has the correct role for this route
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to the appropriate dashboard based on their actual role
    const correctDashboard = userType === 'employer' ? '/EmployerDashboard' : '/StudentDashboard';
    return <Navigate to={correctDashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;
