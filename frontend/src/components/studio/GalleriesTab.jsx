'use strict';
'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Lock, Heart, ExternalLink, Mail, Eye, Trash2 } from 'lucide-react';
import { studioApi } from '@/lib/api/studioApi';

export default function GalleriesTab({ galleries = [], events = [], packages = [], studioId, onGalleriesChange }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clientEmail: '',
    eventId: '',
    packageId: '',
    pinCode: '4920',
    coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await studioApi.createGallery({
        ...formData,
        photos: [
          { id: 'p1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', caption: 'Bride & Groom Portrait', isFavorite: true },
          { id: 'p2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', caption: 'First Dance', isFavorite: false },
          { id: 'p3', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', caption: 'Sunset Rings', isFavorite: true },
        ],
      }, studioId);
      setShowModal(false);
      setFormData({ title: '', clientEmail: '', eventId: '', packageId: '', pinCode: '4920', coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', status: 'published' });
      onGalleriesChange && onGalleriesChange();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create gallery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (galleryId) => {
    if (!window.confirm('Are you sure you want to delete this gallery collection?')) return;
    try {
      await studioApi.deleteGallery(galleryId, studioId);
      onGalleriesChange && onGalleriesChange();
    } catch (err) {
      alert(err.message || 'Error deleting gallery.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F8F6F3', margin: 0 }}>
            Client Photo Galleries ({galleries.length})
          </h3>
          <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '4px 0 0' }}>
            Deliver high-resolution photo proofs with PIN-protected access and album selection
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
            color: '#121220',
            border: 'none',
            borderRadius: '10px',
            padding: '11px 20px',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(200, 169, 110, 0.25)',
          }}
        >
          <Plus size={16} />
          <span>Publish New Gallery</span>
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px' }}>
        {galleries.map((g) => {
          const favCount = (g.photos || []).filter((p) => p.isFavorite).length;
          return (
            <div
              key={g.id}
              style={{
                backgroundColor: '#161628',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Cover Preview */}
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden', backgroundColor: '#121220' }}>
                  <img
                    src={g.coverUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                    alt={g.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                    {g.pinCode && (
                      <span
                        style={{
                          backgroundColor: 'rgba(18, 18, 32, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#C8A96E',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Lock size={12} /> PIN: {g.pinCode}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 6px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {g.title}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={12} /> {g.clientEmail}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#F8F6F3' }}>
                      <ImageIcon size={15} style={{ color: '#C8A96E' }} />
                      <span><strong>{(g.photos || []).length}</strong> proofs</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#ff6b6b' }}>
                      <Heart size={15} fill="#ff6b6b" />
                      <span><strong>{favCount}</strong> favorites</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ padding: '16px 20px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: g.status === 'published' ? '#6EC89B' : '#ffb86c',
                  }}
                >
                  ● {g.status}
                </span>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => alert(`Gallery Public Link: https://momentgrid.io/g/${g.id}\nClient PIN Code: ${g.pinCode || 'None'}`)}
                    title="Share gallery portal link"
                    style={{
                      backgroundColor: 'rgba(200, 169, 110, 0.15)',
                      border: '1px solid #C8A96E',
                      color: '#C8A96E',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ExternalLink size={13} /> Share Link
                  </button>

                  <button
                    onClick={() => handleDelete(g.id)}
                    title="Delete gallery"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#7A7A8C',
                      cursor: 'pointer',
                      padding: '6px',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(200, 169, 110, 0.3)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '500px',
              padding: '28px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 8px' }}>
              Publish Client Gallery
            </h3>
            <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '0 0 20px' }}>
              Upload proof collection and assign a PIN code for secure client review.
            </p>

            {errorMsg && (
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255, 107, 107, 0.15)', color: '#ff6b6b', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Gallery Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sarah & Michael Wedding Highlights"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Client Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="sarah@example.com"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    PIN Access Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    placeholder="4920"
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#C8A96E', fontWeight: 700, fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Gallery Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', fontSize: '13px' }}
                  >
                    <option value="published" style={{ background: '#161628' }}>Published (Live)</option>
                    <option value="draft" style={{ background: '#161628' }}>Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Cover Photo Image URL
                </label>
                <input
                  type="text"
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '10px', color: '#B8B8C6', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)', border: 'none', borderRadius: '10px', color: '#121220', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
