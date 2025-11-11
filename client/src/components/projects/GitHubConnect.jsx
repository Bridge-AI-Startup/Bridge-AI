import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GitHubConnect({ onReposImported }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [error, setError] = useState("");
  const [repoCount, setRepoCount] = useState(0);

  const handleConnect = async () => {
    if (!githubUsername.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setError("");
    setIsConnecting(true);

    try {
      // Fetch user's public repositories from GitHub API
      const response = await fetch(`https://api.github.com/users/${githubUsername.trim()}/repos?sort=updated&per_page=100`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("GitHub user not found");
        }
        throw new Error("Failed to fetch repositories");
      }

      const repos = await response.json();

      if (repos.length === 0) {
        throw new Error("No public repositories found");
      }

      // Transform GitHub repos to our format
      const formattedRepos = repos.map(repo => ({
        name: repo.name,
        description: repo.description || "No description provided",
        tags: repo.language ? [repo.language] : [],
        url: repo.html_url,
        profileUrl: `https://github.com/${githubUsername.trim()}`
      }));

      setRepoCount(formattedRepos.length);
      onReposImported(formattedRepos);
      setIsConnected(true);
    } catch (err) {
      setError(err.message || "Failed to connect to GitHub");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border-2 rounded-2xl p-6 transition-all ${
        isConnected ? "border-green-500" : error ? "border-red-500" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isConnected ? "bg-green-100" : error ? "bg-red-100" : "bg-gray-100"
        }`}>
          <AnimatePresence mode="wait">
            {isConnected ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <AlertCircle className="w-6 h-6 text-red-600" />
              </motion.div>
            ) : (
              <motion.div
                key="github"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Github className="w-6 h-6 text-[#0B1121]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#0B1121] mb-1">
            {isConnected ? "GitHub connected" : "Connect GitHub"}
          </h3>
          <p className="text-sm text-[#6B7280] mb-4 font-normal">
            {isConnected
              ? `${repoCount} repositories imported successfully`
              : "Enter your GitHub username to import your public repositories"
            }
          </p>

          {!isConnected && (
            <div className="space-y-3">
              <Input
                type="text"
                value={githubUsername}
                onChange={(e) => {
                  setGithubUsername(e.target.value);
                  setError("");
                }}
                placeholder="GitHub username"
                className="h-10 rounded-xl"
                disabled={isConnecting}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleConnect();
                  }
                }}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              <Button
                onClick={handleConnect}
                disabled={isConnecting || !githubUsername.trim()}
                className="bg-[#0B1121] hover:bg-[#1E3A8A] text-white h-10 px-6 rounded-xl"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4 mr-2" />
                    Connect GitHub
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
