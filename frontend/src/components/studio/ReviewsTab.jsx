'use strict';
'use client';

import React, { useState } from 'react';
import { Star, Plus, Eye, EyeOff, ShieldCheck, Trash2 } from 'lucide-react';
import { studioApi } from '@/lib/api/studioApi';

export default function ReviewsTab({ reviews = [], studioId, onReviewsChange }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    rating: 5,
    comment: '',
    isVerified: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await studioApi.createReview({
        ...formData,
        rating: Number(formData.rating),
      }, studioId);
      setShowModal(false);
      setFormData({ clientName: '', rating: 5, comment: '', isVerified: true });
      onReviewsChange && onReviewsChange();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add testimonial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async (reviewId) => {
    try {
      await studioApi.toggleReviewVisibility(reviewId, studioId);
      onReviewsChange && onReviewsChange();
    } catch (err) {
      alert(err.message || 'Error updating visibility.');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await studioApi.deleteReview(reviewId, studioId);
      onReviewsChange && onReviewsChange();
    } catch (err) {
      alert(err.message || 'Error deleting review.');
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F8F6F3', margin: 0 }}>
            Client Reviews & Reputation Hub ({reviews.length})
          </h3>
          <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '4px 0 0' }}>
            Average studio rating: <strong style={{ color: '#C8A96E' }}>{averageRating} ★</strong> across all verified shoots
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
          <span>Add Client Testimonial</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {reviews.map((r) => (
          <div
            key={r.id}
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              opacity: r.isPublic !== false ? 1 : 0.6,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8F6F3' }}>
                    {r.clientName}
                  </div>
                  {r.isVerified && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6EC89B', fontWeight: 600 }}>
                      <ShieldCheck size={13} /> Verified Booking
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', color: '#C8A96E', gap: '2px' }}>
                  {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                    <Star key={idx} size={15} fill="#C8A96E" />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '14px', color: '#B8B8C6', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 20px' }}>
                "{r.comment || 'An absolute delight to work with! The photographs exceeded all our expectations and the delivery was seamless.'}"
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <button
                onClick={() => handleToggleVisibility(r.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: r.isPublic !== false ? '#6EC89B' : '#7A7A8C',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                {r.isPublic !== false ? (
                  <>
                    <Eye size={14} /> Visible on Public Profile
                  </>
                ) : (
                  <>
                    <EyeOff size={14} /> Hidden from Profile
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(r.id)}
                title="Delete review"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#7A7A8C',
                  cursor: 'pointer',
                  padding: '6px',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#ff6b6b')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#7A7A8C')}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
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
              maxWidth: '460px',
              padding: '28px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 8px' }}>
              Add Client Testimonial
            </h3>
            <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '0 0 20px' }}>
              Showcase glowing feedback on your studio profile landing page.
            </p>

            {errorMsg && (
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255, 107, 107, 0.15)', color: '#ff6b6b', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Client Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Star Rating (1 - 5)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 12px', color: '#C8A96E', fontWeight: 700, fontSize: '13px' }}
                >
                  <option value={5} style={{ background: '#161628' }}>★★★★★ (5 Stars - Excellent)</option>
                  <option value={4} style={{ background: '#161628' }}>★★★★☆ (4 Stars - Great)</option>
                  <option value={3} style={{ background: '#161628' }}>★★★☆☆ (3 Stars - Good)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Testimonial Quote & Review Comment
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="MomentGrid captured our wedding day with breathtaking artistry..."
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px', resize: 'vertical' }}
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
                  {isSubmitting ? 'Saving...' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
