"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { CertificateItem } from "@/data/certificates";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Award, ExternalLink, Calendar, MousePointer2, Sparkles, Maximize2 } from "lucide-react";

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
  // Continuous rotation angle in degrees
  const [rotation, setRotation] = useState(0);
  // Center active card index
  const [activeIndex, setActiveIndex] = useState(0);
  // Whether the carousel is currently in motion (scrolling / dragging)
  const [isScrolling, setIsScrolling] = useState(false);
  // Whether the active card has expanded into the broad widened state
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardTriggerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  // Animation and physics state
  const rotationRef = useRef(0);
  const activeIndexRef = useRef(0);
  const isScrollingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Drag tracking
  const hasDraggedRef = useRef(false);
  const dragRef = useRef({
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  const N = Math.max(1, certificates.length);
  const stepAngle = 360 / N;
  // 3D radius for outward-facing circular loop
  const radius = Math.max(340, Math.round((280 / 2) / Math.tan(Math.PI / N) * 1.15));

  const activeCert = certificates[activeIndex] || certificates[0];

  // Helper for Card Face image: Core Committee shows medal photo
  const getCardImage = (cert: CertificateItem) => {
    if (cert.id === "invent-core" && cert.extraImage) {
      return cert.extraImage;
    }
    return cert.image;
  };

  // Update ring rotation directly on GPU for butter-smooth 60/120 FPS
  const updateDomRotation = useCallback(
    (rotDeg: number) => {
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${rotDeg}deg)`;
      }

      // Compute nearest front card index
      const nearestIdx = ((Math.round(-rotDeg / stepAngle) % N) + N) % N;
      if (nearestIdx !== activeIndexRef.current) {
        activeIndexRef.current = nearestIdx;
        setActiveIndex(nearestIdx);
      }
    },
    [N, stepAngle]
  );

  // Smooth Spring Animation to target rotation
  const animateToAngle = useCallback(
    (targetAngle: number, onComplete?: () => void) => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (shouldReduceMotion) {
        rotationRef.current = targetAngle;
        updateDomRotation(targetAngle);
        setRotation(targetAngle);
        onComplete?.();
        return;
      }

      const springLoop = () => {
        const current = rotationRef.current;
        const diff = targetAngle - current;

        if (Math.abs(diff) < 0.05) {
          rotationRef.current = targetAngle;
          updateDomRotation(targetAngle);
          setRotation(targetAngle);
          rafIdRef.current = null;
          onComplete?.();
          return;
        }

        // Smooth spring easing
        const next = current + diff * 0.16;
        rotationRef.current = next;
        updateDomRotation(next);
        rafIdRef.current = requestAnimationFrame(springLoop);
      };

      rafIdRef.current = requestAnimationFrame(springLoop);
    },
    [shouldReduceMotion, updateDomRotation]
  );

  // Stop scrolling and expand the centered certificate
  const handleScrollSettled = useCallback(() => {
    isScrollingRef.current = false;
    setIsScrolling(false);

    // Snap to the exact front card position
    const nearestStep = Math.round(rotationRef.current / stepAngle);
    const targetAngle = nearestStep * stepAngle;

    animateToAngle(targetAngle, () => {
      // Once aligned, broaden/expand the centered certificate
      if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = setTimeout(() => {
        setIsExpanded(true);
      }, 60);
    });
  }, [stepAngle, animateToAngle]);

  // Trigger scrolling state: immediately contract card and reset settle timer
  const notifyScrollActivity = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      setIsScrolling(true);
      setIsExpanded(false); // Contract immediately when scrolling starts
    }

    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);

    // When no scroll activity occurs for 190ms, settle and broaden
    stopTimeoutRef.current = setTimeout(handleScrollSettled, 190);
  }, [handleScrollSettled]);

  // Navigate directly to a specific card index
  const rotateToIndex = useCallback(
    (targetIndex: number) => {
      setIsExpanded(false);
      isScrollingRef.current = true;
      setIsScrolling(true);

      const current = rotationRef.current;
      const targetBase = -targetIndex * stepAngle;
      let relDiff = (targetBase - current) % 360;
      if (relDiff > 180) relDiff -= 360;
      if (relDiff < -180) relDiff += 360;

      animateToAngle(current + relDiff, () => {
        handleScrollSettled();
      });
    },
    [stepAngle, animateToAngle, handleScrollSettled]
  );

  // Chevron step navigation
  const handlePrev = useCallback(() => {
    setIsExpanded(false);
    isScrollingRef.current = true;
    setIsScrolling(true);
    const current = Math.round(rotationRef.current / stepAngle) * stepAngle;
    animateToAngle(current + stepAngle, handleScrollSettled);
  }, [stepAngle, animateToAngle, handleScrollSettled]);

  const handleNext = useCallback(() => {
    setIsExpanded(false);
    isScrollingRef.current = true;
    setIsScrolling(true);
    const current = Math.round(rotationRef.current / stepAngle) * stepAngle;
    animateToAngle(current - stepAngle, handleScrollSettled);
  }, [stepAngle, animateToAngle, handleScrollSettled]);

  // REAL MOUSE SCROLLING FUNCTION:
  // Scrolling rotating the 3D loop continuously, then automatically broadening on stop
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      // Intercept wheel on the 3D stage to rotate loop
      e.preventDefault();

      notifyScrollActivity();

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      // Real mouse wheel delta (horizontal or vertical)
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const rotDelta = -delta * 0.22;

      rotationRef.current += rotDelta;
      updateDomRotation(rotationRef.current);
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [notifyScrollActivity, updateDomRotation]);

  // Pointer Drag Handlers (Mouse drag & Touch flick)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    setIsDragging(true);
    hasDraggedRef.current = false;
    dragRef.current = {
      startX: e.clientX,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };

    if (stageRef.current) {
      stageRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragRef.current.lastX;
    const totalDistX = Math.abs(e.clientX - dragRef.current.startX);

    if (totalDistX > 4) {
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        notifyScrollActivity();
      }
    }

    const rotDelta = deltaX * 0.32;
    rotationRef.current += rotDelta;
    updateDomRotation(rotationRef.current);

    const now = performance.now();
    const dt = now - dragRef.current.lastTime;
    if (dt > 0) {
      dragRef.current.velocity = (rotDelta / dt) * 16.67;
    }

    dragRef.current.lastX = e.clientX;
    dragRef.current.lastTime = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      if (stageRef.current && stageRef.current.hasPointerCapture(e.pointerId)) {
        stageRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored if capture lost
    }

    if (hasDraggedRef.current) {
      const vel = dragRef.current.velocity;
      if (Math.abs(vel) > 0.5) {
        // Coasting with friction before snap
        let currentVel = vel * 0.8;
        const coastLoop = () => {
          rotationRef.current += currentVel;
          updateDomRotation(rotationRef.current);
          currentVel *= 0.92;

          if (Math.abs(currentVel) < 0.1) {
            handleScrollSettled();
            return;
          }
          rafIdRef.current = requestAnimationFrame(coastLoop);
        };
        rafIdRef.current = requestAnimationFrame(coastLoop);
      } else {
        handleScrollSettled();
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const triggerEl = cardTriggerRefs.current.get(activeCert.id);
      onOpenModal(activeCert, triggerEl || null);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Certificates 3D Loop Showcase"
      onKeyDown={handleKeyDown}
      className="relative w-full focus-visible:outline-none select-none"
    >
      {/* Screen Reader Live Announcement */}
      <div className="sr-only" aria-live="polite">
        Current certificate: {activeCert.title}, issued by {activeCert.issuer}.
      </div>

      {/* 3D CAROUSEL PERSPECTIVE STAGE (Always active for all screen sizes) */}
      <div className="w-full py-4 sm:py-6">
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-full h-[500px] sm:h-[540px] flex items-center justify-center overflow-hidden rounded-3xl transition-colors duration-300 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* 3D Perspective Viewport */}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              perspective: "1350px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {/* Rotating 3D Cylinder Container */}
            <div
              ref={ringRef}
              className="relative w-[270px] sm:w-[300px] h-[390px] sm:h-[410px]"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${rotation}deg)`,
                willChange: "transform",
              }}
            >
              {certificates.map((cert, i) => {
                const baseAngle = i * stepAngle;
                const isCentred = i === activeIndex;

                // Distance from center front in steps
                let stepDiff = Math.abs(i - activeIndex);
                if (stepDiff > N / 2) stepDiff = N - stepDiff;

                const cardImg = getCardImage(cert);
                const isMedalCard = cert.id === "invent-core";

                // When centered and stopped scrolling, card opens, expands & widens!
                const isBroadened = isCentred && isExpanded && !isScrolling;

                // Scale & Opacity adjustments for depth
                const depthScale = isCentred
                  ? isBroadened
                    ? 1.04
                    : 1.0
                  : stepDiff === 1
                  ? 0.92
                  : 0.84;

                const depthOpacity = isCentred
                  ? 1
                  : stepDiff === 1
                  ? 0.68
                  : 0.28;

                return (
                  <div
                    key={cert.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasDraggedRef.current) return;
                      if (!isCentred) {
                        rotateToIndex(i);
                      } else {
                        // Centred card clicked: open full certificate modal
                        const btnEl = cardTriggerRefs.current.get(cert.id);
                        onOpenModal(cert, btnEl || null);
                      }
                    }}
                    className={`absolute top-0 rounded-2xl flex flex-col justify-between transition-[width,left,transform,opacity,box-shadow,border-color,background-color] duration-300 ease-out cursor-pointer ${
                      isBroadened
                        ? "w-[340px] xs:w-[400px] sm:w-[480px] md:w-[500px] -left-[35px] xs:-left-[65px] sm:-left-[90px] md:-left-[100px] p-5 sm:p-6 z-30"
                        : "w-[270px] sm:w-[300px] left-0 p-5 z-10"
                    } ${
                      /* Subtle bridge border between UI obsidian-blue and certificate white */
                      isCentred
                        ? "bg-white dark:bg-[#0f172a] text-[#0B1220] dark:text-[#E8EEF7] border-2 border-[#2F6BFF] ring-4 ring-[#457DFF]/25 shadow-[0_16px_50px_rgba(47,107,255,0.28)]"
                        : "bg-white/95 dark:bg-[#111A2E]/95 text-[#334155] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#334155]/80 hover:border-[#2F6BFF]/60 shadow-lg hover:shadow-xl"
                    }`}
                    style={{
                      height: "410px",
                      transform: `rotateY(${baseAngle}deg) translateZ(${radius}px) scale(${depthScale})`,
                      opacity: depthOpacity,
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Top Header: Category Tag & Date & Status */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-[rgba(47,107,255,0.12)] text-[#1F5AE6] dark:text-[#457DFF] font-semibold text-[10px] uppercase tracking-wider border border-[#2F6BFF]/20">
                        {cert.category}
                      </span>

                      <div className="flex items-center gap-2">
                        {isBroadened && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <Sparkles className="w-2.5 h-2.5" />
                            Active
                          </span>
                        )}
                        {cert.date && (
                          <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] font-mono">
                            {cert.date}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body: White Bezel Certificate Artwork */}
                    <div className="my-auto py-2">
                      {cardImg ? (
                        <div
                          className={`relative w-full rounded-xl overflow-hidden bg-white dark:bg-slate-950 transition-all duration-300 shadow-inner ${
                            /* Subtle border between UI and white certificate */
                            "border border-[#E2E8F0] dark:border-slate-700/80"
                          } ${isBroadened ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                        >
                          <Image
                            src={cardImg}
                            alt={`${cert.title} preview`}
                            fill
                            sizes="(max-width: 768px) 300px, 500px"
                            loading="lazy"
                            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                          />
                          {isMedalCard && (
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-[#0B1220] font-mono text-[9px] font-bold uppercase tracking-wider shadow">
                              Medal Spec
                            </div>
                          )}
                          {isBroadened && (
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-[#0B1220]/80 backdrop-blur-sm text-white text-[10px] font-mono inline-flex items-center gap-1 shadow">
                              <Maximize2 className="w-3 h-3 text-[#457DFF]" />
                              <span>Click to inspect</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-full rounded-xl border border-dashed border-[#CBD5E1] dark:border-slate-700 flex flex-col items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-900/60 text-center transition-all duration-300 ${
                            isBroadened ? "aspect-[16/9]" : "aspect-[4/3]"
                          }`}
                        >
                          <Award className="w-10 h-10 text-[#2F6BFF] dark:text-[#457DFF] mb-2 opacity-90" />
                          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F5AE6] dark:text-[#457DFF]">
                            Program Involvement
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Title, Issuer, and Broadened Details */}
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-headline font-bold text-[#0B1220] dark:text-[#E8EEF7] tracking-tight transition-all duration-200 ${
                              isBroadened ? "text-lg sm:text-xl line-clamp-1" : "text-base line-clamp-1"
                            }`}
                          >
                            {cert.title}
                          </h4>
                          <p className="text-xs font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold truncate">
                            {cert.issuer}
                          </p>
                        </div>

                        {/* Quick Modal Button when Widened */}
                        {isBroadened && (
                          <button
                            ref={(el) => {
                              cardTriggerRefs.current.set(cert.id, el);
                            }}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const btnEl = cardTriggerRefs.current.get(cert.id);
                              onOpenModal(cert, btnEl || null);
                            }}
                            aria-label={`Open full document for ${cert.title}`}
                            className="flex-shrink-0 p-2 rounded-xl bg-[#2F6BFF] hover:bg-[#2558d4] text-white shadow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Extended Description rendered when the card opens and widens */}
                      <AnimatePresence>
                        {isBroadened && cert.description && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-800"
                          >
                            {cert.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Left and Right Chevron Navigation Buttons */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous certificate"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-white/90 dark:bg-[#111A2E]/90 hover:bg-white dark:hover:bg-[#111A2E] border border-slate-300 dark:border-slate-700/80 text-[#0B1220] dark:text-[#E8EEF7] hover:border-[#2F6BFF] hover:text-[#2F6BFF] dark:hover:text-[#457DFF] shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] z-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next certificate"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-white/90 dark:bg-[#111A2E]/90 hover:bg-white dark:hover:bg-[#111A2E] border border-slate-300 dark:border-slate-700/80 text-[#0B1220] dark:text-[#E8EEF7] hover:border-[#2F6BFF] hover:text-[#2F6BFF] dark:hover:text-[#457DFF] shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] z-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* REAL MOUSE SCROLLING HINT & DYNAMIC STEP TRACKER */}
        <div className="mt-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 max-w-3xl mx-auto w-full font-mono text-xs text-slate-600 dark:text-[#94A3B8]">
          <div className="inline-flex items-center gap-2">
            <MousePointer2 className="w-3.5 h-3.5 text-[#2F6BFF] dark:text-[#457DFF]" aria-hidden="true" />
            <span>
              {isScrolling
                ? "Scrolling 3D loop... Pause to broaden certificate"
                : "Scroll mouse wheel to spin 3D loop • Stops to broaden"}
            </span>
          </div>

          {/* Active Step Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[#2F6BFF] dark:text-[#457DFF] font-bold">
              0{activeIndex + 1}
            </span>
            <span>/</span>
            <span>0{N}</span>
          </div>
        </div>

        {/* BOTTOM METADATA / ACTION BAR */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCert.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-300 dark:border-slate-700/80 shadow-md space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[rgba(47,107,255,0.1)] text-[#1F5AE6] dark:text-[#457DFF] font-semibold uppercase tracking-wider">
                  {activeCert.category}
                </span>
                {activeCert.date && (
                  <span className="text-slate-500 dark:text-[#94A3B8] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeCert.date}</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-headline font-black text-xl sm:text-2xl text-[#0B1220] dark:text-[#E8EEF7] tracking-tight">
                  {activeCert.title}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold mt-0.5">
                  {activeCert.issuer}
                </p>
              </div>

              {activeCert.description && (
                <p className="text-xs sm:text-sm text-slate-700 dark:text-[#CBD5E1] leading-relaxed">
                  {activeCert.description}
                </p>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 dark:text-[#64748B]">
                  {isExpanded ? "Broadened view active" : "Aligning document..."}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const btnEl = cardTriggerRefs.current.get(activeCert.id);
                    onOpenModal(activeCert, btnEl || null);
                  }}
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
