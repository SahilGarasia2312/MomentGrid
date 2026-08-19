'use strict';
'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Mail, Phone, ShieldCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { studioApi } from '@/lib/api/studioApi';

export default function StaffTab({ staffList = [], studioId, onStaffChange }) {
  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    email: '',
    role: 'lead_photographer',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const roleLabels = {
    lead_photographer: { label: 'Lead Photographer', bg: 'rgba(200, 169, 110, 0.15)', color: '#C8A96E' },
    second_shooter: { label: 'Second Shooter', bg: 'rgba(110, 133, 200, 0.15)', color: '#6E85C8' },
    editor: { label: 'Photo Editor', bg: 'rgba(168, 110, 200, 0.15)', color: '#A86EC8' },
    assistant: { label: 'Studio Assistant', bg: 'rgba(110, 200, 155, 0.15)', color: '#6EC89B' },
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await studioApi.addStaff(newStaff, studioId);
      setShowModal(false);
      setNewStaff({ fullName: '', email: '', role: 'lead_photographer', phone: '' });
      onStaffChange && onStaffChange();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to invite staff member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (staffId) => {
    if (!window.confirm('Are you sure you want to remove this crew member from the studio?')) return;
    try {
      await studioApi.removeStaff(staffId, studioId);
      onStaffChange && onStaffChange();
    } catch (err) {
      alert(err.message || 'Error removing staff member.');
    }
  };

  const handleRoleChange = async (staffId, newRole) => {
    try {
      await studioApi.updateStaffRole(staffId, { role: newRole }, studioId);
      onStaffChange && onStaffChange();
    } catch (err) {
      alert(err.message || 'Error updating staff role.');
    }
  };

  return (
    <div>
      {/* Top action header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F8F6F3', margin: 0 }}>
            Active Crew & Photographers ({staffList.length})
          </h3>
          <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '4px 0 0' }}>
            Assign photographers to event schedules and grant studio access permissions
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
          <UserPlus size={16} />
          <span>Invite Crew Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {staffList.map((s) => {
          const roleConfig = roleLabels[s.role] || { label: s.role, bg: 'rgba(255,255,255,0.1)', color: '#fff' };
          return (
            <div
              key={s.id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(200, 169, 110, 0.2)',
                        border: '1px solid #C8A96E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#C8A96E',
                        fontWeight: 700,
                        fontSize: '16px',
                      }}
                    >
                      {s.fullName ? s.fullName.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#F8F6F3' }}>
                        {s.fullName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9A9AA6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                        <Mail size={12} /> {s.email}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: roleConfig.bg,
                      color: roleConfig.color,
                    }}
                  >
                    {roleConfig.label}
                  </span>
                </div>

                {s.phone && (
                  <div style={{ fontSize: '12px', color: '#B8B8C6', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                    <Phone size={13} style={{ color: '#C8A96E' }} />
                    <span>{s.phone}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={14} style={{ color: '#6EC89B' }} />
                  <select
                    value={s.role}
                    onChange={(e) => handleRoleChange(s.id, e.target.value)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: '#F8F6F3',
                      fontSize: '12px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="lead_photographer" style={{ background: '#161628' }}>Lead Photographer</option>
                    <option value="second_shooter" style={{ background: '#161628' }}>Second Shooter</option>
                    <option value="editor" style={{ background: '#161628' }}>Photo Editor</option>
                    <option value="assistant" style={{ background: '#161628' }}>Studio Assistant</option>
                  </select>
                </div>

                <button
                  onClick={() => handleRemove(s.id)}
                  title="Remove from studio"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#7A7A8C',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#ff6b6b')}
                  onMouseOut={(e) => (e.currentTarget.style.color = '#7A7A8C')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Modal */}
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
              maxWidth: '460px',
              padding: '28px',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 8px' }}>
              Invite Crew Member
            </h3>
            <p style={{ fontSize: '13px', color: '#9A9AA6', margin: '0 0 20px' }}>
              Invited staff can be assigned to photo shoots and view client itineraries.
            </p>

            {errorMsg && (
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255, 107, 107, 0.15)', color: '#ff6b6b', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.fullName}
                  onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                  placeholder="e.g. Liam Jenkins"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="liam@studio.com"
                  style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Role Assignment
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 12px', color: '#F8F6F3', fontSize: '13px' }}
                  >
                    <option value="lead_photographer" style={{ background: '#161628' }}>Lead Photographer</option>
                    <option value="second_shooter" style={{ background: '#161628' }}>Second Shooter</option>
                    <option value="editor" style={{ background: '#161628' }}>Photo Editor</option>
                    <option value="assistant" style={{ background: '#161628' }}>Studio Assistant</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9A9AA6', marginBottom: '6px' }}>
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '10px 14px', color: '#F8F6F3', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
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
                  {isSubmitting ? 'Inviting...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
