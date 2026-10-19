"use client";

import React from "react";
import { Terminal, Cpu, Network, Scan, Box } from "lucide-react";

interface BlueprintPlaceholderProps {
  number: string;
  title: string;
  category: string;
  technologies: string[];
}

export function ProjectBlueprintPlaceholder({
  number,
  title,
  category,
  technologies,
}: BlueprintPlaceholderProps) {
  const getCategoryIcon = () => {
    const cat = category.toLowerCase();
    if (cat.includes("vision") || cat.includes("camera") || cat.includes("gesture")) {
      return <Scan className="w-5 h-5 text-[#2F6BFF] dark:text-[#457DFF]" />;
    }
    if (cat.includes("robot") || cat.includes("embedded") || cat.includes("hardware")) {
      return <Cpu className="w-5 h-5 text-[#FF7A59]" />;
    }
    if (cat.includes("full-stack") || cat.includes("rust") || cat.includes("systems")) {
      return <Network className="w-5 h-5 text-[#2F6BFF] dark:text-[#457DFF]" />;
    }
    return <Terminal className="w-5 h-5 text-[#2F6BFF] dark:text-[#457DFF]" />;
  };

  return (
    <div className="relative w-full aspect-[16/10] bg-[#0B1220] rounded-lg overflow-hidden border border-[rgba(232,238,247,0.1)] flex flex-col justify-between p-5 select-none font-mono">
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(232,238,247,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(232,238,247,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs text-[#94A3B8] border-b border-[rgba(232,238,247,0.08)] pb-3">
        <div className="flex items-center gap-2">
          {getCategoryIcon()}
          <span className="text-[11px] uppercase tracking-wider text-[#E8EEF7] font-semibold">
            FIG {number} {"//"} SCHEMATIC
          </span>
        </div>
      </div>

      {/* Center Wireframe Motif */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-xl border border-dashed border-[#2F6BFF]/40 bg-[#2F6BFF]/5 flex items-center justify-center mb-2.5">
          <Box className="w-7 h-7 text-[#457DFF] animate-pulse" />
        </div>
        <div className="text-sm font-headline font-bold text-[#E8EEF7] tracking-wide">
          {title}
        </div>
        <div className="text-[11px] text-[#94A3B8] mt-1 max-w-xs">
          {technologies.slice(0, 3).join(" • ")}
        </div>
      </div>

      {/* Bottom Label: "Illustrative diagram, not a screenshot" */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-[rgba(232,238,247,0.08)] text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A59]" />
          <span className="uppercase tracking-widest text-[#FF7A59]">
            Illustrative diagram, not a screenshot
          </span>
        </div>
      </div>
    </div>
  );
}
