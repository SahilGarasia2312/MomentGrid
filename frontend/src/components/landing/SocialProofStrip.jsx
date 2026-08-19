"use client";

import React from "react";
import { Camera, Award, ShieldCheck, Sparkles, Heart } from "lucide-react";

export default function SocialProofStrip() {
  const stats = [
    { number: "2.4M+", label: "High-Res Photos Delivered", icon: Camera },
    { number: "48,000+", label: "Sessions Successfully Booked", icon: Award },
    { number: "12,000+", label: "Delighted Studio Clients", icon: Heart },
    { number: "99.99%", label: "Cloud Uptime & Security", icon: ShieldCheck },
  ];

  const studioNames = [
    "Lumière Studios",
    "Atelier 8 Wedding",
    "Vance Media & Film",
    "Vogue Focus Creative",
    "Lens & Light Collective",
    "Aperture Pro Society",
  ];

  return (
    <section className="bg-surface-1 border-y border-borderColor py-16 text-textPalette-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Top Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest text-textPalette-tertiary uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            TRUSTED BY OVER 1,200+ LUXURY PHOTOGRAPHY STUDIOS WORLDWIDE
          </p>
        </div>

        {/* Partner Studio Logo Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center mb-16">
          {studioNames.map((name, idx) => (
            <div
              key={idx}
              className="h-14 rounded-xl bg-surface-0 border border-borderColor flex items-center justify-center px-4 shadow-2xs hover:border-brand-primary/60 hover:shadow-sm transition-all duration-300 group cursor-default"
            >
              <span className="font-display font-bold text-sm tracking-wide text-textPalette-secondary group-hover:text-textPalette-primary transition-colors text-center">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-borderColor/60">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface-0 border border-borderColor/50 shadow-2xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-warm flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-display text-3xl md:text-4xl font-bold tracking-tight text-textPalette-primary mb-1">
                  {stat.number}
                </span>
                <span className="text-sm text-textPalette-secondary font-medium">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
