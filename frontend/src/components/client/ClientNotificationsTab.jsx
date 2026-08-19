'use strict';
'use client';

import React from 'react';
import { Bell, Calendar, CreditCard, Image as ImageIcon, BookOpen, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function ClientNotificationsTab({ notifications = [], onNavigateTab }) {
  const displayNotifs = notifications.length > 0 ? notifications : [
    {
      id: 'notif-1',
      type: 'gallery',
      title: 'Proof Gallery Ready: Autumn Golden Hour',
      message: 'Your proof gallery containing 84 high-res photos is published and ready for selection.',
      timestamp: 'Just now',
      read: false,
      actionUrl: 'galleries',
    },
    {
      id: 'notif-2',
      type: 'payment',
      title: 'Retainer Invoice Due #INV-2026-089',
      message: 'Payment of $1,250 USD for your upcoming portrait session retainer is now due.',
      timestamp: '2 days ago',
      read: false,
      actionUrl: 'payments',
    },
    {
      id: 'notif-3',
      type: 'booking',
      title: 'Session Confirmed: Sunset Beach Session',
      message: 'Your photoshoot on 2026-08-15 between 17:00 and 19:30 has been officially confirmed by the lead artist.',
      timestamp: '1 week ago',
      read: true,
      actionUrl: 'bookings',
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'gallery':
        return <ImageIcon size={20} style={{ color: '#C8A96E' }} />;
      case 'payment':
        return <CreditCard size={20} style={{ color: '#ff6b6b' }} />;
      case 'album':
        return <BookOpen size={20} style={{ color: '#38bdf8' }} />;
      default:
        return <Calendar size={20} style={{ color: '#4ade80' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
            VIP Client Notifications Hub
          </h2>
          <p style={{ color: '#B8B8C6', fontSize: '14px', margin: '4px 0 0 0' }}>
            Stay informed on instantaneous proof uploads, invoice notices, and shoot confirmation updates.
          </p>
        </div>
        <div style={{ fontSize: '13px', color: '#9A9AA6' }}>
          Showing <strong style={{ color: '#F8F6F3' }}>{displayNotifs.length}</strong> alerts
        </div>
      </div>

      {/* Notifications Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {displayNotifs.map((item) => (
          <div
            key={item.id}
            onClick={() => item.actionUrl && onNavigateTab?.(item.actionUrl)}
            style={{
              backgroundColor: item.read ? '#161628' : 'rgba(200, 169, 110, 0.08)',
              border: item.read ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(200, 169, 110, 0.35)',
              borderRadius: '16px',
              padding: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              cursor: item.actionUrl ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              if (item.actionUrl) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseOut={(e) => {
              if (item.actionUrl) e.currentTarget.style.backgroundColor = item.read ? '#161628' : 'rgba(200, 169, 110, 0.08)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getIcon(item.type)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: item.read ? 600 : 700, color: '#F8F6F3' }}>
                    {item.title}
                  </span>
                  {!item.read && (
                    <span style={{ backgroundColor: '#C8A96E', color: '#121220', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                      New
                    </span>
                  )}
                </div>
                <p style={{ color: '#B8B8C6', fontSize: '14px', margin: '6px 0 0 0', lineHeight: '1.5' }}>
                  {item.message}
                </p>
                <div style={{ fontSize: '12px', color: '#9A9AA6', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} /> {item.timestamp}
                </div>
              </div>
            </div>

            {item.actionUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C8A96E', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>
                <span>View</span> <ArrowRight size={15} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
