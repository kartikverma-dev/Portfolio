"use client";

import React from "react";
import { certifications } from "@/data/certifications";
import { motion } from "motion/react";
import { Award, Users, ShieldCheck, Clock } from "lucide-react";

export function Certifications() {
  const certificationsList = certifications.filter(
    (c) => c.category === "Certification" || c.category === "Course" || c.category === "Program"
  );

  const campusList = certifications.filter((c) => c.category === "Campus Role");

  return (
    <section
      id="certifications"
      aria-label="Certifications and Community Leadership"
      className="scroll-mt-24 py-28 bg-[#F4F7FB] text-[#0B1220] border-t border-[rgba(11,18,32,0.1)] transition-colors duration-300 dark:bg-[#0c1424] dark:text-[#E8EEF7] dark:border-[rgba(232,238,247,0.1)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] pb-6 mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1F5AE6] dark:text-[#457DFF] font-semibold">
              07 / Credentials & Leadership
            </span>
            <h2 className="mt-2 font-headline font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase">
              CREDENTIALS & COMMUNITY
            </h2>
          </div>
          <div className="mt-4 sm:mt-0 font-mono text-xs text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">
            Verified Courses, Program Involvements & Campus Roles
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Certifications and Programs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#1F5AE6] dark:text-[#457DFF]" />
              <span>Certifications & Specialized Programs</span>
            </h3>

            <div className="space-y-4">
              {certificationsList.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111A2E] border border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] shadow-sm flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold uppercase tracking-wider block">
                        {item.category} {"//"} {item.issuer}
                      </span>
                      <h4 className="font-headline font-bold text-lg text-[#0B1220] dark:text-[#E8EEF7] mt-1">
                        {item.title}
                      </h4>
                    </div>

                    {item.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Documented</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        <span>Verification Placeholder</span>
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs font-mono text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] pt-2 border-t border-[rgba(11,18,32,0.06)] dark:border-[rgba(232,238,247,0.06)]">
                      {item.notes}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Campus & Community Leadership (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF7A59]" />
              <span>Campus & Community Roles</span>
            </h3>

            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111A2E] border border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] shadow-sm space-y-6 font-mono text-xs">
              <p className="text-[rgba(11,18,32,0.8)] dark:text-[#CBD5E1] leading-relaxed">
                Active involvement in student technology initiatives, peer mentorship, and inter-college events at IMS Ghaziabad.
              </p>

              <div className="space-y-4 pt-2 border-t border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)]">
                {campusList.map((campus) => (
                  <div key={campus.id} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F5AE6] dark:bg-[#457DFF] mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-sm text-[#0B1220] dark:text-[#E8EEF7] font-headline block">
                        {campus.title}
                      </span>
                      <span className="text-[11px] text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">
                        {campus.issuer}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)] text-[11px] text-[rgba(11,18,32,0.5)] dark:text-[#64748B]">
                Restrained documentation • No fabricated event statistics or attendance figures.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
