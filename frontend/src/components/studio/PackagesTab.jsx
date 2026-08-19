'use strict';
'use client';

import React, { useState } from 'react';
import { Package, Plus, Clock, Camera, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { studioApi } from '@/lib/api/studioApi';

export default function PackagesTab({ packages = [], studioId, onPackagesChange }) {
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    durationMinutes: 120,
    deliverablesCount: 50,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setFormData({ title: '', description: '', price: '', durationMinutes: 120, deliverablesCount: 50, isActive: true });
    setShowModal(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPkg(pkg);
    setFormData({
      title: pkg.title || '',
      description: pkg.description || '',
      price: pkg.price || '',
      durationMinutes: pkg.durationMinutes || 120,
      deliverablesCount: pkg.deliverablesCount || 50,
      isActive: pkg.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
        deliverablesCount: Number(formData.deliverablesCount),
      };

      if (editingPkg) {
        await studioApi.updatePackage(editingPkg.id, payload, studioId);
      } else {
        await studioApi.createPackage(payload, studioId);
      }
      setShowModal(false);
      onPackagesChange && onPackagesChange();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save package.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (pkgId) => {
    if (!window.confirm('Are you sure you want to delete this booking package?')) return;
    try {
      await studioApi.deletePackage(pkgId, studioId);
      onPackagesChange && onPackagesChange();
    } catch (err) {
      alert(err.message || 'Error deleting package.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F8F6F3', margin: 0 }}>
            Photography Packages & Tiers ({packages.length})
          </h3>
          <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '4px 0 0' }}>
            Configure session durations, print deliverables, and investment pricing for client bookings
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
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
          <span>Create New Package</span>
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            style={{
              backgroundColor: '#161628',
              border: `1px solid ${pkg.isActive ? 'rgba(200, 169, 110, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
              borderRadius: '16px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              opacity: pkg.isActive ? 1 : 0.65,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
                  {pkg.title}
                </h4>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: pkg.isActive ? 'rgba(200, 169, 110, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    color: pkg.isActive ? '#C8A96E' : '#7A7A8C',
                    textTransform: 'uppercase',
                  }}
                >
                  {pkg.isActive ? 'Active' : 'Archived'}
                </span>
              </div>

              <div style={{ fontSize: '32px', fontWeight: 800, color: '#C8A96E', marginBottom: '14px', letterSpacing: '-0.02em' }}>
                ${(pkg.price || 0).toLocaleString()}
              </div>

              <p style={{ fontSize: '13px', color: '#B8B8C6', lineHeight: 1.6, minHeight: '42px', margin: '0 0 20px' }}>
                {pkg.description || 'Comprehensive photography session tailored for memorable moments.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTime: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#F8F6F3' }}>
                  <Clock size={15} style={{ color: '#C8A96E' }} />
                  <span><strong>{pkg.durationMinutes} minutes</strong> on location</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#F8F6F3' }}>
                  <Camera size={15} style={{ color: '#C8A96E' }} />
                  <span><strong>{pkg.deliverablesCount} edited</strong> high-res proofs</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <button
                onClick={() => handleOpenEdit(pkg)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#F8F6F3',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.2)',
                  borderRadius: '8px',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
              maxWidth: '500px',
              padding: '28px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 8px' }}>
              {editingPkg ? 'Edit Package Tier' : 'Create Package Tier'}
            </h3>
            <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '0 0 20px' }}>
              Define package specifications for studio invoices and public galleries.
            </p>

            {errorMsg && (
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255, 107, 107, 0.15)', color: '#ff6b6b', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Package Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Golden Hour Wedding Collection"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Investment Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2400"
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#C8A96E', fontWeight: 600, fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Session Duration (Mins)
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    placeholder="120"
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Deliverable Proofs Count
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.deliverablesCount}
                  onChange={(e) => setFormData({ ...formData, deliverablesCount: e.target.value })}
                  placeholder="50"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Package Description & Inclusions
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail what is included: location scouting, second photographer, online high-res gallery..."
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="isActive" style={{ fontSize: '13px', color: '#F8F6F3', cursor: 'pointer' }}>
                  Make package active and selectable for client bookings
                </label>
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
                  {isSubmitting ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
