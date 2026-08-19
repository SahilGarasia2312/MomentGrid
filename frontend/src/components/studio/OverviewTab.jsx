'use strict';
'use client';

import React from 'react';
import {
  DollarSign,
  CalendarDays,
  Image as ImageIcon,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function OverviewTab({ analytics, onNavigate }) {
  const kpi = analytics?.kpi || {
    totalRevenue: 0,
    totalBookings: 0,
    completedBookings: 0,
    activeGalleries: 0,
    staffCount: 1,
    staffUtilization: 84,
    averageRating: '5.0',
  };

  const chartData = analytics?.monthlyRevenueChart || [
    { month: 'Jan', revenue: 12400 },
    { month: 'Feb', revenue: 16800 },
    { month: 'Mar', revenue: 22100 },
    { month: 'Apr', revenue: 19500 },
    { month: 'May', revenue: 28400 },
    { month: 'Jun', revenue: 34200 },
  ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 10000);

  const kpiCards = [
    {
      label: 'Gross Studio Revenue',
      value: `$${kpi.totalRevenue.toLocaleString()}`,
      change: '+18.4% vs last quarter',
      icon: DollarSign,
      color: '#C8A96E',
    },
    {
      label: 'Total Bookings & Shoots',
      value: kpi.totalBookings.toString(),
      change: `${kpi.completedBookings} completed sessions`,
      icon: CalendarDays,
      color: '#6E85C8',
    },
    {
      label: 'Published Galleries',
      value: kpi.activeGalleries.toString(),
      change: 'High-res client proofs live',
      icon: ImageIcon,
      color: '#A86EC8',
    },
    {
      label: 'Crew Utilization Rate',
      value: `${kpi.staffUtilization}%`,
      change: `Across ${kpi.staffCount} active staff`,
      icon: Users,
      color: '#6EC89B',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              style={{
                backgroundColor: '#161628',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#9A9AA6', fontWeight: 500, marginBottom: '8px' }}>
                    {card.label}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#F8F6F3', letterSpacing: '-0.02em' }}>
                    {card.value}
                  </div>
                </div>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                  }}
                >
                  <Icon size={22} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '18px', fontSize: '12px', color: '#C8A96E' }}>
                <TrendingUp size={14} />
                <span>{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Quick Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Monthly Revenue Chart */}
        <div
          style={{
            backgroundColor: '#161628',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F8F6F3', margin: 0 }}>
                Monthly Revenue Ledger
              </h3>
              <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '4px 0 0' }}>
                Cash flow analysis across package bookings & print deliverables
              </p>
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#C8A96E',
                backgroundColor: 'rgba(200, 169, 110, 0.12)',
                padding: '6px 12px',
                borderRadius: '20px',
              }}
            >
              2026 Fiscal Year
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingTop: '20px' }}>
            {chartData.map((d, i) => {
              const heightPct = Math.max(Math.round((d.revenue / maxRevenue) * 100), 8);
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '10px' }}>
                  <div
                    title={`$${d.revenue.toLocaleString()}`}
                    style={{
                      width: '36px',
                      height: `${heightPct}%`,
                      background: i === chartData.length - 1 ? 'linear-gradient(180deg, #C8A96E 0%, #9A7B4F 100%)' : 'rgba(200, 169, 110, 0.28)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#C8A96E')}
                    onMouseOut={(e) => (e.currentTarget.style.background = i === chartData.length - 1 ? 'linear-gradient(180deg, #C8A96E 0%, #9A7B4F 100%)' : 'rgba(200, 169, 110, 0.28)')}
                  />
                  <span style={{ fontSize: '12px', color: '#9A9AA6', fontWeight: 500 }}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reputation & Action Widget */}
        <div
          style={{
            backgroundColor: '#161628',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F8F6F3', margin: 0 }}>
                Client Satisfaction
              </h3>
              <ArrowUpRight size={18} style={{ color: '#C8A96E' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '42px', fontWeight: 800, color: '#C8A96E' }}>
                {kpi.averageRating}
              </div>
              <div>
                <div style={{ display: 'flex', color: '#C8A96E', gap: '2px' }}>
                  ★ ★ ★ ★ ★
                </div>
                <div style={{ fontSize: '12px', color: '#9A9AA6', marginTop: '4px' }}>
                  Based on {kpi.reviewCount || 12} verified reviews
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#B8B8C6', lineHeight: 1.6 }}>
              MomentGrid automatically triggers post-shoot feedback links after gallery delivery to boost your public studio ranking.
            </p>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('reviews')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(200, 169, 110, 0.12)',
              border: '1px solid rgba(200, 169, 110, 0.3)',
              borderRadius: '10px',
              color: '#C8A96E',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Manage Testimonials →
          </button>
        </div>
      </div>

      {/* Recent Schedule Table */}
      <div
        style={{
          backgroundColor: '#161628',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F8F6F3', margin: 0 }}>
              Recent & Upcoming Shoots
            </h3>
            <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '4px 0 0' }}>
              Confirmed photo sessions requiring staff assignment or proof curation
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('schedule')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#C8A96E',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            View Full Schedule →
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#9A9AA6', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ padding: '12px 16px' }}>Event / Client</th>
                <th style={{ padding: '12px 16px' }}>Date & Time</th>
                <th style={{ padding: '12px 16px' }}>Fee</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(analytics?.recentEvents || []).length > 0 ? (
                analytics.recentEvents.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '14px', color: '#F8F6F3' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600 }}>{ev.title}</div>
                      <div style={{ fontSize: '12px', color: '#9A9AA6' }}>{ev.clientName} ({ev.clientEmail})</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>{ev.eventDate}</div>
                      <div style={{ fontSize: '12px', color: '#9A9AA6' }}>{ev.startTime} - {ev.endTime}</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#C8A96E' }}>
                      ${(ev.price || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          backgroundColor: ev.status === 'completed' ? 'rgba(110, 200, 155, 0.15)' : 'rgba(200, 169, 110, 0.15)',
                          color: ev.status === 'completed' ? '#6EC89B' : '#C8A96E',
                        }}
                      >
                        {ev.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '36px', textAlign: 'center', color: '#9A9AA6', fontSize: '13px' }}>
                    No sessions logged yet. Create a new event from the Schedule tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
