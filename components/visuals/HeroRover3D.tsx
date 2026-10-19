"use client";

import React, { useState, useSyncExternalStore } from "react";
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

// Subscribe to media query changes (resizing across 1024px and reduced-motion changes)
function subscribeToViewport(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const desktopMedia = window.matchMedia("(min-width: 1024px)");
  const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

  desktopMedia.addEventListener("change", callback);
  motionMedia.addEventListener("change", callback);

  return () => {
    desktopMedia.removeEventListener("change", callback);
    motionMedia.removeEventListener("change", callback);
  };
}

// Client snapshot evaluation
function getViewportSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const hasWebGL = checkWebGLSupport();

  return isDesktop && !prefersReducedMotion && hasWebGL;
}

// Server snapshot for SSR hydration safety
function getServerSnapshot(): boolean {
  return false;
}

export function HeroRover3D({ className = "" }: { className?: string }) {
  const [contextLost, setContextLost] = useState(false);

  // Synchronize with external browser viewport and media queries without cascading renders
  const is3DAvailable = useSyncExternalStore(
    subscribeToViewport,
    getViewportSnapshot,
    getServerSnapshot
  );

  const shouldRender3D = is3DAvailable && !contextLost;

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
