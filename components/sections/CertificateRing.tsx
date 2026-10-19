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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true);

  // Fallback active index for mobile swipe row
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeRowRef = useRef<HTMLDivElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  // Physics and Animation Refs
  const rotationRef = useRef(0);
  const activeIndexRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const wheelDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Drag interaction tracking
  const hasDraggedRef = useRef(false);
  const dragStartRef = useRef({
    x: 0,
    y: 0,
    startRot: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  const N = Math.max(1, certificates.length);
  const stepAngle = 360 / N;
  // Adaptive radius: keeps cards comfortable, outward-facing, circular, and collision-free
  const radius = Math.max(340, Math.round((280 / 2) / Math.tan(Math.PI / N) * 1.12));

  // Determine current active certificate
  const currentActiveIndex = isDesktop && !shouldReduceMotion ? activeIndex : mobileActiveIndex;
  const activeCert = certificates[currentActiveIndex] || certificates[0];

  // Helper for Card Face image: Core Committee shows medal photo
  const getCardImage = (cert: CertificateItem) => {
    if (cert.id === "invent-core" && cert.extraImage) {
      return cert.extraImage;
    }
    return cert.image;
  };

  // Viewport breakpoint detection (desktop 3D ring is >= 768px for laptop & tablet support)
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // IntersectionObserver to pause processing when off-screen
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

  // Directly update DOM transform to prevent high-frequency React re-renders during drag/wheel
  const updateDomRotation = useCallback(
    (rotDeg: number) => {
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${rotDeg}deg)`;
      }

      // Calculate active card index
      const normalizedIndex = ((Math.round(-rotDeg / stepAngle) % N) + N) % N;
      if (normalizedIndex !== activeIndexRef.current) {
        activeIndexRef.current = normalizedIndex;
        setActiveIndex(normalizedIndex);
      }
    },
    [N, stepAngle]
  );

  // Smooth Spring Animation to target angle
  const animateToAngle = useCallback(
    (targetAngle: number, immediate = false) => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (immediate || shouldReduceMotion) {
        rotationRef.current = targetAngle;
        updateDomRotation(targetAngle);
        setRotation(targetAngle);
        return;
      }

      const springStep = () => {
        const current = rotationRef.current;
        const diff = targetAngle - current;

        if (Math.abs(diff) < 0.05) {
          rotationRef.current = targetAngle;
          updateDomRotation(targetAngle);
          setRotation(targetAngle);
          rafIdRef.current = null;
          return;
        }

        // Spring damping easing
        const next = current + diff * 0.16;
        rotationRef.current = next;
        updateDomRotation(next);
        rafIdRef.current = requestAnimationFrame(springStep);
      };

      rafIdRef.current = requestAnimationFrame(springStep);
    },
    [shouldReduceMotion, updateDomRotation]
  );

  // Snap to nearest card
  const snapToNearest = useCallback(() => {
    const current = rotationRef.current;
    const nearestStep = Math.round(current / stepAngle);
    const target = nearestStep * stepAngle;
    animateToAngle(target);
  }, [stepAngle, animateToAngle]);

  // Inertia coasting physics loop after drag release
  const startInertiaCoasting = useCallback(
    (initialVelocity: number) => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      let vel = initialVelocity;

      const inertiaStep = () => {
        rotationRef.current += vel;
        updateDomRotation(rotationRef.current);

        // Friction deceleration
        vel *= 0.92;

        if (Math.abs(vel) < 0.08) {
          // Coasting finished -> snap to nearest card
          snapToNearest();
          return;
        }

        rafIdRef.current = requestAnimationFrame(inertiaStep);
      };

      rafIdRef.current = requestAnimationFrame(inertiaStep);
    },
    [updateDomRotation, snapToNearest]
  );

  // Rotate smoothly to a specific card index (shortest angular distance)
  const rotateToIndex = useCallback(
    (targetIndex: number) => {
      const current = rotationRef.current;
      const targetBase = -targetIndex * stepAngle;
      let relDiff = (targetBase - current) % 360;
      if (relDiff > 180) relDiff -= 360;
      if (relDiff < -180) relDiff += 360;
      animateToAngle(current + relDiff);
    },
    [stepAngle, animateToAngle]
  );

  // Step Previous / Next
  const handlePrev = useCallback(() => {
    const current = Math.round(rotationRef.current / stepAngle) * stepAngle;
    animateToAngle(current + stepAngle);
  }, [stepAngle, animateToAngle]);

  const handleNext = useCallback(() => {
    const current = Math.round(rotationRef.current / stepAngle) * stepAngle;
    animateToAngle(current - stepAngle);
  }, [stepAngle, animateToAngle]);

  // Pointer Drag Handlers (Mouse / Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDesktop || shouldReduceMotion) return;
    if (e.button !== 0) return; // Only primary button

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    setIsDragging(true);
    hasDraggedRef.current = false;

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRot: rotationRef.current,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };

    if (stageRef.current) {
      stageRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isDesktop || shouldReduceMotion) return;

    const deltaX = e.clientX - dragStartRef.current.lastX;
    const totalDistX = Math.abs(e.clientX - dragStartRef.current.x);

    if (totalDistX > 5) {
      hasDraggedRef.current = true;
    }

    // Convert pixel delta to rotational degrees
    const rotDelta = deltaX * 0.32;
    rotationRef.current += rotDelta;
    updateDomRotation(rotationRef.current);

    const now = performance.now();
    const dt = now - dragStartRef.current.lastTime;
    if (dt > 0) {
      dragStartRef.current.velocity = (rotDelta / dt) * 16.67;
    }

    dragStartRef.current.lastX = e.clientX;
    dragStartRef.current.lastTime = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      if (stageRef.current && stageRef.current.hasPointerCapture(e.pointerId)) {
        stageRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore if capture was already lost
    }

    if (hasDraggedRef.current) {
      const vel = dragStartRef.current.velocity;
      if (Math.abs(vel) > 0.4) {
        startInertiaCoasting(vel * 0.85);
      } else {
        snapToNearest();
      }
    }
  };

  // Wheel handling:
  // - Trackpad horizontal scroll / Shift + wheel spins carousel with momentum
  // - Vertical wheel spins carousel ONLY when active, otherwise page scrolls normally
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !isDesktop || shouldReduceMotion) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isIntersecting) return;

      const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;

      if (isHorizontalScroll) {
        const delta = e.shiftKey ? e.deltaY : e.deltaX;
        if (Math.abs(delta) > 1.5) {
          e.preventDefault();
          if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

          rotationRef.current -= delta * 0.28;
          updateDomRotation(rotationRef.current);

          if (wheelDebounceRef.current) clearTimeout(wheelDebounceRef.current);
          wheelDebounceRef.current = setTimeout(snapToNearest, 130);
        }
        return;
      }

      // Vertical wheel: preventDefault and spin ONLY when active
      if (isActive) {
        e.preventDefault();
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

        rotationRef.current -= e.deltaY * 0.22;
        updateDomRotation(rotationRef.current);

        if (wheelDebounceRef.current) clearTimeout(wheelDebounceRef.current);
        wheelDebounceRef.current = setTimeout(snapToNearest, 130);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (wheelDebounceRef.current) clearTimeout(wheelDebounceRef.current);
    };
  }, [isDesktop, shouldReduceMotion, isIntersecting, isActive, snapToNearest, updateDomRotation]);

  // Click outside to deactivate
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

  // Keyboard navigation & activation
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

  // Mobile horizontal swipe snap tracking
  const handleMobileScroll = () => {
    const el = swipeRowRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 280;
    const index = Math.round(scrollLeft / cardWidth);
    if (index >= 0 && index < N && index !== mobileActiveIndex) {
      setMobileActiveIndex(index);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Certificates 3D Showcase"
      onKeyDown={handleKeyDown}
      className="relative w-full focus-visible:outline-none"
    >
      {/* Screen Reader Announcement for Centred Active Entry */}
      <div className="sr-only" aria-live="polite">
        Active certificate: {activeCert.title}, issued by {activeCert.issuer}.
      </div>

      {/* 3D CAROUSEL / MOBILE SWIPE STAGE */}
      <div className="w-full py-4">
        {isDesktop && !shouldReduceMotion ? (
          /* DESKTOP (>=768px) 3D PERSPECTIVE RING */
          <div
            ref={stageRef}
            onClick={() => {
              if (!isActive) setIsActive(true);
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative w-full h-[500px] flex items-center justify-center select-none overflow-hidden rounded-3xl transition-all duration-300 ${
              isActive
                ? "ring-2 ring-[#2F6BFF]/40 shadow-[0_0_40px_rgba(47,107,255,0.18)] cursor-grab active:cursor-grabbing bg-[rgba(11,18,32,0.03)] dark:bg-[rgba(232,238,247,0.02)]"
                : "cursor-pointer hover:ring-1 hover:ring-[rgba(47,107,255,0.25)]"
            }`}
          >
            {/* 3D Perspective Stage */}
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                perspective: "1250px",
                perspectiveOrigin: "50% 50%",
              }}
            >
              {/* Rotating Cylinder Driven Directly on GPU */}
              <div
                ref={ringRef}
                className="relative w-[280px] sm:w-[300px] h-[370px] sm:h-[390px]"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotation}deg)`,
                  willChange: "transform",
                }}
              >
                {certificates.map((cert, i) => {
                  const baseAngle = i * stepAngle;
                  const isCentred = i === activeIndex;

                  // Angular distance in steps to scale and fade side cards
                  let stepDiff = Math.abs(i - activeIndex);
                  if (stepDiff > N / 2) stepDiff = N - stepDiff;

                  const cardImg = getCardImage(cert);
                  const isMedalCard = cert.id === "invent-core";

                  // Scale & Opacity based on distance from front
                  const scale = isCentred ? 1.03 : stepDiff === 1 ? 0.94 : 0.85;
                  const opacity = isCentred ? 1 : stepDiff === 1 ? 0.65 : 0.28;

                  return (
                    <div
                      key={cert.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasDraggedRef.current) {
                          rotateToIndex(i);
                        }
                      }}
                      className={`absolute inset-0 rounded-2xl border p-5 flex flex-col justify-between transition-[opacity,transform,box-shadow,border-color,background-color] duration-250 ease-out ${
                        isCentred
                          ? "bg-[#111A2E] text-[#E8EEF7] border-[#2F6BFF] shadow-[0_12px_40px_rgba(47,107,255,0.3)] ring-2 ring-[#2F6BFF]/40 z-30"
                          : "bg-[#0B1220]/95 text-[#CBD5E1] border-[rgba(232,238,247,0.14)] shadow-md hover:border-[#2F6BFF]/40 hover:opacity-80 z-10"
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

                      {/* Card Face: Medal Photo or Document Preview or Program Icon */}
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
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111A2E]/90 hover:bg-[#111A2E] border border-[rgba(232,238,247,0.2)] text-[#E8EEF7] hover:border-[#2F6BFF] hover:text-[#457DFF] shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] z-40"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111A2E]/90 hover:bg-[#111A2E] border border-[rgba(232,238,247,0.2)] text-[#E8EEF7] hover:border-[#2F6BFF] hover:text-[#457DFF] shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] z-40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* MOBILE (<768px) & REDUCED MOTION: FLAT HORIZONTAL SWIPE ROW */
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
        <div className="mt-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 max-w-3xl mx-auto w-full font-mono text-xs text-[rgba(11,18,32,0.65)] dark:text-[#94A3B8]">
          <div className="inline-flex items-center gap-2" aria-live="polite">
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
                    transition={{ duration: 0.18 }}
                    className="text-[#2F6BFF] dark:text-[#457DFF] font-semibold"
                  >
                    Carousel active. Scroll or drag to spin. Press Esc or click outside to release.
                  </motion.span>
                ) : (
                  <motion.span
                    key="inactive-hint"
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, y: -3 }}
                    transition={{ duration: 0.18 }}
                  >
                    Click to activate the certificate carousel • Drag to spin
                  </motion.span>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Active Step Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[#2F6BFF] dark:text-[#457DFF] font-semibold">
              0{currentActiveIndex + 1}
            </span>
            <span>/</span>
            <span>0{N}</span>
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
