"use client";

import React from "react";
import { experiences } from "@/data/experience";
import { motion } from "motion/react";
import { Calendar, ShieldAlert, CheckCircle2, Cpu } from "lucide-react";

export function Experience() {
  return (
    <section
      id="experience"
      aria-label="Professional Experience and Internship"
      className="scroll-mt-24 py-28 bg-[#F4F7FB] text-[#0B1220] border-t border-[rgba(11,18,32,0.1)] transition-colors duration-300 dark:bg-[#0c1424] dark:text-[#E8EEF7] dark:border-[rgba(232,238,247,0.1)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] pb-6 mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1F5AE6] dark:text-[#457DFF] font-semibold">
              04 / Career & Internship
            </span>
            <h2 className="mt-2 font-headline font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase">
              EXPERIENCE
            </h2>
          </div>
          <div className="mt-4 sm:mt-0 font-mono text-xs text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">
            Professional Learning & Applied AI Product Development
          </div>
        </div>

        {/* 12-Column Timeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Context (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-headline font-bold text-2xl sm:text-3xl text-[#0B1220] dark:text-[#E8EEF7]">
                Applied AI Product Development
              </h3>
              <p className="mt-4 text-base text-[rgba(11,18,32,0.8)] dark:text-[#CBD5E1] leading-relaxed">
                Professional learning and applied AI product development at CredgeSol AI Private Limited. Focused on tools, prompt engineering, and structured documentation, without inflated titles or fabricated metrics.
              </p>

              {/* Verified Appointment Factsheet */}
              <div className="mt-8 p-5 rounded-xl bg-white dark:bg-[#111A2E] border border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)]">
                  <span className="text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">ROLE</span>
                  <span className="font-semibold text-[#1F5AE6] dark:text-[#457DFF]">AI Intern</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)]">
                  <span className="text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">APPOINTMENT</span>
                  <span className="text-[#0B1220] dark:text-[#E8EEF7]">Letter dated June 1, 2026</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)]">
                  <span className="text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">DURATION</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Six months (Present)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">FORMAT</span>
                  <span className="text-[#0B1220] dark:text-[#E8EEF7]">Remote, flexible timings</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Timeline Detail & Small CCE Feature (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-[#111A2E] rounded-2xl border border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] p-6 sm:p-8 shadow-sm space-y-6"
              >
                {/* Header */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)]">
                  <div>
                    <h4 className="font-headline font-bold text-2xl text-[#0B1220] dark:text-[#E8EEF7]">
                      {exp.role}
                    </h4>
                    <span className="text-sm font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold block mt-0.5">
                      {exp.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-[rgba(47,107,255,0.08)] text-[#1F5AE6] dark:text-[#457DFF] font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {/* Scope of Work */}
                <div>
                  <h5 className="text-xs font-mono uppercase tracking-wider text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] mb-3">
                    Documented Areas of Work:
                  </h5>
                  <ul className="space-y-2.5 text-sm text-[rgba(11,18,32,0.85)] dark:text-[#CBD5E1]">
                    {exp.description.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#1F5AE6] dark:text-[#457DFF] mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Small CCE Feature */}
                {exp.spotlight && (
                  <div className="mt-6 pt-6 border-t border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)]">
                    <div className="p-5 rounded-xl bg-[#F4F7FB] dark:bg-[#0B1220] border border-[rgba(47,107,255,0.25)] relative overflow-hidden">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold uppercase tracking-wider mb-2">
                        <Cpu className="w-4 h-4" />
                        <span>Featured Initiative: {exp.spotlight.title}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-[rgba(11,18,32,0.85)] dark:text-[#CBD5E1] leading-relaxed">
                        {exp.spotlight.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] pt-2 border-t border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)]">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#FF7A59]" />
                        <span>No Confidential Implementation Details Disclosed</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
