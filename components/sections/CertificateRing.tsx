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
  // Center active card index (0..N-1)
  const [activeIndex, setActiveIndex] = useState(0);
  // Whether the carousel is currently in motion
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
  const targetAngleRef = useRef(0);
  const targetStepRef = useRef(0);
  const activeIndexRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const animStartTimeRef = useRef(0);
  const animStartAngleRef = useRef(0);
  const animDurationRef = useRef(850);
  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Wheel cooldown lock: ensures 1 notch triggers exactly 1 smooth card step without runaway speed
  const lastWheelTimeRef = useRef(0);
  const isTransitioningRef = useRef(false);

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

  // INCREASED FIELD OF VIEW & RADIUS:
  // Expands the 3D cylinder so cards have generous breathing room and never look packed
  const radius = Math.max(460, Math.round((290 / 2) / Math.tan(Math.PI / N) * 1.52));

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

  // CALIBRATED MAJESTIC S-CURVE TRANSITION (850ms duration):
  // Steady, clearly observable pace with zero jumpiness
  const startCinematicAnimation = useCallback(
    (customDuration?: number) => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (shouldReduceMotion) {
        rotationRef.current = targetAngleRef.current;
        updateDomRotation(targetAngleRef.current);
        setRotation(targetAngleRef.current);
        setIsScrolling(false);
        setIsExpanded(true);
        isTransitioningRef.current = false;
        return;
      }

      isTransitioningRef.current = true;
      animStartAngleRef.current = rotationRef.current;
      animStartTimeRef.current = performance.now();
      animDurationRef.current = customDuration || 850;

      const animateLoop = (now: number) => {
        const elapsed = now - animStartTimeRef.current;
        const progress = Math.min(1, elapsed / animDurationRef.current);

        // Smooth easeInOutCubic: gentle start, steady visible glide, graceful deceleration
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const current =
          animStartAngleRef.current +
          (targetAngleRef.current - animStartAngleRef.current) * eased;

        rotationRef.current = current;
        updateDomRotation(current);

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animateLoop);
        } else {
          // Settled on target
          rotationRef.current = targetAngleRef.current;
          updateDomRotation(targetAngleRef.current);
          setRotation(targetAngleRef.current);
          rafIdRef.current = null;
          setIsScrolling(false);
          isTransitioningRef.current = false;

          // Sweet-spot settle pause (140ms) before gracefully expanding into broad view
          if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
          expandTimeoutRef.current = setTimeout(() => {
            setIsExpanded(true);
          }, 140);
        }
      };

      rafIdRef.current = requestAnimationFrame(animateLoop);
    },
    [shouldReduceMotion, updateDomRotation]
  );

  // Step certificate by integer increments (e.g. +1 or -1)
  const stepCertificate = useCallback(
    (stepDelta: number) => {
      setIsExpanded(false);
      setIsScrolling(true);

      targetStepRef.current += stepDelta;
      targetAngleRef.current = targetStepRef.current * stepAngle;

      startCinematicAnimation(850);
    },
    [stepAngle, startCinematicAnimation]
  );

  // Rotate directly to a specific card index
  const rotateToIndex = useCallback(
    (targetIndex: number) => {
      setIsExpanded(false);
      setIsScrolling(true);

      const current = rotationRef.current;
      const targetBase = -targetIndex * stepAngle;
      let relDiff = (targetBase - current) % 360;
      if (relDiff > 180) relDiff -= 360;
      if (relDiff < -180) relDiff += 360;

      const newTarget = current + relDiff;
      targetAngleRef.current = newTarget;
      targetStepRef.current = Math.round(newTarget / stepAngle);

      startCinematicAnimation(850);
    },
    [stepAngle, startCinematicAnimation]
  );

  // Navigation Chevrons
  const handlePrev = useCallback(() => {
    stepCertificate(1);
  }, [stepCertificate]);

  const handleNext = useCallback(() => {
    stepCertificate(-1);
  }, [stepCertificate]);

  // CALIBRATED MOUSE WHEEL ROTATION:
  // Strictly locks to 1 card step per wheel notch with cooldown to prevent runaway speed
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = performance.now();
      // Cooldown of 480ms: prevents multiple wheel ticks from a single flick from skipping multiple cards
      if (now - lastWheelTimeRef.current < 480) {
        return;
      }

      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      // Minimum delta threshold to ignore micro-jitters
      if (Math.abs(rawDelta) < 15) return;

      lastWheelTimeRef.current = now;

      if (rawDelta > 0) {
        stepCertificate(-1); // Downward scroll moves to next certificate
      } else {
        stepCertificate(1);  // Upward scroll moves to previous certificate
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [stepCertificate]);

  // Pointer Drag Handlers (Mouse Drag & Touch Flick)
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
        setIsExpanded(false);
        setIsScrolling(true);
      }
    }

    const rotDelta = deltaX * 0.24;
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
      // Calculate nearest target step from current position plus momentum flick
      const currentAngle = rotationRef.current + vel * 1.8;
      const nearestStep = Math.round(currentAngle / stepAngle);

      targetStepRef.current = nearestStep;
      targetAngleRef.current = nearestStep * stepAngle;
      startCinematicAnimation(800);
    }
  };

  // Keyboard Navigation
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

      {/* 3D CAROUSEL PERSPECTIVE STAGE */}
      <div className="w-full py-4 sm:py-6">
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-full h-[560px] sm:h-[620px] flex items-center justify-center overflow-hidden rounded-3xl transition-colors duration-300 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* EXPANDED 3D PERSPECTIVE VIEWPORT (Wide Field of View) */}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              perspective: "2100px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {/* Rotating 3D Cylinder Container */}
            <div
              ref={ringRef}
              className="relative w-[280px] sm:w-[300px] h-[400px] sm:h-[420px]"
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

                // Generous Depth & Opacity Scaling for Spacious Visual Hierarchy
                const depthScale = isCentred
                  ? isBroadened
                    ? 1.05
                    : 1.0
                  : stepDiff === 1
                  ? 0.86
                  : 0.72;

                const depthOpacity = isCentred
                  ? 1
                  : stepDiff === 1
                  ? 0.52
                  : 0.16;

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
                    className={`absolute top-0 rounded-2xl flex flex-col justify-between transition-[width,left,transform,opacity,box-shadow,border-color,background-color] duration-500 sm:duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                      isBroadened
                        ? "w-[350px] xs:w-[420px] sm:w-[500px] md:w-[540px] -left-[35px] xs:-left-[60px] sm:-left-[100px] md:-left-[120px] p-6 sm:p-7 z-30"
                        : "w-[280px] sm:w-[300px] left-0 p-5 z-10"
                    } ${
                      /* Subtle custom border bridging UI colors and white certificate */
                      isCentred
                        ? "bg-white dark:bg-[#0f172a] text-[#0B1220] dark:text-[#E8EEF7] border-2 border-[#2F6BFF] ring-4 ring-[#457DFF]/25 shadow-[0_20px_60px_rgba(47,107,255,0.32)]"
                        : "bg-white/95 dark:bg-[#111A2E]/95 text-[#334155] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#334155]/80 hover:border-[#2F6BFF]/60 shadow-lg hover:shadow-xl"
                    }`}
                    style={{
                      height: "420px",
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
                          className={`relative w-full rounded-xl overflow-hidden bg-white dark:bg-slate-950 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-inner ${
                            /* Subtle border between UI and white certificate */
                            "border border-[#E2E8F0] dark:border-slate-700/80"
                          } ${isBroadened ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                        >
                          <Image
                            src={cardImg}
                            alt={`${cert.title} preview`}
                            fill
                            sizes="(max-width: 768px) 320px, 540px"
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
                          className={`w-full rounded-xl border border-dashed border-[#CBD5E1] dark:border-slate-700 flex flex-col items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-900/60 text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                            transition={{ duration: 0.25 }}
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

        {/* CALIBRATED SCROLLING HINT & STEP TRACKER */}
        <div className="mt-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 max-w-3xl mx-auto w-full font-mono text-xs text-slate-600 dark:text-[#94A3B8]">
          <div className="inline-flex items-center gap-2">
            <MousePointer2 className="w-3.5 h-3.5 text-[#2F6BFF] dark:text-[#457DFF]" aria-hidden="true" />
            <span>
              {isScrolling
                ? "Gliding to certificate..."
                : "1 mouse notch switches certificate • Stops to broaden"}
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
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
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
