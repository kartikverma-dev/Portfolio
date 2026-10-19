"use client";

import React, { useState } from "react";
import { skillGroups, SkillProficiency } from "@/data/skills";
import { motion } from "motion/react";
import { CheckCircle2, Sparkles, BookOpen } from "lucide-react";

type ProficiencyFilter = "All" | SkillProficiency;

export function Skills() {
  const [activeProficiency, setActiveProficiency] = useState<ProficiencyFilter>("All");

  const getBadgeStyle = (prof: SkillProficiency) => {
    switch (prof) {
      case "Working Knowledge":
        return "bg-[#2F6BFF]/10 text-[#1F5AE6] dark:text-[#457DFF] border-[#2F6BFF]/20";
      case "Project Experience":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      case "Currently Exploring":
        return "bg-[#FF7A59]/10 text-[#FF7A59] border-[#FF7A59]/20";
    }
  };

  const getIcon = (prof: SkillProficiency) => {
    switch (prof) {
      case "Working Knowledge":
        return <CheckCircle2 className="w-3 h-3" />;
      case "Project Experience":
        return <BookOpen className="w-3 h-3" />;
      case "Currently Exploring":
        return <Sparkles className="w-3 h-3" />;
    }
  };

  return (
    <section
      id="skills"
      aria-label="Skills & Competencies"
      className="scroll-mt-24 py-28 bg-[#F4F7FB] text-[#0B1220] border-t border-[rgba(11,18,32,0.1)] transition-colors duration-300 dark:bg-[#0c1424] dark:text-[#E8EEF7] dark:border-[rgba(232,238,247,0.1)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] pb-6 mb-12 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1F5AE6] dark:text-[#457DFF] font-semibold">
              05 / Technical Disciplines & Knowledge
            </span>
            <h2 className="mt-2 font-headline font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase">
              SKILLS & EXPLORATIONS
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[rgba(11,18,32,0.7)] dark:text-[#94A3B8] max-w-xl">
              Categorized by real hands-on depth. Never shown as artificial percentage bars.
            </p>
          </div>

          {/* Interactive Proficiency Filters */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {(["All", "Working Knowledge", "Project Experience", "Currently Exploring"] as ProficiencyFilter[]).map(
              (p) => {
                const isSelected = activeProficiency === p;
                return (
                  <button
                    key={p}
                    onClick={() => setActiveProficiency(p)}
                    type="button"
                    className={`px-3 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? "bg-[#2F6BFF] border-[#2F6BFF] text-white font-semibold shadow-sm"
                        : "bg-white border-[rgba(11,18,32,0.12)] text-[rgba(11,18,32,0.7)] hover:text-[#0B1220] dark:bg-[#111A2E] dark:border-[rgba(232,238,247,0.12)] dark:text-[#94A3B8] dark:hover:text-[#E8EEF7]"
                    }`}
                  >
                    {p}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* 5 Distinct Skill Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {skillGroups.map((group, gIdx) => {
            const filteredSkills = group.skills.filter(
              (s) => activeProficiency === "All" || s.proficiency === activeProficiency
            );

            if (filteredSkills.length === 0) return null;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: gIdx * 0.08 }}
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111A2E] border border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)] mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[rgba(11,18,32,0.5)] dark:text-[#64748B]">
                      GROUP 0{gIdx + 1}
                    </span>
                    <span className="text-xs font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold">
                      {filteredSkills.length} items
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-xl text-[#0B1220] dark:text-[#E8EEF7] mb-6">
                    {group.title}
                  </h3>

                  {/* Skills List */}
                  <div className="space-y-2.5">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-3 rounded-lg bg-[#F4F7FB] dark:bg-[#0B1220] border border-[rgba(11,18,32,0.06)] dark:border-[rgba(232,238,247,0.06)] flex items-center justify-between gap-2 transition-all hover:border-[#2F6BFF]/30"
                      >
                        <span className="font-medium text-xs sm:text-sm text-[#0B1220] dark:text-[#E8EEF7]">
                          {skill.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border flex-shrink-0 ${getBadgeStyle(
                            skill.proficiency
                          )}`}
                        >
                          {getIcon(skill.proficiency)}
                          <span>{skill.proficiency}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
