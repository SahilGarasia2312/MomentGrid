"use client";

import React from "react";
import { Building2, CalendarCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Building2,
      title: "Set Up Your Studio Profile",
      description:
        "Create your branded studio workspace in 3 minutes. Add your photographers, define your service tiers, and configure your payment integrations.",
    },
    {
      number: "02",
      icon: CalendarCheck,
      title: "Let Clients Book & Pay",
      description:
        "Clients discover your booking packages, choose open dates with automated calendar conflicts checked, sign digital contracts, and pay retainers instantly.",
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Deliver & Delight Forever",
      description:
        "Upload high-res shoot galleries with one click. Clients heart favorite shots, order prints, and experience their memories in a cinematic portal.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-surface-0 border-b border-borderColor text-textPalette-primary relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-up">
          <Badge variant="outline" className="mb-4 px-3.5 py-1 text-xs tracking-wider uppercase border-brand-primary/40 text-brand-primary bg-brand-warm/30">
            SIMPLE 3-STEP FLOW
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-textPalette-primary leading-tight mb-4">
            How MomentGrid powers <br className="hidden sm:inline" />
            <span className="text-brand-primary">modern photography teams.</span>
          </h2>
          <p className="font-sans text-lg text-textPalette-secondary leading-relaxed">
            From the initial client inquiry to the final album delivery, we have re-engineered the workflow so you spend less time behind a spreadsheet and more time behind the lens.
          </p>
        </div>

        {/* 3-Step Grid with Connecting Line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Dashed connector line for desktop */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-brand-primary/20 via-brand-primary/60 to-brand-primary/20 border-t-2 border-dashed border-brand-primary/40 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left group p-6 rounded-2xl bg-surface-1/50 hover:bg-surface-1 border border-transparent hover:border-borderColor transition-all duration-300"
              >
                {/* Step Circle Header */}
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-secondary text-brand-primary flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="font-display text-4xl font-bold font-mono text-brand-primary/30 group-hover:text-brand-primary transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-textPalette-primary mb-3 group-hover:text-brand-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-base text-textPalette-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
