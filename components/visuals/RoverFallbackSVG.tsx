import React from "react";

export function RoverFallbackSVG({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full aspect-square max-w-[420px] mx-auto flex flex-col items-center justify-center p-6 bg-[#0B1220]/80 rounded-2xl border border-[rgba(47,107,255,0.2)] font-mono ${className}`}
    >
      {/* Background blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none rounded-2xl"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2F6BFF 1px, transparent 1px),
            linear-gradient(to bottom, #2F6BFF 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Isometric Rover Wireframe Vector */}
      <svg
        viewBox="0 0 300 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_0_15px_rgba(47,107,255,0.2)]"
        aria-hidden="true"
      >
        {/* Chassis Isometric Hexagon/Box */}
        <polygon
          points="150,50 230,95 230,135 150,180 70,135 70,95"
          stroke="#457DFF"
          strokeWidth="1.5"
          fill="rgba(47, 107, 255, 0.06)"
        />
        <line x1="150" y1="50" x2="150" y2="180" stroke="#457DFF" strokeWidth="1.2" strokeDasharray="3 3" />
        <line x1="70" y1="95" x2="150" y2="140" stroke="#457DFF" strokeWidth="1.2" />
        <line x1="230" y1="95" x2="150" y2="140" stroke="#457DFF" strokeWidth="1.2" />

        {/* Electronics Bay / Microcontroller Riser */}
        <polygon
          points="150,30 195,55 195,75 150,95 105,75 105,55"
          stroke="#E8EEF7"
          strokeWidth="1.5"
          fill="rgba(232, 238, 247, 0.1)"
        />
        <line x1="150" y1="30" x2="150" y2="95" stroke="#E8EEF7" strokeWidth="1" />

        {/* Antenna / Telemetry Mast */}
        <line x1="150" y1="30" x2="150" y2="10" stroke="#FF7A59" strokeWidth="2" />
        <circle cx="150" cy="10" r="3" fill="#FF7A59" />

        {/* 4 Mecanum Wheels (Front-Left, Front-Right, Rear-Left, Rear-Right) */}
        {/* Left-Front Wheel */}
        <ellipse cx="60" cy="100" rx="14" ry="24" stroke="#E8EEF7" strokeWidth="1.5" fill="rgba(11, 18, 32, 0.8)" />
        <line x1="50" y1="85" x2="70" y2="115" stroke="#2F6BFF" strokeWidth="1.2" />
        <line x1="50" y1="95" x2="70" y2="125" stroke="#2F6BFF" strokeWidth="1.2" />

        {/* Left-Rear Wheel */}
        <ellipse cx="60" cy="145" rx="14" ry="24" stroke="#E8EEF7" strokeWidth="1.5" fill="rgba(11, 18, 32, 0.8)" />
        <line x1="50" y1="130" x2="70" y2="160" stroke="#2F6BFF" strokeWidth="1.2" />
        <line x1="50" y1="140" x2="70" y2="170" stroke="#2F6BFF" strokeWidth="1.2" />

        {/* Right-Front Wheel */}
        <ellipse cx="240" cy="100" rx="14" ry="24" stroke="#E8EEF7" strokeWidth="1.5" fill="rgba(11, 18, 32, 0.8)" />
        <line x1="230" y1="85" x2="250" y2="115" stroke="#2F6BFF" strokeWidth="1.2" />
        <line x1="230" y1="95" x2="250" y2="125" stroke="#2F6BFF" strokeWidth="1.2" />

        {/* Right-Rear Wheel */}
        <ellipse cx="240" cy="145" rx="14" ry="24" stroke="#E8EEF7" strokeWidth="1.5" fill="rgba(11, 18, 32, 0.8)" />
        <line x1="230" y1="130" x2="250" y2="160" stroke="#2F6BFF" strokeWidth="1.2" />
        <line x1="230" y1="140" x2="250" y2="170" stroke="#2F6BFF" strokeWidth="1.2" />

        {/* Ground Projection Shadows / Calibration ring */}
        <ellipse cx="150" cy="195" rx="100" ry="28" stroke="rgba(47, 107, 255, 0.25)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Required Illustrative Caption */}
      <div className="mt-3 text-center font-mono">
        <span className="text-[10px] text-[#94A3B8] tracking-wider block">
          Illustrative 3D model, not a photo of physical hardware
        </span>
      </div>
    </div>
  );
}
