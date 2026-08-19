'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Shield,
  Share2,
  FolderPlus,
  Sparkles,
  RefreshCw,
  Eye,
  CheckSquare,
  Trash2,
  FolderInput,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { galleryManagementApi } from '../../lib/api/galleryManagementApi';
import CloudinaryUploaderModal from '../../components/gallery-manager/CloudinaryUploaderModal';
import FolderAndCategorySidebar from '../../components/gallery-manager/FolderAndCategorySidebar';
import SearchFilterPaginationBar from '../../components/gallery-manager/SearchFilterPaginationBar';
import OptimizedLazyPhotoGrid from '../../components/gallery-manager/OptimizedLazyPhotoGrid';
import WatermarkSettingsDrawer from '../../components/gallery-manager/WatermarkSettingsDrawer';
import SharingAndDownloadModal from '../../components/gallery-manager/SharingAndDownloadModal';

export default function GalleryManagerPage() {
  const [galleryId] = useState('gal-momentgrid-heirloom-2026');
  const [galleryTitle, setGalleryTitle] = useState('Elena & Marcus — Villa d’Este Destination Wedding');
  
  // State for Photos, Folders, Categories, and Pagination
  const [photos, setPhotos] = useState([]);
  const [folders, setFolders] = useState([
    { id: 'root', name: 'All Photos', parentId: null, photoCount: 16 },
    { id: 'getting-ready', name: 'Getting Ready', parentId: 'root', photoCount: 4 },
    { id: 'ceremony', name: 'Ceremony & Vows', parentId: 'root', photoCount: 6 },
    { id: 'reception', name: 'Reception Gala', parentId: 'root', photoCount: 6 },
  ]);
  const [categories, setCategories] = useState(['wedding', 'editorial', 'portrait', 'black-and-white', 'details']);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    totalItems: 16,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter & Search State
  const [activeFolderId, setActiveFolderId] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Watermark & Sharing State
  const [isWatermarkActive, setIsWatermarkActive] = useState(true);
  const [watermarkConfig, setWatermarkConfig] = useState({
    enabled: true,
    text: '© MomentGrid Collective',
    opacity: 45,
    position: 'south_east',
  });
  const [sharingConfig, setSharingConfig] = useState({
    isPublic: true,
    requirePin: true,
    pinCode: '2026',
    allowDownloads: true,
  });

  // Selection & Modal States
  const [selectedIds, setSelectedIds] = useState([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isWatermarkDrawerOpen, setIsWatermarkDrawerOpen] = useState(false);
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // Fetch or filter photos
  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await galleryManagementApi.listPhotos({
        galleryId,
        searchQuery,
        category: activeCategory,
        folderId: activeFolderId,
        favoritesOnly,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (res?.data) {
        setPhotos(res.data.photos || []);
        if (res.data.folders) setFolders(res.data.folders);
        if (res.data.categories) setCategories(res.data.categories);
        if (res.data.watermarkConfig) setWatermarkConfig(res.data.watermarkConfig);
        if (res.data.sharingConfig) setSharingConfig(res.data.sharingConfig);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load gallery photos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [galleryId, searchQuery, activeCategory, activeFolderId, favoritesOnly, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Batch Selection Handlers
  const handleToggleSelect = (photoId) => {
    setSelectedIds((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === photos.length && photos.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(photos.map((p) => p.id));
    }
  };

  const handleToggleFavorite = async (photoId) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleMoveToFolder = async (photoId, targetFolderId) => {
    try {
      await galleryManagementApi.manageFolders({
        galleryId,
        action: 'move_photos',
        folderPayload: { photoIds: [photoId], targetFolderId },
      });
      fetchPhotos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBatchMove = async (targetFolderId) => {
    if (selectedIds.length === 0) return;
    try {
      await galleryManagementApi.manageFolders({
        galleryId,
        action: 'move_photos',
        folderPayload: { photoIds: selectedIds, targetFolderId },
      });
      setSelectedIds([]);
      fetchPhotos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0 || !window.confirm(`Delete ${selectedIds.length} selected proofs permanently?`)) return;
    setPhotos((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  const handleDownloadSingle = (photo) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.caption || photo.id}.jpg`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col font-sans selection:bg-[#C8A96E]/30 selection:text-[#C8A96E]">
      
      {/* Top Navigation / Action Bar */}
      <header className="sticky top-0 z-40 bg-[#161628]/95 border-b border-white/10 backdrop-blur-md px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] text-[10px] font-bold uppercase tracking-widest border border-[#C8A96E]/40">
              Gallery Management Module
            </span>
            <span className="text-xs text-white/50">• Collection #{galleryId.slice(-4)}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1 flex items-center gap-2">
            <span>{galleryTitle}</span>
          </h1>
        </div>

        {/* Action Toolbar buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Watermark Preview Toggle */}
          <button
            onClick={() => setIsWatermarkActive(!isWatermarkActive)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isWatermarkActive
                ? 'bg-[#C8A96E]/20 text-white border-[#C8A96E]/60 shadow-sm'
                : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
            }`}
            title="Toggle watermark overlay simulation on proofs"
          >
            <Eye className="w-3.5 h-3.5 text-[#C8A96E]" />
            <span>Watermark: {isWatermarkActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Configure Watermark Drawer Trigger */}
          <button
            onClick={() => setIsWatermarkDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-[#C8A96E]" />
            <span className="hidden sm:inline">Watermark</span> Settings
          </button>

          {/* Delivery & Sharing Modal Trigger */}
          <button
            onClick={() => setIsSharingModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C8A96E]" />
            <span className="hidden sm:inline">Share &</span> Delivery
          </button>

          {/* Upload New Proofs Button */}
          <button
            onClick={() => setIsUploaderOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-bold text-xs tracking-wide hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Proofs</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar: Folders & Categories Tree */}
        <FolderAndCategorySidebar
          galleryId={galleryId}
          folders={folders}
          categories={categories}
          activeFolderId={activeFolderId}
          activeCategory={activeCategory}
          onSelectFolder={(fId) => {
            setActiveFolderId(fId);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          onFoldersUpdated={(newFolders) => setFolders(newFolders)}
        />

        {/* Right Gallery Proofs View */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          
          {/* Search, Filter & Pagination Bar */}
          <SearchFilterPaginationBar
            searchQuery={searchQuery}
            onSearchChange={(query) => {
              setSearchQuery(query);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            favoritesOnly={favoritesOnly}
            onToggleFavorites={() => {
              setFavoritesOnly(!favoritesOnly);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            pagination={pagination}
            onPageChange={(pPage) => setPagination((prev) => ({ ...prev, page: pPage }))}
            onLimitChange={(pLimit) => setPagination((prev) => ({ ...prev, limit: pLimit, page: 1 }))}
            isSelectAll={selectedIds.length === photos.length && photos.length > 0}
            onToggleSelectAll={handleToggleSelectAll}
            selectedCount={selectedIds.length}
          />

          {/* Batch Operation Floating Bar (Only shown when items are selected) */}
          {selectedIds.length > 0 && (
            <div className="bg-gradient-to-r from-[#161628] via-[#1f1f3a] to-[#161628] border border-[#C8A96E] rounded-2xl p-3.5 px-5 flex items-center justify-between gap-4 shadow-2xl animate-in fade-in slide-in-from-top duration-200">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-[#C8A96E]/20 text-[#C8A96E]">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Batch Operations ({selectedIds.length} selected)</p>
                  <p className="text-[10px] text-white/60">Manage multiple proofs simultaneously across folders</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Batch Move Dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) handleBatchMove(e.target.value);
                  }}
                  defaultValue=""
                  className="px-3 py-1.5 bg-[#0d0d1a] border border-white/20 rounded-lg text-xs text-white/90 focus:outline-none focus:border-[#C8A96E] cursor-pointer"
                >
                  <option value="" disabled>📁 Move to Folder...</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>

                {/* Batch Download Button */}
                <button
                  onClick={() => setIsSharingModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C8A96E]" />
                  <span>Download Selects</span>
                </button>

                {/* Batch Delete Button */}
                <button
                  onClick={handleBatchDelete}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}

          {/* Masonry Proofs Grid / Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/2] rounded-2xl bg-white/[0.04] animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <OptimizedLazyPhotoGrid
              photos={photos}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleFavorite={handleToggleFavorite}
              onDownloadSingle={handleDownloadSingle}
              onOpenLightbox={(photo) => setLightboxPhoto(photo)}
              isWatermarkActive={isWatermarkActive}
              watermarkConfig={watermarkConfig}
              onMoveToFolder={handleMoveToFolder}
              folders={folders}
            />
          )}

        </div>
      </main>

      {/* ── Modals & Drawers Suite ── */}
      <CloudinaryUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        folders={folders}
        categories={categories}
        onUploadComplete={(added) => {
          setPhotos((prev) => [...added, ...prev]);
          fetchPhotos();
        }}
      />

      <WatermarkSettingsDrawer
        isOpen={isWatermarkDrawerOpen}
        onClose={() => setIsWatermarkDrawerOpen(false)}
        galleryId={galleryId}
        initialConfig={watermarkConfig}
        onConfigSaved={(newConfig) => setWatermarkConfig(newConfig)}
      />

      <SharingAndDownloadModal
        isOpen={isSharingModalOpen}
        onClose={() => setIsSharingModalOpen(false)}
        galleryId={galleryId}
        galleryTitle={galleryTitle}
        sharingConfig={sharingConfig}
        onSharingSaved={(newConfig) => setSharingConfig(newConfig)}
      />

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 select-none"
          onClick={() => setLightboxPhoto(null)}
        >
          {/* Top Lightbox Bar */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-white/80 z-20">
            <div>
              <h4 className="text-sm font-semibold text-white">{lightboxPhoto.caption}</h4>
              <p className="text-xs text-white/50">
                #{lightboxPhoto.category || 'general'} • {((lightboxPhoto.bytes || 2048000) / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleToggleFavorite(lightboxPhoto.id)}
                className={`p-2 rounded-xl border transition-all ${
                  lightboxPhoto.isFavorite
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-white/10 text-white hover:text-rose-400 border-white/20'
                }`}
              >
                <Eye className="w-4 h-4 hidden" />
                <span className="text-xs font-bold">{lightboxPhoto.isFavorite ? '♥ Favorite' : '♡ Add to Favorites'}</span>
              </button>
              <button
                onClick={() => handleDownloadSingle(lightboxPhoto)}
                className="px-4 py-2 rounded-xl bg-[#C8A96E] text-black font-bold text-xs flex items-center gap-1.5 hover:brightness-110"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res</span>
              </button>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Lightbox Image with Watermark Simulation */}
          <div
            className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            {isWatermarkActive && watermarkConfig.enabled && (
              <div
                className="absolute inset-0 pointer-events-none flex items-end justify-end p-6 select-none"
                style={{ opacity: (watermarkConfig.opacity || 45) / 100 }}
              >
                <span className="px-4 py-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/30 text-white font-bold tracking-widest text-sm uppercase shadow-2xl">
                  {watermarkConfig.text || '© MomentGrid'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
