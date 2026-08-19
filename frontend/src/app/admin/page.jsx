'use strict';

import AdminDashboard from '../../components/admin/AdminDashboard';

export const metadata = {
  title: 'Super Admin Dashboard — MomentGrid',
  description: 'Platform administration command centre: users, studios, photographers, clients, revenue, analytics, subscriptions, settings and audit logs.',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
