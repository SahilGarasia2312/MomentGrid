'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, CheckCircle, ArrowRight, Eye, X, RefreshCw } from 'lucide-react';
import { albumSelectionApi } from '../../lib/api/albumSelectionApi';

import AlbumHeaderAndStatusBar from './AlbumHeaderAndStatusBar';
import PhotoCuratorGrid from './PhotoCuratorGrid';
import SpreadArrangerBoard from './SpreadArrangerBoard';
import CoverAndSizingCustomizer from './CoverAndSizingCustomizer';
import PhotoCommentModal from './PhotoCommentModal';
import FinalSubmissionModal from './FinalSubmissionModal';
import StudioApprovedManifestView from './StudioApprovedManifestView';

export default function AlbumSelectorSuite({
  galleryId = 'gal-momentgrid-heirloom-2026',
  clientEmail = 'elena.rossi@momentgrid.com',
  clientName = 'Elena & Marcus Rossi',
}) {
  const [albumState, setAlbumState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('curate'); // 'curate' | 'arrange' | 'styling' | 'review'

  // Modals state
  const [commentModalPhoto, setCommentModalPhoto] = useState(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [savingAction, setSavingAction] = useState(false);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    albumSelectionApi
      .getOrStartDraft({ galleryId, clientEmail, clientName })
      .then((res) => {
        if (isMounted && res?.data) {
          setAlbumState(res.data);
        }
        if (isMounted) setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [galleryId, clientEmail, clientName]);

  if (loading) {
    return (
      <div className="min-h-[700px] bg-[#0A0A14] flex flex-col items-center justify-center text-center p-8 text-white">
        <Sparkles className="w-12 h-12 text-[#C8A96E] animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-wide">Loading Album Selection Session...</h2>
        <p className="text-xs text-white/50 mt-1 max-w-sm">
          Retrieving proof gallery, existing favorites, and spread arrangement for {clientName}.
        </p>
      </div>
    );
  }

  if (!albumState) {
    return (
      <div className="min-h-[500px] bg-[#0A0A14] flex flex-col items-center justify-center p-8 text-white text-center">
        <p>Failed to initialize album draft session.</p>
      </div>
    );
  }

  const {
    id: albumId,
    title,
    status,
    favoritedPhotoIds = [],
    rejectedPhotoIds = [],
    orderedPhotoIds = [],
    photoComments = [],
    availablePhotos = [],
    albumSize = '12x12 Master Luxe',
    pageCount = 40,
    coverMaterial = 'Italian Leather - Obsidian Black',
    coverSpecs = {},
    clientNotes = '',
  } = albumState;

  // Handlers
  const handleToggleFavorite = async (photoId) => {
    setSavingAction(true);
    try {
      const res = await albumSelectionApi.updateSelection({
        albumId,
        action: 'toggle_favorite',
        photoId,
      });
      if (res?.data) setAlbumState(res.data);
    } finally {
      setSavingAction(false);
    }
  };

  const handleToggleReject = async (photoId) => {
    setSavingAction(true);
    try {
      const res = await albumSelectionApi.updateSelection({
        albumId,
        action: 'toggle_reject',
        photoId,
      });
      if (res?.data) setAlbumState(res.data);
    } finally {
      setSavingAction(false);
    }
  };

  const handleReorderSequence = async (newOrderedIds) => {
    setSavingAction(true);
    try {
      const res = await albumSelectionApi.updateSelection({
        albumId,
        action: 'set_order',
        orderedPhotoIds: newOrderedIds,
      });
      if (res?.data) setAlbumState(res.data);
    } finally {
      setSavingAction(false);
    }
  };

  const handleRemoveFromSelection = async (photoId) => {
    const isFav = favoritedPhotoIds.includes(photoId);
    if (isFav) {
      await handleToggleFavorite(photoId);
    }
  };

  const handleSaveComment = async (photoId, comment) => {
    const res = await albumSelectionApi.addOrUpdateComment({
      albumId,
      photoId,
      comment,
      clientName,
    });
    if (res?.data) setAlbumState(res.data);
  };

  const handleSaveCoverSpecs = async (updates) => {
    const res = await albumSelectionApi.configureCoverAndSize({
      albumId,
      ...updates,
    });
    if (res?.data) setAlbumState(res.data);
  };

  const handleSubmitConfirm = async () => {
    const res = await albumSelectionApi.submitAlbum({ albumId });
    if (res?.data) {
      setAlbumState(res.data);
      setCurrentStep('review');
    }
  };

  const getCommentForPhoto = (photoId) => {
    const found = photoComments.find((c) => c.photoId === photoId);
    return found ? found.comment : '';
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white flex flex-col font-sans pb-24 selection:bg-[#C8A96E]/30 selection:text-white">
      
      {/* Sticky Header & Progress Bar */}
      <AlbumHeaderAndStatusBar
        albumTitle={title}
        clientName={clientName}
        status={status}
        favoritedCount={favoritedPhotoIds.length}
        rejectedCount={rejectedPhotoIds.length}
        orderedCount={orderedPhotoIds.length}
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
        minPhotosRequired={10}
        onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)}
      />

      {/* Main Content Area based on active step */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        
        {currentStep === 'curate' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161628] p-6 rounded-3xl border border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Step 1: Select Your Must-Have Spread Proofs</span>
                  {savingAction && <RefreshCw className="w-4 h-4 text-[#C8A96E] animate-spin" />}
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  Click the golden star (<strong className="text-[#C8A96E]">★</strong>) on any photo to mark it for your album spreads. Click the message icon to attach specific cropping or retouching notes.
                </p>
              </div>
              <button
                onClick={() => setCurrentStep('arrange')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-bold text-xs flex items-center gap-2 self-start md:self-auto hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20"
              >
                <span>Proceed to Storyboard Arrangement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <PhotoCuratorGrid
              photos={availablePhotos}
              favoritedPhotoIds={favoritedPhotoIds}
              rejectedPhotoIds={rejectedPhotoIds}
              photoComments={photoComments}
              onToggleFavorite={handleToggleFavorite}
              onToggleReject={handleToggleReject}
              onOpenCommentModal={(photo) => setCommentModalPhoto(photo)}
              onOpenLightbox={(photo) => setLightboxPhoto(photo)}
              status={status}
            />
          </div>
        )}

        {currentStep === 'arrange' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Step 2: Spread Sequence & Storyboard</h2>
              <button
                onClick={() => setCurrentStep('styling')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20"
              >
                <span>Proceed to Cover & Sizing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <SpreadArrangerBoard
              photos={availablePhotos}
              orderedPhotoIds={orderedPhotoIds}
              photoComments={photoComments}
              onReorderSequence={handleReorderSequence}
              onRemoveFromSelection={handleRemoveFromSelection}
              onOpenCommentModal={(photo) => setCommentModalPhoto(photo)}
              status={status}
            />
          </div>
        )}

        {currentStep === 'styling' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Step 3: Cover Styling & Dimensions</h2>
              <button
                onClick={() => setCurrentStep('review')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20"
              >
                <span>Proceed to Final Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <CoverAndSizingCustomizer
              albumSize={albumSize}
              pageCount={pageCount}
              coverSpecs={coverSpecs}
              clientNotes={clientNotes}
              availablePhotos={availablePhotos.filter((p) => favoritedPhotoIds.includes(p.id))}
              onSaveSpecs={handleSaveCoverSpecs}
              status={status}
            />
          </div>
        )}

        {currentStep === 'review' && (
          <StudioApprovedManifestView
            albumId={albumId}
            onBackToSelector={status === 'selecting' ? () => setCurrentStep('curate') : null}
          />
        )}

      </main>

      {/* Retouching Note Modal */}
      <PhotoCommentModal
        isOpen={Boolean(commentModalPhoto)}
        photo={commentModalPhoto}
        initialComment={commentModalPhoto ? getCommentForPhoto(commentModalPhoto.id) : ''}
        onClose={() => setCommentModalPhoto(null)}
        onSaveComment={handleSaveComment}
      />

      {/* Final Sign-Off Submission Modal */}
      <FinalSubmissionModal
        isOpen={isSubmissionModalOpen}
        albumTitle={title}
        favoritedCount={favoritedPhotoIds.length}
        orderedCount={orderedPhotoIds.length}
        albumSize={albumSize}
        pageCount={pageCount}
        coverMaterial={coverSpecs?.material || coverMaterial}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSubmitConfirm={handleSubmitConfirm}
      />

      {/* Full-Screen Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxPhoto(null)}
        >
          <div className="max-w-6xl max-h-full flex flex-col items-center gap-4 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute -top-12 right-0 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption}
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <div className="bg-[#161628]/90 border border-white/10 px-6 py-3 rounded-2xl max-w-2xl text-center">
              <p className="text-sm font-bold text-white">{lightboxPhoto.caption}</p>
              <p className="text-xs text-white/50 mt-0.5">Proof #{lightboxPhoto.id} • Category: {lightboxPhoto.category}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
