'use strict';
'use client';

import React, { useState } from 'react';
import { Camera, Plus, ExternalLink, Filter, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function PhotographerPortfolioTab({ portfolioItems = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [items, setItems] = useState(
    portfolioItems.length > 0
      ? portfolioItems
      : [
          { id: 'port-1', title: 'Golden Hour Bridal Portraiture', category: 'wedding', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', clientName: 'Sarah & Michael' },
          { id: 'port-2', title: 'Vogue Summer Editorial Series', category: 'editorial', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', clientName: 'Vogue Collective' },
          { id: 'port-3', title: 'Cinematic Sunset Rings', category: 'wedding', imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', clientName: 'Aria & David' },
          { id: 'port-4', title: 'Monochrome Studio Headshot', category: 'portrait', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', clientName: 'Devon Vance' },
        ]
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('wedding');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80');
  const [newClient, setNewClient] = useState('');

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((i) => i.category === activeCategory);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newTitle.trim() && newImageUrl.trim()) {
      const newItem = {
        id: `port-${Date.now()}`,
        title: newTitle.trim(),
        category: newCategory,
        imageUrl: newImageUrl.trim(),
        clientName: newClient.trim() || 'Session Highlight',
      };
      setItems([newItem, ...items]);
      setShowAddModal(false);
      setNewTitle('');
      setNewClient('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Controls & Category Filters */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} style={{ color: '#C8A96E' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'wedding', 'editorial', 'portrait'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  backgroundColor: activeCategory === cat ? 'rgba(200, 169, 110, 0.2)' : 'transparent',
                  border: activeCategory === cat ? '1px solid #C8A96E' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  color: activeCategory === cat ? '#C8A96E' : '#9A9AA6',
                  fontSize: '13px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            color: '#121220',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(200, 169, 110, 0.25)',
          }}
        >
          <Plus size={16} /> Add Showcase Piece
        </button>
      </div>

      {/* Portfolio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div style={{ position: 'relative', height: '240px', backgroundColor: '#0e0e18', overflow: 'hidden' }}>
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(18, 18, 32, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(200, 169, 110, 0.4)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#C8A96E',
                  textTransform: 'uppercase',
                }}
              >
                {item.category}
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8F6F3' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '13px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={14} style={{ color: '#C8A96E' }} /> Client: {item.clientName}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ backgroundColor: '#161628', border: '1px solid rgba(200, 169, 110, 0.3)', borderRadius: '16px', width: '100%', maxWidth: '460px', padding: '28px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', marginTop: 0, marginBottom: '20px' }}>
              Add Portfolio Showcase Piece
            </h3>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#F8F6F3', marginBottom: '6px' }}>Piece Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cinematic Sunset Vows"
                  style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#F8F6F3', marginBottom: '6px' }}>Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#121220', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', outline: 'none' }}
                >
                  <option value="wedding">Wedding</option>
                  <option value="editorial">Editorial</option>
                  <option value="portrait">Portrait</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#F8F6F3', marginBottom: '6px' }}>Image URL</label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#F8F6F3', marginBottom: '6px' }}>Client / Project Name</label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="e.g. Sarah & Michael"
                  style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 18px', color: '#B8B8C6', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)', border: 'none', borderRadius: '8px', padding: '10px 22px', color: '#121220', fontWeight: 700, cursor: 'pointer' }}
                >
                  Add Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
