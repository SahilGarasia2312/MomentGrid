import React from 'react';
import NotificationSuite from '../../components/notifications/NotificationSuite';

export const metadata = {
  title: 'Notification Centre — MomentGrid Luxe',
  description: 'Real-time booking alerts, gallery ready notifications, album selection reminders, and payment escrow updates for MomentGrid clients.',
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      <NotificationSuite
        initialEmail="elena.rossi@momentgrid.com"
      />
    </div>
  );
}
