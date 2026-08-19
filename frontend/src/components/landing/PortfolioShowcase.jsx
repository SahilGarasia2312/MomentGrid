"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Download, Sparkles, Lock, ArrowUpRight } from "lucide-react";

export default function PortfolioShowcase() {
  const [activeTab, setActiveTab] = useState("all");

  const galleries = [
    {
      id: "gal-1",
      title: "Vance & Clara — Amalfi Coast Gala",
      category: "weddings",
      client: "Clara Vance",
      photographer: "Elena Rostova",
      photoCount: 420,
      likes: 184,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85",
      aspect: "col-span-1 md:col-span-2 row-span-2 min-h-[420px]",
      featured: true,
    },
    {
      id: "gal-2",
      title: "Vogue Autumn Editorial '26",
      category: "editorial",
      client: "Vogue Creative",
      photographer: "Marcus Vance",
      photoCount: 128,
      likes: 96,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85",
      aspect: "col-span-1 min-h-[300px]",
      featured: false,
    },
    {
      id: "gal-3",
      title: "Julian & Sofia Portrait Suite",
      category: "portraits",
      client: "Julian Sterling",
      photographer: "Lumière Team",
      photoCount: 85,
      likes: 62,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85",
      aspect: "col-span-1 min-h-[300px]",
      featured: false,
    },
    {
      id: "gal-4",
      title: "Symphony at Carnegie Hall Gala",
      category: "events",
      client: "Philharmonic Org",
      photographer: "Elena Rostova",
      photoCount: 310,
      likes: 215,
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=85",
      aspect: "col-span-1 md:col-span-2 min-h-[340px]",
      featured: false,
    },
    {
      id: "gal-5",
      title: "Château de Versailles Bridal Ceremony",
      category: "weddings",
      client: "Audrey & Liam",
      photographer: "Atelier 8 Studios",
      photoCount: 560,
      likes: 340,
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=85",
      aspect: "col-span-1 min-h-[340px]",
      featured: false,
    },
  ];

  const filteredGalleries =
    activeTab === "all"
      ? galleries
      : galleries.filter((g) => g.category === activeTab);

  return (
    <section id="portfolio" className="py-24 bg-surface-1 border-y border-borderColor text-textPalette-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <Badge variant="gold" className="mb-4 px-3.5 py-1 text-xs tracking-wider uppercase">
              <Sparkles className="w-3 h-3 mr-1.5" /> LIVE CLIENT DELIVERY EXPERIENCE
            </Badge>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-textPalette-primary leading-tight">
              Galleries that leave clients <br className="hidden sm:inline" />
              <span className="text-brand-primary">breathless.</span>
            </h2>
          </div>
          <p className="font-sans text-base sm:text-lg text-textPalette-secondary max-w-md leading-relaxed">
            Witness how world-class studios present their work. Zero pixelation, custom password gates, and seamless high-res downloads.
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-12">
          <TabsList className="flex flex-wrap gap-2 justify-start md:justify-center bg-surface-2 p-2 rounded-2xl h-auto">
            <TabsTrigger value="all" className="px-6 py-2.5 rounded-xl text-sm">All Deliverables</TabsTrigger>
            <TabsTrigger value="weddings" className="px-6 py-2.5 rounded-xl text-sm">Luxury Weddings</TabsTrigger>
            <TabsTrigger value="portraits" className="px-6 py-2.5 rounded-xl text-sm">Portraits</TabsTrigger>
            <TabsTrigger value="editorial" className="px-6 py-2.5 rounded-xl text-sm">Editorial & Fashion</TabsTrigger>
            <TabsTrigger value="events" className="px-6 py-2.5 rounded-xl text-sm">Gala Events</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Masonry / Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {filteredGalleries.map((gal) => (
            <div
              key={gal.id}
              className={`group relative rounded-2xl overflow-hidden border border-borderColor shadow-md bg-brand-secondary transition-all duration-500 hover:shadow-glow hover:-translate-y-1.5 flex flex-col justify-end ${gal.aspect}`}
            >
              {/* Background Photographic Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${gal.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

              {/* Top Bar Badges */}
              <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
                <Badge variant="gold" className="bg-surface-0/90 text-brand-secondary border-none backdrop-blur-md shadow-sm font-bold text-[10px]">
                  {gal.category.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-surface-0/90 bg-brand-secondary/80 px-2.5 py-1 rounded-full backdrop-blur-md border border-surface-0/15">
                    <Lock className="w-3 h-3 text-brand-primary" /> PIN Gated
                  </span>
                </div>
              </div>

              {/* Bottom Info & CTA Overlay */}
              <div className="relative z-20 p-6 sm:p-8 flex flex-col justify-end">
                <div className="flex items-center gap-4 text-xs text-brand-accent font-medium mb-2">
                  <span>📸 {gal.photoCount} High-Res Photos</span>
                  <span>•</span>
                  <span>Photographer: {gal.photographer}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-surface-0 group-hover:text-brand-primary transition-colors mb-3 leading-snug">
                  {gal.title}
                </h3>

                <div className="flex items-center justify-between pt-4 border-t border-surface-0/20">
                  <div className="flex items-center gap-3 text-sm text-surface-0/80">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> {gal.likes} favorites
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-brand-primary" /> ZIP Ready
                    </span>
                  </div>

                  <button
                    onClick={() => alert(`Opening preview for ${gal.title}... (Demo Gallery)`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-brand-primary text-brand-secondary px-4 py-2 rounded-lg hover:bg-brand-accent transition-colors shadow-md"
                  >
                    <span>View Gallery</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
