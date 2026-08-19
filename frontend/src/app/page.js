"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofStrip from "@/components/landing/SocialProofStrip";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PortfolioShowcase from "@/components/landing/PortfolioShowcase";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FaqSection from "@/components/landing/FaqSection";
import FinalCtaAndFooter from "@/components/landing/FinalCtaAndFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-0 font-sans selection:bg-brand-primary selection:text-brand-secondary overflow-x-hidden">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main>
        <HeroSection />
        <SocialProofStrip />
        <FeaturesSection />
        <PortfolioShowcase />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCtaAndFooter />
      </main>
    </div>
  );
}
