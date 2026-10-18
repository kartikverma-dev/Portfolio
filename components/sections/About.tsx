"use client";

import React from "react";
import { siteConfig } from "@/data/site";
import { motion } from "motion/react";
import { GraduationCap, MapPin, Compass, Shield, Cpu, Code2, Camera } from "lucide-react";

export function About() {
  return (
    <section
      id="about"
      aria-label="About Kartik Verma"
      className="scroll-mt-24 py-28 bg-[#F4F7FB] text-[#0B1220] border-t border-[rgba(11,18,32,0.1)] transition-colors duration-300 dark:bg-[#0c1424] dark:text-[#E8EEF7] dark:border-[rgba(232,238,247,0.1)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] pb-6 mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1F5AE6] dark:text-[#457DFF] font-semibold">
              02 / Personal Dossier & Background
            </span>
            <h2 className="mt-2 font-headline font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase">
              ABOUT KARTIK
            </h2>
          </div>
          <div className="mt-4 sm:mt-0 font-mono text-xs text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">
            IMS Ghaziabad • Class of 2028 • Term 02
          </div>
        </div>

        {/* 12-Column Grid with Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Narrative Story (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-base sm:text-lg leading-relaxed text-[rgba(11,18,32,0.85)] dark:text-[#CBD5E1]"
            >
              <p className="font-headline font-semibold text-2xl sm:text-3xl text-[#0B1220] dark:text-[#E8EEF7] leading-snug">
                BCA student at IMS Ghaziabad exploring ideas at the intersection of AI, cybersecurity, software, and hardware.
              </p>

              <p>
                My focus is hands-on: I explore ideas through code, AI experiments, interactive interfaces, and hardware prototypes — turning curiosity into things you can see, test, and build upon.
              </p>

              <p>
                In software and AI, I work with local LLMs using Ollama (Qwen, Gemma), train YOLO object-detection models, explore computer vision with OpenCV and MediaPipe, and build interfaces with React, Next.js, and Tailwind CSS.
              </p>

              <p>
                In security and systems, I study cybersecurity fundamentals, networking, and the Linux command line in Kali Linux. On the embedded side, I experiment with Arduino Uno, ESP8266, NRF24L01 wireless communication, and motor control for Mecanum wheel robotics.
              </p>

              <p className="text-sm font-mono text-[rgba(11,18,32,0.7)] dark:text-[#94A3B8] border-l-2 border-[#1F5AE6] dark:border-[#457DFF] pl-4 py-1 italic">
                Someone who builds and experiments, not just studies.
              </p>
            </motion.div>

            {/* Interest Tags Matrix from Master Prompt Section 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="pt-6"
            >
              <h3 className="text-xs font-mono uppercase tracking-widest text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] mb-3">
                Interests & Explorations:
              </h3>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  { name: "AI & AI Engineering", icon: Code2 },
                  { name: "Cybersecurity & Ethical Hacking", icon: Shield },
                  { name: "Computer Vision & YOLO", icon: Cpu },
                  { name: "Robotics & Embedded Systems", icon: Cpu },
                  { name: "Gesture Recognition", icon: Compass },
                  { name: "Cinematography & Photography", icon: Camera },
                ].map((item) => (
                  <span
                    key={item.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[rgba(11,18,32,0.12)] text-[#0B1220] shadow-sm dark:bg-[#121A2C] dark:border-[rgba(232,238,247,0.1)] dark:text-[#E8EEF7]"
                  >
                    <item.icon className="w-3.5 h-3.5 text-[#1F5AE6] dark:text-[#457DFF]" />
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Intentional Asymmetric Editorial Dossier Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 bg-white dark:bg-[#111A2E] border border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            {/* Accent Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F6BFF]" />

            <div>
              {/* Card Meta Header */}
              <div className="flex items-center justify-between text-xs font-mono text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] pb-4 border-b border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)]">
                <span className="uppercase tracking-wider">ACADEMIC DOSSIER</span>
                <span className="px-2 py-0.5 rounded bg-[rgba(47,107,255,0.1)] text-[#1F5AE6] dark:text-[#457DFF] font-semibold">
                  STATUS
                </span>
              </div>

              {/* Asymmetric Highlight: Oversized Semester Badge */}
              <div className="py-6 border-b border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)] flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] block">
                    SEMESTER STATUS
                  </span>
                  <div className="font-headline font-black text-4xl sm:text-5xl text-[#0B1220] dark:text-[#E8EEF7] tracking-tight mt-1">
                    02 <span className="text-xl font-normal text-[rgba(11,18,32,0.5)] dark:text-[#64748B]">/ 06</span>
                  </div>
                </div>
                <div className="text-right font-mono text-xs text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">
                  <span>Batch 2025–2028</span>
                  <span className="block text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Second Semester (Oct 2026)
                  </span>
                </div>
              </div>

              {/* Identity Ledger */}
              <div className="py-6 space-y-4 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-4 h-4 text-[#1F5AE6] dark:text-[#457DFF] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[rgba(11,18,32,0.5)] dark:text-[#64748B] block">EDUCATION</span>
                    <span className="font-semibold text-[#0B1220] dark:text-[#E8EEF7] block mt-0.5">
                      {siteConfig.education.degree}
                    </span>
                    <span className="text-[rgba(11,18,32,0.7)] dark:text-[#94A3B8] block">
                      {siteConfig.education.institution}, {siteConfig.education.campus}
                    </span>
                    <span className="text-[11px] text-[rgba(11,18,32,0.5)] dark:text-[#64748B]">
                      Affiliated with {siteConfig.education.affiliation}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <MapPin className="w-4 h-4 text-[#FF7A59] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[rgba(11,18,32,0.5)] dark:text-[#64748B] block">LOCATION</span>
                    <span className="font-semibold text-[#0B1220] dark:text-[#E8EEF7] block mt-0.5">
                      {siteConfig.location.city}, {siteConfig.location.state}, {siteConfig.location.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campus Involvement from Section 5 */}
              <div className="pt-4 border-t border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] block mb-2">
                  CAMPUS AND COMMUNITY:
                </span>
                <ul className="space-y-1.5 text-xs text-[rgba(11,18,32,0.8)] dark:text-[#CBD5E1]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F5AE6] dark:bg-[#457DFF]" />
                    <span>Technical representative, Tech Yuva community</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F5AE6] dark:bg-[#457DFF]" />
                    <span>Editor, AI-ML Club</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F5AE6] dark:bg-[#457DFF]" />
                    <span>Organizing involvement with SPARDHA 2026 through the IMS UC Sports Club</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
