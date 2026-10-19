"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { CertificateItem } from "@/data/certificates";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Award, ExternalLink, Calendar, MousePointer2 } from "lucide-react";

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
  const [isActive, setIsActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true);

  // Fallback active index for mobile swipe row
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const swipeRowRef = useRef<HTMLDivElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Animation frame and inertia refs
  const rafIdRef = useRef<number | null>(null);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const dragStartRef = useRef({ x: 0, rot: 0, time: 0, lastX: 0, lastTime: 0, velocity: 0 });
  const wheelDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const N = Math.max(1, certificates.length);
  const stepAngle = 360 / N;
  // Radius calculation: keeps 3+ cards circular and comfortably spaced without collision
  const radius = Math.max(340, Math.round((280 / 2) / Math.tan(Math.PI / N) * 1.05));

  // Determine active index from rotation on desktop
  const activeIndexDesktop = (Math.round(-rotation / stepAngle) % N + N) % N;
  const activeIndex = isDesktop && !shouldReduceMotion ? activeIndexDesktop : mobileActiveIndex;
  const activeCert = certificates[activeIndex] || certificates[0];

  // Sync ref with rotation state
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // Responsive breakpoint check: desktop is >= 1024px
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // IntersectionObserver to pause processing when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Smooth spring animation to target rotation
  const animateToTarget = useCallback((targetAngle: number, immediate = false) => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    targetRotationRef.current = targetAngle;

    if (immediate || shouldReduceMotion) {
      rotationRef.current = targetAngle;
      setRotation(targetAngle);
      return;
    }

    const springStep = () => {
      const current = rotationRef.current;
      const target = targetRotationRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.05) {
        rotationRef.current = target;
        setRotation(target);
        rafIdRef.current = null;
        return;
      }

      // Spring damping interpolation
      const next = current + diff * 0.18;
      rotationRef.current = next;
      setRotation(next);
      rafIdRef.current = requestAnimationFrame(springStep);
    };

    rafIdRef.current = requestAnimationFrame(springStep);
  }, [shouldReduceMotion]);

  // Snap to nearest card
  const snapToNearest = useCallback(() => {
    const current = rotationRef.current;
    const nearestIndex = Math.round(current / stepAngle);
    const target = nearestIndex * stepAngle;
    animateToTarget(target);
  }, [stepAngle, animateToTarget]);

  // Rotate to specific card index
  const rotateToIndex = useCallback((index: number) => {
    const current = rotationRef.current;
    const baseAngle = index * stepAngle;
    let relAngle = (baseAngle + current) % 360;
    if (relAngle > 180) relAngle -= 360;
    if (relAngle < -180) relAngle += 360;
    animateToTarget(current - relAngle);
  }, [stepAngle, animateToTarget]);

  // Step left/right navigation
  const handlePrev = useCallback(() => {
    const current = targetRotationRef.current || rotationRef.current;
    const target = Math.round(current / stepAngle) * stepAngle + stepAngle;
    animateToTarget(target);
  }, [stepAngle, animateToTarget]);

  const handleNext = useCallback(() => {
    const current = targetRotationRef.current || rotationRef.current;
    const target = Math.round(current / stepAngle) * stepAngle - stepAngle;
    animateToTarget(target);
  }, [stepAngle, animateToTarget]);

  // Wheel interaction handling
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isDesktop || shouldReduceMotion) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isIntersecting) return;

      const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;

      if (isHorizontalScroll) {
        // Trackpad horizontal scroll or Shift + wheel
        const delta = e.shiftKey ? e.deltaY : e.deltaX;
        if (Math.abs(delta) > 1.5) {
          e.preventDefault();
          if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
          const next = rotationRef.current - delta * 0.28;
          rotationRef.current = next;
          setRotation(next);

          if (wheelDebounceRef.current) clearTimeout(wheelDebounceRef.current);
          wheelDebounceRef.current = setTimeout(snapToNearest, 120);
        }
        return;
      }

      // Vertical wheel: preventDefault and spin ONLY when active
      if (isActive) {
        e.preventDefault();
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        const next = rotationRef.current - e.deltaY * 0.24;
        rotationRef.current = next;
        setRotation(next);

        if (wheelDebounceRef.current) clearTimeout(wheelDebounceRef.current);
        wheelDebounceRef.current = setTimeout(snapToNearest, 120);
      }
      // When inactive: no preventDefault; page scrolls normally
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (wheelDebounceRef.current) clearTimeout(wheelDebounceRef.current);
    };
  }, [isDesktop, shouldReduceMotion, isIntersecting, isActive, snapToNearest]);

  // Deactivation on click outside
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isActive]);

  // Keyboard navigation & activation / deactivation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsActive(false);
      return;
    }

    if (!isActive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setIsActive(true);
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Pointer drag handling on 3D ring
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDesktop || shouldReduceMotion) return;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      rot: rotationRef.current,
      time: performance.now(),
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore in environments where setPointerCapture fails
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const now = performance.now();
    const dt = Math.max(1, now - dragStartRef.current.lastTime);
    const dx = e.clientX - dragStartRef.current.lastX;
    const velocity = (dx / dt) * 1000; // px/s

    dragStartRef.current.lastX = e.clientX;
    dragStartRef.current.lastTime = now;
    dragStartRef.current.velocity = velocity;

    const totalDeltaX = e.clientX - dragStartRef.current.x;
    const newRot = dragStartRef.current.rot + totalDeltaX * 0.35;
    rotationRef.current = newRot;
    setRotation(newRot);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Apply inertia if release velocity is high
    const v = dragStartRef.current.velocity;
    if (Math.abs(v) > 250) {
      const inertiaDelta = (v * 0.12) * 0.35;
      const target = Math.round((rotationRef.current + inertiaDelta) / stepAngle) * stepAngle;
      animateToTarget(target);
    } else {
      snapToNearest();
    }
  };

  // Mobile horizontal swipe snap tracking
  const handleMobileScroll = () => {
    const el = swipeRowRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 280;
    const index = Math.round(scrollLeft / cardWidth);
    if (index >= 0 && index < N && index !== mobileActiveIndex) {
      setMobileActiveIndex(index);
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
      aria-label="Certificates 3D Showcase"
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (!isActive && isDesktop && !shouldReduceMotion) {
          setIsActive(true);
        }
      }}
      onBlur={(e) => {
        // If focus leaves the container, deactivate
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setIsActive(false);
        }
      }}
      className={`relative w-full rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] ${
        isActive
          ? "ring-2 ring-[#2F6BFF] shadow-[0_0_35px_rgba(47,107,255,0.22)] bg-[rgba(47,107,255,0.02)]"
          : "hover:border-[#2F6BFF]/30"
      }`}
    >
      {/* Screen Reader Announcement for Centred Active Entry */}
      <div className="sr-only" aria-live="polite">
        Active certificate: {activeCert.title}, issued by {activeCert.issuer}.
      </div>

      {/* DESKTOP (>=1024px) 3D PERSPECTIVE RING */}
      {isDesktop && !shouldReduceMotion ? (
        <div className="relative w-full h-[520px] flex items-center justify-center select-none overflow-hidden">
          {/* 3D Perspective Stage */}
          <div
            className={`w-full h-full flex items-center justify-center ${
              isActive ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-pointer"
            }`}
            style={{
              perspective: "1250px",
              perspectiveOrigin: "50% 50%",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* The 3D Rotating Cylinder */}
            <div
              ref={ringRef}
              className="relative w-[300px] h-[380px] pointer-events-none"
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
                const scale = Math.max(0.78, 1 - progress * 0.22);
                const opacity = Math.max(0.25, 1 - progress * 0.75);

                const cardImg = getCardImage(cert);
                const isMedalCard = cert.id === "invent-core";

                return (
                  <div
                    key={cert.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(i, el);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isCentred) {
                        rotateToIndex(i);
                      } else if (!isActive) {
                        setIsActive(true);
                      }
                    }}
                    className={`absolute inset-0 rounded-2xl border pointer-events-auto p-5 flex flex-col justify-between transition-[opacity,box-shadow,border-color] duration-200 ${
                      isCentred
                        ? "bg-[#111A2E] text-[#E8EEF7] border-[#2F6BFF] shadow-2xl ring-1 ring-[#2F6BFF]/40 z-30"
                        : "bg-[#0B1220]/95 text-[#CBD5E1] border-[rgba(232,238,247,0.14)] shadow-md z-10"
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
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous certificate"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111A2E]/90 border border-[rgba(232,238,247,0.2)] text-[#E8EEF7] hover:border-[#2F6BFF] hover:text-[#457DFF] shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] z-40"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111A2E]/90 border border-[rgba(232,238,247,0.2)] text-[#E8EEF7] hover:border-[#2F6BFF] hover:text-[#457DFF] shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] z-40"
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
            const isSelected = idx === mobileActiveIndex;
            const cardImg = getCardImage(cert);

            return (
              <div
                key={cert.id}
                onClick={() => setMobileActiveIndex(idx)}
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

      {/* ACTIVATION HINT DIRECTLY BELOW THE RING */}
      <div className="mt-4 mb-8 flex justify-center px-4" aria-live="polite">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(11,18,32,0.1)] dark:border-[rgba(232,238,247,0.1)] bg-white/70 dark:bg-[#111A2E]/70 text-xs font-mono text-[rgba(11,18,32,0.65)] dark:text-[#94A3B8] shadow-sm">
          <MousePointer2 className="w-3.5 h-3.5 text-[#2F6BFF] dark:text-[#457DFF]" aria-hidden="true" />
          {!isDesktop || shouldReduceMotion ? (
            <span>Swipe to browse certificates</span>
          ) : (
            <AnimatePresence mode="wait">
              {isActive ? (
                <motion.span
                  key="active-hint"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#2F6BFF] dark:text-[#457DFF] font-medium"
                >
                  Carousel active. Scroll or drag to spin. Press Esc or click outside to release.
                </motion.span>
              ) : (
                <motion.span
                  key="inactive-hint"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  Click to activate the certificate carousel
                </motion.span>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* DESCRIPTION PANEL BELOW THE RING */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCert.id}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111A2E] border border-[rgba(11,18,32,0.12)] dark:border-[rgba(232,238,247,0.12)] shadow-md space-y-4"
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
              <h3 className="font-headline font-black text-2xl sm:text-3xl text-[#0B1220] dark:text-[#E8EEF7] tracking-tight">
                {activeCert.title}
              </h3>
              <p className="text-sm font-mono text-[#1F5AE6] dark:text-[#457DFF] font-semibold mt-1">
                {activeCert.issuer}
              </p>
            </div>

            {/* Description (rendered only if present) */}
            {activeCert.description && (
              <p className="text-sm sm:text-base text-[rgba(11,18,32,0.8)] dark:text-[#CBD5E1] leading-relaxed">
                {activeCert.description}
              </p>
            )}

            {/* CTA: Open Full Certificate Button (Does not auto-open) */}
            <div className="pt-3 border-t border-[rgba(11,18,32,0.08)] dark:border-[rgba(232,238,247,0.08)] flex items-center justify-between">
              <span className="text-xs font-mono text-[rgba(11,18,32,0.5)] dark:text-[#64748B]">
                Centred document record
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
  );
}
