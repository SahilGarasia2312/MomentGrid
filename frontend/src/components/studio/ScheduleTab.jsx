'use strict';
'use client';

import React, { useState } from 'react';
import { CalendarDays, Plus, Clock, User, Mail, Phone, DollarSign, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { studioApi } from '@/lib/api/studioApi';

export default function ScheduleTab({ events = [], packages = [], staffList = [], studioId, onEventsChange }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    packageId: '',
    price: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const statusConfigs = {
    requested: { label: 'Requested', bg: 'rgba(255, 184, 108, 0.15)', color: '#ffb86c' },
    confirmed: { label: 'Confirmed', bg: 'rgba(200, 169, 110, 0.18)', color: '#C8A96E' },
    completed: { label: 'Completed', bg: 'rgba(110, 200, 155, 0.18)', color: '#6EC89B' },
    cancelled: { label: 'Cancelled', bg: 'rgba(255, 107, 107, 0.15)', color: '#ff6b6b' },
  };

  const handlePackageSelect = (pkgId) => {
    const selectedPkg = packages.find((p) => p.id === pkgId);
    setFormData((prev) => ({
      ...prev,
      packageId: pkgId,
      price: selectedPkg ? selectedPkg.price : prev.price,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await studioApi.createEvent({
        ...formData,
        price: Number(formData.price) || 0,
      }, studioId);
      setShowModal(false);
      setFormData({ title: '', clientName: '', clientEmail: '', clientPhone: '', eventDate: new Date().toISOString().split('T')[0], startTime: '10:00', endTime: '12:00', packageId: '', price: '', notes: '' });
      onEventsChange && onEventsChange();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to schedule event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await studioApi.updateEventStatus(eventId, { status: newStatus }, studioId);
      onEventsChange && onEventsChange();
    } catch (err) {
      alert(err.message || 'Error updating event status.');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Cancel and delete this booking schedule?')) return;
    try {
      await studioApi.deleteEvent(eventId, studioId);
      onEventsChange && onEventsChange();
    } catch (err) {
      alert(err.message || 'Error deleting event.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F8F6F3', margin: 0 }}>
            Session Schedule & Itineraries ({events.length})
          </h3>
          <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '4px 0 0' }}>
            Track client shoot dates, time slots, assigned packages, and booking confirmations
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
          <span>Book New Session</span>
        </button>
      </div>

      {/* Events Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {events.length > 0 ? (
          events.map((ev) => {
            const statusConf = statusConfigs[ev.status] || statusConfigs.confirmed;
            const pkg = packages.find((p) => p.id === ev.packageId);
            return (
              <div
                key={ev.id}
                style={{
                  backgroundColor: '#161628',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                }}
              >
                {/* Left: Date & Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '220px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(200, 169, 110, 0.12)',
                      border: '1px solid rgba(200, 169, 110, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C8A96E',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                      {ev.eventDate ? new Date(ev.eventDate).toLocaleString('default', { month: 'short' }) : 'DAY'}
                    </span>
                    <span style={{ fontSize: '20px', fontWeight: 800 }}>
                      {ev.eventDate ? ev.eventDate.split('-')[2] : '--'}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8F6F3' }}>
                      {ev.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#C8A96E', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: 500 }}>
                      <Clock size={14} /> {ev.startTime} - {ev.endTime}
                    </div>
                  </div>
                </div>

                {/* Middle: Client Info */}
                <div style={{ flex: 1, padding: '0 20px', borderLeft: '1px solid rgba(255, 255, 255, 0.06)', borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#F8F6F3' }}>
                    <User size={15} style={{ color: '#9A9AA6' }} />
                    <span>{ev.clientName}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px', color: '#9A9AA6' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {ev.clientEmail}</span>
                    {ev.clientPhone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {ev.clientPhone}</span>}
                  </div>
                  {pkg && (
                    <div style={{ fontSize: '12px', color: '#6E85C8', marginTop: '8px', fontWeight: 500 }}>
                      Package: {pkg.title}
                    </div>
                  )}
                </div>

                {/* Right: Fee, Status & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#9A9AA6' }}>Session Fee</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#C8A96E' }}>
                      ${(ev.price || 0).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <select
                      value={ev.status}
                      onChange={(e) => handleStatusChange(ev.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: statusConf.bg,
                        color: statusConf.color,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        outline: 'none',
                      }}
                    >
                      <option value="confirmed" style={{ background: '#161628', color: '#fff' }}>Confirmed</option>
                      <option value="completed" style={{ background: '#161628', color: '#fff' }}>Completed</option>
                      <option value="requested" style={{ background: '#161628', color: '#fff' }}>Requested</option>
                      <option value="cancelled" style={{ background: '#161628', color: '#fff' }}>Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDelete(ev.id)}
                    title="Cancel session"
                    style={{
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      border: 'none',
                      color: '#ff6b6b',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '64px', textAlign: 'center', backgroundColor: '#161628', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#9A9AA6' }}>
            <CalendarDays size={40} style={{ color: '#C8A96E', margin: '0 auto 16px', opacity: 0.6 }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#F8F6F3' }}>No Upcoming Photo Sessions</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Click "Book New Session" to log a shoot date and invoice amount.</div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
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
              maxWidth: '540px',
              padding: '28px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 8px' }}>
              Schedule New Session
            </h3>
            <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '0 0 20px' }}>
              Create an event schedule itinerary for client shoot tracking.
            </p>

            {errorMsg && (
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255, 107, 107, 0.15)', color: '#ff6b6b', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Event / Shoot Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sarah & Michael Wedding Portraiture"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Sarah Jenkins"
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Client Email
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Select Package Tier
                  </label>
                  <select
                    value={formData.packageId}
                    onChange={(e) => handlePackageSelect(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', fontSize: '13px' }}
                  >
                    <option value="" style={{ background: '#161628' }}>-- Custom / No Package --</option>
                    {packages.map((p) => (
                      <option key={p.id} value={p.id} style={{ background: '#161628' }}>
                        {p.title} (${p.price})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#C8A96E', fontWeight: 600, fontSize: '13px' }}
                  />
                </div>
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
                  {isSubmitting ? 'Scheduling...' : 'Confirm Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
