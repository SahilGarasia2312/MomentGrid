'use strict';
'use client';

import React, { useState } from 'react';
import { UploadCloud, Lock, Check, Plus, Trash2, Image as ImageIcon, Sparkles, Send } from 'lucide-react';

export default function PhotographerGalleryUploadTab({ initialEvent, onGalleryUploaded }) {
  const [title, setTitle] = useState(initialEvent ? `${initialEvent.title} - Select Proofs` : '');
  const [pinCode, setPinCode] = useState('8842');
  const [clientEmail, setClientEmail] = useState(initialEvent?.clientEmail || '');
  const [photos, setPhotos] = useState([
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', caption: 'Ceremony Grand Entrance' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', caption: 'Sunset Cliffs First Look' },
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (newPhotoUrl.trim()) {
      setPhotos([...photos, { url: newPhotoUrl.trim(), caption: newCaption.trim() || `Select Proof #${photos.length + 1}` }]);
      setNewPhotoUrl('');
      setNewCaption('');
    }
  };

  const handleRemovePhoto = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e, status = 'published') => {
    e.preventDefault();
    if (!title || !pinCode || photos.length === 0) return;
    setIsSubmitting(true);
    setUploadSuccess(false);
    try {
      if (onGalleryUploaded) {
        await onGalleryUploaded({
          title,
          pinCode,
          eventId: initialEvent?.id || null,
          clientEmail: clientEmail || 'client@example.com',
          photos,
          status,
        });
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to upload proof gallery:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8A96E', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              <Sparkles size={16} /> Client Proof Delivery Portal
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
              Upload & Publish Client Proof Gallery
            </h3>
          </div>
          {uploadSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '8px 16px', borderRadius: '12px', fontWeight: 600, fontSize: '13px' }}>
              <Check size={16} /> Proof Gallery Published successfully!
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F3', marginBottom: '8px' }}>
              Gallery Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sarah & Michael Wedding Selects"
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 14px', color: '#F8F6F3', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F3', marginBottom: '8px' }}>
              Client Email Address
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="sarah.mitchell@example.com"
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 14px', color: '#F8F6F3', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F3', marginBottom: '8px' }}>
              4-Digit Security PIN Code
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C8A96E' }} />
              <input
                type="text"
                maxLength={4}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 14px 12px 40px', color: '#F8F6F3', fontWeight: 700, letterSpacing: '0.2em', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Add Photo Input Row */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#F8F6F3', marginTop: 0, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={18} style={{ color: '#C8A96E' }} /> Add High-Resolution Photo Selects ({photos.length} in queue)
          </h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="url"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="Paste high-res image URL (e.g. from Cloudinary/AWS S3)..."
              style={{ flex: 2, minWidth: '240px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', outline: 'none' }}
            />
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Caption (optional)"
              style={{ flex: 1, minWidth: '160px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', outline: 'none' }}
            />
            <button
              type="button"
              onClick={handleAddPhoto}
              style={{ backgroundColor: 'rgba(200, 169, 110, 0.18)', border: '1px solid #C8A96E', borderRadius: '8px', padding: '10px 20px', color: '#C8A96E', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add to Gallery
            </button>
          </div>
        </div>

        {/* Photos Grid Queue */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {photos.map((p, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0e0e18',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '140px', overflow: 'hidden' }}>
                <img src={p.url} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#B8B8C6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.caption}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '2px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={isSubmitting || photos.length === 0}
            style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '10px', padding: '12px 24px', color: '#B8B8C6', fontWeight: 600, cursor: 'pointer' }}
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={isSubmitting || !title || photos.length === 0}
            style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)', border: 'none', borderRadius: '10px', padding: '12px 28px', color: '#121220', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(200, 169, 110, 0.3)' }}
          >
            <Send size={16} /> {isSubmitting ? 'Publishing Gallery...' : 'Publish Proofs & Notify Client'}
          </button>
        </div>
      </div>
    </div>
  );
}
