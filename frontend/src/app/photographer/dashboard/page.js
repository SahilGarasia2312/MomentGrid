'use strict';
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { photographerApi } from '@/lib/api/photographerApi';
import { getRoleDashboardPath } from '@/lib/utils/roleRouting';

// Components
import PhotographerSidebar from '@/components/photographer/PhotographerSidebar';
import PhotographerHeader from '@/components/photographer/PhotographerHeader';
import PhotographerPerformanceTab from '@/components/photographer/PhotographerPerformanceTab';
import PhotographerProfileTab from '@/components/photographer/PhotographerProfileTab';
import PhotographerPortfolioTab from '@/components/photographer/PhotographerPortfolioTab';
import PhotographerEventsTab from '@/components/photographer/PhotographerEventsTab';
import PhotographerGalleryUploadTab from '@/components/photographer/PhotographerGalleryUploadTab';
import PhotographerAvailabilityTab from '@/components/photographer/PhotographerAvailabilityTab';
import PhotographerNotificationsTab from '@/components/photographer/PhotographerNotificationsTab';

export default function PhotographerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('performance');
  const [selectedEventForUpload, setSelectedEventForUpload] = useState(null);

  // Data States
  const [profile, setProfile] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [notificationsData, setNotificationsData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect if not logged in or incorrect role
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    } else if (!authLoading && isAuthenticated && user) {
      if (user.role !== 'photographer') {
        router.replace(getRoleDashboardPath(user.role));
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const loadAllPhotographerData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsRefreshing(true);
    try {
      const [profRes, perfRes, evRes, availRes, notifRes] = await Promise.allSettled([
        photographerApi.getProfile('me'),
        photographerApi.getPerformance('me'),
        photographerApi.listEvents('me'),
        photographerApi.getAvailability(new Date().toISOString().slice(0, 7), 'me'),
        photographerApi.getNotifications('me'),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value?.data) setProfile(profRes.value.data);
      if (perfRes.status === 'fulfilled' && perfRes.value?.data) setPerformanceData(perfRes.value.data);
      if (evRes.status === 'fulfilled' && evRes.value?.data) setEventsData(evRes.value.data);
      if (availRes.status === 'fulfilled' && availRes.value?.data) setAvailabilityData(availRes.value.data);
      if (notifRes.status === 'fulfilled' && notifRes.value?.data) setNotificationsData(notifRes.value.data);
    } catch (e) {
      console.error('Failed to load photographer portal data:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllPhotographerData();
    }
  }, [isAuthenticated, loadAllPhotographerData]);

  // Handlers
  const handleSaveProfile = async (payload) => {
    const updated = await photographerApi.updateProfile(payload, 'me');
    if (updated?.data) setProfile(updated.data);
    await loadAllPhotographerData();
  };

  const handleLaunchUploadFromEvent = (event) => {
    setSelectedEventForUpload(event);
    setActiveTab('upload');
  };

  const handleGalleryUploaded = async (payload) => {
    await photographerApi.uploadGallery(payload, 'me');
    setSelectedEventForUpload(null);
    await loadAllPhotographerData();
    setActiveTab('performance');
  };

  const handleManageBlockedDates = async (dates, action) => {
    await photographerApi.manageBlockedDates(dates, action, 'me');
    await loadAllPhotographerData();
  };

  // Tab Titles mapping
  const tabTitles = {
    performance: 'Artist Performance & Reputation Hub',
    profile: 'Artist Profile & Credentials',
    portfolio: 'Visual Showcase & Portfolio',
    events: 'Assigned Sessions & Itinerary',
    upload: 'Proof Gallery Delivery Portal',
    availability: 'Schedule Management & Calendar',
    notifications: 'Real-time Alerts & Activity Feed',
  };

  if (authLoading || (!profile && isRefreshing)) {
    return (
      <div className="min-h-screen bg-surface-0 dark:bg-[#121220] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="btnSpinner w-10 h-10 border-t-brand-primary dark:border-t-[#C8A96E] mx-auto mb-4" />
          <div className="text-textPalette-secondary dark:text-[#9A9AA6] text-sm font-medium">Loading MomentGrid Artist Portal...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-1 dark:bg-[#0c0c14] text-textPalette-primary dark:text-[#F8F6F3] transition-colors duration-300">
      {/* Sidebar */}
      <PhotographerSidebar
        activeTab={activeTab}
        setActiveTab={(t) => {
          if (t !== 'upload') setSelectedEventForUpload(null);
          setActiveTab(t);
        }}
        user={user || profile}
        onLogout={logout}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <PhotographerHeader
          activeTabName={tabTitles[activeTab] || 'Artist Portal'}
          onRefresh={loadAllPhotographerData}
          unreadCount={notificationsData?.unread_count || 2}
          onQuickUpload={() => setActiveTab('upload')}
          onQuickAvailability={() => setActiveTab('availability')}
        />

        {/* Content Area */}
        <main className="flex-1 p-9 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {activeTab === 'performance' && (
              <PhotographerPerformanceTab performanceData={performanceData} />
            )}
            {activeTab === 'profile' && (
              <PhotographerProfileTab profileData={profile} onSaveProfile={handleSaveProfile} />
            )}
            {activeTab === 'portfolio' && (
              <PhotographerPortfolioTab portfolioItems={profile?.portfolioItems || []} />
            )}
            {activeTab === 'events' && (
              <PhotographerEventsTab eventsData={eventsData} onLaunchUpload={handleLaunchUploadFromEvent} />
            )}
            {activeTab === 'upload' && (
              <PhotographerGalleryUploadTab initialEvent={selectedEventForUpload} onGalleryUploaded={handleGalleryUploaded} />
            )}
            {activeTab === 'availability' && (
              <PhotographerAvailabilityTab availabilityData={availabilityData} onManageBlockedDates={handleManageBlockedDates} />
            )}
            {activeTab === 'notifications' && (
              <PhotographerNotificationsTab
                notificationsData={notificationsData}
                onSelectAction={(tabId) => setActiveTab(tabId)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
