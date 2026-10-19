"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { CertificateItem } from "@/data/certificates";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Award, ExternalLink, Calendar, MousePointer2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CertificateRingProps {
  certificates: CertificateItem[];
  onOpenModal: (cert: CertificateItem, triggerEl: HTMLElement | null) => void;
  shouldReduceMotion: boolean | null;
}

export function CertificateRing({
  certificates,
  onOpenModal,
  shouldReduceMotion,
}: CertificateRingProps) {
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinTriggerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const swipeRowRef = useRef<HTMLDivElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  const N = Math.max(1, certificates.length);
  const stepAngle = 360 / N;
  // Adaptive radius: keeps cards comfortable, outward-facing and collision-free
  const radius = Math.max(360, Math.round((290 / 2) / Math.tan(Math.PI / N) * 1.08));

  // Active certificate
  const activeCert = certificates[activeIndex] || certificates[0];

  // Register GSAP ScrollTrigger plugin client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  // Viewport breakpoint detection (desktop is >= 1024px)
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // GSAP ScrollTrigger: Scroll-driven Pinned 3D Carousel with Momentum & Snapping
  useEffect(() => {
    if (!isDesktop || shouldReduceMotion) return;

    const triggerEl = pinTriggerRef.current;
    if (!triggerEl) return;

    // Use gsap.context for robust scoped lifecycle cleanup
    const ctx = gsap.context(() => {
      const rotObj = { value: 0 };
      // Total rotation angle to traverse through all N cards
      const totalRotation = -(N - 1) * stepAngle;
      // Scroll travel distance (e.g. 380px per card for comfortable wheel pacing)
      const scrollDistance = Math.max(1800, (N - 1) * 380);

      const st = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top+=75",
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: 1.2, // Inertia / momentum: smooth deceleration and coasting after scroll stops
        snap: {
          snapTo: 1 / (N - 1), // Snaps accurately to each certificate card
          duration: { min: 0.25, max: 0.5 },
          ease: "power1.inOut",
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          const currentRot = progress * totalRotation;
          rotObj.value = currentRot;
          setRotation(currentRot);

          // Update active card index based on progress
          const index = Math.round(progress * (N - 1));
          if (index >= 0 && index < N) {
            setActiveIndex(index);
          }
        },
      });

      scrollTriggerInstanceRef.current = st;
    }, containerRef);

    return () => ctx.revert();
  }, [isDesktop, shouldReduceMotion, N, stepAngle]);

  // Navigate to specific certificate index by scrolling the ScrollTrigger smoothly
  const navigateToIndex = useCallback((targetIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(N - 1, targetIndex));
    const st = scrollTriggerInstanceRef.current;

    if (st && isDesktop && !shouldReduceMotion) {
      const targetProgress = clampedIndex / (N - 1);
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    } else {
      setActiveIndex(clampedIndex);
      // For mobile swipe row, scroll into view
      if (swipeRowRef.current) {
        const cardWidth = 280;
        swipeRowRef.current.scrollTo({
          left: clampedIndex * cardWidth,
          behavior: "smooth",
        });
      }
    }
  }, [N, isDesktop, shouldReduceMotion]);

  const handlePrev = useCallback(() => {
    navigateToIndex(activeIndex - 1);
  }, [activeIndex, navigateToIndex]);

  const handleNext = useCallback(() => {
    navigateToIndex(activeIndex + 1);
  }, [activeIndex, navigateToIndex]);

  // Keyboard navigation when container is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Mobile horizontal swipe snap tracking
  const handleMobileScroll = () => {
    const el = swipeRowRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 280;
    const index = Math.round(scrollLeft / cardWidth);
    if (index >= 0 && index < N && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Helper for Card Face image: Core Committee shows medal photo
  const getCardImage = (cert: CertificateItem) => {
    if (cert.id === "invent-core" && cert.extraImage) {
      return cert.extraImage;
    }
    return cert.image;
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Certificates Pinned 3D Showcase"
      onKeyDown={handleKeyDown}
      className="relative w-full focus-visible:outline-none"
    >
      {/* Screen Reader Announcement for Centred Active Entry */}
      <div className="sr-only" aria-live="polite">
        Active certificate: {activeCert.title}, issued by {activeCert.issuer}.
      </div>

      {/* PIN TRIGGER WRAPPER FOR SCROLL-DRIVEN 3D PINNING */}
      <div
        ref={pinTriggerRef}
        className="w-full flex flex-col justify-between py-6"
      >
        {/* DESKTOP (>=1024px) SCROLL-DRIVEN 3D PERSPECTIVE RING */}
        {isDesktop && !shouldReduceMotion ? (
          <div className="relative w-full h-[450px] flex items-center justify-center select-none overflow-hidden">
            {/* 3D Perspective Stage */}
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                perspective: "1350px",
                perspectiveOrigin: "50% 48%",
              }}
            >
              {/* Rotating Cylinder Driven Directly by Scroll Momentum */}
              <div
                ref={ringRef}
                className="relative w-[300px] h-[370px]"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotation}deg)`,
                  willChange: "transform",
                }}
              >
                {certificates.map((cert, i) => {
                  const baseAngle = i * stepAngle;
                  let relAngle = (baseAngle + rotation) % 360;
                  if (relAngle > 180) relAngle -= 360;
                  if (relAngle < -180) relAngle += 360;
                  const absAngle = Math.abs(relAngle);
                  const isCentred = absAngle < stepAngle / 2;

                  // Scale down and dim cards as they turn away from center
                  const progress = Math.min(1, absAngle / 180);
                  const scale = Math.max(0.76, 1.04 - progress * 0.28);
                  const opacity = Math.max(0.22, 1 - progress * 0.78);

                  const cardImg = getCardImage(cert);
                  const isMedalCard = cert.id === "invent-core";

                  return (
                    <div
                      key={cert.id}
                      onClick={() => navigateToIndex(i)}
                      className={`absolute inset-0 rounded-2xl border cursor-pointer p-5 flex flex-col justify-between transition-[opacity,box-shadow,border-color,background-color] duration-200 ${
                        isCentred
                          ? "bg-[#111A2E] text-[#E8EEF7] border-[#2F6BFF] shadow-2xl ring-2 ring-[#2F6BFF]/40 z-30"
                          : "bg-[#0B1220]/95 text-[#CBD5E1] border-[rgba(232,238,247,0.14)] shadow-md hover:border-[#2F6BFF]/40 z-10"
                      }`}
                      style={{
                        transform: `rotateY(${baseAngle}deg) translateZ(${radius}px) scale(${scale})`,
                        opacity,
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {/* Top Metadata */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="px-2.5 py-0.5 rounded-full bg-[rgba(47,107,255,0.18)] text-[#457DFF] font-semibold text-[10px] uppercase tracking-wider">
                          {cert.category}
                        </span>
                        {cert.date && (
                          <span className="text-[11px] text-[#94A3B8]">
                            {cert.date}
                          </span>
                        )}
                      </div>

                      {/* Card Face: Image or Text-only Card */}
                      <div className="my-auto py-2">
                        {cardImg ? (
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[rgba(232,238,247,0.12)] bg-[#0B1220] shadow-inner">
                            <Image
                              src={cardImg}
                              alt={`${cert.title} face`}
                              fill
                              sizes="300px"
                              loading="lazy"
                              className="object-cover"
                            />
                            {isMedalCard && (
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-amber-500/90 text-[#0B1220] font-mono text-[9px] font-bold uppercase tracking-wider shadow">
                                Medal Spec
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full aspect-[4/3] rounded-xl border border-dashed border-[rgba(232,238,247,0.2)] flex flex-col items-center justify-center p-4 bg-[#0B1220]/60 text-center">
                            <Award className="w-10 h-10 text-[#457DFF] mb-2 opacity-85" />
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#457DFF]">
                              Program Involvement
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Title & Issuer */}
                      <div>
                        <h4 className="font-headline font-bold text-base sm:text-lg text-[#E8EEF7] line-clamp-1">
                          {cert.title}
                        </h4>
                        <p className="text-xs font-mono text-[#94A3B8] truncate mt-0.5">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Left/Right Arrow Navigation Buttons */}
            <button
              type="button"
              disabled={activeIndex <= 0}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous certificate"
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111A2E]/90 border border-[rgba(232,238,247,0.2)] text-[#E8EEF7] shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] z-40 ${
                activeIndex <= 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:border-[#2F6BFF] hover:text-[#457DFF]"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              disabled={activeIndex >= N - 1}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next certificate"
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111A2E]/90 border border-[rgba(232,238,247,0.2)] text-[#E8EEF7] shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] z-40 ${
                activeIndex >= N - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:border-[#2F6BFF] hover:text-[#457DFF]"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* MOBILE & REDUCED MOTION: FLAT HORIZONTAL SWIPE ROW */
          <div
            ref={swipeRowRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory py-6 px-4 no-scrollbar scroll-smooth"
            role="region"
            aria-label="Certificates swipe gallery"
          >
            {certificates.map((cert, idx) => {
              const isSelected = idx === activeIndex;
              const cardImg = getCardImage(cert);

              return (
                <div
                  key={cert.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`snap-center flex-shrink-0 w-[260px] sm:w-[290px] rounded-2xl bg-white dark:bg-[#111A2E] border p-5 flex flex-col justify-between transition-all shadow-sm ${
                    isSelected
                      ? "border-[#2F6BFF] ring-2 ring-[#2F6BFF]/30 dark:border-[#457DFF]"
                      : "border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] opacity-85"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="px-2 py-0.5 rounded bg-[rgba(47,107,255,0.1)] text-[#1F5AE6] dark:text-[#457DFF] font-semibold text-[10px] uppercase">
                      {cert.category}
                    </span>
                    {cert.date && (
                      <span className="text-[11px] text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8]">
                        {cert.date}
                      </span>
                    )}
                  </div>

                  <div className="my-auto py-2">
                    {cardImg ? (
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)] bg-slate-100 dark:bg-slate-900">
                        <Image
                          src={cardImg}
                          alt={`${cert.title} preview`}
                          fill
                          sizes="260px"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/3] rounded-xl border border-dashed border-[rgba(11,18,32,0.15)] dark:border-[rgba(232,238,247,0.15)] flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50 text-center">
                        <Award className="w-8 h-8 text-[#1F5AE6] dark:text-[#457DFF] mb-2 opacity-80" />
                        <span className="text-xs font-mono font-semibold uppercase text-[#1F5AE6] dark:text-[#457DFF]">
                          Program
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <h4 className="font-headline font-bold text-base text-[#0B1220] dark:text-[#E8EEF7] line-clamp-1">
                      {cert.title}
                    </h4>
                    <p className="text-xs font-mono text-[rgba(11,18,32,0.65)] dark:text-[#94A3B8] truncate mt-0.5">
                      {cert.issuer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PINNED GALLERY SCROLL PROGRESS & INTERACTION HINT */}
        <div className="mt-3 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 max-w-3xl mx-auto w-full font-mono text-xs text-[rgba(11,18,32,0.65)] dark:text-[#94A3B8]">
          <div className="inline-flex items-center gap-2">
            <MousePointer2 className="w-3.5 h-3.5 text-[#2F6BFF] dark:text-[#457DFF]" aria-hidden="true" />
            {isDesktop && !shouldReduceMotion ? (
              <span>Scroll down to advance carousel • Or use Left/Right keys</span>
            ) : (
              <span>Swipe to browse certificates</span>
            )}
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[#2F6BFF] dark:text-[#457DFF] font-semibold">
              0{activeIndex + 1}
            </span>
            <span>/</span>
            <span>0{N}</span>
            {isDesktop && !shouldReduceMotion && (
              <div className="w-16 h-1.5 rounded-full bg-[rgba(11,18,32,0.1)] dark:bg-[rgba(232,238,247,0.1)] overflow-hidden ml-1">
                <div
                  className="h-full bg-[#2F6BFF] dark:bg-[#457DFF] transition-all duration-150"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* DESCRIPTION PANEL BELOW THE RING */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCert.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111A2E] border border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] shadow-md space-y-3"
            >
              {/* Meta Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[rgba(47,107,255,0.1)] text-[#1F5AE6] dark:text-[#457DFF] font-semibold uppercase tracking-wider">
                  {activeCert.category}
                </span>
                {activeCert.date && (
                  <span className="text-[rgba(11,18,32,0.6)] dark:text-[#94A3B8] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeCert.date}</span>
                  </span>
                )}
              </div>

              {/* Title & Issuer */}
              <div>
                <h3 className="font-headline font-black text-xl sm:text-2xl text-[#0B1220] dark:text-[#E8EEF7] tracking-tight">
                  {activeCert.title}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold mt-0.5">
                  {activeCert.issuer}
                </p>
              </div>

              {/* Description (rendered only if present) */}
              {activeCert.description && (
                <p className="text-xs sm:text-sm text-[rgba(11,18,32,0.8)] dark:text-[#CBD5E1] leading-relaxed">
                  {activeCert.description}
                </p>
              )}

              {/* CTA: Open Full Certificate Button */}
              <div className="pt-3 border-t border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)] flex items-center justify-between">
                <span className="text-xs font-mono text-[rgba(11,18,32,0.5)] dark:text-[#64748B]">
                  Document record active
                </span>
                <button
                  ref={openBtnRef}
                  type="button"
                  onClick={() => onOpenModal(activeCert, openBtnRef.current)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F6BFF] hover:bg-[#2558d4] text-white font-mono text-xs font-semibold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                >
                  <span>Open full certificate</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
