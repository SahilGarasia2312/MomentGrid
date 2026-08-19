'use strict';
'use client';

import React, { useState } from 'react';
import { Building2, Globe, Palette, Mail, Phone, Save, CheckCircle2 } from 'lucide-react';
import { studioApi } from '@/lib/api/studioApi';

export default function ProfileTab({ profile, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    slug: profile?.slug || '',
    brandColor: profile?.brandColor || '#C8A96E',
    contactEmail: profile?.contactEmail || '',
    phone: profile?.phone || '',
    about: profile?.about || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);
    try {
      const res = await studioApi.updateProfile(formData, profile?.id);
      if (res?.data) {
        onUpdateProfile && onUpdateProfile(res.data);
        setStatusMsg({ type: 'success', text: 'Studio branding updated successfully!' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile details.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl flex flex-col gap-7 animate-fade-in">
      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
          }`}
        >
          {statusMsg.type === 'success' && <CheckCircle2 size={18} className="flex-shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Brand Identity Card */}
        <div className="bg-surface-0 dark:bg-[#161628] border border-borderColor dark:border-white/10 rounded-2xl p-7 shadow-sm transition-colors duration-300">
          <h3 className="text-lg font-bold text-textPalette-primary dark:text-[#F8F6F3] mb-5 flex items-center gap-2.5">
            <Building2 size={20} className="text-[#C8A96E]" />
            Studio Brand Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textPalette-secondary dark:text-[#9A9AA6] mb-2">
                Studio Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-surface-1 dark:bg-black/20 border border-borderColor dark:border-white/15 rounded-xl px-4 py-3 text-textPalette-primary dark:text-[#F8F6F3] text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textPalette-secondary dark:text-[#9A9AA6] mb-2">
                Custom Portal Slug (URL identifier)
              </label>
              <div className="flex">
                <span className="bg-surface-2 dark:bg-white/5 border border-r-0 border-borderColor dark:border-white/15 rounded-l-xl px-3.5 py-3 text-textPalette-secondary dark:text-[#7A7A8C] text-sm flex items-center select-none">
                  momentgrid.io/s/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="flex-1 min-w-0 bg-surface-1 dark:bg-black/20 border border-borderColor dark:border-white/15 rounded-r-xl px-4 py-3 text-brand-primary dark:text-[#C8A96E] font-semibold text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-borderColor dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textPalette-secondary dark:text-[#9A9AA6] mb-1">
                Brand Accent Color
              </label>
              <p className="text-xs text-textPalette-muted dark:text-gray-400">
                Primary color for client buttons, pin boxes, and invoices.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-surface-1 dark:bg-black/20 border border-borderColor dark:border-white/15 px-3.5 py-2 rounded-xl">
              <input
                type="color"
                name="brandColor"
                value={formData.brandColor}
                onChange={handleChange}
                className="w-9 h-9 border-0 rounded-lg cursor-pointer bg-transparent p-0"
              />
              <span className="text-sm font-bold font-mono text-textPalette-primary dark:text-[#F8F6F3] uppercase">
                {formData.brandColor}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-surface-0 dark:bg-[#161628] border border-borderColor dark:border-white/10 rounded-2xl p-7 shadow-sm transition-colors duration-300">
          <h3 className="text-lg font-bold text-textPalette-primary dark:text-[#F8F6F3] mb-5 flex items-center gap-2.5">
            <Mail size={20} className="text-[#C8A96E]" />
            Public Contact Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textPalette-secondary dark:text-[#9A9AA6] mb-2">
                Inquiry / Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full bg-surface-1 dark:bg-black/20 border border-borderColor dark:border-white/15 rounded-xl px-4 py-3 text-textPalette-primary dark:text-[#F8F6F3] text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textPalette-secondary dark:text-[#9A9AA6] mb-2">
                Studio Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (415) 555-0199"
                className="w-full bg-surface-1 dark:bg-black/20 border border-borderColor dark:border-white/15 rounded-xl px-4 py-3 text-textPalette-primary dark:text-[#F8F6F3] text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-textPalette-secondary dark:text-[#9A9AA6] mb-2">
              About & Bio (Public Gallery Header)
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={4}
              placeholder="Tell clients about your photography style, studio credentials, and equipment..."
              className="w-full bg-surface-1 dark:bg-black/20 border border-borderColor dark:border-white/15 rounded-xl px-4 py-3 text-textPalette-primary dark:text-[#F8F6F3] text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200 resize-y"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-gradient-to-r from-[#C8A96E] to-[#9A7B4F] text-[#121220] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed border-none rounded-xl px-8 py-3.5 font-bold text-sm flex items-center gap-2.5 shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Brand Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
