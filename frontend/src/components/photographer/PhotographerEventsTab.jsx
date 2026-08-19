'use strict';
'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, AlertCircle, UploadCloud, ChevronRight, Phone, Mail } from 'lucide-react';

export default function PhotographerEventsTab({ eventsData, onLaunchUpload }) {
  const [subTab, setSubTab] = useState('upcoming'); // upcoming | assigned | past

  const upcomingEvents = eventsData?.upcoming_events || [
    {
      id: 'ev-101',
      title: 'Sarah & Michael Luxury Wedding',
      clientName: 'Sarah Mitchell',
      clientEmail: 'sarah.mitchell@example.com',
      clientPhone: '+1 (555) 234-8900',
      eventDate: '2026-07-18',
      startTime: '14:00',
      endTime: '22:00',
      status: 'confirmed',
      notes: 'Ceremony at Sunset Cliffs followed by Grand Ballroom reception. Lead shooter assignment.',
    },
    {
      id: 'ev-102',
      title: 'Vogue Summer Fashion Editorial',
      clientName: 'Vogue Brand Agency',
      clientEmail: 'production@vogue-agency.example.com',
      clientPhone: '+1 (555) 888-1212',
      eventDate: '2026-07-25',
      startTime: '09:00',
      endTime: '17:00',
      status: 'confirmed',
      notes: 'Studio 3 continuous lighting setup. High-speed burst requirement.',
    },
  ];

  const pastEvents = eventsData?.past_events || [
    {
      id: 'ev-098',
      title: 'Aria & David Destination Vows',
      clientName: 'Aria Montgomery',
      clientEmail: 'aria.m@example.com',
      eventDate: '2026-06-20',
      startTime: '16:00',
      endTime: '21:00',
      status: 'completed',
      notes: 'Delivered 480 high-res select proofs on June 23.',
    },
  ];

  const displayedList = subTab === 'past' ? pastEvents : upcomingEvents;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Subtab Toggle Header */}
      <div
        style={{
          backgroundColor: '#161628',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'upcoming', label: `Upcoming Schedule (${upcomingEvents.length})` },
            { id: 'assigned', label: 'My Assigned Leads' },
            { id: 'past', label: `Past Shoot History (${pastEvents.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                backgroundColor: subTab === tab.id ? 'rgba(200, 169, 110, 0.2)' : 'transparent',
                border: subTab === tab.id ? '1px solid #C8A96E' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '8px 18px',
                color: subTab === tab.id ? '#C8A96E' : '#9A9AA6',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Cards Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {displayedList.length === 0 ? (
          <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '48px', textAlign: 'center', color: '#9A9AA6' }}>
            No sessions listed under this category right now.
          </div>
        ) : (
          displayedList.map((ev) => (
            <div
              key={ev.id}
              style={{
                backgroundColor: '#161628',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span
                      style={{
                        backgroundColor: ev.status === 'completed' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(200, 169, 110, 0.15)',
                        color: ev.status === 'completed' ? '#4ade80' : '#C8A96E',
                        border: `1px solid ${ev.status === 'completed' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(200, 169, 110, 0.3)'}`,
                        borderRadius: '20px',
                        padding: '2px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {ev.status}
                    </span>
                    <span style={{ fontSize: '13px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} style={{ color: '#C8A96E' }} /> {ev.eventDate}
                    </span>
                    <span style={{ fontSize: '13px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} style={{ color: '#C8A96E' }} /> {ev.startTime} - {ev.endTime}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
                    {ev.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => onLaunchUpload && onLaunchUpload(ev)}
                    style={{
                      background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#121220',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <UploadCloud size={15} /> Launch Gallery Proof
                  </button>
                </div>
              </div>

              {/* Client & Notes Info Box */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#9A9AA6' }}>Client Contact</span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8F6F3', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={15} style={{ color: '#C8A96E' }} /> {ev.clientName}
                  </div>
                  {ev.clientEmail && (
                    <div style={{ fontSize: '12px', color: '#B8B8C6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} /> {ev.clientEmail}
                    </div>
                  )}
                </div>

                {ev.notes && (
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <span style={{ fontSize: '12px', color: '#9A9AA6' }}>Shoot Brief & Equipment Notes</span>
                    <p style={{ fontSize: '13px', color: '#B8B8C6', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                      {ev.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
