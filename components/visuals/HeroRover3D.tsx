"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RoverFallbackSVG } from "./RoverFallbackSVG";

// Dynamically import the 3D Canvas with ssr disabled
const DynamicRoverCanvas = dynamic(
  () => import("./RoverCanvas").then((mod) => mod.RoverCanvas),
  {
    ssr: false,
    loading: () => <RoverFallbackSVG />,
  }
);

// Check WebGL availability safely
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function HeroRover3D({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(checkWebGLSupport());

    const desktopMedia = window.matchMedia("(min-width: 1024px)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMediaMatches = () => {
      setIsDesktop(desktopMedia.matches);
      setPrefersReducedMotion(motionMedia.matches);
    };

    // Initial check
    updateMediaMatches();

    // Listen for resize and reduced-motion changes in both directions
    desktopMedia.addEventListener("change", updateMediaMatches);
    motionMedia.addEventListener("change", updateMediaMatches);

    return () => {
      desktopMedia.removeEventListener("change", updateMediaMatches);
      motionMedia.removeEventListener("change", updateMediaMatches);
    };
  }, []);

  // Show 3D scene only when mounted, desktop (>= 1024px), reduced motion is off, WebGL is supported, and context has not been lost
  const shouldRender3D =
    mounted && isDesktop && !prefersReducedMotion && hasWebGL && !contextLost;

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      {shouldRender3D ? (
        <DynamicRoverCanvas onContextLost={() => setContextLost(true)} />
      ) : (
        <RoverFallbackSVG />
      )}
    </div>
  );
}
