'use strict';
'use client';

import React from 'react';
import { Award, Camera, Star, DollarSign, CheckCircle2, TrendingUp, Sparkles, Heart } from 'lucide-react';

export default function PhotographerPerformanceTab({ performanceData }) {
  const stats = performanceData?.stats || {
    total_sessions: 42,
    total_photos_delivered: 4890,
    average_rating: 4.9,
    total_reviews: 38,
    estimated_earnings: 18900.0,
  };

  const reviews = performanceData?.recent_reviews || [
    {
      id: 'rev-1',
      clientName: 'Sarah & Michael Mitchell',
      rating: 5,
      comment: 'Alex captured our destination wedding at Big Sur with incredible artistry. Every shot feels like a movie still!',
      createdAt: '2026-07-02T14:30:00Z',
      isVerified: true,
    },
    {
      id: 'rev-2',
      clientName: 'Vogue Collective Brand Studio',
      rating: 5,
      comment: 'Consistently stellar delivery. Fast turnaround on the 100+ proof selects and perfect color grading.',
      createdAt: '2026-06-28T10:15:00Z',
      isVerified: true,
    },
    {
      id: 'rev-3',
      clientName: 'Devon Vance Headshots',
      rating: 5,
      comment: 'Made me feel super comfortable in the studio. Best portrait session experience I have ever had.',
      createdAt: '2026-06-15T18:00:00Z',
      isVerified: true,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(200, 169, 110, 0.15) 0%, rgba(18, 18, 32, 0.9) 100%)',
          border: '1px solid rgba(200, 169, 110, 0.3)',
          borderRadius: '16px',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8A96E', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            <Sparkles size={16} /> Artist Velocity Index
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
            Performance & Reputation Hub
          </h2>
          <p style={{ color: '#B8B8C6', fontSize: '14px', marginTop: '6px', marginBottom: 0 }}>
            Real-time delivery ledgers and client satisfaction metrics across your shoot portfolio.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '12px 20px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#9A9AA6' }}>Artist Rating</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#C8A96E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '2px' }}>
              <Star size={20} fill="#C8A96E" color="#C8A96E" /> {stats.average_rating}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#9A9AA6', fontWeight: 500 }}>Completed Shoots</span>
            <Award size={20} style={{ color: '#C8A96E' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#F8F6F3' }}>
            {stats.total_sessions}
          </div>
          <div style={{ fontSize: '12px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <CheckCircle2 size={13} /> 100% on-time delivery rate
          </div>
        </div>

        <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#9A9AA6', fontWeight: 500 }}>Total Proofs Delivered</span>
            <Camera size={20} style={{ color: '#C8A96E' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#F8F6F3' }}>
            {stats.total_photos_delivered.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#C8A96E', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={13} /> Avg 115 photos per session
          </div>
        </div>

        <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#9A9AA6', fontWeight: 500 }}>Total Client Reviews</span>
            <Star size={20} style={{ color: '#C8A96E' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#F8F6F3' }}>
            {stats.total_reviews}
          </div>
          <div style={{ fontSize: '12px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <Heart size={13} style={{ color: '#ff6b6b' }} /> Verified studio bookings
          </div>
        </div>

        <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#9A9AA6', fontWeight: 500 }}>Estimated Earnings Share</span>
            <DollarSign size={20} style={{ color: '#4ade80' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#4ade80' }}>
            ${stats.estimated_earnings.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            Based on completed package tiers
          </div>
        </div>
      </div>

      {/* Recent Client Reviews Feed */}
      <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3', marginTop: 0, marginBottom: '20px' }}>
          Recent Client Testimonials ({reviews.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#F8F6F3' }}>
                    {rev.clientName}
                  </span>
                  {rev.isVerified && (
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                      Verified Client
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={15} fill="#C8A96E" color="#C8A96E" />
                  ))}
                </div>
              </div>
              <p style={{ color: '#B8B8C6', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
