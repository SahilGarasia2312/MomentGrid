"use client";

import React, { useState, useEffect } from "react";
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
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InteractiveCameraShowcase() {
  const [activeTab, setActiveTab] = useState("3d-lens"); // "3d-lens" | "live-gallery" | "telemetry"
  const [isCapturing, setIsCapturing] = useState(false);
  const [shutterCount, setShutterCount] = useState(4892);
  const [activeColorGrade, setActiveColorGrade] = useState("Sapphire LUT");
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const photos = [
    {
      id: 0,
      title: "Vogue Bridal Editorial #402",
      client: "Elena & Marcus Vance",
      category: "LUXURY BRIDAL",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      exif: "Canon EOS R5 • 85mm f/1.2L • ISO 100 • 1/4000s",
      colorGrade: "Sapphire Graded",
      size: "48.2 MP ProRAW",
    },
    {
      id: 1,
      title: "Milan Fashion Week Runway #119",
      client: "Atelier Royale Milan",
      category: "EDITORIAL",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
      exif: "Sony A1 • 70-200mm f/2.8 GM • ISO 400 • 1/2000s",
      colorGrade: "Golden Hour LUT",
      size: "50.1 MP ProRAW",
    },
    {
      id: 2,
      title: "Lake Como Sunset Vows #808",
      client: "Villa d'Este Wedding",
      category: "DESTINATION",
      image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
      exif: "Leica M11 • 35mm f/1.4 Summilux • ISO 64 • 1/1000s",
      colorGrade: "Diamond Noir LUT",
      size: "60.3 MP ProRAW",
    },
    {
      id: 3,
      title: "Met Gala Private Portrait #204",
      client: "Vogue Collective",
      category: "STUDIO PORTRAIT",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      exif: "Hasselblad X2D • 90mm f/2.5 • ISO 100 • 1/500s",
      colorGrade: "Sapphire Graded",
      size: "100 MP 16-Bit RAW",
    },
  ];

  const handleTriggerShutter = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setShutterCount((prev) => prev + 1);
    setTimeout(() => {
      setIsCapturing(false);
    }, 650);
  };

  return (
    <div className="relative flex justify-center lg:justify-end items-center mt-4 lg:mt-0 w-full">
      {/* ── Background Halo & Aurora Glows ───────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/15 via-[#234F60]/15 to-transparent rounded-3xl blur-3xl" aria-hidden="true" />
      
      {/* ── Simulated Camera Flash Strobe Overlay ─────────────────────────── */}
      {isCapturing && (
        <div className="absolute inset-0 z-50 rounded-3xl bg-white/80 dark:bg-white/90 backdrop-blur-md animate-pulse flex items-center justify-center transition-opacity duration-300">
          <div className="text-center px-6 py-4 rounded-2xl bg-[#121111] text-white shadow-2xl border border-brand-primary/60 scale-110 transition-transform">
            <Sparkles className="w-8 h-8 text-[#D4A052] mx-auto mb-2 animate-spin" />
            <p className="font-display font-bold text-lg tracking-wide">SHUTTER CAPTURED!</p>
            <p className="font-mono text-xs text-[#D4A052] mt-1">48.2 MP ProRAW • Synced to Studio Cloud in 0.18s</p>
          </div>
        </div>
      )}

      {/* ── Main Interactive 3D Camera & Photoshoot Card ─────────────────── */}
      <div className="relative w-full max-w-lg xl:max-w-xl rounded-3xl border border-borderColor bg-surface-1/95 dark:bg-[#121111]/90 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl ring-1 ring-borderColor/60 transition-all duration-300 overflow-hidden">
        
        {/* Top Camera HUD Telemetry Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-borderColor mb-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4A052]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#234F60]" />
            </div>
            <span className="font-mono text-[11px] font-bold text-textPalette-primary ml-2 tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#D4A052]" /> STUDIO 3D LENS OS v2.4
            </span>
          </div>

          {/* Interactive Mode Switcher Tabs */}
          <div className="flex items-center bg-surface-0 border border-borderColor rounded-xl p-1 shadow-inner gap-1 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab("3d-lens")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                activeTab === "3d-lens"
                  ? "bg-gradient-to-r from-brand-primary to-[#E5B873] text-[#121111] shadow-md"
                  : "text-textPalette-secondary hover:text-textPalette-primary"
              }`}
            >
              <Aperture className="w-3.5 h-3.5" /> 3D Lens View
            </button>
            <button
              onClick={() => setActiveTab("live-gallery")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                activeTab === "live-gallery"
                  ? "bg-gradient-to-r from-brand-primary to-[#E5B873] text-[#121111] shadow-md"
                  : "text-textPalette-secondary hover:text-textPalette-primary"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Photoshoot Grid
            </button>
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                activeTab === "telemetry"
                  ? "bg-gradient-to-r from-brand-primary to-[#E5B873] text-[#121111] shadow-md"
                  : "text-textPalette-secondary hover:text-textPalette-primary"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> AI LUT Studio
            </button>
          </div>
        </div>

        {/* ── TAB 1: 3D LENS & APERTURE CORE WITH FLOATING PHOTOS ────────── */}
        {activeTab === "3d-lens" && (
          <div className="space-y-5 animate-fade-in">
            {/* 3D Rotating Lens Showcase Container */}
            <div className="relative h-64 sm:h-72 rounded-2xl bg-gradient-to-br from-[#121111] via-[#1D262B] to-[#234F60] border border-brand-primary/40 flex items-center justify-center overflow-hidden shadow-2xl group">
              
              {/* Background Focal Grid & Telemetry Lines */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #D4A052 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Floating Photoshoot Preview Card (Behind Left) */}
              <div className="absolute -left-6 sm:left-4 top-4 w-40 sm:w-44 rounded-xl overflow-hidden border-2 border-[#D4A052]/50 shadow-2xl transform -rotate-12 group-hover:-rotate-6 group-hover:scale-105 transition-all duration-700 z-10 bg-[#121111]">
                <div className="relative h-28">
                  <img
                    src={photos[1].image}
                    alt={photos[1].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[#D4A052] text-[8px] font-mono font-bold">
                    85mm f/1.2
                  </div>
                </div>
                <div className="p-2 bg-[#1D262B] text-white">
                  <p className="text-[10px] font-bold truncate">{photos[1].title}</p>
                  <p className="text-[8px] text-[#D4A052] font-mono">MILAN RUNWAY RAW</p>
                </div>
              </div>

              {/* Floating Photoshoot Preview Card (Behind Right) */}
              <div className="absolute -right-6 sm:right-4 bottom-4 w-40 sm:w-44 rounded-xl overflow-hidden border-2 border-[#234F60]/60 shadow-2xl transform rotate-12 group-hover:rotate-6 group-hover:scale-105 transition-all duration-700 z-10 bg-[#121111]">
                <div className="relative h-28">
                  <img
                    src={photos[2].image}
                    alt={photos[2].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[#DFE6E6] text-[8px] font-mono font-bold">
                    35mm f/1.4
                  </div>
                </div>
                <div className="p-2 bg-[#1D262B] text-white">
                  <p className="text-[10px] font-bold truncate">{photos[2].title}</p>
                  <p className="text-[8px] text-[#DFE6E6] font-mono">LAKE COMO SUNSET</p>
                </div>
              </div>

              {/* Central 3D Camera Lens & Shutter Core */}
              <div
                onClick={handleTriggerShutter}
                className="relative z-20 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-[#121111] via-[#1D262B] to-[#0A0B0E] border-4 border-[#D4A052] shadow-[0_0_50px_rgba(212,160,82,0.4)] flex items-center justify-center cursor-pointer group hover:scale-110 transition-transform duration-500"
                title="Click to Trigger Shutter & Capture ProRAW"
              >
                {/* Rotating Outer Lens Ring */}
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#D4A052]/60 animate-[spin_20s_linear_infinite]" />
                
                {/* Rotating Inner Aperture Blade Ring */}
                <div className="absolute inset-5 rounded-full border border-dotted border-[#234F60] animate-[spin_12s_linear_infinite_reverse]" />

                {/* Center Glass Reflection & Aperture Blades */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#234F60] via-[#121111] to-[#E5B873]/40 border border-[#D4A052]/80 shadow-inner flex flex-col items-center justify-center text-center p-2 group-hover:border-white transition-colors">
                  <Aperture className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4A052] animate-pulse mb-1 group-hover:rotate-90 transition-transform duration-700" />
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-white uppercase">
                    f/1.2 • 85mm
                  </span>
                  <span className="font-mono text-[7px] text-[#D4A052] tracking-wider mt-0.5">
                    CLICK TO CAPTURE
                  </span>
                </div>
              </div>

              {/* Bottom Telemetry Overlay inside Lens Box */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-20">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ISO 100 • 1/8000s • 5600K
                </span>
                <span className="text-[#D4A052] font-bold">RAW 16-BIT</span>
              </div>
            </div>

            {/* Interactive Shutter Trigger & Counter Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface-0 border border-borderColor shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-[#E5B873] flex items-center justify-center text-[#121111] font-extrabold shadow-md">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-textPalette-primary">Studio Cloud Counter</p>
                    <Badge variant="gold" className="text-[9px] px-1.5 py-0">INSTANT SYNC</Badge>
                  </div>
                  <p className="font-mono text-sm font-extrabold text-[#234F60] dark:text-[#DFE6E6]">
                    {shutterCount.toLocaleString()} <span className="text-xs font-normal text-textPalette-secondary">ProRAW Files Captured</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleTriggerShutter}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary via-[#E5B873] to-brand-primary text-[#121111] font-display font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-glow-lg transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" /> Trigger Shutter Strobe
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 2: LIVE PHOTOSHOOT GRID & EXIF INSPECTOR ────────────────── */}
        {activeTab === "live-gallery" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-textPalette-primary">
              <span>Client Gallery Delivery Deck</span>
              <span className="text-[#D4A052] font-mono text-[11px]">Click Photo to Inspect EXIF →</span>
            </div>

            {/* Interactive 2x2 Photoshoot Grid */}
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.id)}
                  className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                    selectedPhoto === photo.id
                      ? "border-[#D4A052] shadow-glow scale-[1.02]"
                      : "border-borderColor hover:border-[#D4A052]/50 shadow-sm"
                  }`}
                >
                  <div className="relative h-32 sm:h-36">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[#D4A052] text-[9px] font-mono font-bold">
                      {photo.category}
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <p className="text-xs font-bold truncate">{photo.title}</p>
                      <p className="text-[10px] text-white/70 truncate">{photo.client}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Selected Photo Telemetry Box */}
            <div className="p-3.5 rounded-xl bg-surface-0 border border-borderColor shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs text-textPalette-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A052]" /> {photos[selectedPhoto].title}
                </span>
                <Badge variant="emerald" className="text-[10px]">{photos[selectedPhoto].colorGrade}</Badge>
              </div>
              <p className="font-mono text-[11px] text-textPalette-secondary bg-surface-1 p-2 rounded-lg border border-borderColor/60">
                EXIF: {photos[selectedPhoto].exif} • {photos[selectedPhoto].size}
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 3: AI LUT STUDIO & COLOR GRADING CONTROLLER ───────────── */}
        {activeTab === "telemetry" && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-surface-0 border border-borderColor space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-borderColor pb-2.5">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#D4A052]" />
                  <span className="font-display font-bold text-xs text-textPalette-primary">
                    Real-time AI LUT Color Grader
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#234F60] dark:text-[#DFE6E6] font-bold">
                  ⚡ GPU ACCELERATED
                </span>
              </div>

              <p className="text-xs text-textPalette-secondary leading-relaxed font-medium">
                Switch color grading profiles to see how MomentGrid automatically applies cinema-grade LUTs to multi-thousand RAW wedding galleries with zero latency:
              </p>

              {/* Color LUT Selector Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { name: "Golden Hour LUT", color: "from-[#E5B873] to-[#D4A052]", label: "GOLDEN" },
                  { name: "Sapphire LUT", color: "from-[#35677B] to-[#234F60]", label: "SAPPHIRE" },
                  { name: "Diamond Noir LUT", color: "from-[#121111] to-[#2E333D]", label: "DIAMOND" },
                ].map((lut) => (
                  <button
                    key={lut.name}
                    onClick={() => setActiveColorGrade(lut.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                      activeColorGrade === lut.name
                        ? "border-[#D4A052] shadow-md bg-surface-1"
                        : "border-borderColor bg-surface-0 hover:border-[#D4A052]/50"
                    }`}
                  >
                    <div className={`w-full h-4 rounded-md bg-gradient-to-r ${lut.color} shadow-sm`} />
                    <div className="mt-2">
                      <p className="text-[10px] font-bold text-textPalette-primary truncate">{lut.name}</p>
                      <span className="font-mono text-[8px] text-[#D4A052] font-semibold">{lut.label} ACTIVE</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Live Histogram Waveform Bars Simulation */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] text-textPalette-secondary mb-1.5 font-mono">
                  <span>LIVE HISTOGRAM ({activeColorGrade})</span>
                  <span>100% HIGHLIGHTS BALANCED</span>
                </div>
                <div className="flex items-end justify-between gap-1 h-12 bg-surface-1 p-2 rounded-lg border border-borderColor">
                  {[45, 65, 30, 80, 95, 70, 85, 60, 40, 75, 90, 55, 65, 80, 50].map((val, idx) => (
                    <div
                      key={idx}
                      className="w-full bg-gradient-to-t from-brand-primary to-[#234F60] rounded-t transition-all duration-500 animate-pulse"
                      style={{ height: `${val}%`, animationDelay: `${idx * 0.08}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Instant Delivery Simulation Box */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#234F60]/15 via-surface-0 to-[#D4A052]/15 border border-borderColor shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-textPalette-primary">Client Portal Delivery Ready</p>
                  <p className="text-[10px] text-textPalette-secondary">Zero compression • Watermarked • Password Protected</p>
                </div>
              </div>
              <Badge variant="gold" className="text-[10px] shrink-0">4K PRO READY</Badge>
            </div>
          </div>
        )}

        {/* Bottom Status Footer Inside Showcase */}
        <div className="mt-4 pt-3 border-t border-borderColor/60 flex items-center justify-between text-[11px] text-textPalette-secondary font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#234F60] inline-block animate-ping" />
            Active Studio Connection: <strong className="text-textPalette-primary">Elena Rostova Studio</strong>
          </span>
          <span className="text-[#D4A052] font-bold hover:underline cursor-pointer">
            Explore 14-Day Free Trial →
          </span>
        </div>
      </div>

      {/* ── Floating Notification Chips (`Client Delivered` & `Exif Metadata`) ── */}
      <div className="absolute -top-5 right-0 sm:-top-6 sm:-right-4 z-30 rounded-xl bg-surface-0 dark:bg-[#121111] border border-borderColor p-3 shadow-2xl flex items-center gap-2.5 animate-float max-w-[220px]">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-textPalette-primary truncate">Album Downloaded</p>
          <p className="text-[10px] text-textPalette-secondary truncate">Vance Wedding • 480 ProRAW</p>
        </div>
      </div>

      <div
        className="absolute -bottom-5 left-0 sm:-bottom-6 sm:-left-4 z-30 rounded-xl bg-surface-0 dark:bg-[#121111] border border-borderColor p-3 shadow-2xl flex items-center gap-2.5 animate-float max-w-[230px]"
        style={{ animationDelay: "2.5s" }}
      >
        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
          <Camera className="w-4 h-4 text-[#D4A052]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-textPalette-primary">EXIF: 85mm f/1.2L</p>
          <p className="text-[10px] text-textPalette-secondary truncate">⚡ Shutter Speed: 1/8000s ProRAW</p>
        </div>
      </div>
    </div>
  );
}
