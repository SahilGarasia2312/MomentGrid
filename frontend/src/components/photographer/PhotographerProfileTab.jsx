'use strict';
'use client';

import React, { useState } from 'react';
import { User, Globe, Award, Check, Plus, Trash2, Camera } from 'lucide-react';

export default function PhotographerProfileTab({ profileData, onSaveProfile }) {
  const [bio, setBio] = useState(profileData?.bio || 'Professional cinematic portrait and event photographer with over 5 years of experience capturing luxury celebrations.');
  const [portfolioUrl, setPortfolioUrl] = useState(profileData?.portfolioUrl || 'https://momentgrid.io/photographers/portfolio');
  const [yearsExperience, setYearsExperience] = useState(profileData?.yearsExperience || 5);
  const [specializations, setSpecializations] = useState(profileData?.specializations || ['wedding', 'portrait', 'editorial']);
  const [newSpec, setNewSpec] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSpec = () => {
    if (newSpec.trim() && !specializations.includes(newSpec.trim().toLowerCase())) {
      setSpecializations([...specializations, newSpec.trim().toLowerCase()]);
      setNewSpec('');
    }
  };

  const handleRemoveSpec = (specToRemove) => {
    setSpecializations(specializations.filter((s) => s !== specToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      if (onSaveProfile) {
        await onSaveProfile({ bio, portfolioUrl, yearsExperience: Number(yearsExperience), specializations });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save photographer profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
              Artist Profile & Experience
            </h3>
            <p style={{ color: '#B8B8C6', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
              Manage your professional biography, gear credentials, and specialization categories.
            </p>
          </div>
          {saveSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '13px', fontWeight: 600 }}>
              <Check size={16} /> Profile synchronized
            </div>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Bio textarea */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F3', marginBottom: '8px' }}>
              Artist Biography & Style Statement
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your photography philosophy, lighting style, and background..."
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#F8F6F3',
                fontSize: '14px',
                lineHeight: '1.6',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Years Experience */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F3', marginBottom: '8px' }}>
                Years of Professional Experience
              </label>
              <div style={{ position: 'relative' }}>
                <Award size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C8A96E' }} />
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 42px',
                    color: '#F8F6F3',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Portfolio Link */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F3', marginBottom: '8px' }}>
                Public Portfolio URL
              </label>
              <div style={{ position: 'relative' }}>
                <Globe size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C8A96E' }} />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://alexkim.photography"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 42px',
                    color: '#F8F6F3',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Specialization Tags */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F3', marginBottom: '8px' }}>
              Shoot Specializations
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {specializations.map((spec) => (
                <span
                  key={spec}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(200, 169, 110, 0.15)',
                    color: '#C8A96E',
                    border: '1px solid rgba(200, 169, 110, 0.3)',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(spec)}
                    style={{ background: 'transparent', border: 'none', color: '#C8A96E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Add specialization (e.g., newborn, drone, fashion)..."
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#F8F6F3',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleAddSpec}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '0 18px',
                  color: '#F8F6F3',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                + Add
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 26px',
                color: '#121220',
                fontWeight: 700,
                fontSize: '14px',
                cursor: isSaving ? 'wait' : 'pointer',
                boxShadow: '0 4px 16px rgba(200, 169, 110, 0.3)',
              }}
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
