'use client';

import React, { useState } from 'react';
import { Folder, FolderPlus, Tag, Plus, Check, Edit3, Trash2, ChevronRight, Layers } from 'lucide-react';
import { galleryManagementApi } from '../../lib/api/galleryManagementApi';

export default function FolderAndCategorySidebar({
  galleryId = 'gal-momentgrid-heirloom-2026',
  folders = [],
  categories = [],
  activeFolderId,
  activeCategory,
  onSelectFolder,
  onSelectCategory,
  onFoldersUpdated,
}) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await galleryManagementApi.manageFolders({
        galleryId,
        action: 'create',
        folderPayload: { name: newFolderName.trim(), parentId: 'root' },
      });

      setIsSubmitting(false);
      setIsCreatingFolder(false);
      setNewFolderName('');
      if (onFoldersUpdated && res?.data?.folders) {
        onFoldersUpdated(res.data.folders);
      }
    } catch (err) {
      setIsSubmitting(false);
      setIsCreatingFolder(false);
    }
  };

  const handleDeleteFolder = async (folderId, e) => {
    e.stopPropagation();
    if (folderId === 'root' || !window.confirm('Delete this folder and move all its proofs back to root?')) return;

    try {
      const res = await galleryManagementApi.manageFolders({
        galleryId,
        action: 'delete',
        folderPayload: { folderId },
      });
      if (onFoldersUpdated && res?.data?.folders) {
        onFoldersUpdated(res.data.folders);
      }
      if (activeFolderId === folderId) onSelectFolder('all');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-[#161628]/80 border border-[#C8A96E]/20 rounded-2xl p-5 flex flex-col gap-6 shadow-xl backdrop-blur-sm shrink-0">
      
      {/* ── Folder Hierarchy Section ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A96E] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Proof Folders
          </h4>
          <button
            onClick={() => setIsCreatingFolder(!isCreatingFolder)}
            className="p-1 rounded bg-[#C8A96E]/10 hover:bg-[#C8A96E]/20 text-[#C8A96E] transition-colors"
            title="Create new folder"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* New Folder Inline Form */}
        {isCreatingFolder && (
          <form onSubmit={handleCreateFolder} className="mb-3 p-2 rounded-lg bg-white/[0.04] border border-[#C8A96E]/30 space-y-2">
            <input
              type="text"
              placeholder="Folder Name (e.g. First Look)..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              className="w-full px-2.5 py-1.5 bg-[#0d0d1a] border border-white/20 rounded text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C8A96E]"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setIsCreatingFolder(false)}
                className="px-2 py-1 text-[10px] text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newFolderName.trim()}
                className="px-2.5 py-1 rounded bg-[#C8A96E] text-black font-semibold text-[10px] flex items-center gap-1 hover:brightness-110"
              >
                {isSubmitting ? '...' : <Check className="w-3 h-3" />} Add
              </button>
            </div>
          </form>
        )}

        <div className="space-y-1">
          {/* All Photos Trigger */}
          <button
            onClick={() => onSelectFolder('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeFolderId === 'all'
                ? 'bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-semibold shadow-md shadow-[#C8A96E]/10'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4 shrink-0" />
              <span>All Collection</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeFolderId === 'all' ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-white/70'
            }`}>
              {folders.find((f) => f.id === 'root')?.photoCount || 16}
            </span>
          </button>

          {/* Individual Folders */}
          {folders
            .filter((f) => f.id !== 'root')
            .map((folder) => {
              const isActive = activeFolderId === folder.id;
              return (
                <div
                  key={folder.id}
                  onClick={() => onSelectFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all group ${
                    isActive
                      ? 'bg-[#C8A96E]/20 border border-[#C8A96E]/50 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate pr-1">
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform shrink-0 ${isActive ? 'rotate-90 text-[#C8A96E]' : 'text-white/30'}`} />
                    <span className="truncate">{folder.name}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-[#C8A96E] text-black font-bold' : 'bg-white/10 text-white/60'
                    }`}>
                      {folder.photoCount || 0}
                    </span>
                    <button
                      onClick={(e) => handleDeleteFolder(folder.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-red-400 transition-opacity"
                      title="Delete folder"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ── Categories Hashtags Section ── */}
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A96E] flex items-center gap-1.5 mb-3">
          <Tag className="w-3.5 h-3.5" /> Category Filters
        </h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
              activeCategory === 'all'
                ? 'bg-[#C8A96E] text-black border-[#C8A96E] font-semibold'
                : 'bg-white/5 text-white/70 border-white/10 hover:border-[#C8A96E]/50 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                  isActive
                    ? 'bg-[#C8A96E] text-black border-[#C8A96E] font-semibold shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:border-[#C8A96E]/50 hover:text-white'
                }`}
              >
                #{cat.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Quota / Quick Stats */}
      <div className="border-t border-white/10 pt-4 mt-auto">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs text-white/70">
          <div className="flex justify-between items-center font-medium">
            <span>Cloudinary CDN</span>
            <span className="text-[#C8A96E]">Active</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#C8A96E] h-full w-2/5" />
          </div>
          <div className="flex justify-between text-[10px] text-white/50">
            <span>48.2 MB used</span>
            <span>2.0 GB quota</span>
          </div>
        </div>
      </div>

    </aside>
  );
}
