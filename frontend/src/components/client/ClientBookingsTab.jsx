'use strict';
'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle2, AlertCircle, X, Sparkles, MapPin } from 'lucide-react';

export default function ClientBookingsTab({ bookings = [], onCreateBooking, isSubmitting }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    eventDate: '',
    startTime: '16:00',
    endTime: '18:30',
    notes: '',
  });

  const displayBookings = bookings.length > 0 ? bookings : [
    {
      id: 'book-sample-1',
      title: 'Sunset Beach & Heirloom Portrait Session',
      eventDate: '2026-08-15',
      startTime: '17:00',
      endTime: '19:30',
      status: 'confirmed',
      price: 1500,
      notes: 'Please bring both formal ivory and casual linen wardrobe options.',
    },
    {
      id: 'book-sample-2',
      title: 'Autumn Golden Hour Lookbook Shoot',
      eventDate: '2026-10-10',
      startTime: '15:30',
      endTime: '18:00',
      status: 'requested',
      price: 1200,
      notes: 'Pending final weather check and location permits.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.eventDate) return;
    if (onCreateBooking) {
      await onCreateBooking(form);
    }
    setIsModalOpen(false);
    setForm({ title: '', eventDate: '', startTime: '16:00', endTime: '18:30', notes: '' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> Confirmed Session
          </span>
        );
      case 'requested':
        return (
          <span style={{ backgroundColor: 'rgba(200, 169, 110, 0.15)', color: '#C8A96E', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> Pending Studio Confirmation
          </span>
        );
      default:
        return (
          <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#B8B8C6', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
            {status}
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
            Session Bookings & Itinerary
          </h2>
          <p style={{ color: '#B8B8C6', fontSize: '14px', margin: '4px 0 0 0' }}>
            Review confirmed photoshoot logistics or request customized dates with our master artists.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#121220',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(200, 169, 110, 0.3)',
          }}
        >
          <Plus size={18} /> Request New Session
        </button>
      </div>

      {/* Bookings List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {displayBookings.map((book) => (
          <div
            key={book.id}
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                {getStatusBadge(book.status)}
                {book.price && (
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#F8F6F3' }}>
                    ${book.price.toLocaleString()}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 12px 0' }}>
                {book.title}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#B8B8C6', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={15} style={{ color: '#C8A96E' }} />
                  <span>Date: {book.eventDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={15} style={{ color: '#C8A96E' }} />
                  <span>Time: {book.startTime} - {book.endTime}</span>
                </div>
                {book.notes && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '6px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <AlertCircle size={15} style={{ color: '#9A9AA6', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '12px', color: '#9A9AA6' }}>{book.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} /> VIP Studio Logistics
              </span>
              <button
                style={{
                  backgroundColor: 'rgba(200, 169, 110, 0.12)',
                  border: '1px solid rgba(200, 169, 110, 0.3)',
                  color: '#C8A96E',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Manage Wardrobe & Notes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Request Session Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(200, 169, 110, 0.4)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '500px',
              padding: '28px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8A96E', fontSize: '16px', fontWeight: 700 }}>
                <Sparkles size={18} /> Request Photography Session
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#9A9AA6', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#B8B8C6', marginBottom: '6px' }}>
                  Session Concept & Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Golden Hour Family Portrait"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#F8F6F3',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#B8B8C6', marginBottom: '6px' }}>
                    Requested Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#F8F6F3',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#B8B8C6', marginBottom: '6px' }}>
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#F8F6F3',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#B8B8C6', marginBottom: '6px' }}>
                  Client Notes & Wardrobe Concept
                </label>
                <textarea
                  rows="3"
                  placeholder="Share details on preferred locations, lighting aesthetics, or styling preferences..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#F8F6F3',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#B8B8C6',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 22px',
                    color: '#121220',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
