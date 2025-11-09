import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {item.path ? (
              <Link
                to={createPageUrl(item.path)}
                className="text-[#6B7280] hover:text-[#1E3A8A] transition-colors font-normal"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[#0B1121] font-medium">
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}