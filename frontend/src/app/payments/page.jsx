'use strict';
'use client';

import React from 'react';
import PaymentSuite from '../../components/payment/PaymentSuite';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      <PaymentSuite
        initialEmail="elena.rossi@momentgrid.com"
        initialBookingId="booking-momentgrid-como-2026"
      />
    </div>
  );
}
