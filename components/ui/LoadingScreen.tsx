"use client";

import React, { useEffect, useState } from "react";

export function LoadingScreen() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("kv-visited") === "true") {
        const fastDismiss = setTimeout(() => setLoaded(true), 0);
        return () => clearTimeout(fastDismiss);
      }
      sessionStorage.setItem("kv-visited", "true");
    } catch {
      // Storage unavailable fallback
    }

    const handleDismiss = () => setLoaded(true);

    if (typeof document !== "undefined" && document.readyState === "complete") {
      const timer = setTimeout(handleDismiss, 200);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", handleDismiss);
      const fallback = setTimeout(handleDismiss, 800);
      return () => {
        window.removeEventListener("load", handleDismiss);
        clearTimeout(fallback);
      };
    }
  }, []);

  if (loaded) return null;

  return (
    <>
      {/* Hide completely if JavaScript is disabled */}
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: "#loading-screen { display: none !important; }" }} />
      </noscript>

      <aside
        id="loading-screen"
        aria-label="Loading portfolio"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B1220] text-[#E8EEF7] transition-opacity duration-500 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="font-headline font-black text-3xl tracking-tight flex items-center gap-2">
            <span>KV</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A59] animate-pulse" />
          </div>
          <div className="w-24 h-0.5 bg-[#111A2E] overflow-hidden rounded-full">
            <div className="w-full h-full bg-[#2F6BFF] origin-left animate-[loading_0.8s_ease-in-out_infinite]" />
          </div>
          <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-widest">
            INITIALIZING
          </span>
        </div>
      </aside>
    </>
  );
}
