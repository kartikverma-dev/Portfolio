"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { FlaskConical, Cpu, Radio, Video, Hand, HardDrive, Sparkles } from "lucide-react";

interface LabEntry {
  id: string;
  logLabel: string;
  title: string;
  domain: string;
  status: "Prototype" | "Research" | "In Progress" | "Experiment";
  statusColor: string;
  hardwareSoftware: string[];
  demonstrated: string;
  boundary: string;
  icon: React.ElementType;
}

const labEntries: LabEntry[] = [
  {
    id: "gesture-sharing",
    logLabel: "EXPERIMENT",
    title: "Android Hand-Gesture Sharing",
    domain: "Android, Computer Vision, HCI",
    status: "In Progress",
    statusColor: "text-[#2F6BFF] border-[#2F6BFF]/30 bg-[#2F6BFF]/10",
    hardwareSoftware: [
      "Google MediaPipe Hand Landmarker",
      "Samsung Galaxy A55",
      "Android",
      "HCI",
    ],
    demonstrated:
      "Hand landmarks tracked and one hand detected on a Samsung Galaxy A55.",
    boundary:
      "Hand landmark tracking tested on a Samsung Galaxy A55.",
    icon: Hand,
  },
  {
    id: "nexus-rover",
    logLabel: "ROBOTICS",
    title: "NEXUS AI ROVER",
    domain: "Robotics, Embedded",
    status: "In Progress",
    statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    hardwareSoftware: [
      "Arduino Uno",
      "ESP8266",
      "NRF24L01 Wireless",
      "Li-ion Power",
      "Motor Control",
      "Mecanum Wheels",
    ],
    demonstrated:
      "A robotics project exploring Arduino Uno, ESP8266, NRF24L01 wireless communication, Li-ion power, motor control and Mecanum wheels.",
    boundary:
      "Hardware prototype in progress.",
    icon: Cpu,
  },
  {
    id: "tinynas",
    logLabel: "EMBEDDED",
    title: "TinyNAS",
    domain: "Embedded, IoT",
    status: "Experiment",
    statusColor: "text-[#FF7A59] border-[#FF7A59]/30 bg-[#FF7A59]/10",
    hardwareSoftware: ["Arduino Uno", "ESP8266", "Storage & Networking Exploration"],
    demonstrated:
      "Experiment with Arduino Uno, ESP8266 and storage or networking ideas on tiny hardware.",
    boundary:
      "Early hardware experiment exploring storage and networking concepts.",
    icon: HardDrive,
  },
  {
    id: "lumos-suite",
    logLabel: "HARDWARE",
    title: "LUMOS Projects",
    domain: "Experimental, Hardware",
    status: "Research",
    statusColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    hardwareSoftware: [
      "LUMOS RF (Research & Prototype)",
      "LUMOS ROVER (In Progress)",
      "LUMOS AI PIN (Prototype & Research)",
    ],
    demonstrated:
      "LUMOS RF (research and prototype), LUMOS ROVER (in progress), and LUMOS AI PIN (prototype and research).",
    boundary:
      "Hardware exploration suite across RF sensing, rover robotics, and wearable AI.",
    icon: Radio,
  },
  {
    id: "ai-video-lab",
    logLabel: "GENERATIVE",
    title: "AI Video Lab",
    domain: "AI, Generative Media",
    status: "Experiment",
    statusColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    hardwareSoftware: [
      "ComfyUI",
      "Hugging Face Models",
      "Google Colab",
      "GPU-based Video Generation",
    ],
    demonstrated:
      "Experiments with ComfyUI, Hugging Face models, Google Colab and GPU-based video generation.",
    boundary:
      "Workflow exploration with open generative pipelines.",
    icon: Video,
  },
];

