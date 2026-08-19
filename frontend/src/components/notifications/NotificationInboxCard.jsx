'use strict';
'use client';

import React from 'react';
import { Bell, CheckCheck, Clock, AlertCircle, Sparkles, CreditCard, BookOpen, Image } from 'lucide-react';

const TYPE_CONFIG = {
  booking_update: {
    icon: Bell,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    label: 'Booking',
  },
  gallery_ready: {
    icon: Image,
    color: 'text-[#C8A96E]',
    bg: 'bg-[#C8A96E]/10',
    border: 'border-[#C8A96E]/20',
    label: 'Gallery',
  },
  album_ready: {
    icon: BookOpen,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    label: 'Album',
  },
  payment_reminder: {
    icon: CreditCard,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    label: 'Payment',
  },
};

function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationInboxCard({
  notification,
  onMarkRead,
  onDelete,
  onNavigate,
}) {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.booking_update;
  const IconComp = config.icon;

  const handleCardClick = () => {
    if (!notification.isRead && onMarkRead) {
      onMarkRead([notification.id]);
    }
    if (onNavigate && notification.actionUrl) {
      onNavigate(notification.actionUrl);
    }
  };

  return (
    <div
      className={`group relative flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300
        ${notification.isRead
          ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
          : `${config.bg} ${config.border} hover:brightness-110`
        }`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`Notification: ${notification.title}`}
    >
      {/* Unread indicator dot */}
      {!notification.isRead && (
        <span className={`absolute top-3 right-3 w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} ring-2 ring-black/40`} />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${config.bg} border ${config.border}`}>
        <IconComp className={`w-5 h-5 ${config.color}`} />
      </div>

      {/* Thumbnail */}
      {notification.thumbnailUrl && (
        <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-white/10">
          <img
            src={notification.thumbnailUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}>
            {config.label}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-white/40 flex-shrink-0">
            <Clock className="w-3 h-3" />
            {timeAgo(notification.createdAt)}
          </span>
        </div>

        <p className={`mt-1 text-sm font-bold leading-snug ${notification.isRead ? 'text-white/70' : 'text-white'}`}>
          {notification.title}
        </p>

        <p className="mt-1 text-xs text-white/50 leading-relaxed line-clamp-2">
          {notification.body}
        </p>
      </div>

      {/* Actions (visible on hover) */}
      <div className="absolute bottom-3 right-3 hidden group-hover:flex items-center gap-1">
        {!notification.isRead && (
          <button
            id={`btn-mark-read-${notification.id}`}
            onClick={(e) => { e.stopPropagation(); onMarkRead && onMarkRead([notification.id]); }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
            title="Mark as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          id={`btn-delete-notif-${notification.id}`}
          onClick={(e) => { e.stopPropagation(); onDelete && onDelete(notification.id); }}
          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
          title="Delete notification"
        >
          <AlertCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
