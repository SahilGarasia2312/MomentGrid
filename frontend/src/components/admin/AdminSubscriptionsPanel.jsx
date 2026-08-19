'use strict';
'use client';

import React, { useState } from 'react';
import { CreditCard, Check, Zap, Star, Crown, Building2 } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free Tier',
    icon: Zap,
    price: '$0',
    period: '/month',
    color: 'text-white/60',
    bg: 'bg-white/5',
    border: 'border-white/10',
    features: ['Up to 100 photos', '1 photographer seat', 'Basic gallery', 'Email support'],
    studiosCount: 8,
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Star,
    price: '$49',
    period: '/month',
    color: 'text-[#C8A96E]',
    bg: 'bg-[#C8A96E]/5',
    border: 'border-[#C8A96E]/30',
    highlight: true,
    features: ['Up to 5,000 photos', '5 photographer seats', 'Full gallery + albums', 'Razorpay payments', 'Priority support'],
    studiosCount: 31,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    price: '$149',
    period: '/month',
    color: 'text-purple-400',
    bg: 'bg-purple-400/5',
    border: 'border-purple-400/30',
    features: ['Unlimited photos', 'Unlimited photographers', 'White-label branding', 'API access', 'Dedicated support', 'Custom domain'],
    studiosCount: 8,
  },
];

const STUDIO_ASSIGNMENTS = [
  { studio: 'MomentGrid Collective', plan: 'enterprise', renewalDate: '2026-09-01', status: 'active' },
  { studio: 'Lumière Atelier', plan: 'professional', renewalDate: '2026-08-15', status: 'active' },
  { studio: 'Veda Frame Studios', plan: 'professional', renewalDate: '2026-07-30', status: 'active' },
  { studio: 'Pacific Light Works', plan: 'free', renewalDate: '—', status: 'active' },
  { studio: 'Desert Bloom Studio', plan: 'professional', renewalDate: '2026-08-20', status: 'trial' },
  { studio: 'Nordic Frame Works', plan: 'free', renewalDate: '—', status: 'pending' },
];

const PLAN_BADGES = {
  free: 'text-white/60 bg-white/10',
  professional: 'text-[#C8A96E] bg-[#C8A96E]/10',
  enterprise: 'text-purple-400 bg-purple-400/10',
};
const STATUS_BADGES = {
  active: 'text-emerald-400 bg-emerald-400/10',
  trial: 'text-amber-400 bg-amber-400/10',
  pending: 'text-blue-400 bg-blue-400/10',
};

export default function AdminSubscriptionsPanel() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Subscription Management</h2>
        <p className="text-xs text-white/40 mt-0.5">Platform plan tiers and studio subscription assignments</p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div key={plan.id}
              className={`relative bg-white/[0.03] border ${plan.border} rounded-2xl p-5 transition-all duration-300 cursor-pointer hover:scale-[1.01]
                ${selectedPlan === plan.id ? 'ring-1 ring-[#C8A96E]/50' : ''}`}
              onClick={() => setSelectedPlan(plan.id === selectedPlan ? null : plan.id)}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#C8A96E] text-[#0A0A14] uppercase tracking-widest">Most Popular</span>
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl ${plan.bg} border ${plan.border} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${plan.color}`} />
              </div>

              <h3 className="text-sm font-black text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className={`text-3xl font-black ${plan.color}`}>{plan.price}</span>
                <span className="text-xs text-white/40">{plan.period}</span>
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[11px] text-white/60">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <Building2 className="w-3.5 h-3.5 text-white/40" />
                <span className="text-[11px] text-white/50">
                  <span className="font-bold text-white">{plan.studiosCount}</span> studios on this plan
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Studio Assignments Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
          <CreditCard className="w-4 h-4 text-[#C8A96E]" />
          <h3 className="text-sm font-bold text-white">Studio Plan Assignments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Studio', 'Plan', 'Renewal Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {STUDIO_ASSIGNMENTS.map((s) => (
                <tr key={s.studio} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-3.5 text-sm font-bold text-white">{s.studio}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${PLAN_BADGES[s.plan]}`}>
                      {s.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-white/50">{s.renewalDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGES[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#C8A96E]/10 text-[#C8A96E] hover:bg-[#C8A96E]/20 transition-all">
                        Upgrade
                      </button>
                      <button className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-all">
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
