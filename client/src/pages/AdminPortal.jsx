import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Database,
  Users,
  Building2,
  Briefcase,
  FileCheck,
  Trash2,
  GitMerge,
  Sparkles,
  Send,
  BarChart3,
  Shield,
  Search,
  Activity,
  Settings,
  ChevronRight,
  ExternalLink,
  Grid,
  ArrowRight,
  Eye
} from "lucide-react";
import Header from "../components/navigation/Header";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import { API_URL } from "../config";

export default function AdminPortal() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbItems = [
    { label: "Admin Portal" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const routes = [
    {
      category: "Admin Pages",
      icon: Grid,
      color: "indigo",
      items: [
        {
          name: "Admin Matching Grid",
          description: "2D grid interface for rating student-job matches",
          path: "/AdminMatching",
          method: "PAGE",
          icon: Grid,
          action: () => navigate('/AdminMatching')
        },
        {
          name: "Send Matches",
          description: "Generate and publish optimal matches using greedy algorithm",
          path: "/SendMatches",
          method: "PAGE",
          icon: Send,
          action: () => navigate('/SendMatches')
        },
        {
          name: "Review Assessments",
          description: "Review and grade student assessment submissions",
          path: "/ReviewAssessments",
          method: "PAGE",
          icon: FileCheck,
          action: () => navigate('/ReviewAssessments')
        },
        {
          name: "Review Matches",
          description: "View and manage all published matches",
          path: "/ReviewMatches",
          method: "PAGE",
          icon: Eye,
          action: () => navigate('/ReviewMatches')
        }
      ]
    },
    {
      category: "Pages & UI",
      icon: Activity,
      color: "blue",
      items: [
        {
          name: "Database Table View",
          description: "View and manage all database collections in a table format",
          path: "/api/admin/table",
          method: "GET",
          icon: Database,
          action: () => window.open(`${API_URL}/api/admin/table`, '_blank')
        },
        {
          name: "Console View",
          description: "Interactive admin console for debugging",
          path: "/api/admin/console",
          method: "GET",
          icon: Settings,
          action: () => window.open(`${API_URL}/api/admin/console`, '_blank')
        }
      ]
    },
    {
      category: "Statistics & Analytics",
      icon: BarChart3,
      color: "purple",
      items: [
        {
          name: "System Statistics",
          description: "View counts and metrics for all system entities",
          path: "/api/admin/stats",
          method: "GET",
          icon: BarChart3,
          apiCall: true,
          endpoint: "/api/admin/stats"
        }
      ]
    },
    {
      category: "User Management",
      icon: Users,
      color: "green",
      items: [
        {
          name: "All Users",
          description: "Fetch all users (students and employers)",
          path: "/api/admin/users",
          method: "GET",
          icon: Users,
          apiCall: true,
          endpoint: "/api/admin/users"
        },
        {
          name: "All Employers",
          description: "Fetch all employer users",
          path: "/api/admin/employers",
          method: "GET",
          icon: Shield,
          apiCall: true,
          endpoint: "/api/admin/employers"
        },
        {
          name: "Delete User",
          description: "Delete a user by ID",
          path: "/api/admin/users/:id",
          method: "DELETE",
          icon: Trash2,
          requiresInput: true,
          inputLabel: "User ID"
        }
      ]
    },
    {
      category: "Company Management",
      icon: Building2,
      color: "indigo",
      items: [
        {
          name: "All Companies",
          description: "Fetch all registered companies",
          path: "/api/admin/companies",
          method: "GET",
          icon: Building2,
          apiCall: true,
          endpoint: "/api/admin/companies"
        },
        {
          name: "Delete Company",
          description: "Delete a company by ID",
          path: "/api/admin/companies/:id",
          method: "DELETE",
          icon: Trash2,
          requiresInput: true,
          inputLabel: "Company ID"
        }
      ]
    },
    {
      category: "Job Listings",
      icon: Briefcase,
      color: "orange",
      items: [
        {
          name: "All Job Listings",
          description: "Fetch all job listings",
          path: "/api/admin/job-listings",
          method: "GET",
          icon: Briefcase,
          apiCall: true,
          endpoint: "/api/admin/job-listings"
        }
      ]
    },
    {
      category: "Assessments & Applications",
      icon: FileCheck,
      color: "yellow",
      items: [
        {
          name: "Pending Assessments",
          description: "Get all pending assessment results for review",
          path: "/api/admin/assessments/pending",
          method: "GET",
          icon: FileCheck,
          apiCall: true,
          endpoint: "/api/admin/assessments/pending"
        },
        {
          name: "Get Application",
          description: "Get application details by ID",
          path: "/api/admin/applications/:id",
          method: "GET",
          icon: Search,
          requiresInput: true,
          inputLabel: "Application ID"
        },
        {
          name: "Grade Application",
          description: "Grade an application assessment",
          path: "/api/admin/applications/:id/grade",
          method: "POST",
          icon: FileCheck,
          requiresInput: true,
          inputLabel: "Application ID",
          note: "Requires grade data in request body"
        }
      ]
    },
    {
      category: "Matching System",
      icon: GitMerge,
      color: "pink",
      items: [
        {
          name: "All Matches Data",
          description: "Get all matches with statistics",
          path: "/api/admin/matching/data",
          method: "GET",
          icon: Database,
          apiCall: true,
          endpoint: "/api/admin/matching/data"
        },
        {
          name: "Create Match",
          description: "Manually create a new match",
          path: "/api/admin/matching/create",
          method: "POST",
          icon: GitMerge,
          note: "Requires student, job, company IDs and scores"
        },
        {
          name: "Update Match",
          description: "Update a match by ID",
          path: "/api/admin/matching/:matchId",
          method: "PUT",
          icon: Settings,
          requiresInput: true,
          inputLabel: "Match ID"
        },
        {
          name: "Delete Match",
          description: "Delete a specific match by ID",
          path: "/api/admin/matching/:matchId",
          method: "DELETE",
          icon: Trash2,
          requiresInput: true,
          inputLabel: "Match ID"
        },
        {
          name: "Populate Random Matches",
          description: "Create random test matches for all student-job combinations",
          path: "/api/admin/matching/populate-random",
          method: "POST",
          icon: Sparkles,
          apiCall: true,
          endpoint: "/api/admin/matching/populate-random",
          note: "⚠️ Prerequisites: Need students (run node scripts/seedUsers.js) and job listings (create via employer dashboard). Creates complete matrix with varied scores (20% poor, 30% fair, 30% good, 20% excellent)."
        },
        {
          name: "Clear All Matches",
          description: "Delete all matches and assessment results",
          path: "/api/admin/matching/clear-all",
          method: "DELETE",
          icon: Trash2,
          apiCall: true,
          endpoint: "/api/admin/matching/clear-all",
          dangerous: true,
          confirmation: "This will delete ALL matches and assessment results. Are you sure?"
        },
        {
          name: "Get Student Matches",
          description: "Get all matches for a specific student",
          path: "/api/admin/matching/student/:studentId",
          method: "GET",
          icon: Users,
          requiresInput: true,
          inputLabel: "Student ID"
        },
        {
          name: "Get Job Matches",
          description: "Get all matches for a specific job listing",
          path: "/api/admin/matching/job/:jobListingId",
          method: "GET",
          icon: Briefcase,
          requiresInput: true,
          inputLabel: "Job Listing ID"
        },
        {
          name: "Batch Create Matches",
          description: "Create multiple matches at once",
          path: "/api/admin/matching/batch",
          method: "POST",
          icon: Database,
          note: "Requires array of match objects"
        },
        {
          name: "AI Match Suggestions",
          description: "Get AI-powered match suggestions for a student-job pair",
          path: "/api/admin/matching/ai-suggest",
          method: "POST",
          icon: Sparkles,
          note: "Requires student and job IDs"
        },
        {
          name: "Generate Optimal Matches",
          description: "Generate optimal matches using greedy algorithm",
          path: "/api/admin/matching/generate-optimal",
          method: "POST",
          icon: Sparkles,
          note: "Requires studentLimit, jobLimit, minScore"
        },
        {
          name: "Publish Final Matches",
          description: "Publish matches to make them visible to students and employers",
          path: "/api/admin/matching/publish-final",
          method: "POST",
          icon: Send,
          note: "Requires array of match data"
        }
      ]
    },
    {
      category: "Data Clearing Operations",
      icon: Trash2,
      color: "red",
      items: [
        {
          name: "Clear Auth Data",
          description: "Clear all users, team members, and companies",
          path: "/api/admin/clear/auth",
          method: "POST",
          icon: Trash2,
          apiCall: true,
          endpoint: "/api/admin/clear/auth",
          dangerous: true,
          confirmation: "This will delete ALL users, team members, and companies. Continue?"
        },
        {
          name: "Clear By Type",
          description: "Clear specific data types (users, companies, jobs, assessments, matches)",
          path: "/api/admin/clear/:type",
          method: "POST",
          icon: Trash2,
          dangerous: true,
          requiresInput: true,
          inputLabel: "Type (users/companies/jobs/assessments/matches)",
          confirmation: "This will delete all data of the specified type. Continue?"
        }
      ]
    }
  ];

  const [expandedCategories, setExpandedCategories] = useState({});
  const [resultData, setResultData] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleApiCall = async (item, inputValue = null) => {
    const key = item.name;
    setLoadingStates(prev => ({ ...prev, [key]: true }));

    try {
      let endpoint = item.endpoint || item.path;

      if (inputValue && item.requiresInput) {
        endpoint = endpoint.replace(':id', inputValue)
                           .replace(':matchId', inputValue)
                           .replace(':studentId', inputValue)
                           .replace(':jobListingId', inputValue)
                           .replace(':type', inputValue);
      }

      if (item.dangerous && item.confirmation) {
        if (!window.confirm(item.confirmation)) {
          setLoadingStates(prev => ({ ...prev, [key]: false }));
          return;
        }
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      setResultData(prev => ({
        ...prev,
        [key]: {
          success: response.ok,
          data: data,
          timestamp: new Date().toLocaleString()
        }
      }));
    } catch (error) {
      setResultData(prev => ({
        ...prev,
        [key]: {
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleString()
        }
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleRouteAction = (item) => {
    if (item.action) {
      item.action();
    } else if (item.apiCall) {
      handleApiCall(item);
    } else if (item.requiresInput) {
      const inputValue = window.prompt(`Enter ${item.inputLabel}:`);
      if (inputValue) {
        handleApiCall(item, inputValue);
      }
    } else {
      alert(`This route requires specific parameters. Path: ${item.path}`);
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'PAGE': return 'bg-indigo-100 text-indigo-700';
      case 'GET': return 'bg-green-100 text-green-700';
      case 'POST': return 'bg-blue-100 text-blue-700';
      case 'PUT': return 'bg-yellow-100 text-yellow-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700',
      green: 'bg-green-100 text-green-700',
      indigo: 'bg-indigo-100 text-indigo-700',
      orange: 'bg-orange-100 text-orange-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      pink: 'bg-pink-100 text-pink-700',
      red: 'bg-red-100 text-red-700'
    };
    return colors[color] || 'bg-gray-100 text-gray-700';
  };

  const filteredRoutes = routes.map(category => ({
    ...category,
    items: category.items.filter(item =>
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.path.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="AdminPortal" />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-[#0B1121] mb-2">Admin Portal</h1>
                <p className="text-gray-600">
                  Central hub for all administrative routes and operations
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          {!isLoadingStats && stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
            >
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-[#0B1121]">{stats.totalUsers || 0}</p>
                <p className="text-sm text-gray-600">Users</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <Building2 className="w-6 h-6 text-indigo-600 mb-2" />
                <p className="text-2xl font-bold text-[#0B1121]">{stats.totalCompanies || 0}</p>
                <p className="text-sm text-gray-600">Companies</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <Briefcase className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-2xl font-bold text-[#0B1121]">{stats.totalJobListings || 0}</p>
                <p className="text-sm text-gray-600">Job Listings</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <FileCheck className="w-6 h-6 text-yellow-600 mb-2" />
                <p className="text-2xl font-bold text-[#0B1121]">{stats.totalAssessments || 0}</p>
                <p className="text-sm text-gray-600">Assessments</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <GitMerge className="w-6 h-6 text-pink-600 mb-2" />
                <p className="text-2xl font-bold text-[#0B1121]">{stats.totalMatches || 0}</p>
                <p className="text-sm text-gray-600">Matches</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <Activity className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-[#0B1121]">{stats.totalApplications || 0}</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
            </motion.div>
          )}

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search routes by name, description, or path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Routes by Category */}
          <div className="space-y-6">
            {filteredRoutes.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              const isExpanded = expandedCategories[category.category] !== false; // Default to expanded

              return (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(category.color)}`}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-xl font-semibold text-[#0B1121]">{category.category}</h2>
                        <p className="text-sm text-gray-600">{category.items.length} routes</p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      {category.items.map((item, itemIndex) => {
                        const ItemIcon = item.icon;
                        const resultKey = item.name;
                        const result = resultData[resultKey];
                        const isLoading = loadingStates[resultKey];

                        return (
                          <div
                            key={itemIndex}
                            className="border-b border-gray-100 last:border-b-0"
                          >
                            <div className="px-6 py-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <ItemIcon className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-semibold text-[#0B1121]">{item.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getMethodColor(item.method)}`}>
                                      {item.method}
                                    </span>
                                    {item.dangerous && (
                                      <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                                        DANGEROUS
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                                    {item.path}
                                  </code>
                                  {item.note && (
                                    <p className="text-xs text-orange-600 mt-2">ℹ️ {item.note}</p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleRouteAction(item)}
                                  disabled={isLoading}
                                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                                    item.dangerous
                                      ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400'
                                      : item.method === 'PAGE'
                                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400'
                                      : 'bg-[#1E3A8A] text-white hover:bg-[#2D4A9A] disabled:bg-gray-400'
                                  }`}
                                >
                                  {isLoading ? 'Loading...' : item.method === 'PAGE' ? 'Go to Page' : item.action ? 'Open' : 'Execute'}
                                  {item.method === 'PAGE' ? <ArrowRight className="w-4 h-4" /> : item.action && <ExternalLink className="w-4 h-4" />}
                                </button>
                              </div>

                              {/* Result Display */}
                              {result && (
                                <div className="mt-4">
                                  <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className={`text-sm font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                                        {result.success ? '✓ Success' : '✗ Error'}
                                      </span>
                                      <span className="text-xs text-gray-500">{result.timestamp}</span>
                                    </div>
                                    <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto max-h-64 overflow-y-auto">
                                      {JSON.stringify(result.data || result.error, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredRoutes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-12 border border-gray-200 text-center"
            >
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No routes found matching "{searchQuery}"</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
