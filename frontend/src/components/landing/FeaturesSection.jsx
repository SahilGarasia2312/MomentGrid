"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Image as ImageIcon, Heart, Users, TrendingUp, Smartphone, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Intelligent Booking System",
      description:
        "Let clients schedule sessions with real-time calendar synchronization, automated deposit collection via Stripe, and branded SMS/email confirmations.",
      tag: "SMART CALENDAR",
      accent: "border-l-4 border-l-brand-primary",
      iconBg: "bg-brand-warm text-brand-primary group-hover:bg-brand-primary group-hover:text-surface-0",
      tagBadge: "bg-brand-warm/60 text-brand-primary",
    },
    {
      icon: ImageIcon,
      title: "Stunning Gallery Delivery",
      description:
        "Share password-protected cinematic galleries with zero compression. Features adaptive masonry grids, automated watermarking, and tiered download permissions.",
      tag: "SAPPHIRE PRESENTATION",
      accent: "border-l-4 border-l-[#234F60]",
      iconBg: "bg-[#DFE6E6] text-[#234F60] group-hover:bg-[#234F60] group-hover:text-white",
      tagBadge: "bg-[#DFE6E6] text-[#234F60]",
    },
    {
      icon: Heart,
      title: "Client Selection Tools",
      description:
        "Clients can effortlessly heart favorites, leave pinpoint editing notes on specific frames, and curate custom physical wedding album layouts in one place.",
      tag: "GOLDEN COLLABORATION",
      accent: "border-l-4 border-l-[#D4A052]",
      iconBg: "bg-[#FBF6EE] dark:bg-[#D4A052]/15 text-[#D4A052] group-hover:bg-[#D4A052] group-hover:text-white",
      tagBadge: "bg-[#FBF6EE] dark:bg-[#D4A052]/15 text-[#D4A052]",
    },
    {
      icon: Users,
      title: "Photographer Team Hub",
      description:
        "Assign lead and second shooters to specific shoots, monitor RAW deliverable progress, track team schedules, and manage individual shooter payouts seamlessly.",
      tag: "BLACK TIE ROLES",
      accent: "border-l-4 border-l-[#121111] dark:border-l-[#DFE6E6]",
      iconBg: "bg-[#EFEFEF] dark:bg-white/10 text-[#121111] dark:text-[#DFE6E6] group-hover:bg-[#121111] dark:group-hover:bg-[#DFE6E6] group-hover:text-white dark:group-hover:text-[#121111]",
      tagBadge: "bg-[#EFEFEF] dark:bg-white/10 text-[#121111] dark:text-[#DFE6E6]",
    },
    {
      icon: TrendingUp,
      title: "Revenue & Package Analytics",
      description:
        "Gain instant visibility into your studio's financial health with real-time revenue breakdowns, package booking trends, and high-margin upsell metrics.",
      tag: "SAPPHIRE BUSINESS",
      accent: "border-l-4 border-l-[#234F60]",
      iconBg: "bg-[#DFE6E6] text-[#234F60] group-hover:bg-[#234F60] group-hover:text-white",
      tagBadge: "bg-[#DFE6E6] text-[#234F60]",
    },
    {
      icon: Smartphone,
      title: "White-Label Client Portal",
      description:
        "Provide your couples and commercial clients with a dedicated mobile-responsive portal hosted on your custom domain, custom-branded with your studio logo.",
      tag: "GOLDEN BRANDING",
      accent: "border-l-4 border-l-[#D4A052]",
      iconBg: "bg-[#FBF6EE] dark:bg-[#D4A052]/15 text-[#D4A052] group-hover:bg-[#D4A052] group-hover:text-white",
      tagBadge: "bg-[#FBF6EE] dark:bg-[#D4A052]/15 text-[#D4A052]",
    },
  ];

  return (
    <section id="features" className="py-24 bg-surface-0 text-textPalette-primary relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-warm/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-3.5 py-1 text-xs tracking-wider uppercase border-brand-primary/40 text-brand-primary bg-brand-warm/30">
            <Sparkles className="w-3 h-3 mr-1.5" /> EVERYTHING YOU NEED TO SCALE
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-textPalette-primary leading-tight mb-4">
            Built for studios. <br className="hidden sm:inline" />
            <span className="text-brand-primary">Loved by photographers.</span>
          </h2>
          <p className="font-sans text-lg text-textPalette-secondary leading-relaxed">
            Eliminate messy email threads, disconnected file transfers, and manual spreadsheets. MomentGrid unifies every step of your photography workflow into one luxury suite.
          </p>
        </motion.div>

        {/* 6-Card Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card
                  glow={true}
                  className={`flex flex-col justify-between h-full group p-2 transition-all duration-300 ${feat.accent} hover:shadow-xl`}
                >
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 ${feat.iconBg || "bg-brand-warm text-brand-primary group-hover:bg-brand-primary group-hover:text-surface-0"}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full ${feat.tagBadge || "bg-surface-2 text-textPalette-tertiary"}`}>
                        {feat.tag}
                      </span>
                    </div>
                    <CardTitle className="font-display text-2xl font-bold text-textPalette-primary group-hover:text-brand-primary transition-colors mb-3">
                      {feat.title}
                    </CardTitle>
                    <CardDescription className="text-base text-textPalette-secondary leading-relaxed">
                      {feat.description}
                    </CardDescription>
                  </CardHeader>

                  <div className="px-6 pb-6 pt-2">
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary group-hover:underline cursor-pointer">
                      <span>Explore feature</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
