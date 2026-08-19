"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("annual"); // 'annual' or 'monthly'

  const plans = [
    {
      name: "Starter",
      description: "Perfect for solo photographers beginning their journey.",
      priceMonthly: "$0",
      priceAnnual: "$0",
      billingNote: "Free forever plan",
      features: [
        "1 Photographer Seat",
        "Up to 5 Active Galleries",
        "1 GB High-Speed Cloud Storage",
        "Standard Gallery Themes",
        "Client PIN Code Verification",
        "Community Support",
      ],
      cta: "Get Started Free",
      ctaVariant: "obsidian",
      popular: false,
      cardTheme: "border border-borderColor bg-surface-0 shadow-sm hover:shadow-md",
      checkIconBg: "bg-brand-obsidian/10 text-brand-secondary",
    },
    {
      name: "Professional",
      description: "Our most popular tier for growing independent studios.",
      priceMonthly: "$59",
      priceAnnual: "$49",
      billingNote: "per month, billed annually",
      features: [
        "Up to 5 Photographer Seats",
        "Unlimited Active Galleries",
        "50 GB NVMe Cloud Storage",
        "Custom Watermarking & Branding",
        "Full Client Album Selection Tools",
        "Integrated Stripe Deposit Billing",
        "Priority 24/7 Email & Chat Support",
      ],
      cta: "Start 14-Day Free Trial",
      ctaVariant: "gold",
      popular: true,
      cardTheme: "border-2 border-brand-primary shadow-2xl scale-105 z-10 bg-surface-0",
      checkIconBg: "bg-brand-warm text-brand-primary",
    },
    {
      name: "Studio Enterprise",
      description: "Full white-label power for large multi-shooter collectives.",
      priceMonthly: "$119",
      priceAnnual: "$99",
      billingNote: "per month, billed annually",
      features: [
        "Unlimited Photographer Seats",
        "Unlimited Active Galleries",
        "500 GB NVMe Cloud Storage",
        "Custom Domain White-Label Portal",
        "Advanced Revenue & Team Analytics",
        "Multi-Shooter Payout Management",
        "Dedicated VIP Account Manager",
      ],
      cta: "Upgrade to Enterprise",
      ctaVariant: "emerald",
      popular: false,
      cardTheme: "bg-gradient-to-b from-[#234F60]/10 via-surface-0 to-surface-0 border-2 border-[#234F60]/40 hover:border-[#234F60] shadow-md hover:shadow-glow-emerald",
      checkIconBg: "bg-[#DFE6E6] text-[#234F60]",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-surface-1 text-textPalette-primary border-b border-borderColor relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <Badge variant="gold" className="mb-4 px-3.5 py-1 text-xs tracking-wider uppercase">
            <Sparkles className="w-3 h-3 mr-1.5" /> TRANSPARENT PRICING
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-textPalette-primary leading-tight mb-4">
            Invest in your studio. <br className="hidden sm:inline" />
            <span className="text-brand-primary">Scale without friction.</span>
          </h2>
          <p className="font-sans text-lg text-textPalette-secondary leading-relaxed mb-8">
            Simple, predictable pricing designed for studios of all sizes. No hidden commissions on your client downloads or print orders.
          </p>

          {/* Monthly / Annual Toggle Button */}
          <div className="inline-flex items-center gap-4 bg-surface-2 p-1.5 rounded-full border border-borderColor shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-surface-0 text-textPalette-primary shadow-sm"
                  : "text-textPalette-secondary hover:text-textPalette-primary"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-brand-primary text-surface-0 shadow-md font-bold"
                  : "text-textPalette-secondary hover:text-textPalette-primary"
              }`}
            >
              Annual Billing
              <span className="bg-brand-secondary text-brand-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`relative flex flex-col justify-between transition-all duration-300 ${
                plan.cardTheme || (plan.popular
                  ? "border-2 border-brand-primary shadow-2xl scale-105 z-10 bg-surface-0"
                  : "border border-borderColor bg-surface-0 shadow-sm hover:shadow-md")
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-brand-secondary text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-brand-secondary" /> Most Popular Tier
                </div>
              )}

              <div>
                <CardHeader className="p-8 pb-6">
                  <CardTitle className="font-display text-2xl font-bold text-textPalette-primary mb-2">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-textPalette-secondary min-h-[40px]">
                    {plan.description}
                  </CardDescription>
                  
                  {/* Price Display */}
                  <div className="pt-6 border-t border-borderColor/60 mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl sm:text-5xl font-bold text-textPalette-primary">
                        {billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly}
                      </span>
                      {plan.priceMonthly !== "$0" && (
                        <span className="text-sm text-textPalette-secondary font-medium">/ month</span>
                      )}
                    </div>
                    <span className="text-xs text-textPalette-tertiary block mt-1">
                      {billingCycle === "annual" ? plan.billingNote : "billed monthly"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-textPalette-tertiary mb-4">
                    What is included:
                  </p>
                  <ul className="space-y-3.5">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-textPalette-secondary">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.checkIconBg || "bg-emerald-100 text-emerald-600"}`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <CardFooter className="p-8 pt-4">
                <Link href={`/register?plan=${plan.name.toLowerCase().replace(/\s+/g, "-")}`} className="w-full">
                  <Button
                    variant={plan.ctaVariant}
                    size="lg"
                    className="w-full justify-center font-bold text-base shadow-sm"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
