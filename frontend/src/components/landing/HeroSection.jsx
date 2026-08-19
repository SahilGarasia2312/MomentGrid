"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, Star, Camera, Sparkles, Image as ImageIcon, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import Cinematic3DCameraRig from "@/components/landing/Cinematic3DCameraRig";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen pt-24 pb-20 md:pt-32 md:pb-28 bg-surface-0 text-textPalette-primary overflow-hidden flex items-center transition-colors duration-300">
      
      {/* ── Background Aurora Orbs ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Central gold pulse */}
        <div className="absolute top-[30%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand-primary/15 blur-[160px] animate-pulse-glow" />
        {/* Sapphire top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#234F60]/15 blur-[140px]" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(212,160,82,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,82,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">

          {/* Left: Copy ─────────────────────────────────────────────────── */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge
                variant="gold"
                className="mb-6 px-4 py-1.5 text-[11px] sm:text-xs tracking-[0.15em] font-bold"
              >
                <Sparkles className="w-3 h-3 mr-1.5 shrink-0" />
                PHOTOGRAPHY STUDIO MANAGEMENT 2.0
              </Badge>
            </motion.div>

            {/* H1 */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-[2.6rem] sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-textPalette-primary leading-[1.1] mb-6 transition-colors duration-300"
            >
              Capture Every{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#E5B873] to-brand-primary">
                Moment.
              </span>
              <br className="hidden sm:block" />
              Deliver Every{" "}
              <span className="relative inline-block">
                Memory.
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
                  className="absolute -bottom-1.5 left-0 w-full text-brand-primary overflow-visible"
                  height="10"
                  viewBox="0 0 200 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7C50 1.5 150 1.5 198 7"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </motion.h1>

            {/* Sub-copy */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base sm:text-lg text-textPalette-secondary max-w-xl leading-relaxed mb-8 transition-colors duration-300"
            >
              The all-in-one cinematic platform for luxury photography studios — orchestrate multi-team bookings, deliver password-protected client galleries, and scale recurring revenue effortlessly.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="gold"
                  className="w-full sm:w-auto justify-center gap-2 group font-bold shadow-lg overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto justify-center gap-2 bg-surface-1 border-borderColor text-textPalette-primary hover:bg-surface-2 font-semibold backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-[#D4A052] text-[#D4A052] shrink-0" />
                  Watch 2-Min Demo
                </Button>
              </a>
            </motion.div>

            {/* Trust Signals */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pt-5 border-t border-borderColor flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-textPalette-secondary transition-colors duration-300"
            >
              {[
                "No credit card required",
                "Free 14-day studio trial",
                "Cancel anytime",
              ].map((item, i) => (
                <motion.span 
                  key={item} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + (i * 0.1) }}
                  className="flex items-center gap-1.5 font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: 3D Animated Camera & Photoshoot Rig ────────────────── */}
          <Cinematic3DCameraRig />

        </div>
      </div>
    </section>
  );
}
