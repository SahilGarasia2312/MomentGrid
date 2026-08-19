'use strict';
'use client';

import React from 'react';
import { BookOpen, Sparkles, Check, Save, Layers, Palette, FileText } from 'lucide-react';

export default function CoverAndSizingCustomizer({
  albumSize = '12x12 Master Luxe',
  pageCount = 40,
  coverSpecs = {},
  clientNotes = '',
  availablePhotos = [],
  onSaveSpecs,
  status,
}) {
  const sizes = [
    { id: '10x10 Square Heirloom', label: '10x10" Square Heirloom', desc: 'Classic square format ideal for intimate story spreads.', price: 'Included' },
    { id: '12x12 Master Luxe', label: '12x12" Master Luxe', desc: 'Our signature flagship flush-mount statement album.', price: '+$350 Luxe Upgrade' },
    { id: '11x14 Grand Editorial', label: '11x14" Grand Editorial', desc: 'Panoramic magazine-style editorial proportions.', price: '+$550 Editorial Upgrade' },
    { id: '8x12 Landscape Spreads', label: '8x12" Landscape Spreads', desc: 'Sleek horizontal format emphasizing wide scenic landscapes.', price: 'Included' },
  ];

  const materials = [
    { id: 'Italian Leather - Obsidian Black', name: 'Obsidian Black Leather', swatch: 'bg-[#121212] border-white/30 text-white' },
    { id: 'Italian Leather - Tuscan Cognac', name: 'Tuscan Cognac Leather', swatch: 'bg-[#7B3F00] border-amber-600 text-amber-100' },
    { id: 'Linen Velvet - Pearl White', name: 'Pearl White Linen Velvet', swatch: 'bg-[#F5F5F0] border-gray-300 text-gray-900' },
    { id: 'Linen Velvet - Midnight Emerald', name: 'Midnight Emerald Linen', swatch: 'bg-[#0A291A] border-emerald-600 text-emerald-100' },
    { id: 'Hardbound Glass - Acrylic Luxe', name: 'Crystal Acrylic Hardbound', swatch: 'bg-gradient-to-br from-white/30 to-white/10 border-[#C8A96E] text-white backdrop-blur-md' },
  ];

  const selectedPhoto = availablePhotos.find((p) => p.id === coverSpecs?.photoId) || availablePhotos[0] || null;

  const handleUpdate = (updates) => {
    if (status !== 'selecting') return;
    onSaveSpecs({
      albumSize,
      pageCount,
      coverSpecs: { ...coverSpecs, ...updates.coverSpecs },
      clientNotes,
      ...updates,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
      
      {/* Left Column: Interactive Cover Mockup Preview */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="sticky top-24 bg-[#161628] border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-6 shadow-2xl">
          <div className="w-full flex items-center justify-between text-xs text-white/60 border-b border-white/10 pb-3">
            <span className="font-bold uppercase tracking-wider text-[#C8A96E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 3D Cover Mockup Preview
            </span>
            <span>{albumSize}</span>
          </div>

          {/* Book Spine / Cover Rendering */}
          <div className="relative w-full max-w-[340px] aspect-[1/1] rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border flex flex-col justify-between overflow-hidden transition-all duration-500 transform hover:scale-[1.02] cursor-pointer group"
               style={{
                 background: coverSpecs?.material?.includes('Tuscan')
                   ? 'linear-gradient(135deg, #5c2c04 0%, #3a1a01 100%)'
                   : coverSpecs?.material?.includes('Pearl White')
                   ? 'linear-gradient(135deg, #ebebe3 0%, #d4d4ca 100%)'
                   : coverSpecs?.material?.includes('Emerald')
                   ? 'linear-gradient(135deg, #072115 0%, #03120b 100%)'
                   : 'linear-gradient(135deg, #18181c 0%, #0a0a0c 100%)',
                 borderColor: coverSpecs?.material?.includes('Pearl White') ? '#aaaaaa' : '#C8A96E',
               }}
          >
            {/* Book Spine Left Accent */}
            <div className="absolute top-0 bottom-0 left-0 w-8 border-r border-white/10 bg-black/30 shadow-inner" />

            {/* Top Centerpiece Cover Photo */}
            <div className="z-10 pl-6 pt-2 flex flex-col items-center w-full">
              {selectedPhoto ? (
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-lg overflow-hidden border-2 border-[#C8A96E]/80 shadow-2xl relative group-hover:brightness-110 transition-all">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-44 h-44 rounded-lg bg-white/10 border border-dashed border-white/30 flex items-center justify-center text-[10px] text-white/50 text-center p-4">
                  Select a cover photo below
                </div>
              )}
            </div>

            {/* Bottom Embossed Title Foil Text */}
            <div className="z-10 pl-6 pb-2 text-center w-full">
              <p
                className="font-serif tracking-[0.25em] uppercase text-xs sm:text-sm font-bold transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                style={{
                  color: coverSpecs?.material?.includes('Pearl White') ? '#1a1a1a' : '#e6cd98',
                  textShadow: coverSpecs?.material?.includes('Pearl White') ? 'none' : '0 1px 3px rgba(200,169,110,0.6)',
                }}
              >
                {coverSpecs?.embossText || 'Elena & Marcus — 2026'}
              </p>
              <p
                className="text-[9px] uppercase tracking-[0.3em] font-sans mt-1 opacity-70"
                style={{ color: coverSpecs?.material?.includes('Pearl White') ? '#444' : '#aaaaaa' }}
              >
                {coverSpecs?.material || 'Italian Leather'} • {pageCount} Pages
              </p>
            </div>
          </div>

          <p className="text-[11px] text-center text-white/50 max-w-xs leading-relaxed">
            Every MomentGrid album is hand-bound using archival pigment inks guaranteed to resist fading for over 100 years.
          </p>
        </div>
      </div>

      {/* Right Column: Customization Controls */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        
        {/* Step A: Album Dimensional Size */}
        <div className="bg-[#161628] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C8A96E]" />
              <span>1. Choose Album Format & Dimensions</span>
            </h3>
            <span className="text-xs text-white/50">Selected: <strong className="text-white">{albumSize}</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sizes.map((sz) => {
              const isSelected = albumSize === sz.id;
              return (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => handleUpdate({ albumSize: sz.id })}
                  disabled={status !== 'selecting'}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-[#C8A96E]/15 border-[#C8A96E] shadow-lg shadow-[#C8A96E]/10'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-white">{sz.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#C8A96E]" />}
                  </div>
                  <p className="text-[11px] text-white/60 mt-1.5 leading-normal">{sz.desc}</p>
                  <span className={`text-[10px] font-bold mt-3 inline-block px-2 py-0.5 rounded-md w-fit ${
                    isSelected ? 'bg-[#C8A96E] text-black' : 'bg-white/10 text-white/70'
                  }`}>
                    {sz.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step B: Page Count Selector */}
        <div className="bg-[#161628] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C8A96E]" />
              <span>2. Total Spread Page Count</span>
            </h3>
            <span className="text-xs font-extrabold text-[#C8A96E] px-3 py-1 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/30">
              {pageCount} Pages ({pageCount / 2} Double Spreads)
            </span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <input
              type="range"
              min="20"
              max="80"
              step="10"
              value={pageCount}
              disabled={status !== 'selecting'}
              onChange={(e) => handleUpdate({ pageCount: Number(e.target.value) })}
              className="w-full accent-[#C8A96E] bg-white/10 h-2 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/50">
            <span>20 Pages (Intimate)</span>
            <span>40 Pages (Standard Heirloom)</span>
            <span>60+ Pages (Luxe Grand)</span>
          </div>
        </div>

        {/* Step C: Luxury Cover Material Swatches */}
        <div className="bg-[#161628] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#C8A96E]" />
              <span>3. Cover Binding Material & Finish</span>
            </h3>
            <span className="text-xs text-white/60">Current: <strong className="text-white">{coverSpecs?.material}</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {materials.map((mat) => {
              const isSelected = (coverSpecs?.material || '') === mat.id;
              return (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => handleUpdate({ coverSpecs: { ...coverSpecs, material: mat.id } })}
                  disabled={status !== 'selecting'}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'border-[#C8A96E] bg-white/10 shadow-md'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${mat.swatch}`}>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{mat.name}</p>
                    <p className="text-[10px] text-white/50">Archival quality</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step D: Foil Embossed Title & Cover Centerpiece Photo */}
        <div className="bg-[#161628] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C8A96E]" />
            <span>4. Cover Embossed Foil Text & Photo Centerpiece</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">
              Embossed Cover Title (24K Gold or Silver Foil)
            </label>
            <input
              type="text"
              value={coverSpecs?.embossText || ''}
              disabled={status !== 'selecting'}
              onChange={(e) => handleUpdate({ coverSpecs: { ...coverSpecs, embossText: e.target.value } })}
              placeholder="e.g. Elena & Marcus — Villa d’Este 2026"
              className="w-full rounded-2xl bg-[#0d0d1a] border border-white/15 focus:border-[#C8A96E] focus:outline-none p-4 text-xs text-white placeholder-white/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2.5">
              Select Cover Photo Centerpiece (Pick from your favorites)
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {availablePhotos.slice(0, 12).map((photo) => {
                const isSelectedPhoto = coverSpecs?.photoId === photo.id;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => handleUpdate({ coverSpecs: { ...coverSpecs, photoId: photo.id } })}
                    disabled={status !== 'selecting'}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      isSelectedPhoto
                        ? 'border-[#C8A96E] scale-105 shadow-lg shadow-[#C8A96E]/30'
                        : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    {isSelectedPhoto && (
                      <div className="absolute inset-0 bg-[#C8A96E]/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* General Client Layout Notes */}
          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">
              General Layout & Retouching Instructions for Studio Team
            </label>
            <textarea
              rows={3}
              value={clientNotes}
              disabled={status !== 'selecting'}
              onChange={(e) => handleUpdate({ clientNotes: e.target.value })}
              placeholder="e.g. Please emphasize high-contrast black and white grading for the evening reception spreads..."
              className="w-full rounded-2xl bg-[#0d0d1a] border border-white/15 focus:border-[#C8A96E] focus:outline-none p-4 text-xs text-white placeholder-white/40 leading-relaxed resize-none transition-colors"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
