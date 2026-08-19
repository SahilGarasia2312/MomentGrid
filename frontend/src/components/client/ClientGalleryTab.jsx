'use strict';
'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Heart, Lock, CheckCircle2, Sparkles, Grid, Maximize2, X, Download } from 'lucide-react';

export default function ClientGalleryTab({ galleries = [], onToggleFavorite }) {
  const [activeGalleryId, setActiveGalleryId] = useState(null);
  const [pinInput, setPinInput] = useState({});
  const [unlockedGalleries, setUnlockedGalleries] = useState({});
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const displayGalleries = galleries.length > 0 ? galleries : [
    {
      id: 'gal-sample-1',
      title: 'Autumn Golden Hour Lookbook — Proof Selects',
      pinCode: '2026',
      coverUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      photos: [
        { id: 'p1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', caption: 'Golden Hour Portrait #1', isFavorite: true },
        { id: 'p2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', caption: 'Heirloom Vows #2', isFavorite: false },
        { id: 'p3', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80', caption: 'Big Sur Coastline #3', isFavorite: true },
        { id: 'p4', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80', caption: 'Bridal Party Walk #4', isFavorite: false },
      ],
      status: 'published',
    },
    {
      id: 'gal-sample-2',
      title: 'Sunset Beach Engagement — High Res Deliverables',
      pinCode: null,
      coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      photos: [
        { id: 'p5', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', caption: 'Engagement Toast #1', isFavorite: false },
        { id: 'p6', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', caption: 'Engagement Ring Detail #2', isFavorite: false },
      ],
      status: 'published',
    },
  ];

  const activeGallery = displayGalleries.find((g) => (g.id || g._id) === activeGalleryId) || displayGalleries[0] || null;
  const isPinRequired = activeGallery && activeGallery.pinCode && !unlockedGalleries[activeGallery.id || activeGallery._id];

  const handleUnlockPin = (galleryId, correctPin) => {
    if (pinInput[galleryId] === correctPin) {
      setUnlockedGalleries({ ...unlockedGalleries, [galleryId]: true });
    } else {
      alert('Incorrect 4-digit PIN code for this gallery.');
    }
  };

  const handleFavoriteClick = async (photoId) => {
    if (!activeGallery) return;
    const galleryId = activeGallery.id || activeGallery._id;
    if (onToggleFavorite) {
      await onToggleFavorite(galleryId, photoId);
    } else {
      // Optimistic state flip for sample demo
      const photo = activeGallery.photos.find((p) => p.id === photoId);
      if (photo) photo.isFavorite = !photo.isFavorite;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Gallery Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
            Digital Proof Galleries & Selects
          </h2>
          <p style={{ color: '#B8B8C6', fontSize: '14px', margin: '4px 0 0 0' }}>
            Click the heart icon to curate favorite shots for your print lookbooks or download high-res files.
          </p>
        </div>

        {/* Gallery Dropdown Selector */}
        {displayGalleries.length > 1 && (
          <select
            value={activeGallery ? activeGallery.id || activeGallery._id : ''}
            onChange={(e) => setActiveGalleryId(e.target.value)}
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(200, 169, 110, 0.4)',
              borderRadius: '10px',
              padding: '10px 16px',
              color: '#F8F6F3',
              fontSize: '14px',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {displayGalleries.map((g) => (
              <option key={g.id || g._id} value={g.id || g._id}>
                {g.title} ({g.photos?.length || 0} photos)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main Gallery Display Area */}
      {activeGallery ? (
        isPinRequired ? (
          /* PIN Verification Gate */
          <div
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(200, 169, 110, 0.4)',
              borderRadius: '16px',
              padding: '48px 32px',
              textAlign: 'center',
              maxWidth: '480px',
              margin: '32px auto',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 169, 110, 0.15)',
                color: '#C8A96E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <Lock size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 8px 0' }}>
              PIN Protected Gallery
            </h3>
            <p style={{ color: '#B8B8C6', fontSize: '14px', marginBottom: '24px' }}>
              Please enter the 4-digit security PIN provided by your photographer to unlock &ldquo;{activeGallery.title}&rdquo;.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <input
                type="password"
                maxLength={6}
                placeholder="PIN"
                value={pinInput[activeGallery.id || activeGallery._id] || ''}
                onChange={(e) => setPinInput({ ...pinInput, [activeGallery.id || activeGallery._id]: e.target.value })}
                style={{
                  width: '120px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#F8F6F3',
                  textAlign: 'center',
                  fontSize: '18px',
                  letterSpacing: '0.2em',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleUnlockPin(activeGallery.id || activeGallery._id, activeGallery.pinCode)}
                style={{
                  background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  color: '#121220',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Unlock
              </button>
            </div>
          </div>
        ) : (
          /* Unlocked Photo Grid */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#B8B8C6' }}>
                Showing <strong style={{ color: '#F8F6F3' }}>{activeGallery.photos.length}</strong> proofs •{' '}
                <strong style={{ color: '#C8A96E' }}>
                  {activeGallery.photos.filter((p) => p.isFavorite).length} favorites selected
                </strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {activeGallery.photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    backgroundColor: '#161628',
                    border: photo.isFavorite ? '2px solid #C8A96E' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  <div
                    onClick={() => setLightboxPhoto(photo)}
                    style={{
                      position: 'relative',
                      paddingTop: '66.67%', // 3:2 aspect ratio
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>

                  <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#161628' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#F8F6F3', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {photo.caption || 'Photo Select'}
                    </span>

                    <button
                      onClick={() => handleFavoriteClick(photo.id)}
                      title={photo.isFavorite ? 'Remove from favorites' : 'Mark as favorite select'}
                      style={{
                        background: photo.isFavorite ? 'rgba(200, 169, 110, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: photo.isFavorite ? '1px solid #C8A96E' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: photo.isFavorite ? '#C8A96E' : '#B8B8C6',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Heart size={15} fill={photo.isFavorite ? '#C8A96E' : 'none'} />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{photo.isFavorite ? 'Selected' : 'Select'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9A9AA6', fontSize: '15px' }}>
          No digital proof galleries currently available.
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {lightboxPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '40px',
          }}
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            style={{ position: 'relative', maxWidth: '1100px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                background: 'transparent',
                border: 'none',
                color: '#F8F6F3',
                cursor: 'pointer',
              }}
            >
              <X size={28} />
            </button>
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption}
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
            />
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '20px', color: '#F8F6F3' }}>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>{lightboxPhoto.caption}</span>
              <button
                onClick={() => handleFavoriteClick(lightboxPhoto.id)}
                style={{
                  background: lightboxPhoto.isFavorite ? '#C8A96E' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: lightboxPhoto.isFavorite ? '#121220' : '#F8F6F3',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Heart size={16} fill={lightboxPhoto.isFavorite ? '#121220' : 'none'} />
                <span>{lightboxPhoto.isFavorite ? 'Favorited Select' : 'Mark as Favorite'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