export function Lab() {
  const [selectedLog, setSelectedLog] = useState<string>("gesture-sharing");

  const currentEntry = labEntries.find((e) => e.id === selectedLog) || labEntries[0];

  return (
    <section
      id="lab"
      aria-label="Research Lab & Experimental Notebook"
      className="scroll-mt-24 py-28 bg-[#0B1220] text-[#E8EEF7] border-t border-[rgba(232,238,247,0.1)] relative overflow-hidden"
    >
      {/* Subtle Blueprint Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E8EEF7 1px, transparent 1px),
            linear-gradient(to bottom, #E8EEF7 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[rgba(232,238,247,0.12)] pb-6 mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2F6BFF] dark:text-[#457DFF] font-semibold">
              <FlaskConical className="w-4 h-4 text-[#FF7A59]" />
              <span>Digital Research Notebook</span>
            </div>
            <h2 className="mt-2 font-headline font-black text-4xl sm:text-5xl lg:text-6xl text-[#E8EEF7] tracking-tight uppercase">
              THE LAB
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#94A3B8] max-w-xl">
              Research notebook for prototypes, hardware explorations, and creative technology experiments.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] bg-[#111A2E] px-4 py-2 rounded-lg border border-[rgba(232,238,247,0.1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Research Notebook</span>
          </div>
        </div>

        {/* 12-Column Research Notebook Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Log Selection Index (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] block mb-2">
              Select Research Entry:
            </span>

            {labEntries.map((entry) => {
              const isSelected = selectedLog === entry.id;
              const IconComp = entry.icon;

              return (
                <button
                  key={entry.id}
                  onClick={() => setSelectedLog(entry.id)}
                  type="button"
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 font-mono ${
                    isSelected
                      ? "bg-[#111A2E] border-[#2F6BFF] ring-1 ring-[#2F6BFF]/30 shadow-md"
                      : "bg-[#0E1626] border-[rgba(232,238,247,0.08)] hover:border-[rgba(232,238,247,0.2)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        isSelected ? "bg-[#2F6BFF] text-white" : "bg-[#111A2E] text-[#94A3B8]"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">
                        {entry.logLabel} {"//"} {entry.domain}
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-headline font-bold block mt-0.5 ${
                          isSelected ? "text-[#E8EEF7]" : "text-[#94A3B8]"
                        }`}
                      >
                        {entry.title}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${entry.statusColor}`}
                  >
                    {entry.status}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Notebook Card (7 cols) */}
          <motion.div
            key={currentEntry.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#111A2E] border border-[rgba(232,238,247,0.12)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden font-mono"
          >
            {/* Top Log Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[rgba(232,238,247,0.08)] text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <span className="text-[#457DFF] font-semibold">{currentEntry.logLabel}</span>
                <span>{"//"}</span>
                <span>{currentEntry.domain}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-semibold border ${currentEntry.statusColor}`}>
                {currentEntry.status}
              </span>
            </div>

            {/* Title */}
            <div>
              <h3 className="font-headline font-bold text-2xl sm:text-3xl text-[#E8EEF7]">
                {currentEntry.title}
              </h3>
            </div>

            {/* Stack Tags */}
            <div>
              <span className="text-[11px] text-[#64748B] uppercase tracking-wider block mb-2">
                Hardware & Software Technologies:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentEntry.hardwareSoftware.map((hw) => (
                  <span
                    key={hw}
                    className="px-2.5 py-1 rounded bg-[#0B1220] border border-[rgba(232,238,247,0.1)] text-xs text-[#CBD5E1]"
                  >
                    {hw}
                  </span>
                ))}
              </div>
            </div>

            {/* Demonstrated Observations strictly per Master Prompt */}
            <div className="p-4 rounded-xl bg-[#0B1220] border border-[rgba(232,238,247,0.08)] space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#457DFF] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Demonstrated Result / Focus:
              </span>
              <p className="text-xs sm:text-sm text-[#E8EEF7] leading-relaxed">
                {currentEntry.demonstrated}
              </p>
            </div>

            {/* Research Boundary strictly per Master Prompt */}
            <div className="p-4 rounded-xl bg-[#0B1220]/60 border border-[rgba(255,122,89,0.25)] space-y-1.5 text-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#FF7A59] font-semibold block">
                Research Scope & Status:
              </span>
              <p className="text-[#94A3B8] leading-relaxed">
                {currentEntry.boundary}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
