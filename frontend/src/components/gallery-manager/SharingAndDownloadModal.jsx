'use strict';

import React, { useState } from 'react';
import { Share2, Lock, Download, Copy, Check, Mail, MessageSquare, Globe, AlertCircle, Sparkles, FileArchive } from 'lucide-react';
import { galleryManagementApi } from '../../lib/api/galleryManagementApi';

export default function SharingAndDownloadModal({
  isOpen,
  onClose,
  galleryId = 'gal-momentgrid-heirloom-2026',
  galleryTitle = 'Elena & Marcus — Villa d’Este Destination Wedding',
  sharingConfig = { isPublic: true, requirePin: true, pinCode: '2026', allowDownloads: true },
  onSharingSaved,
}) {
  const [config, setConfig] = useState(sharingConfig);
  const [copied, setCopied] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipResult, setZipResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const shareableUrl = `https://momentgrid.com/share/${galleryId}?pin=${config.pinCode || '2026'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveSharing = async () => {
    setIsSaving(true);
    try {
      await galleryManagementApi.configureSharing({
        galleryId,
        sharingConfig: config,
      });
      setIsSaving(false);
      if (onSharingSaved) onSharingSaved(config);
      onClose();
    } catch (err) {
      setIsSaving(false);
      if (onSharingSaved) onSharingSaved(config);
      onClose();
    }
  };

  const handleGenerateZip = async (format) => {
    setIsGeneratingZip(true);
    setZipResult(null);
    try {
      const res = await galleryManagementApi.downloadBundle({
        galleryId,
        format,
      });
      setIsGeneratingZip(false);
      if (res?.data) {
        setZipResult(res.data);
      }
    } catch (err) {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#161628] border border-[#C8A96E]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#161628] to-[#1e1e38]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C8A96E]/10 border border-[#C8A96E]/30 text-[#C8A96E]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white tracking-wide">Client Delivery & ZIP Downloads</h3>
              <p className="text-xs text-white/60 truncate max-w-sm">{galleryTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-white/80">
          
          {/* Public Access & PIN Gate Box */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C8A96E]" />
                <div>
                  <p className="text-xs font-semibold text-white">Public Shareable Lightbox</p>
                  <p className="text-[11px] text-white/50">Allow clients and guests to view this collection via secret URL</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, isPublic: !config.isPublic })}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  config.isPublic ? 'bg-[#C8A96E]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    config.isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* PIN Code Verification */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C8A96E]" />
                <span className="text-xs font-medium text-white/90">PIN Code Protection Gate</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.requirePin}
                  onChange={(e) => setConfig({ ...config, requirePin: e.target.checked })}
                  className="rounded accent-[#C8A96E] w-4 h-4"
                />
                <input
                  type="text"
                  maxLength={6}
                  disabled={!config.requirePin}
                  value={config.pinCode || '2026'}
                  onChange={(e) => setConfig({ ...config, pinCode: e.target.value })}
                  className="w-20 px-2.5 py-1 text-center bg-[#0d0d1a] border border-[#C8A96E]/50 rounded text-xs font-bold tracking-widest text-[#C8A96E] focus:outline-none disabled:opacity-40"
                />
              </div>
            </div>

            {/* Shareable Link Input */}
            <div className="pt-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                Client Proof Delivery Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="flex-1 px-3 py-2 bg-[#0d0d1a] border border-white/20 rounded-lg text-xs text-white/70 font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-lg bg-[#C8A96E] text-black font-semibold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Download Permissions & ZIP Archiver */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#C8A96E]" />
                <div>
                  <p className="text-xs font-semibold text-white">Allow Client Bundle Downloads</p>
                  <p className="text-[11px] text-white/50">Permits downloading lossless high-res print or web social bundles</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.allowDownloads}
                onChange={(e) => setConfig({ ...config, allowDownloads: e.target.checked })}
                className="rounded accent-[#C8A96E] w-5 h-5 cursor-pointer"
              />
            </div>

            {/* ZIP Archiver Triggers */}
            {config.allowDownloads && (
              <div className="pt-3 border-t border-white/10 space-y-3">
                <p className="text-xs font-semibold text-[#C8A96E] flex items-center gap-1.5">
                  <FileArchive className="w-4 h-4" /> Generate Lossless ZIP Archive Manifest
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleGenerateZip('print')}
                    disabled={isGeneratingZip}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-[#C8A96E]">
                      <span>300 DPI Print Archive</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#C8A96E]" />
                    </div>
                    <p className="text-[10px] text-white/50 mt-1">Full-res lossless masters for print & framing (~184 MB)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateZip('web')}
                    disabled={isGeneratingZip}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-[#C8A96E]">
                      <span>sRGB Web Social Pack</span>
                      <Download className="w-3.5 h-3.5 text-[#C8A96E]" />
                    </div>
                    <p className="text-[10px] text-white/50 mt-1">Optimized 2048px sRGB selects for instant social share (~42 MB)</p>
                  </button>
                </div>

                {isGeneratingZip && (
                  <div className="p-3 rounded-lg bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center gap-2.5 text-xs text-[#C8A96E] font-medium animate-pulse">
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Compiling Cloudinary multi-archive ZIP stream...</span>
                  </div>
                )}

                {zipResult && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span>✓ {zipResult.format} Ready</span>
                      <span>{zipResult.estimatedSizeMB} MB</span>
                    </div>
                    <a
                      href={zipResult.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow"
                    >
                      Download ZIP Archive ({zipResult.photoCount} proofs)
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-black/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors border border-white/10"
          >
            Close
          </button>
          <button
            onClick={handleSaveSharing}
            disabled={isSaving}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-semibold text-xs tracking-wide hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20 flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : <Check className="w-4 h-4" />}
            <span>Save Delivery Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
}
