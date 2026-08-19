'use strict';
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, CheckCheck, RefreshCw, Filter, Mail, Inbox, Sparkles,
} from 'lucide-react';
import { notificationApi } from '../../lib/api/notificationApi';
import NotificationInboxCard from './NotificationInboxCard';
import LiveTriggerSimulatorPanel from './LiveTriggerSimulatorPanel';
import EmailTemplatePreviewModal from './EmailTemplatePreviewModal';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'gallery_ready', label: 'Gallery' },
  { id: 'album_ready', label: 'Album' },
  { id: 'booking_update', label: 'Booking' },
  { id: 'payment_reminder', label: 'Payment' },
];

export default function NotificationSuite({
  initialEmail = 'elena.rossi@momentgrid.com',
}) {
  const [notifications, setNotifications] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [notifRes, emailRes] = await Promise.all([
        notificationApi.listNotifications({
          recipientEmail: initialEmail,
          isRead: showUnreadOnly ? false : undefined,
          type: activeFilter !== 'all' ? activeFilter : undefined,
          page,
          limit: 10,
        }),
        notificationApi.getEmailLog(initialEmail),
      ]);

      if (notifRes?.data) {
        setNotifications(notifRes.data.notifications || []);
        setUnreadCount(notifRes.data.unreadCount || 0);
        setPagination(notifRes.data.pagination || null);
      }

      if (emailRes?.data) {
        setEmailLogs(Array.isArray(emailRes.data) ? emailRes.data : []);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  }, [initialEmail, activeFilter, showUnreadOnly, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time SSE stream for live updates
  useEffect(() => {
    let eventSource;
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/notifications/stream?email=${encodeURIComponent(initialEmail)}`;
      eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'notification_dispatched') {
            setNotifications((prev) => [msg.data, ...prev]);
            setUnreadCount((prev) => prev + 1);
          }
          if (msg.type === 'unread_count_updated') {
            setUnreadCount(msg.data.count || 0);
          }
        } catch (_) {}
      };

      eventSource.onerror = () => eventSource.close();
    } catch (_) {}

    return () => { if (eventSource) eventSource.close(); };
  }, [initialEmail]);

  const handleMarkRead = async (ids) => {
    await notificationApi.markAsRead({ notificationIds: ids, recipientEmail: initialEmail });
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - ids.length));
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAsRead({ recipientEmail: initialEmail, markAll: true });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (id) => {
    const deleted = notifications.find((n) => n.id === id);
    await notificationApi.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (deleted && !deleted.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleSimulationDispatched = (data) => {
    if (data?.notification) {
      setNotifications((prev) => [data.notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }
    if (data?.htmlEmailPreview) {
      setEmailLogs((prev) => [{
        id: `eml_${Date.now()}`,
        recipientEmail: initialEmail,
        type: data.notification?.type,
        title: data.notification?.title,
        body: data.notification?.body,
        actionUrl: data.notification?.actionUrl,
        dispatchedAt: new Date().toISOString(),
        htmlContent: data.htmlEmailPreview,
      }, ...prev]);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (showUnreadOnly && n.isRead) return false;
    if (activeFilter !== 'all' && n.type !== activeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white pb-20 selection:bg-[#C8A96E]/30">

      {/* Page Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A14]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C8A96E]/10 border border-[#C8A96E]/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#C8A96E]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">
                Notification Centre
              </h1>
              <p className="text-[11px] text-white/40 font-medium">
                {unreadCount > 0 ? (
                  <span className="text-[#C8A96E]">{unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</span>
                ) : (
                  'All caught up'
                )}
                {' · '}MomentGrid • Luxe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                id="btn-mark-all-read-suite"
                onClick={handleMarkAllRead}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/70 hover:text-white transition-all"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark All Read
              </button>
            )}
            <button
              id="btn-email-log-open"
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/70 hover:text-white transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-[#C8A96E]" />
              <span className="hidden sm:inline">Email Log</span>
              {emailLogs.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] font-black">
                  {emailLogs.length}
                </span>
              )}
            </button>
            <button
              id="btn-refresh-notifications"
              onClick={loadData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* LEFT: Notification Inbox */}
          <div className="space-y-5">

            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-2xl p-1">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    id={`btn-filter-${tab.id}`}
                    onClick={() => { setActiveFilter(tab.id); setPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeFilter === tab.id
                        ? 'bg-[#C8A96E]/20 text-[#C8A96E] border border-[#C8A96E]/30'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                id="btn-toggle-unread-only"
                onClick={() => { setShowUnreadOnly((v) => !v); setPage(1); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                  showUnreadOnly
                    ? 'bg-[#C8A96E]/20 border-[#C8A96E]/30 text-[#C8A96E]'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                Unread Only
              </button>
            </div>

            {/* Notification List */}
            <div className="space-y-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/[0.03] animate-pulse" />
                ))
              ) : filteredNotifications.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-4 text-white/30">
                  <Inbox className="w-14 h-14" />
                  <p className="font-black text-sm uppercase tracking-widest">All Caught Up</p>
                  <p className="text-xs text-center max-w-xs">
                    No notifications match this filter. Trigger a new alert from the simulator panel.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <NotificationInboxCard
                    key={n.id}
                    notification={n}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                    onNavigate={(url) => console.log('Navigate to:', url)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  id="btn-notif-prev-page"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white disabled:opacity-30 transition-all"
                >
                  Previous
                </button>
                <span className="text-xs text-white/40 font-mono">
                  {page} / {pagination.totalPages}
                </span>
                <button
                  id="btn-notif-next-page"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white disabled:opacity-30 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Simulator + Stats Sidebar */}
          <div className="space-y-5">

            {/* Live Stats Card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#C8A96E]" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Inbox Overview</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Unread', value: unreadCount, color: 'text-[#C8A96E]' },
                  { label: 'Total', value: notifications.length, color: 'text-white' },
                  { label: 'Emails Sent', value: emailLogs.length, color: 'text-blue-400' },
                  { label: 'Live Streams', value: 1, color: 'text-emerald-400' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-3">
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Trigger Simulator */}
            <LiveTriggerSimulatorPanel
              recipientEmail={initialEmail}
              onNotificationDispatched={handleSimulationDispatched}
            />
          </div>
        </div>
      </main>

      {/* Email Template Preview Modal */}
      <EmailTemplatePreviewModal
        emailLogs={emailLogs}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
}
