"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RoverModelProps {
  pointer: { x: number; y: number };
}

function RoverModel({ pointer }: RoverModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Reusable materials disposed cleanly on unmount
  const { chassisMat, wheelMat, accentMat, rollerMat } = useMemo(() => {
    return {
      chassisMat: new THREE.MeshBasicMaterial({
        color: 0x2f6bff,
        wireframe: true,
      }),
      wheelMat: new THREE.MeshBasicMaterial({
        color: 0xe8eef7,
        wireframe: true,
      }),
      accentMat: new THREE.MeshBasicMaterial({
        color: 0xff7a59,
        wireframe: true,
      }),
      rollerMat: new THREE.MeshBasicMaterial({
        color: 0x457dff,
        wireframe: true,
      }),
    };
  }, []);

  // Dispose materials on unmount
  useEffect(() => {
    return () => {
      chassisMat.dispose();
      wheelMat.dispose();
      accentMat.dispose();
      rollerMat.dispose();
    };
  }, [chassisMat, wheelMat, accentMat, rollerMat]);

  // Gentle cursor reaction & continuous slow turntable rotation
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Gentle base turntable rotation
    groupRef.current.rotation.y += delta * 0.35;

    // Subtle cursor parallax response
    const targetRotX = pointer.y * 0.25;
    const targetRotZ = -pointer.x * 0.2;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotZ,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Main Chassis Box */}
      <mesh material={chassisMat} position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.45, 1.4]} />
      </mesh>

      {/* 2. Microcontroller / Electronics Riser (Arduino & ESP Bay) */}
      <mesh material={wheelMat} position={[0, 0.35, 0]}>
        <boxGeometry args={[1.2, 0.3, 0.9]} />
      </mesh>

      {/* 3. RF Transceiver / Antenna Mast */}
      <mesh material={accentMat} position={[0.4, 0.75, 0.3]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 6]} />
      </mesh>

      {/* 4. Four Mecanum Wheels with Angled Rollers */}
      {/* Front-Left */}
      <group position={[-1.15, -0.15, 0.85]}>
        <mesh material={wheelMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 10]} />
        </mesh>
        <mesh material={rollerMat} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.42, 0.42, 0.32]} />
        </mesh>
      </group>

      {/* Front-Right */}
      <group position={[1.15, -0.15, 0.85]}>
        <mesh material={wheelMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 10]} />
        </mesh>
        <mesh material={rollerMat} rotation={[-Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.42, 0.42, 0.32]} />
        </mesh>
      </group>

      {/* Rear-Left */}
      <group position={[-1.15, -0.15, -0.85]}>
        <mesh material={wheelMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 10]} />
        </mesh>
        <mesh material={rollerMat} rotation={[-Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.42, 0.42, 0.32]} />
        </mesh>
      </group>

      {/* Rear-Right */}
      <group position={[1.15, -0.15, -0.85]}>
        <mesh material={wheelMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 10]} />
        </mesh>
        <mesh material={rollerMat} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.42, 0.42, 0.32]} />
        </mesh>
      </group>

      {/* Ground Projection Calibration Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]} material={chassisMat}>
        <ringGeometry args={[1.5, 1.55, 32]} />
      </mesh>
    </group>
  );
}

interface RoverCanvasProps {
  onContextLost?: () => void;
}

export function RoverCanvas({ onContextLost }: RoverCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  // Track mouse coordinates over the hero/canvas area
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setPointer({ x, y });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Performance rule: Pause rendering when off-screen or tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[440px] mx-auto select-none"
    >
      <Canvas
        camera={{ position: [3.5, 2.5, 3.8], fov: 42 }}
        dpr={[1, 1.5]} // Cap pixel ratio at 1.5
        frameloop={isVisible ? "always" : "never"} // Pause rendering when off-screen
        gl={{
          antialias: true,
          powerPreference: "low-power",
          alpha: true,
        }}
        onCreated={({ gl }) => {
          const domCanvas = gl.domElement;
          const handleContextLost = (e: Event) => {
            e.preventDefault();
            onContextLost?.();
          };
          domCanvas.addEventListener("webglcontextlost", handleContextLost);
        }}
        className="w-full h-full"
      >
        <RoverModel pointer={pointer} />
      </Canvas>

      {/* Required Illustrative Model Caption */}
      <div className="text-center font-mono mt-1">
        <span className="text-[10px] text-[#94A3B8] tracking-wider block">
          Illustrative 3D model, not a photo of physical hardware
        </span>
      </div>
    </div>
  );
}
