'use strict';

/**
 * Returns the correct portal route based on the user's role.
 *
 * @param {string} role - The user role ('studio_owner', 'photographer', 'client', 'super_admin')
 * @returns {string} The path to their respective dashboard
 */
export function getRoleDashboardPath(role) {
  switch (role) {
    case 'photographer':
      return '/photographer/dashboard';
    case 'client':
      return '/client/dashboard';
    case 'super_admin':
    case 'admin':
      return '/dashboard'; // or admin portal
    case 'studio_owner':
    default:
      return '/dashboard';
  }
}
