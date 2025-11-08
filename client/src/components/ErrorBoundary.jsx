import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isRateLimit = this.state.error?.response?.status === 429;
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">
              {isRateLimit ? 'Too Many Requests' : 'Something Went Wrong'}
            </h2>
            
            <p className="text-[#6B7280] font-normal mb-6">
              {isRateLimit 
                ? 'Please wait a moment before trying again. The system is processing too many requests.'
                : 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            
            <Button
              onClick={() => window.location.reload()}
              className="w-full h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;