'use strict';
'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Sparkles, FileText } from 'lucide-react';

export default function ClientDetailsStep({
  clientData = { clientName: '', clientEmail: '', clientPhone: '', location: '', notes: '' },
  onChangeClientData,
  onBack,
  onNext,
}) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!clientData.clientName || clientData.clientName.trim().length < 2) {
      errs.clientName = 'Please enter your full name.';
    }
    if (!clientData.clientEmail || !clientData.clientEmail.includes('@')) {
      errs.clientEmail = 'Please enter a valid email address for receipt delivery.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#C8A96E',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '10px',
          }}
        >
          <Sparkles size={14} color="#C8A96E" /> Step 3 of 4 • Client Questionnaire
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 12px' }}>
          Your Contact & Vision Credentials
        </h2>
        <p style={{ color: '#A09D98', fontSize: '15px', maxWidth: '620px', margin: '0 auto', lineHeight: '1.6' }}>
          Provide your contact details so our production coordinators can issue your official booking itinerary and digital contract.
        </p>
      </div>

      <form onSubmit={handleNext} style={{ maxWidth: '680px', margin: '0 auto 40px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Full Name */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#E0DDD8', marginBottom: '8px' }}>
            <User size={15} color="#C8A96E" /> Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Lady Eleanor Vance"
            value={clientData.clientName}
            onChange={(e) => onChangeClientData({ ...clientData, clientName: e.target.value })}
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: '#161628',
              border: errors.clientName ? '1px solid #E57373' : '1px solid #282840',
              borderRadius: '10px',
              color: '#F8F6F3',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          {errors.clientName && <span style={{ fontSize: '12px', color: '#E57373', marginTop: '4px', display: 'block' }}>{errors.clientName}</span>}
        </div>

        {/* Email & Phone Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#E0DDD8', marginBottom: '8px' }}>
              <Mail size={15} color="#C8A96E" /> Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="eleanor@vance-holdings.com"
              value={clientData.clientEmail}
              onChange={(e) => onChangeClientData({ ...clientData, clientEmail: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#161628',
                border: errors.clientEmail ? '1px solid #E57373' : '1px solid #282840',
                borderRadius: '10px',
                color: '#F8F6F3',
                fontSize: '15px',
                outline: 'none',
              }}
            />
            {errors.clientEmail && <span style={{ fontSize: '12px', color: '#E57373', marginTop: '4px', display: 'block' }}>{errors.clientEmail}</span>}
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#E0DDD8', marginBottom: '8px' }}>
              <Phone size={15} color="#C8A96E" /> Mobile Phone (Optional)
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 019-2834"
              value={clientData.clientPhone}
              onChange={(e) => onChangeClientData({ ...clientData, clientPhone: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#161628',
                border: '1px solid #282840',
                borderRadius: '10px',
                color: '#F8F6F3',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Shoot Location */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#E0DDD8', marginBottom: '8px' }}>
            <MapPin size={15} color="#C8A96E" /> Shoot Location / Venue Address
          </label>
          <input
            type="text"
            placeholder="e.g. The Glasshouse Loft, Manhattan, NY or Studio A"
            value={clientData.location || ''}
            onChange={(e) => onChangeClientData({ ...clientData, location: e.target.value })}
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: '#161628',
              border: '1px solid #282840',
              borderRadius: '10px',
              color: '#F8F6F3',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        {/* Styling Notes */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#E0DDD8', marginBottom: '8px' }}>
            <FileText size={15} color="#C8A96E" /> Creative Vision, Wardrobe & Lighting Notes
          </label>
          <textarea
            rows={4}
            placeholder="Describe your desired mood, color palette, or specific lighting style (e.g. dramatic chiaroscuro, warm golden hour tones)..."
            value={clientData.notes || ''}
            onChange={(e) => onChangeClientData({ ...clientData, notes: e.target.value })}
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: '#161628',
              border: '1px solid #282840',
              borderRadius: '10px',
              color: '#F8F6F3',
              fontSize: '15px',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Navigation Buttons inside Form */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #232338', paddingTop: '24px', marginTop: '12px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '14px 28px',
              backgroundColor: '#161628',
              color: '#E0DDD8',
              border: '1px solid #232338',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Back to Calendar
          </button>

          <button
            type="submit"
            style={{
              padding: '16px 36px',
              backgroundColor: '#C8A96E',
              color: '#0c0c14',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 24px rgba(200, 169, 110, 0.3)',
            }}
          >
            Review Invoice & Checkout →
          </button>
        </div>
      </form>
    </div>
  );
}
