"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { certificates, CertificateItem } from "@/data/certificates";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Award, X, ExternalLink, Calendar, ShieldCheck, Medal } from "lucide-react";

type CertificateCategory =
  | "All"
  | "AI & Security"
  | "IoT"
  | "Community"
  | "Professional skills"
  | "Honours"
  | "Program";

const categories: CertificateCategory[] = [
  "All",
  "AI & Security",
  "IoT",
  "Community",
  "Professional skills",
  "Honours",
  "Program",
];

export function Certificates() {
  const [activeCategory, setActiveCategory] = useState<CertificateCategory>("All");
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const triggerRefs = useRef<Map<string, HTMLElement>>(new Map());
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Hide any entry with verified: false
  const verifiedCertificates = certificates.filter((c) => c.verified);
  const featuredCert = verifiedCertificates.find((c) => c.featured);
  const regularCerts = verifiedCertificates.filter((c) => !c.featured);

  const filteredCerts =
    activeCategory === "All"
      ? regularCerts
      : regularCerts.filter((c) => c.category === activeCategory);

  const openModal = (cert: CertificateItem, triggerEl: HTMLElement | null) => {
    if (triggerEl) {
      triggerRefs.current.set(cert.id, triggerEl);
    }
    setSelectedCert(cert);
  };

  const closeModal = useCallback(() => {
    const certId = selectedCert?.id;
    setSelectedCert(null);
    // Return focus to trigger card on close
    if (certId && triggerRefs.current.has(certId)) {
      setTimeout(() => {
        triggerRefs.current.get(certId)?.focus();
      }, 50);
    }
  }, [selectedCert]);

  // Lock body scroll and trap focus when modal is open
  useEffect(() => {
    if (!selectedCert) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button initially
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCert, closeModal]);

  return (
    <section
      id="credentials"
      aria-label="Certificates and Credentials"
      className="scroll-mt-24 py-28 bg-[#F4F7FB] text-[#0B1220] border-t border-[rgba(11,18,32,0.1)] transition-colors duration-300 dark:bg-[#0c1424] dark:text-[#E8EEF7] dark:border-[rgba(232,238,247,0.1)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] pb-6 mb-12 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1F5AE6] dark:text-[#457DFF] font-semibold">
              05 / Verified Credentials & Honours
            </span>
            <h2 className="mt-2 font-headline font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase">
              CERTIFICATES
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[rgba(11,18,32,0.7)] dark:text-[#94A3B8] max-w-xl">
              Verified certifications, faculty development programs, community initiatives, and academic honours.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  type="button"
                  className={`px-3 py-1.5 rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] ${
                    isSelected
                      ? "bg-[#2F6BFF] border-[#2F6BFF] text-white font-semibold shadow-sm"
                      : "bg-white dark:bg-[#111A2E] border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] text-[rgba(11,18,32,0.7)] dark:text-[#94A3B8] hover:text-[#0B1220] dark:hover:text-[#E8EEF7] hover:border-[#2F6BFF]/40"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* FEATURED: Core Committee Honours Card */}
        {featuredCert && (activeCategory === "All" || activeCategory === "Honours") && (
          <div className="mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-[#1F5AE6] dark:text-[#457DFF] font-semibold mb-3 flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-500" />
              <span>Featured Honours</span>
            </div>

            <div
              tabIndex={0}
              role="button"
              onClick={(e) => openModal(featuredCert, e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openModal(featuredCert, e.currentTarget);
                }
              }}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-[#111A2E] border-2 border-amber-500/30 hover:border-amber-500/60 p-6 sm:p-8 md:p-10 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Portrait Medal Image */}
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden border border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] shadow-md group-hover:scale-[1.02] transition-transform">
                    {featuredCert.extraImage && (
                      <Image
                        src={featuredCert.extraImage}
                        alt="Medal for serving on Core Committee InvenT 2026"
                        fill
                        sizes="(max-width: 768px) 200px, 250px"
                        loading="lazy"
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Content Column */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
                      {featuredCert.category}
                    </span>
                    {featuredCert.date && (
                      <span className="text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">
                        {featuredCert.date}
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline font-black text-2xl sm:text-3xl text-[#0B1220] dark:text-[#E8EEF7] tracking-tight group-hover:text-[#1F5AE6] dark:group-hover:text-[#457DFF] transition-colors">
                    {featuredCert.title}
                  </h3>

                  <div className="text-sm font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold">
                    {featuredCert.issuer}
                  </div>

                  {featuredCert.description && (
                    <p className="text-sm sm:text-base text-[rgba(11,18,32,0.8)] dark:text-[#CBD5E1] leading-relaxed">
                      {featuredCert.description}
                    </p>
                  )}

                  <div className="pt-2 text-xs font-mono text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Click to view certificate and medal detail</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => {
            const isProgram = cert.category === "Program";

            return (
              <div
                key={cert.id}
                tabIndex={0}
                role="button"
                onClick={(e) => openModal(cert, e.currentTarget)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal(cert, e.currentTarget);
                  }
                }}
                className="group cursor-pointer rounded-xl bg-white dark:bg-[#111A2E] border border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] p-5 shadow-sm hover:border-[#2F6BFF]/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail if image exists */}
                  {cert.image ? (
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)] mb-4 bg-slate-100 dark:bg-slate-900">
                      <Image
                        src={cert.image}
                        alt={`${cert.title} issued by ${cert.issuer}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded-lg border border-dashed border-[rgba(11,18,32,0.15)] dark:border-[rgba(232,238,247,0.15)] mb-4 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50">
                      <Award className="w-10 h-10 text-[#1F5AE6] dark:text-[#457DFF] mb-2 opacity-80" />
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F5AE6] dark:text-[#457DFF]">
                        Program Involvements
                      </span>
                    </div>
                  )}

                  {/* Header Meta */}
                  <div className="flex items-center justify-between text-xs font-mono text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] mb-2">
                    <span className="px-2 py-0.5 rounded bg-[rgba(31,90,230,0.08)] text-[#1F5AE6] dark:text-[#457DFF] text-[10px] font-semibold uppercase">
                      {isProgram ? "Program" : cert.category}
                    </span>
                    {cert.date && <span>{cert.date}</span>}
                  </div>

                  {/* Title & Issuer */}
                  <h4 className="font-headline font-bold text-lg text-[#0B1220] dark:text-[#E8EEF7] group-hover:text-[#1F5AE6] dark:group-hover:text-[#457DFF] transition-colors line-clamp-2">
                    {cert.title}
                  </h4>
                  <div className="text-xs font-mono text-[rgba(11,18,32,0.65)] dark:text-[#94A3B8] mt-1 line-clamp-1">
                    {cert.issuer}
                  </div>
                </div>

                {/* Footer hint */}
                <div className="pt-4 mt-4 border-t border-[rgba(11,18,32,0.06)] dark:border-[rgba(232,238,247,0.06)] flex items-center justify-between text-xs font-mono text-[rgba(11,18,32,0.5)] dark:text-[#64748B]">
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Modal Dialog */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-dialog-title"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Content */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111A2E] border border-[rgba(11,18,32,0.15)] dark:border-[rgba(232,238,247,0.15)] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 space-y-6"
            >
              {/* Modal Top Bar */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-[rgba(31,90,230,0.1)] text-[#1F5AE6] dark:text-[#457DFF] font-semibold uppercase">
                      {selectedCert.category === "Program" ? "Program" : selectedCert.category}
                    </span>
                    {selectedCert.date && (
                      <span className="text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {selectedCert.date}
                      </span>
                    )}
                  </div>
                  <h3
                    id="cert-dialog-title"
                    className="font-headline font-black text-2xl sm:text-3xl text-[#0B1220] dark:text-[#E8EEF7] tracking-tight"
                  >
                    {selectedCert.title}
                  </h3>
                  <div className="text-sm font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold mt-1">
                    {selectedCert.issuer}
                  </div>
                </div>

                <button
                  ref={closeButtonRef}
                  onClick={closeModal}
                  type="button"
                  aria-label="Close certificate dialog"
                  className="p-2 rounded-lg border border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] hover:text-[#0B1220] dark:hover:text-[#E8EEF7] hover:border-[#2F6BFF] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Full Image(s) */}
              <div className="space-y-4">
                {selectedCert.image && (
                  <div className="relative w-full aspect-[4/3] max-h-[500px] rounded-xl overflow-hidden border border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] bg-slate-50 dark:bg-slate-900">
                    <Image
                      src={selectedCert.image}
                      alt={`Certificate: ${selectedCert.title}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 850px"
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Extra Image (e.g. Medal photo for featured core committee) */}
                {selectedCert.extraImage && (
                  <div className="pt-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] block mb-2">
                      InvenT 2026 Core Committee Medal:
                    </span>
                    <div className="relative w-full sm:w-72 aspect-[3/4] mx-auto rounded-xl overflow-hidden border border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] bg-slate-50 dark:bg-slate-900 shadow">
                      <Image
                        src={selectedCert.extraImage}
                        alt="Medal for Core Committee InvenT 2026"
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedCert.description && (
                <div className="p-4 rounded-xl bg-[#F4F7FB] dark:bg-[#0B1220] border border-[rgba(11,18,32,0.06)] dark:border-[rgba(232,238,247,0.06)] text-sm text-[rgba(11,18,32,0.85)] dark:text-[#CBD5E1] leading-relaxed font-mono">
                  {selectedCert.description}
                </div>
              )}

              {/* Footer / Credential URL link if exists */}
              <div className="flex items-center justify-between pt-4 border-t border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] text-xs font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Documented Record</span>
                </span>

                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2F6BFF] text-white hover:bg-[#2558d4] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
