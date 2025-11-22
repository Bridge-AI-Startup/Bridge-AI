import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Define which routes require authentication
  const protectedStudentRoutes = [
    'Profile',
    'StudentDashboard',
    'Onboarding',
    'OnboardingParse',
    'AddProjects',
    'CompanyPreferences',
    'EditResume',
    'EditProjects',
    'EditPreferences',
    'ProjectsParse',
    'PreferencesParse',
    'BookInterview',
    'StartAssessment',
    'TakeAssessment',
    'StudentPipeline',
    'StudentNewMatches',
    'StudentAssessments',
    'StudentInterviews',
    'StudentInterviewed',
    'StudentOffers',
    'StudentCalendar',
    'CompanyProfile',
    'ApplicantProfile'
  ];

  const protectedEmployerRoutes = [
    'EmployerProfile',
    'EmployerDashboard',
    'EmployerOnboarding',
    'JobListingDashboard',
    'ScheduleInterview',
    'CreateListing',
    'CreateJobListing',
    'JobAnalysis',
    'EditListing',
    'TeamMembers',
    'ReviewAssessments',
    'GradeAssessment',
    'AdminMatching',
    'SendMatches',
    'ReviewMatches',
    'InterviewCalendar',
    'ReviewInterviews',
    'ReviewOffers',
    'AssignProject',
    'NewKanbanDesign',
    'AdminPortal'
  ];

  // Render the main app
  return (
    <LayoutWrapper currentPageName={mainPageKey}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {Object.entries(Pages).map(([path, Page]) => {
          // Determine if this route needs protection and which sign-in page to redirect to
          if (protectedStudentRoutes.includes(path)) {
            return (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <ProtectedRoute redirectTo="/StudentSignIn" requiredUserType="student">
                    <Page />
                  </ProtectedRoute>
                }
              />
            );
          } else if (protectedEmployerRoutes.includes(path)) {
            return (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <ProtectedRoute redirectTo="/EmployerSignIn" requiredUserType="employer">
                    <Page />
                  </ProtectedRoute>
                }
              />
            );
          } else {
            return <Route key={path} path={`/${path}`} element={<Page />} />;
          }
        })}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </LayoutWrapper>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
