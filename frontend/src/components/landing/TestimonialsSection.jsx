"use client";

import React from "react";
import { Star, Quote, Sparkles } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TestimonialsSection() {
  const reviews = [
    {
      quote:
        "Before MomentGrid, we spent 15 hours a week managing disparate gallery ZIP links and email invoices. Now, our 6 photographers deliver directly inside our custom portal, and client print upsells increased by 42% in our first quarter.",
      author: "Sarah Jenkins",
      role: "Lead Director & Owner",
      studio: "Lumière Studios",
      location: "San Francisco, CA",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      quote:
        "The PIN-gated gallery presentation is absolutely cinematic. Our celebrity wedding clients constantly remark on how luxurious it feels to select their album favorites on MomentGrid compared to generic cloud storage folders.",
      author: "Marcus Vance",
      role: "Founder & Creative Principal",
      studio: "Vance Media & Film",
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      quote:
        "As a multi-shooter fashion boutique, managing who shot what and tracking RAW deadlines used to be a nightmare. The Photographer Team Hub gives our second shooters crystal-clear ownership and automated contract payouts.",
      author: "Elena Rostova",
      role: "Senior Fashion Photographer",
      studio: "Atelier 8 Wedding",
      location: "Paris, France",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-surface-0 text-textPalette-primary border-b border-borderColor relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-brand-warm/80 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <Badge variant="outline" className="mb-4 px-3.5 py-1 text-xs tracking-wider uppercase border-brand-primary/40 text-brand-primary bg-brand-warm/30">
            <Sparkles className="w-3 h-3 mr-1.5" /> ACCLAIMED BY INDUSTRY LEADERS
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-textPalette-primary leading-tight mb-4">
            Loved by studios that <br className="hidden sm:inline" />
            <span className="text-brand-primary">refuse to compromise.</span>
          </h2>
          <p className="font-sans text-lg text-textPalette-secondary leading-relaxed">
            Read how professional photography collectives use MomentGrid to transform their client presentation and streamline multi-team operations.
          </p>
        </div>

        {/* 3-Column Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <Card
              key={idx}
              glow={true}
              className="flex flex-col justify-between p-2 relative bg-surface-0 border border-borderColor hover:border-brand-primary/40 transition-all duration-300"
            >
              <CardContent className="p-6 pt-6">
                {/* 5 Gold Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-primary text-brand-primary" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-brand-primary/20" />
                </div>

                {/* Blockquote text */}
                <blockquote className="font-display italic text-lg sm:text-xl text-textPalette-primary leading-relaxed mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </blockquote>
              </CardContent>

              {/* Author Footer */}
              <div className="p-6 pt-0 border-t border-borderColor/60 flex items-center gap-4 mt-auto">
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-brand-primary/40 shrink-0 shadow-xs"
                  style={{ backgroundImage: `url(${rev.avatar})` }}
                />
                <div>
                  <h4 className="font-sans font-bold text-base text-textPalette-primary">
                    {rev.author}
                  </h4>
                  <p className="text-xs text-brand-primary font-semibold">
                    {rev.role} • {rev.studio}
                  </p>
                  <p className="text-[11px] text-textPalette-tertiary">
                    {rev.location}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
