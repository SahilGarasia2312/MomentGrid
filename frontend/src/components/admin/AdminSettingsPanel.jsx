'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Shield, Mail, Upload, CreditCard, Power, UserPlus, Loader2 } from 'lucide-react';
import { adminApi } from '../../lib/api/adminApi';

const Toggle = ({ id, value, onChange, disabled }) => (
  <button id={id} onClick={() => onChange(!value)} disabled={disabled}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
      ${value ? 'bg-[#C8A96E]' : 'bg-white/20'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
      ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default function AdminSettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSettings();
      if (res?.data) { setSettings(res.data); setDraft(res.data); }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const patch = (key, val) => setDraft((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminApi.updateSettings(draft);
      if (res?.data) { setSettings(res.data); setDraft(res.data); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } finally { setSaving(false); }
  };

  const isDirty = JSON.stringify(draft) !== JSON.stringify(settings);

  if (loading) return (
    <div className="space-y-4">
      <div className="h-7 bg-white/10 rounded-lg w-48 animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Platform Settings</h2>
          <p className="text-xs text-white/40 mt-0.5">Global configuration for MomentGrid platform</p>
        </div>
        <button id="btn-settings-save" onClick={handleSave} disabled={!isDirty || saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all
            ${isDirty ? 'bg-[#C8A96E]/20 border-[#C8A96E]/30 text-[#C8A96E] hover:bg-[#C8A96E]/30' : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'}
            ${saving ? 'opacity-70' : ''}`}>
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <RefreshCw className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Toggle Settings */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl divide-y divide-white/[0.04]">
        {[
          { id: 'toggle-maintenance', key: 'maintenanceMode', icon: Power, label: 'Maintenance Mode', desc: 'Blocks all non-admin access to the platform. Use during deployments.', color: 'text-rose-400', warnOn: true },
          { id: 'toggle-registration', key: 'userRegistrationEnabled', icon: UserPlus, label: 'User Registration', desc: 'Allow new users to register accounts on MomentGrid.', color: 'text-emerald-400', warnOn: false },
        ].map(({ id, key, icon: Icon, label, desc, color, warnOn }) => (
          <div key={key} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{desc}</p>
                {draft[key] === warnOn && <p className="text-[10px] text-rose-400 mt-1 font-bold">⚠ Active — affects all users</p>}
              </div>
            </div>
            <Toggle id={id} value={!!draft[key]} onChange={(v) => patch(key, v)} />
          </div>
        ))}
      </div>

      {/* Text/Numeric Settings */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl divide-y divide-white/[0.04]">
        {[
          { id: 'input-max-uploads', key: 'maxUploadsPerStudio', icon: Upload, label: 'Max Uploads Per Studio', desc: 'Maximum number of images a studio can upload (all galleries combined)', type: 'number', min: 100, max: 50000 },
          { id: 'input-email-sender', key: 'emailSenderName', icon: Mail, label: 'Email Sender Name', desc: 'Displayed "From" name in all outbound MomentGrid emails', type: 'text' },
          { id: 'input-support-email', key: 'supportEmail', icon: Shield, label: 'Support Email', desc: 'Platform support email shown in client communications', type: 'email' },
        ].map(({ id, key, icon: Icon, label, desc, type, min, max }) => (
          <div key={key} className="px-5 py-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#C8A96E]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{desc}</p>
              </div>
            </div>
            <input id={id} type={type} value={draft[key] ?? ''} min={min} max={max}
              onChange={(e) => patch(key, type === 'number' ? Number(e.target.value) : e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C8A96E]/50 transition-colors" />
          </div>
        ))}

        {/* Razorpay Mode */}
        <div className="px-5 py-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4 text-[#C8A96E]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Razorpay Mode</p>
              <p className="text-[11px] text-white/40 mt-0.5">Switch between test and live payment gateway</p>
              {draft.razorpayMode === 'live' && (
                <p className="text-[10px] text-rose-400 mt-1 font-bold">⚠ LIVE mode — real transactions will be processed</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {['test', 'live'].map((mode) => (
              <button key={mode} id={`btn-razorpay-${mode}`}
                onClick={() => patch('razorpayMode', mode)}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold capitalize transition-all
                  ${draft.razorpayMode === mode
                    ? mode === 'live' ? 'bg-rose-400/20 border-rose-400/40 text-rose-400' : 'bg-emerald-400/20 border-emerald-400/40 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}>
                {mode} Mode
              </button>
            ))}
          </div>
        </div>
      </div>

      {settings?.updatedAt && (
        <p className="text-[10px] text-white/30 text-center">
          Last saved: {new Date(settings.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
