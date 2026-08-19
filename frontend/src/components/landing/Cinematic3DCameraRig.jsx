"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Aperture,
  Sparkles,
  CheckCircle2,
  Star,
  Sliders,
  Download,
  Share2,
  Eye,
  Layers,
  Zap,
  RefreshCw,
  Image as ImageIcon,
  Rotate3d,
  Play,
  Pause,
  Maximize2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Cinematic3DCameraRig() {
  // 3D Scene Rotation & Parallax States
  const [rotation, setRotation] = useState({ x: 12, y: -18 });
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [shutterCount, setShutterCount] = useState(4892);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [colorGrade, setColorGrade] = useState("SAPPHIRE LUT");
  const [isHovered, setIsHovered] = useState(false);
  const [ejectedPhoto, setEjectedPhoto] = useState(false);

  const containerRef = useRef(null);
  const requestRef = useRef(null);
  const autoRotateAngle = useRef(-18);

  // High-resolution luxury photography items floating in 3D orbit around the lens
  const photos = [
    {
      id: 0,
      title: "Vogue Bridal Editorial #402",
      client: "Elena & Marcus Vance",
      category: "LUXURY BRIDAL",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      exif: "85mm f/1.2L • ISO 100 • 1/4000s",
      pos3d: { x: -180, y: -70, z: 120, rotY: 22, rotZ: -6 },
    },
    {
      id: 1,
      title: "Milan Fashion Week Runway #119",
      client: "Atelier Royale Milan",
      category: "EDITORIAL",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
      exif: "70-200mm f/2.8 GM • ISO 400 • 1/2000s",
      pos3d: { x: 185, y: -60, z: 140, rotY: -24, rotZ: 8 },
    },
    {
      id: 2,
      title: "Lake Como Sunset Vows #808",
      client: "Villa d'Este Wedding",
      category: "DESTINATION",
      image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
      exif: "35mm f/1.4 Summilux • ISO 64 • 1/1000s",
      pos3d: { x: 160, y: 120, z: 90, rotY: -18, rotZ: -5 },
    },
    {
      id: 3,
      title: "Met Gala Private Portrait #204",
      client: "Vogue Collective",
      category: "STUDIO PORTRAIT",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      exif: "90mm f/2.5 X2D • ISO 100 • 1/500s",
      pos3d: { x: -165, y: 130, z: 100, rotY: 20, rotZ: 6 },
    },
  ];

  // Auto-Orbit Animation Loop in 3D
  useEffect(() => {
    const animate = () => {
      if (isAutoRotate && !isHovered) {
        autoRotateAngle.current += 0.35;
        setRotation((prev) => ({
          x: 12 + Math.sin(autoRotateAngle.current * 0.03) * 6,
          y: Math.sin(autoRotateAngle.current * 0.02) * 28 - 10,
        }));
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isAutoRotate, isHovered]);

  // Interactive Mouse Parallax 3D Orbit
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    setIsHovered(true);
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    setRotation({
      x: 12 - deltaY * 18,
      y: deltaX * 28,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleShutterCapture = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setShutterCount((prev) => prev + 1);
    setEjectedPhoto(true);

    setTimeout(() => {
      setActivePhotoIndex((prev) => (prev + 1) % photos.length);
    }, 300);

    setTimeout(() => {
      setIsCapturing(false);
      setEjectedPhoto(false);
    }, 800);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xl xl:max-w-2xl mx-auto mt-6 lg:mt-0">
      
      {/* ── Background Halo Aurora & Studio Light Orbs ───────────────────── */}
      <div className="absolute -inset-10 bg-gradient-to-tr from-brand-primary/20 via-[#234F60]/20 to-[#D4A052]/15 rounded-full blur-[110px] pointer-events-none" aria-hidden="true" />

      {/* ── Simulated Studio Flash Strobe Effect ─────────────────────────── */}
      {isCapturing && (
        <div className="absolute -inset-20 z-50 rounded-3xl bg-white/90 backdrop-blur-xl animate-pulse flex items-center justify-center pointer-events-none transition-all duration-300">
          <div className="px-6 py-4 rounded-2xl bg-[#121111] text-white shadow-2xl border-2 border-[#D4A052] scale-110 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-[#D4A052] animate-spin" />
            <div>
              <p className="font-display font-bold text-base tracking-wider">3D SHUTTER CAPTURED!</p>
              <p className="font-mono text-xs text-[#D4A052]">ProRAW 48.2 MP • Synced to Studio OS in 0.14s</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Control HUD Bar ─────────────────────────────────────────── */}
      <div className="w-full rounded-2xl border border-borderColor bg-surface-1/90 backdrop-blur-xl px-4 py-3 shadow-lg mb-4 flex flex-wrap items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4A052]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#234F60]" />
          </div>
          <span className="font-mono text-xs font-extrabold text-textPalette-primary ml-1 tracking-wider flex items-center gap-1.5">
            <Rotate3d className="w-4 h-4 text-[#D4A052] animate-spin-slow" /> 3D CAMERA & PHOTOSHOOT RIG
          </span>
        </div>

        {/* 3D Orbit & LUT Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAutoRotate
                ? "bg-brand-primary/20 text-[#D4A052] border border-[#D4A052]/40"
                : "bg-surface-0 border border-borderColor text-textPalette-secondary hover:text-textPalette-primary"
            }`}
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoRotate ? "Auto Orbit 3D" : "Paused Orbit"}
          </button>

          <div className="flex items-center bg-surface-0 border border-borderColor rounded-xl p-1 gap-1">
            {["GOLDEN", "SAPPHIRE", "DIAMOND"].map((lut) => (
              <button
                key={lut}
                onClick={() => setColorGrade(`${lut} LUT`)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  colorGrade.includes(lut)
                    ? "bg-gradient-to-r from-brand-primary to-[#E5B873] text-[#121111] shadow-sm"
                    : "text-textPalette-secondary hover:text-textPalette-primary"
                }`}
              >
                {lut}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3D PERSPECTIVE VIEWPORT ENGINE (`preserve-3d`) ───────────────── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => !isHovered && setIsAutoRotate(!isAutoRotate)}
        className="relative w-full h-[380px] sm:h-[440px] rounded-3xl border border-borderColor bg-surface-1/60 dark:bg-[#121111]/80 backdrop-blur-2xl overflow-hidden shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{
          perspective: "1600px",
        }}
        title="Move mouse to orbit 3D Camera & Photoshoot Rig"
      >
        {/* Background Grid & Studio Floor Reflection */}
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at center, #D4A052 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── 3D SCENE ROOT CONTAINER ───────────────────────────────────── */}
        <div
          className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          
          {/* ════════════════════════════════════════════════════════════════
             TRUE 3D CAMERA BODY & EXTRUDED LENS BARREL RIG
             ════════════════════════════════════════════════════════════════ */}
          <div
            className="absolute flex items-center justify-center group cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleShutterCapture();
            }}
          >
            {/* 1. Camera Body Backplate & Sensor Chassis (`translateZ(-30px)`) */}
            <div
              className="absolute w-52 h-36 sm:w-60 sm:h-40 rounded-3xl bg-gradient-to-br from-[#1D262B] via-[#121111] to-[#0D0F12] border-2 border-[#D4A052]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center"
              style={{
                transform: "translateZ(-30px)",
              }}
            >
              <div className="absolute top-2 left-4 text-[9px] font-mono text-[#D4A052] font-extrabold tracking-widest">
                MOMENTGRID STUDIO PRO OS
              </div>
              <div className="absolute top-2 right-4 flex items-center gap-1.5 text-[8px] font-mono text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> 4K 120FPS RAW
              </div>
            </div>

            {/* 2. Camera Grip & Top Mode Dial Controls (`translateZ(-10px)`) */}
            <div
              className="absolute w-48 h-32 sm:w-56 sm:h-36 rounded-2xl bg-[#14181D] border border-white/10 shadow-inner flex items-center justify-between px-4"
              style={{
                transform: "translateZ(-10px)",
              }}
            >
              {/* Left Grip Texture */}
              <div className="w-8 h-full bg-gradient-to-r from-black/40 to-transparent border-r border-white/5" />
              
              {/* Top Red Shutter Button Extrusion (`translateZ(40px)`) */}
              <div
                className="absolute -top-4 right-6 w-8 h-5 rounded-t-lg bg-gradient-to-t from-red-700 to-red-500 border border-red-400 shadow-lg flex items-center justify-center text-[7px] font-mono font-bold text-white uppercase tracking-tighter hover:scale-110 transition-transform"
                style={{
                  transform: "translateZ(30px)",
                }}
              >
                REC
              </div>
            </div>

            {/* 3. Outer Lens Barrel Base (`translateZ(15px)`) */}
            <div
              className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[#121111] via-[#234F60] to-[#1D262B] border-4 border-[#D4A052]/70 shadow-2xl flex items-center justify-center"
              style={{
                transform: "translateZ(15px)",
              }}
            >
              <span className="absolute -top-5 text-[9px] font-mono text-[#D4A052] font-extrabold tracking-[0.2em] bg-black/80 px-2 py-0.5 rounded-full border border-[#D4A052]/40">
                85mm f/1.2 PRIME LENS
              </span>
            </div>

            {/* 4. Mid Extruded Knurled Focus Ring (`translateZ(45px)`) */}
            <div
              className="absolute w-36 h-36 sm:w-42 sm:h-42 rounded-full bg-gradient-to-br from-[#1F2930] via-[#121111] to-[#0A0C0E] border-2 border-dashed border-[#D4A052]/80 flex items-center justify-center animate-[spin_25s_linear_infinite]"
              style={{
                transform: "translateZ(45px)",
              }}
            />

            {/* 5. Inner Rotating Aperture Blade Ring (`translateZ(75px)`) */}
            <div
              className="absolute w-28 h-28 sm:w-34 sm:h-34 rounded-full bg-gradient-to-tr from-[#0D0F12] via-[#234F60] to-[#121111] border-2 border-[#D4A052] shadow-inner flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]"
              style={{
                transform: "translateZ(75px)",
              }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dotted border-white/40" />
            </div>

            {/* 6. Front Lens Glass Element (`translateZ(105px)`) — Interactive Core */}
            <div
              className={`absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#234F60] via-[#121111] to-[#E5B873]/50 border-2 border-white/90 shadow-[0_0_35px_rgba(212,160,82,0.6)] flex flex-col items-center justify-center text-center p-2 transition-all duration-300 ${
                isCapturing ? "scale-90 border-red-500 bg-red-950/80" : "hover:scale-105"
              }`}
              style={{
                transform: "translateZ(105px)",
              }}
            >
              <Aperture className={`w-8 h-8 sm:w-10 sm:h-10 text-[#D4A052] transition-transform duration-500 ${
                isCapturing ? "rotate-180 scale-75 text-white" : "animate-pulse"
              }`} />
              <span className="font-mono text-[9px] sm:text-[10px] font-extrabold tracking-widest text-white uppercase mt-1">
                f/1.2 • 85mm
              </span>
              <span className="font-mono text-[7px] text-[#D4A052] tracking-wider mt-0.5 bg-black/60 px-1.5 py-0.5 rounded border border-[#D4A052]/40">
                🔴 CLICK LENS
              </span>
            </div>

            {/* 7. Ejecting 3D Photo Animation (`translateZ(150px)`) when Capturing */}
            {ejectedPhoto && (
              <div
                className="absolute w-36 h-28 rounded-xl bg-white border-2 border-[#D4A052] shadow-2xl p-1 animate-[bounce_0.6s_ease-out] z-50 flex flex-col justify-between overflow-hidden"
                style={{
                  transform: "translateZ(170px) rotateY(-10deg)",
                }}
              >
                <img
                  src={photos[activePhotoIndex].image}
                  alt="Captured"
                  className="w-full h-20 object-cover rounded-lg"
                />
                <div className="flex items-center justify-between px-1 text-[8px] font-mono font-bold text-[#121111]">
                  <span>48.2 MP RAW</span>
                  <span className="text-emerald-600">✓ SYNCED</span>
                </div>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════════════════════
             FLOATING 3D PHOTOSHOOT PRINTS & FILMSTRIPS IN 3D ORBIT
             ════════════════════════════════════════════════════════════════ */}
          {photos.map((photo, idx) => {
            const isActive = activePhotoIndex === idx;
            const p = photo.pos3d;
            return (
              <div
                key={photo.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex(idx);
                }}
                className={`absolute w-36 sm:w-44 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 shadow-2xl group ${
                  isActive
                    ? "border-[#D4A052] scale-110 shadow-[0_0_30px_rgba(212,160,82,0.5)] z-40 bg-[#121111]"
                    : "border-white/20 bg-[#121111]/90 hover:border-[#D4A052]/70 hover:scale-105 z-20"
                }`}
                style={{
                  transform: `translate3d(${p.x}px, ${p.y}px, ${isActive ? p.z + 40 : p.z}px) rotateY(${p.rotY}deg) rotateZ(${p.rotZ}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative h-24 sm:h-28 overflow-hidden">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category & Color LUT Badge */}
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[#D4A052] text-[8px] font-mono font-extrabold border border-[#D4A052]/40">
                    {photo.category} • {colorGrade.split(" ")[0]}
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold shadow-md animate-bounce">
                      ✓
                    </div>
                  )}

                  {/* Title */}
                  <div className="absolute bottom-1.5 left-2 right-2 text-white">
                    <p className="text-[11px] font-bold truncate leading-tight">{photo.title}</p>
                    <p className="text-[9px] text-[#DFE6E6] font-mono truncate">{photo.exif}</p>
                  </div>
                </div>

                {/* Bottom Polaroid/Frame Footer */}
                <div className="p-2 bg-[#1D262B] border-t border-white/10 flex items-center justify-between text-[8px] font-mono text-white/80">
                  <span className="truncate">{photo.client}</span>
                  <span className="text-[#D4A052] font-bold shrink-0">RAW Pro</span>
                </div>
              </div>
            );
          })}

          {/* ════════════════════════════════════════════════════════════════
             FLOATING 3D STUDIO TELEMETRY ORBS & LIGHT BOXES
             ════════════════════════════════════════════════════════════════ */}
          <div
            className="absolute -top-28 -left-32 sm:-left-40 px-3 py-2 rounded-xl bg-surface-0/90 dark:bg-[#121111]/90 backdrop-blur-md border border-borderColor shadow-xl flex items-center gap-2 pointer-events-none"
            style={{
              transform: "translate3d(0, 0, 140px) rotateY(-10deg)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div className="text-left font-mono">
              <p className="text-[10px] font-bold text-textPalette-primary">CLOUD GALLERY SYNC</p>
              <p className="text-[8px] text-textPalette-secondary">14,200 ProRAW • 2.4 GB/s Speed</p>
            </div>
          </div>

          <div
            className="absolute -bottom-28 -right-32 sm:-right-40 px-3 py-2 rounded-xl bg-surface-0/90 dark:bg-[#121111]/90 backdrop-blur-md border border-borderColor shadow-xl flex items-center gap-2 pointer-events-none"
            style={{
              transform: "translate3d(0, 0, 150px) rotateY(12deg)",
            }}
          >
            <Zap className="w-4 h-4 text-[#D4A052] shrink-0 animate-bounce" />
            <div className="text-left font-mono">
              <p className="text-[10px] font-bold text-textPalette-primary">ACTIVE COLOR GRADE</p>
              <p className="text-[8px] text-[#234F60] dark:text-[#DFE6E6] font-bold">{colorGrade} • GPU INSTANT</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Interactive Shutter Capture Bar ──────────────────────── */}
      <div className="w-full mt-4 rounded-2xl border border-borderColor bg-surface-0 px-4 py-3 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary via-[#E5B873] to-brand-primary flex items-center justify-center text-[#121111] font-extrabold shadow-md shrink-0">
            <Camera className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-textPalette-primary">Studio Shutter Cloud Counter</p>
              <Badge variant="gold" className="text-[9px] px-1.5 py-0">LIVE PRO</Badge>
            </div>
            <p className="font-mono text-sm font-extrabold text-[#234F60] dark:text-[#DFE6E6]">
              {shutterCount.toLocaleString()} <span className="text-xs font-normal text-textPalette-secondary">ProRAW Files Captured & Cloud Synced</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleShutterCapture}
          disabled={isCapturing}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-brand-primary via-[#E5B873] to-brand-primary text-[#121111] font-display font-extrabold text-xs tracking-wider uppercase shadow-lg hover:shadow-glow-lg active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Trigger 3D Shutter Strobe
        </button>
      </div>
    </div>
  );
}
