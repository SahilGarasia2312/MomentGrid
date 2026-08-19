'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, X, ArrowRight, Inbox } from 'lucide-react';
import { notificationApi } from '../../lib/api/notificationApi';
import NotificationInboxCard from './NotificationInboxCard';

export default function NotificationBellPopover({
  recipientEmail = 'elena.rossi@momentgrid.com',
  onNavigate,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.listNotifications({
        recipientEmail,
        limit: 8,
      });
      if (res?.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (e) {
      console.error('Notification load error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Real-time SSE stream for live badge updates
  useEffect(() => {
    let eventSource;
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/notifications/stream?email=${encodeURIComponent(recipientEmail)}`;
      eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'notification_dispatched') {
            setUnreadCount((prev) => prev + 1);
            setNotifications((prev) => [msg.data, ...prev].slice(0, 8));
          }
          if (msg.type === 'unread_count_updated') {
            setUnreadCount(msg.data.count || 0);
          }
        } catch (_) {}
      };

      eventSource.onerror = () => {
        eventSource.close();
      };
    } catch (_) {}

    // Load initial data
    loadNotifications();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [recipientEmail]);

  // Close popover when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    await notificationApi.markAsRead({ recipientEmail, markAll: true });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleMarkRead = async (ids) => {
    await notificationApi.markAsRead({ notificationIds: ids, recipientEmail });
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - ids.length));
  };

  const handleDelete = async (id) => {
    await notificationApi.deleteNotification(id);
    const deleted = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (deleted && !deleted.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        id="btn-notification-bell"
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#C8A96E]/30 transition-all duration-200 group"
        aria-label={`Notifications — ${unreadCount} unread`}
      >
        <Bell className="w-5 h-5 text-white/70 group-hover:text-[#C8A96E] transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#C8A96E] text-[10px] font-black text-black animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-12 w-[380px] bg-[#161628] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50"
          style={{ animation: 'fadeSlideIn 0.15s ease-out forwards' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C8A96E]" />
              <span className="text-sm font-bold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  id="btn-mark-all-read-popover"
                  onClick={handleMarkAllRead}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                id="btn-close-notification-popover"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 p-2 space-y-1">
            {loading ? (
              <div className="py-10 flex flex-col items-center gap-3 text-white/40">
                <Bell className="w-8 h-8 animate-pulse" />
                <p className="text-xs">Loading notifications…</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-3 text-white/30">
                <Inbox className="w-10 h-10" />
                <p className="text-xs font-bold uppercase tracking-widest">All Caught Up</p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationInboxCard
                  key={n.id}
                  notification={n}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                  onNavigate={(url) => {
                    setIsOpen(false);
                    if (onNavigate) onNavigate(url);
                  }}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 p-2">
            <button
              id="btn-view-all-notifications"
              onClick={() => {
                setIsOpen(false);
                if (onNavigate) onNavigate('/notifications');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-[#C8A96E] hover:bg-[#C8A96E]/10 transition-all"
            >
              View All Notifications
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
