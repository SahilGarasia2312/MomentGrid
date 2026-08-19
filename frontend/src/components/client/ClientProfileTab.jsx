'use strict';
'use client';

import React, { useState } from 'react';
import { User, Phone, MapPin, Lock, Save, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

export default function ClientProfileTab({ profileData, onUpdateProfile }) {
  const [form, setForm] = useState({
    fullName: profileData?.fullName || 'Sarah & Michael Mitchell',
    phone: profileData?.phone || '+1 (555) 234-8900',
    shippingAddress: profileData?.shippingAddress || '742 Evergreen Terrace, Big Sur, CA 93920',
    emailNotifications: true,
    smsNotifications: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    if (onUpdateProfile) {
      await onUpdateProfile(form);
    }
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
          Profile & Account Settings
        </h2>
        <p style={{ color: '#B8B8C6', fontSize: '14px', margin: '4px 0 0 0' }}>
          Manage your contact credentials and shipping addresses for physical heirloom album deliveries.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#161628',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#121220',
              fontWeight: 800,
              fontSize: '24px',
            }}
          >
            {form.fullName.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3' }}>{form.fullName}</div>
            <div style={{ fontSize: '13px', color: '#C8A96E', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <ShieldCheck size={14} /> VIP Patron Account • Encrypted Storage
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', color: '#B8B8C6', marginBottom: '6px' }}>
            Primary Client Names *
          </label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9A9AA6' }} />
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                borderRadius: '10px',
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
            Contact Phone Number
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9A9AA6' }} />
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                borderRadius: '10px',
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
            Print Album Shipping Address *
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9A9AA6' }} />
            <textarea
              rows="2"
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#F8F6F3',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        <div style={{ paddingTop: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={form.emailNotifications}
              onChange={(e) => setForm({ ...form, emailNotifications: e.target.checked })}
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px', color: '#F8F6F3' }}>Receive Instant Email Notices for New Galleries & Invoices</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.smsNotifications}
              onChange={(e) => setForm({ ...form, smsNotifications: e.target.checked })}
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px', color: '#F8F6F3' }}>Receive SMS Reminders on Day of Photoshoot Session</span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {saveSuccess && (
            <span style={{ color: '#4ade80', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Profile Preferences Updated
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            style={{
              background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              color: '#121220',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(200, 169, 110, 0.25)',
            }}
          >
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
