'use strict';
'use client';

import React from 'react';
import { CheckCircle, Clock, Sparkles, Award } from 'lucide-react';

export default function PackageSelectorStep({ packages = [], selectedPackage, onSelectPackage, onNext }) {
  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
          <Sparkles size={14} color="#C8A96E" /> Step 1 of 4 • Curated Collections
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 12px' }}>
          Select Your Photography Collection
        </h2>
        <p style={{ color: '#A09D98', fontSize: '15px', maxWidth: '620px', margin: '0 auto', lineHeight: '1.6' }}>
          Choose the collection tier that aligns with your creative vision. Every experience includes high-resolution master proofs, color grading, and online private proofing.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {packages.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              style={{
                backgroundColor: isSelected ? '#1c1c30' : '#161628',
                border: isSelected ? '2px solid #C8A96E' : '1px solid #232338',
                borderRadius: '16px',
                padding: '32px 28px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: isSelected ? '0 12px 32px rgba(200, 169, 110, 0.15)' : 'none',
              }}
            >
              {pkg.isFeatured && (
                <div
                  style={{
                    position: 'absolute',
                    top: '18px',
                    right: '18px',
                    backgroundColor: 'rgba(200, 169, 110, 0.15)',
                    border: '1px solid #C8A96E',
                    color: '#C8A96E',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Award size={12} /> Most Requested
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A09D98', fontSize: '13px', marginBottom: '12px' }}>
                  <Clock size={15} color="#C8A96E" />
                  <span>{pkg.durationMinutes || 120} Minutes Shoot Duration</span>
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 10px', lineHeight: '1.3' }}>
                  {pkg.title}
                </h3>

                <p style={{ color: '#A09D98', fontSize: '14px', lineHeight: '1.6', margin: '0 0 22px', minHeight: '45px' }}>
                  {pkg.description}
                </p>

                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 800,
                    color: '#C8A96E',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '6px',
                  }}
                >
                  <span>${pkg.price}</span>
                  <span style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>{pkg.currency || 'USD'}</span>
                </div>

                <div style={{ borderTop: '1px solid #232338', paddingTop: '20px', marginBottom: '28px' }}>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', fontWeight: 600, marginBottom: '12px' }}>
                    Collection Inclusions:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(Array.isArray(pkg.deliverables) ? pkg.deliverables : ['High-Resolution Master Proofs', 'Online Lightbox Gallery', 'Commercial Print Release']).map((deliv, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#E0DDD8' }}>
                        <CheckCircle size={16} color="#C8A96E" style={{ flexShrink: 0 }} />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPackage(pkg);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: isSelected ? '#C8A96E' : 'transparent',
                  color: isSelected ? '#0c0c14' : '#C8A96E',
                  border: isSelected ? 'none' : '1px solid #C8A96E',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.04em',
                }}
              >
                {isSelected ? '✓ Selected Collection' : 'Select Collection'}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #232338', paddingTop: '24px' }}>
        <button
          type="button"
          disabled={!selectedPackage}
          onClick={onNext}
          style={{
            padding: '16px 36px',
            backgroundColor: selectedPackage ? '#C8A96E' : '#232338',
            color: selectedPackage ? '#0c0c14' : '#666',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: selectedPackage ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: selectedPackage ? '0 8px 24px rgba(200, 169, 110, 0.3)' : 'none',
          }}
        >
          Proceed to Calendar & Slots →
        </button>
      </div>
    </div>
  );
}
