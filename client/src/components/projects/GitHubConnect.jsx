import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GitHubConnect({ onReposImported }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);

    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock imported repos
    const mockRepos = [
      {
        name: "personal-portfolio",
        description: "Built a responsive portfolio website with React and Tailwind",
        tags: ["React", "Tailwind", "JavaScript"],
        url: "https://github.com/username/personal-portfolio"
      },
      {
        name: "ml-price-predictor",
        description: "Machine learning model to predict housing prices using scikit-learn",
        tags: ["Python", "Machine Learning", "scikit-learn"],
        url: "https://github.com/username/ml-price-predictor"
      },
      {
        name: "task-manager-api",
        description: "RESTful API for task management built with Node.js and PostgreSQL",
        tags: ["Node.js", "PostgreSQL", "Express"],
        url: "https://github.com/username/task-manager-api"
      }
    ];

    onReposImported(mockRepos);
    setIsConnecting(false);
    setIsConnected(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border-2 rounded-2xl p-6 transition-all ${
        isConnected ? "border-green-500" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isConnected ? "bg-green-100" : "bg-gray-100"
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
              ? "3 repositories imported successfully"
              : "Automatically import your repositories and their descriptions"
            }
          </p>

          {!isConnected && (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
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
          )}
        </div>
      </div>
    </motion.div>
  );
}