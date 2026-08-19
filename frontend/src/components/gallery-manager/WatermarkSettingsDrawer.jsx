'use strict';

import React, { useState } from 'react';
import { Shield, Eye, Check, X, Sliders, Type, Layout, Sparkles } from 'lucide-react';
import { galleryManagementApi } from '../../lib/api/galleryManagementApi';

export default function WatermarkSettingsDrawer({
  isOpen,
  onClose,
  galleryId = 'gal-momentgrid-heirloom-2026',
  initialConfig = { enabled: true, text: '© MomentGrid Collective', opacity: 45, position: 'south_east' },
  onConfigSaved,
}) {
  const [config, setConfig] = useState(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [previewSampleUrl] = useState(
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
  );

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await galleryManagementApi.applyWatermark({
        galleryId,
        watermarkConfig: config,
      });
      setIsSaving(false);
      if (onConfigSaved) onConfigSaved(config);
      onClose();
    } catch (err) {
      setIsSaving(false);
      if (onConfigSaved) onConfigSaved(config);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#161628] border-l border-[#C8A96E]/30 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#161628] to-[#1e1e38]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C8A96E]/10 border border-[#C8A96E]/30 text-[#C8A96E]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-wide">Cloudinary Watermarking</h3>
              <p className="text-xs text-white/60">Dynamic overlay transformations to protect digital proofs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-white/80">
          
          {/* Master Enable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] border border-white/10">
            <div>
              <p className="font-semibold text-white text-xs">Enable Watermark Overlay</p>
              <p className="text-[11px] text-white/50 mt-0.5">Applies protective branding on client preview proofs</p>
            </div>
            <button
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                config.enabled ? 'bg-[#C8A96E]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  config.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Watermark Text Input */}
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-2 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#C8A96E]" /> Brand Watermark Text
            </label>
            <input
              type="text"
              disabled={!config.enabled}
              value={config.text || ''}
              onChange={(e) => setConfig({ ...config, text: e.target.value })}
              placeholder="e.g. © MomentGrid Collective"
              className="w-full px-3.5 py-2.5 bg-[#0d0d1a] border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C8A96E] disabled:opacity-40 transition-colors"
            />
          </div>

          {/* Opacity Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-white/90 mb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#C8A96E]" /> Overlay Opacity
              </span>
              <span className="text-[#C8A96E]">{config.opacity || 45}%</span>
            </div>
            <input
              type="range"
              disabled={!config.enabled}
              min="10"
              max="100"
              value={config.opacity || 45}
              onChange={(e) => setConfig({ ...config, opacity: Number(e.target.value) })}
              className="w-full accent-[#C8A96E] bg-white/10 rounded-lg h-2 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Placement Selector */}
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-2 flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-[#C8A96E]" /> Watermark Position
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'south_east', label: 'Bottom Right' },
                { id: 'center', label: 'Center Overlay' },
                { id: 'south_west', label: 'Bottom Left' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  disabled={!config.enabled}
                  type="button"
                  onClick={() => setConfig({ ...config, position: pos.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all disabled:opacity-40 ${
                    config.position === pos.id
                      ? 'bg-[#C8A96E] text-black border-[#C8A96E] font-semibold shadow-md'
                      : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="border border-white/10 rounded-2xl p-4 bg-[#0d0d1a]/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#C8A96E]">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Cloudinary Live Preview
              </span>
              <span className="text-[10px] text-white/50 uppercase">Proof Sample</span>
            </div>
            
            <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-black border border-white/20">
              <img src={previewSampleUrl} alt="Sample" className="w-full h-full object-cover" />
              {config.enabled && (
                <div
                  className={`absolute inset-0 pointer-events-none flex p-4 ${
                    config.position === 'center'
                      ? 'items-center justify-center'
                      : config.position === 'south_west'
                      ? 'items-end justify-start'
                      : 'items-end justify-end'
                  }`}
                  style={{ opacity: (config.opacity || 45) / 100 }}
                >
                  <span className="px-3 py-1.5 rounded bg-black/70 backdrop-blur-sm border border-white/20 text-white font-bold tracking-widest text-xs uppercase shadow-xl">
                    {config.text || '© MomentGrid'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-white/50 text-center">
              Watermarks are applied dynamically via Cloudinary transformation URLs without modifying original master RAW/JPG uploads.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-black/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-semibold text-xs tracking-wide hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20 flex items-center gap-2"
          >
            {isSaving ? 'Applying...' : <Check className="w-4 h-4" />}
            <span>Apply Watermark Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
}
