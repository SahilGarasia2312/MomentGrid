'use strict';
'use client';

import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Sparkles, Layers, Edit3, Send, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ClientAlbumSelectionTab({ albums = [], galleries = [], onCreateAlbum, onUpdateAlbum }) {
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    galleryId: galleries[0]?.id || galleries[0]?._id || '',
    title: 'Heirloom Wedding Lookbook — Vol I',
    coverMaterial: 'Italian Leather - Obsidian Black',
    pageCount: 30,
    clientNotes: 'Please ensure high contrast on black and white portraits and center double-page spreads.',
  });

  const displayAlbums = albums.length > 0 ? albums : [
    {
      id: 'alb-sample-1',
      title: 'Autumn Golden Hour Lookbook — Print Selection',
      galleryId: 'gal-sample-1',
      selectedPhotoIds: ['p1', 'p3'],
      coverMaterial: 'Italian Leather - Obsidian Black',
      pageCount: 30,
      clientNotes: 'Please prioritize the beach sunset silhouette for the hard cover spread.',
      status: 'selecting',
    },
    {
      id: 'alb-sample-2',
      title: 'Heirloom Portrait Lookbook — Vol II',
      galleryId: 'gal-sample-1',
      selectedPhotoIds: ['p1', 'p2', 'p3', 'p4'],
      coverMaterial: 'Linen Velvet - Warm Cream',
      pageCount: 40,
      clientNotes: 'No borders, full bleed prints.',
      status: 'in_production',
    },
  ];

  const activeAlbum = displayAlbums.find((a) => (a.id || a._id) === selectedAlbumId) || displayAlbums[0] || null;

  const handleSubmitNew = async (e) => {
    e.preventDefault();
    if (onCreateAlbum) {
      await onCreateAlbum(form);
    }
    setIsCreating(false);
  };

  const handleStatusSubmit = async (status) => {
    if (!activeAlbum || !onUpdateAlbum) return;
    await onUpdateAlbum(activeAlbum.id || activeAlbum._id, { status });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'selecting':
        return (
          <span style={{ backgroundColor: 'rgba(200, 169, 110, 0.15)', color: '#C8A96E', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Edit3 size={13} /> Selection In Progress
          </span>
        );
      case 'submitted':
        return (
          <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> Submitted for Review
          </span>
        );
      case 'in_production':
        return (
          <span style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} /> Artisan Bindery In Progress
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
            Heirloom Print Album Selections
          </h2>
          <p style={{ color: '#B8B8C6', fontSize: '14px', margin: '4px 0 0 0' }}>
            Curate physical print specifications, choose artisanal cover bindings, and submit layouts to bindery.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          style={{
            background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#121220',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(200, 169, 110, 0.25)',
          }}
        >
          <BookOpen size={16} /> New Lookbook Specification
        </button>
      </div>

      {/* Album Selector Tabs / Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {displayAlbums.map((alb) => {
          const isSelected = activeAlbum && (activeAlbum.id || activeAlbum._id) === (alb.id || alb._id);
          return (
            <div
              key={alb.id || alb._id}
              onClick={() => setSelectedAlbumId(alb.id || alb._id)}
              style={{
                backgroundColor: '#161628',
                border: isSelected ? '2px solid #C8A96E' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  {getStatusBadge(alb.status)}
                  <span style={{ fontSize: '12px', color: '#9A9AA6' }}>{alb.pageCount} Pages</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 8px 0' }}>
                  {alb.title}
                </h3>

                <div style={{ fontSize: '13px', color: '#B8B8C6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} style={{ color: '#C8A96E' }} />
                  <span>Cover: {alb.coverMaterial}</span>
                </div>
              </div>

              <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#C8A96E' }}>
                  {alb.selectedPhotoIds?.length || 0} proofs selected
                </span>
                <span style={{ fontSize: '12px', color: '#9A9AA6' }}>Click to view details &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Album Specification & Submission Panel */}
      {activeAlbum && (
        <div
          style={{
            backgroundColor: '#161628',
            border: '1px solid rgba(200, 169, 110, 0.35)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8A96E', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>
                <Sparkles size={16} /> Active Lookbook Workspace
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#F8F6F3', margin: '4px 0 0 0' }}>
                {activeAlbum.title}
              </h3>
            </div>
            {getStatusBadge(activeAlbum.status)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#9A9AA6', textTransform: 'uppercase' }}>Selected Photo Count</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', marginTop: '4px' }}>
                {activeAlbum.selectedPhotoIds?.length || 0} Selects Curated
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9A9AA6', textTransform: 'uppercase' }}>Artisanal Binding</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#C8A96E', marginTop: '4px' }}>
                {activeAlbum.coverMaterial}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9A9AA6', textTransform: 'uppercase' }}>Spread Volume</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#F8F6F3', marginTop: '4px' }}>
                {activeAlbum.pageCount} Custom Pages
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#B8B8C6', marginBottom: '6px' }}>
              Special Layout & Color Grading Instructions:
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', color: '#F8F6F3', fontSize: '14px', lineHeight: '1.6', border: '1px solid rgba(255,255,255,0.06)' }}>
              {activeAlbum.clientNotes || 'No special instructions submitted.'}
            </div>
          </div>

          {activeAlbum.status === 'selecting' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => alert('Please navigate to Proof Galleries and click the Heart icon on photos to add/remove selects for this album.')}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#F8F6F3',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Modify Selects in Gallery
              </button>
              <button
                onClick={() => handleStatusSubmit('submitted')}
                style={{
                  background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  color: '#121220',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(200, 169, 110, 0.3)',
                }}
              >
                <Send size={16} /> Submit to Bindery Production
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Album Specification Modal */}
      {isCreating && (
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
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 20px 0' }}>
              Create Bespoke Print Lookbook Spec
            </h3>

            <form onSubmit={handleSubmitNew} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#B8B8C6', marginBottom: '6px' }}>
                  Lookbook Title *
                </label>
                <input
                  type="text"
                  required
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

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#B8B8C6', marginBottom: '6px' }}>
                  Cover Material & Color Grading
                </label>
                <select
                  value={form.coverMaterial}
                  onChange={(e) => setForm({ ...form, coverMaterial: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#121220',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#F8F6F3',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  <option value="Italian Leather - Obsidian Black">Italian Leather - Obsidian Black</option>
                  <option value="Italian Leather - Warm Amber Gold">Italian Leather - Warm Amber Gold</option>
                  <option value="Linen Velvet - Natural Ivory">Linen Velvet - Natural Ivory</option>
                  <option value="Hardbound Glass - Acrylic Edge">Hardbound Glass - Acrylic Edge</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#B8B8C6', marginBottom: '6px' }}>
                  Page Count
                </label>
                <input
                  type="number"
                  min="20"
                  max="100"
                  value={form.pageCount}
                  onChange={(e) => setForm({ ...form, pageCount: Number(e.target.value) })}
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
                  Layout Instructions
                </label>
                <textarea
                  rows="3"
                  value={form.clientNotes}
                  onChange={(e) => setForm({ ...form, clientNotes: e.target.value })}
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
                  onClick={() => setIsCreating(false)}
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
                  Create Specification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
