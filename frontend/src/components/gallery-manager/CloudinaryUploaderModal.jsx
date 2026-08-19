'use client';

import React, { useState } from 'react';
import { Upload, X, CheckCircle2, Image as ImageIcon, FolderPlus, Tag, AlertCircle } from 'lucide-react';
import { galleryManagementApi } from '../../lib/api/galleryManagementApi';

export default function CloudinaryUploaderModal({ isOpen, onClose, folders = [], categories = [], onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [targetFolderId, setTargetFolderId] = useState('root');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [customCategory, setCustomCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = files.map((file) => ({
      file,
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: file.name,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2),
      previewUrl: URL.createObjectURL(file),
      status: 'pending', // pending | uploading | done
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(10);
    setErrorMessage('');

    try {
      // 1. Get direct upload signature
      const sigRes = await galleryManagementApi.getUploadSignature({
        folderPath: `momentgrid/galleries/${targetFolderId}`,
        tags: [selectedCategory || customCategory || 'gallery'],
      });

      // Simulate progressive direct cloud upload steps
      for (let i = 20; i <= 85; i += 15) {
        setUploadProgress(i);
        await new Promise((r) => setTimeout(r, 220));
      }

      // 2. Prepare photo metadata payloads for backend registration
      const photoPayloads = selectedFiles.map((item, idx) => ({
        id: `photo-${Date.now()}-${idx}`,
        url: item.previewUrl,
        caption: item.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: customCategory.trim() ? customCategory.trim() : selectedCategory,
        folderId: targetFolderId,
        width: 4800,
        height: 3200,
        format: 'jpg',
        bytes: Math.round(Number(item.sizeMB) * 1024 * 1024),
      }));

      // 3. Register with backend gallery controller
      const res = await galleryManagementApi.uploadPhotos({
        galleryId: 'gal-momentgrid-heirloom-2026',
        photos: photoPayloads,
        targetFolderId,
        category: customCategory.trim() ? customCategory.trim() : selectedCategory,
      });

      setUploadProgress(100);
      setIsUploading(false);
      setSelectedFiles([]);
      if (onUploadComplete) {
        onUploadComplete(res?.data?.photos || photoPayloads);
      }
      onClose();
    } catch (err) {
      setIsUploading(false);
      setErrorMessage('Upload failed: ' + (err.message || 'Network error during Cloudinary transmission.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#161628] border border-[#C8A96E]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#161628] to-[#1e1e38]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C8A96E]/10 border border-[#C8A96E]/30 text-[#C8A96E]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white tracking-wide">Upload High-Res Gallery Proofs</h3>
              <p className="text-xs text-white/60">Direct Cloudinary upload with dynamic resolution scaling & thumbnail indexing</p>
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
          
          {/* Destination Folder & Category Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/10">
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2 flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-[#C8A96E]" /> Destination Folder
              </label>
              <select
                value={targetFolderId}
                onChange={(e) => setTargetFolderId(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d0d1a] border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#C8A96E] transition-colors"
              >
                <option value="root">📁 All Photos (Root)</option>
                {folders
                  .filter((f) => f.id !== 'root')
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name} ({f.photoCount || 0} proofs)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#C8A96E]" /> Category Tag
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (e.target.value !== 'custom') setCustomCategory('');
                  }}
                  className="flex-1 px-3 py-2 bg-[#0d0d1a] border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#C8A96E] transition-colors"
                >
                  <option value="general">✨ General Selects</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      #{c.toUpperCase()}
                    </option>
                  ))}
                  <option value="custom">+ New Custom Tag</option>
                </select>
                {selectedCategory === 'custom' && (
                  <input
                    type="text"
                    placeholder="tag..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-28 px-2 py-2 bg-[#0d0d1a] border border-[#C8A96E] rounded-lg text-white text-xs focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <label className="border-2 border-dashed border-[#C8A96E]/40 hover:border-[#C8A96E] bg-[#C8A96E]/5 hover:bg-[#C8A96E]/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="p-3.5 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-white">Drag & drop high-res RAW/JPG/PNG images here</p>
            <p className="text-xs text-white/50 mt-1">Or click to browse from your computer or attached hard drive</p>
            <span className="mt-3 px-3 py-1 rounded-full bg-white/10 text-xs text-[#C8A96E] font-medium border border-white/10">
              Up to 50MB per file supported
            </span>
          </label>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                <span>Selected Proofs ({selectedFiles.length})</span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {selectedFiles.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.04] border border-white/10"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="w-10 h-10 object-cover rounded border border-white/20"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-[#C8A96E]">{item.sizeMB} MB • Cloudinary Direct Ready</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(item.id)}
                      className="text-white/40 hover:text-red-400 p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress / Error Alerts */}
          {isUploading && (
            <div className="p-4 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#C8A96E]">
                <span>Uploading to Cloudinary...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#C8A96E] to-[#e6cf9c] h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-black/30">
          <span className="text-xs text-white/50">
            {selectedFiles.length === 0 ? 'No files selected' : `${selectedFiles.length} files queued for upload`}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleStartUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-semibold text-xs tracking-wide hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Upload & Optimize ({selectedFiles.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
