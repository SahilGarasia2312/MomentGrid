'use strict';
'use client';

import React from 'react';
import {
  Calendar,
  Image as ImageIcon,
  CreditCard,
  BookOpen,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
} from 'lucide-react';

export default function ClientOverviewTab({ overviewData, onNavigateTab }) {
  const kpis = overviewData?.kpis || {
    totalBookings: 3,
    activeBookingsCount: 1,
    activeGalleriesCount: 2,
    pendingInvoicesCount: 1,
    pendingBalance: 1250.0,
    albumsInProductionCount: 1,
  };

  const nextShoot = overviewData?.nextShoot || {
    id: 'shoot-1',
    title: 'Sunset Beach & Heirloom Portrait Session',
    date: '2026-08-15',
    time: '17:00 - 19:30',
    status: 'confirmed',
  };

  const timeline = overviewData?.recentTimeline || [
    { id: '1', type: 'gallery', title: 'Proof Gallery Ready: Autumn Golden Hour', date: '2 days ago', status: '84 photos' },
    { id: '2', type: 'payment', title: 'Retainer Invoice Paid #INV-2026-089', date: '5 days ago', status: '$500 USD' },
    { id: '3', type: 'booking', title: 'Session Confirmed: Sunset Beach Session', date: '1 week ago', status: 'Confirmed' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top VIP Welcome & Next Session Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(200, 169, 110, 0.18) 0%, rgba(18, 18, 32, 0.95) 100%)',
          border: '1px solid rgba(200, 169, 110, 0.35)',
          borderRadius: '16px',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ maxWidth: '540px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#C8A96E',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}
          >
            <Sparkles size={16} /> VIP Client Suite
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#F8F6F3', margin: 0, lineHeight: '1.2' }}>
            Welcome back to your luxury photography suite
          </h2>
          <p style={{ color: '#B8B8C6', fontSize: '14px', marginTop: '8px', marginBottom: 0, lineHeight: '1.6' }}>
            Curate your digital proof galleries, review bespoke Italian leather print albums, and manage upcoming session itineraries from one seamless portal.
          </p>
        </div>

        {/* Next Shoot Countdown Box */}
        {nextShoot ? (
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(200, 169, 110, 0.4)',
              borderRadius: '14px',
              padding: '20px 24px',
              minWidth: '260px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#C8A96E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> Next Scheduled Shoot
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8F6F3', marginTop: '6px' }}>
              {nextShoot.title}
            </div>
            <div style={{ fontSize: '13px', color: '#B8B8C6', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} style={{ color: '#9A9AA6' }} /> {nextShoot.date} • {nextShoot.time}
            </div>
            <button
              onClick={() => onNavigateTab?.('bookings')}
              style={{
                marginTop: '14px',
                background: 'transparent',
                border: '1px solid #C8A96E',
                color: '#C8A96E',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#C8A96E';
                e.currentTarget.style.color = '#121220';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#C8A96E';
              }}
            >
              <span>View Itinerary</span> <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '20px 24px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', color: '#9A9AA6' }}>No upcoming sessions scheduled</div>
            <button
              onClick={() => onNavigateTab?.('bookings')}
              style={{
                marginTop: '10px',
                backgroundColor: '#C8A96E',
                border: 'none',
                color: '#121220',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Request Session
            </button>
          </div>
        )}
      </div>

      {/* KPI Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div
          onClick={() => onNavigateTab?.('bookings')}
          style={{
            backgroundColor: '#161628',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '22px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = '#C8A96E')}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#9A9AA6', fontWeight: 500 }}>Active Bookings</span>
            <Calendar size={20} style={{ color: '#C8A96E' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#F8F6F3' }}>
            {kpis.activeBookingsCount}
          </div>
          <div style={{ fontSize: '12px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <CheckCircle2 size={13} /> {kpis.totalBookings} lifetime sessions
          </div>
        </div>

        <div
          onClick={() => onNavigateTab?.('galleries')}
          style={{
            backgroundColor: '#161628',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '22px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = '#C8A96E')}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#9A9AA6', fontWeight: 500 }}>Published Galleries</span>
            <ImageIcon size={20} style={{ color: '#C8A96E' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#F8F6F3' }}>
            {kpis.activeGalleriesCount}
          </div>
          <div style={{ fontSize: '12px', color: '#C8A96E', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <Sparkles size={13} /> High-res assets ready
          </div>
        </div>

        <div
          onClick={() => onNavigateTab?.('payments')}
          style={{
            backgroundColor: '#161628',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '22px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = '#C8A96E')}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#9A9AA6', fontWeight: 500 }}>Pending Balance</span>
            <CreditCard size={20} style={{ color: kpis.pendingBalance > 0 ? '#ff6b6b' : '#4ade80' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: kpis.pendingBalance > 0 ? '#ff6b6b' : '#4ade80' }}>
            ${kpis.pendingBalance.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            {kpis.pendingInvoicesCount > 0 ? (
              <span style={{ color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={13} /> {kpis.pendingInvoicesCount} invoice(s) due
              </span>
            ) : (
              <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> All invoices paid
              </span>
            )}
          </div>
        </div>

        <div
          onClick={() => onNavigateTab?.('albums')}
          style={{
            backgroundColor: '#161628',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '22px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = '#C8A96E')}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#9A9AA6', fontWeight: 500 }}>Albums In Bindery</span>
            <BookOpen size={20} style={{ color: '#C8A96E' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#F8F6F3' }}>
            {kpis.albumsInProductionCount}
          </div>
          <div style={{ fontSize: '12px', color: '#C8A96E', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <HeartHandshake size={13} /> Artisan crafting stage
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline & Quick Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div
          style={{
            backgroundColor: '#161628',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
              Recent Portal Activity & Deliverables
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {timeline.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(200, 169, 110, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C8A96E',
                    }}
                  >
                    {item.type === 'gallery' ? (
                      <ImageIcon size={18} />
                    ) : item.type === 'payment' ? (
                      <CreditCard size={18} />
                    ) : (
                      <Calendar size={18} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#F8F6F3' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#9A9AA6', marginTop: '2px' }}>{item.date}</div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#C8A96E' }}>{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
