'use strict';
'use client';

import React, { useState } from 'react';
import { Bell, Calendar, Heart, Star, CheckCircle, Clock, ExternalLink, Sparkles } from 'lucide-react';

export default function PhotographerNotificationsTab({ notificationsData, onSelectAction }) {
  const [notifications, setNotifications] = useState(
    notificationsData?.notifications || [
      {
        id: 'notif-1',
        type: 'assignment',
        title: 'New Session Assigned: Lead Shooter',
        message: 'You are assigned as Lead Shooter for "Sarah & Michael Wedding" on 2026-07-18.',
        timestamp: '1 hour ago',
        read: false,
        actionUrl: 'events',
      },
      {
        id: 'notif-2',
        type: 'gallery',
        title: 'Client Favorited 14 Proofs',
        message: 'Client Sarah Mitchell favorited 14 photos in proof gallery "Golden Hour Bridal".',
        timestamp: '5 hours ago',
        read: false,
        actionUrl: 'galleries',
      },
      {
        id: 'notif-3',
        type: 'review',
        title: 'New 5-Star Testimonial Received',
        message: '"Alex captured the quiet beauty of our day so effortlessly. 10/10 recommendation!"',
        timestamp: 'Yesterday',
        read: true,
        actionUrl: 'performance',
      },
      {
        id: 'notif-4',
        type: 'system',
        title: 'Weekly Schedule Sync Completed',
        message: 'Your blocked dates for July 2026 have been synchronized with the studio itinerary.',
        timestamp: '2 days ago',
        read: true,
        actionUrl: 'availability',
      },
    ]
  );

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <Calendar size={18} style={{ color: '#C8A96E' }} />;
      case 'gallery':
        return <Heart size={18} style={{ color: '#ff6b6b' }} />;
      case 'review':
        return <Star size={18} style={{ color: '#C8A96E' }} />;
      default:
        return <CheckCircle size={18} style={{ color: '#4ade80' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          backgroundColor: '#161628',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} style={{ color: '#C8A96E' }} /> Notifications & Activity Feed
          </h3>
          <p style={{ color: '#B8B8C6', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
            Real-time updates across your assigned shoots, client proof selections, and review alerts.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '8px 18px',
            color: '#F8F6F3',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Mark all as read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              backgroundColor: n.read ? '#161628' : 'rgba(200, 169, 110, 0.07)',
              border: `1px solid ${n.read ? 'rgba(255, 255, 255, 0.06)' : 'rgba(200, 169, 110, 0.3)'}`,
              borderRadius: '14px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getIcon(n.type)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#F8F6F3' }}>
                    {n.title}
                  </span>
                  {!n.read && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C8A96E' }} />
                  )}
                </div>
                <p style={{ color: '#B8B8C6', fontSize: '14px', margin: '6px 0 0 0', lineHeight: '1.5' }}>
                  {n.message}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9A9AA6', marginTop: '8px' }}>
                  <Clock size={13} /> {n.timestamp}
                </div>
              </div>
            </div>

            {n.actionUrl && (
              <button
                onClick={() => onSelectAction && onSelectAction(n.actionUrl)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#C8A96E',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                View Details <ExternalLink size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
