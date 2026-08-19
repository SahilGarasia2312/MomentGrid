'use strict';
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { clientApi } from '@/lib/api/clientApi';
import { getRoleDashboardPath } from '@/lib/utils/roleRouting';

// Components
import ClientSidebar from '@/components/client/ClientSidebar';
import ClientHeader from '@/components/client/ClientHeader';
import ClientOverviewTab from '@/components/client/ClientOverviewTab';
import ClientBookingsTab from '@/components/client/ClientBookingsTab';
import ClientPaymentsTab from '@/components/client/ClientPaymentsTab';
import ClientGalleryTab from '@/components/client/ClientGalleryTab';
import ClientAlbumSelectionTab from '@/components/client/ClientAlbumSelectionTab';
import ClientDownloadsTab from '@/components/client/ClientDownloadsTab';
import ClientNotificationsTab from '@/components/client/ClientNotificationsTab';
import ClientProfileTab from '@/components/client/ClientProfileTab';

export default function ClientDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');

  // Data States
  const [overviewData, setOverviewData] = useState(null);
  const [bookingsData, setBookingsData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [galleriesData, setGalleriesData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Redirect if not logged in or incorrect role
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    } else if (!authLoading && isAuthenticated && user) {
      if (user.role !== 'client') {
        router.replace(getRoleDashboardPath(user.role));
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const loadAllClientData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsRefreshing(true);
    try {
      const [ovRes, bookRes, payRes, galRes, albRes, notifRes, profRes] = await Promise.allSettled([
        clientApi.getOverview('me'),
        clientApi.listBookings('me'),
        clientApi.listPayments('me'),
        clientApi.listGalleries('me'),
        clientApi.listAlbums('me'),
        clientApi.getNotifications('me'),
        clientApi.getProfile('me'),
      ]);

      if (ovRes.status === 'fulfilled' && ovRes.value?.data) setOverviewData(ovRes.value.data);
      if (bookRes.status === 'fulfilled' && bookRes.value?.data) setBookingsData(bookRes.value.data);
      if (payRes.status === 'fulfilled' && payRes.value?.data) setPaymentsData(payRes.value.data);
      if (galRes.status === 'fulfilled' && galRes.value?.data) setGalleriesData(galRes.value.data);
      if (albRes.status === 'fulfilled' && albRes.value?.data) setAlbumsData(albRes.value.data);
      if (notifRes.status === 'fulfilled' && notifRes.value?.data) setNotificationsData(notifRes.value.data);
      if (profRes.status === 'fulfilled' && profRes.value?.data) setProfileData(profRes.value.data);
    } catch (e) {
      console.error('Failed to load client portal data:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllClientData();
    }
  }, [isAuthenticated, loadAllClientData]);

  // Handlers
  const handleCreateBooking = async (formPayload) => {
    setIsSubmittingBooking(true);
    try {
      await clientApi.requestBooking(formPayload, 'me');
      await loadAllClientData();
    } catch (err) {
      console.error('Booking request error:', err);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handlePayInvoice = async (paymentId, method) => {
    try {
      await clientApi.payInvoice(paymentId, method, 'me');
      await loadAllClientData();
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const handleToggleFavorite = async (galleryId, photoId) => {
    try {
      await clientApi.toggleFavorite(galleryId, photoId, 'me');
      await loadAllClientData();
    } catch (err) {
      console.error('Favorite toggle error:', err);
    }
  };

  const handleCreateAlbum = async (formPayload) => {
    try {
      await clientApi.createAlbum(formPayload, 'me');
      await loadAllClientData();
    } catch (err) {
      console.error('Album creation error:', err);
    }
  };

  const handleUpdateAlbum = async (albumId, updates) => {
    try {
      await clientApi.updateAlbum(albumId, updates, 'me');
      await loadAllClientData();
    } catch (err) {
      console.error('Album update error:', err);
    }
  };

  const handleLogDownload = async (galleryId, format) => {
    try {
      const res = await clientApi.logDownload(galleryId, format, 'me');
      return res?.data;
    } catch (err) {
      console.error('Download log error:', err);
      return null;
    }
  };

  const handleUpdateProfile = async (updates) => {
    try {
      await clientApi.updateProfile(updates, 'me');
      await loadAllClientData();
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  // Tab titles mapping
  const tabTitles = {
    overview: 'VIP Patron Overview Hub',
    bookings: 'Session Bookings & Itinerary',
    payments: 'Invoices & Secure Payments Ledger',
    galleries: 'Digital Proof Galleries & Selects',
    albums: 'Heirloom Print Album Selections',
    downloads: 'Master Asset Delivery & Downloads',
    notifications: 'Real-time Portal Alerts & Feed',
    profile: 'VIP Profile & Contact Credentials',
  };

  const unreadCount = Array.isArray(notificationsData) ? notificationsData.filter((n) => !n.read).length : 0;

  if (authLoading || (!profileData && isRefreshing && !overviewData)) {
    return (
      <div className="min-h-screen bg-surface-0 dark:bg-[#121220] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="btnSpinner w-10 h-10 border-t-brand-primary dark:border-t-[#C8A96E] mx-auto mb-4" />
          <div className="text-textPalette-secondary dark:text-[#9A9AA6] text-sm font-medium">Loading MomentGrid Client Suite...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-1 dark:bg-[#0c0c14] text-textPalette-primary dark:text-[#F8F6F3] transition-colors duration-300">
      {/* Sidebar */}
      <ClientSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user || profileData}
        onLogout={logout}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <ClientHeader
          activeTabName={tabTitles[activeTab] || 'VIP Patron Suite'}
          onRefresh={loadAllClientData}
          unreadCount={unreadCount}
          onRequestBooking={() => setActiveTab('bookings')}
          onQuickPay={() => setActiveTab('payments')}
        />

        {/* Content Area */}
        <main className="flex-1 p-9 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {activeTab === 'overview' && (
              <ClientOverviewTab
                overviewData={overviewData}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'bookings' && (
              <ClientBookingsTab
                bookings={bookingsData}
                onCreateBooking={handleCreateBooking}
                isSubmitting={isSubmittingBooking}
              />
            )}
            {activeTab === 'payments' && (
              <ClientPaymentsTab
                payments={paymentsData}
                onPayInvoice={handlePayInvoice}
              />
            )}
            {activeTab === 'galleries' && (
              <ClientGalleryTab
                galleries={galleriesData}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
            {activeTab === 'albums' && (
              <ClientAlbumSelectionTab
                albums={albumsData}
                galleries={galleriesData}
                onCreateAlbum={handleCreateAlbum}
                onUpdateAlbum={handleUpdateAlbum}
              />
            )}
            {activeTab === 'downloads' && (
              <ClientDownloadsTab
                galleries={galleriesData}
                onLogDownload={handleLogDownload}
              />
            )}
            {activeTab === 'notifications' && (
              <ClientNotificationsTab
                notifications={notificationsData}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'profile' && (
              <ClientProfileTab
                profileData={profileData || user}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
