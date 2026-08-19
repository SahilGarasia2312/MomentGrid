"use client";

import React from "react";
import Link from "next/link";
import { Aperture, ArrowRight, Sparkles, Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FinalCtaAndFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Final CTA Banner Section */}
      <section className="relative py-24 bg-surface-1 text-textPalette-primary overflow-hidden border-b border-borderColor transition-colors duration-300">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/15 rounded-full blur-[140px]" />
          <div className="absolute -bottom-20 right-10 w-96 h-96 bg-[#234F60]/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-10 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/40 text-[#D4A052] text-xs font-bold tracking-widest uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" /> START YOUR 14-DAY FREE TRIAL
          </div>

          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-textPalette-primary leading-tight mb-6 max-w-3xl mx-auto transition-colors duration-300">
            Ready to transform your <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#E5B873] to-brand-primary">
              photography business?
            </span>
          </h2>

          <p className="font-sans text-lg sm:text-xl text-textPalette-secondary max-w-2xl mx-auto leading-relaxed mb-10 transition-colors duration-300 font-medium">
            Join over 1,200+ luxury photography collectives. Set up your branded studio portal, invite your team, and deliver your next wedding gallery today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="xl" variant="gold" className="w-full sm:w-auto font-bold gap-2 text-base shadow-xl justify-center">
                Create Free Studio Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full sm:w-auto font-semibold bg-surface-0 border-borderColor text-textPalette-primary hover:bg-surface-2 justify-center shadow-sm transition-all">
                Schedule Enterprise Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Column Footer */}
      <footer className="bg-surface-0 text-textPalette-secondary pt-20 pb-12 border-t border-borderColor transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-borderColor">
            {/* Column 1: Brand Info (2 cols width) */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#121111] via-[#1D262B] to-[#234F60] flex items-center justify-center shadow-md border border-brand-primary/40 group-hover:shadow-glow transition-all duration-300">
                  <Aperture className="w-5 h-5 text-brand-primary group-hover:rotate-45 transition-transform duration-500" />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-textPalette-primary transition-colors duration-300">
                  Moment<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#E5B873] to-brand-primary font-extrabold">Grid</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed max-w-sm text-textPalette-secondary font-medium">
                The enterprise-grade platform connecting photography studio owners, multi-shooter teams, and luxury clientele through breathtaking digital galleries and smart schedule management.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-surface-1 border border-borderColor flex items-center justify-center hover:bg-[#D4A052] hover:text-[#121111] hover:border-[#D4A052] transition-all text-textPalette-primary shadow-sm">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#facebook" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-surface-1 border border-borderColor flex items-center justify-center hover:bg-[#D4A052] hover:text-[#121111] hover:border-[#D4A052] transition-all text-textPalette-primary shadow-sm">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#twitter" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-surface-1 border border-borderColor flex items-center justify-center hover:bg-[#D4A052] hover:text-[#121111] hover:border-[#D4A052] transition-all text-textPalette-primary shadow-sm">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#linkedin" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-surface-1 border border-borderColor flex items-center justify-center hover:bg-[#D4A052] hover:text-[#121111] hover:border-[#D4A052] transition-all text-textPalette-primary shadow-sm">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-textPalette-primary">
                Product & Suite
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li><a href="#features" className="hover:text-brand-primary transition-colors">Features & Capabilities</a></li>
                <li><a href="#portfolio" className="hover:text-brand-primary transition-colors">Live Gallery Showcase</a></li>
                <li><a href="#how-it-works" className="hover:text-brand-primary transition-colors">3-Step Studio Flow</a></li>
                <li><a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing & Tiers</a></li>
                <li><Link href="/register" className="hover:text-brand-primary transition-colors">Free 14-Day Trial</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-textPalette-primary">
                Company & Community
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li><a href="#about" className="hover:text-brand-primary transition-colors">About Our Mission</a></li>
                <li><a href="#blog" className="hover:text-brand-primary transition-colors">Photography Business Blog</a></li>
                <li><a href="#careers" className="hover:text-brand-primary transition-colors flex items-center gap-1.5">Careers & Hiring <span className="text-[10px] bg-brand-primary/20 text-[#D4A052] font-bold px-1.5 py-0.5 rounded">WE ARE HIRING</span></a></li>
                <li><a href="#press" className="hover:text-brand-primary transition-colors">Press Kit & Brand Assets</a></li>
                <li><a href="#contact" className="hover:text-brand-primary transition-colors">Partner Program</a></li>
              </ul>
            </div>

            {/* Column 4: Support & Legal */}
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-textPalette-primary">
                Support & Contact
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-primary shrink-0" /> support@momentgrid.io</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-primary shrink-0" /> +1 (800) 555-GRID</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-primary shrink-0" /> San Francisco & Paris</li>
                <li className="pt-2"><Link href="/privacy" className="hover:text-brand-primary transition-colors text-xs">Privacy Policy</Link> • <Link href="/terms" className="hover:text-brand-primary transition-colors text-xs">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-textPalette-secondary font-medium">
            <p>© {currentYear} MomentGrid Technologies, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>System Status: <strong className="text-emerald-500 dark:text-emerald-400 font-bold">● Operational</strong></span>
              <span>English (United States)</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
