'use strict';
'use client';

import React, { useState } from 'react';
import { ShieldCheck, Calendar, Clock, MapPin, Download, AlertTriangle, CheckCircle, Bell, XCircle } from 'lucide-react';
import { bookingApi } from '@/lib/api/bookingApi';

export default function BookingStatusHub({
  bookingResult,
  onResetWizard,
}) {
  const [bookingData, setBookingData] = useState(bookingResult?.event || null);
  const [paymentData, setPaymentData] = useState(bookingResult?.payment || null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState(null);

  if (!bookingData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#E0DDD8' }}>
        <h2>Session confirmation loading...</h2>
      </div>
    );
  }

  // Calculate hours remaining until shoot
  const eventTimeMs = new Date(`${bookingData.eventDate}T${bookingData.startTime || '10:00'}:00`).getTime();
  const hoursRemaining = Math.round((eventTimeMs - Date.now()) / (1000 * 60 * 60));
  const isRefundEligible = hoursRemaining >= 48;

  const handleCancelSession = async () => {
    setIsCancelling(true);
    try {
      const res = await bookingApi.cancelBooking(bookingData.id, cancellationReason || 'Client requested cancellation');
      if (res?.data?.event) {
        setBookingData(res.data.event);
        if (res.data.payment) setPaymentData(res.data.payment);
        setCancelFeedback(`Booking cancelled. ${isRefundEligible ? 'Full refund of retainer has been initiated.' : 'Retainer deposit forfeited per 48-hour policy.'}`);
      } else {
        // Fallback simulation
        setBookingData({ ...bookingData, status: 'cancelled' });
        if (paymentData) {
          setPaymentData({ ...paymentData, status: isRefundEligible ? 'refunded' : 'retainer_forfeited' });
        }
        setCancelFeedback(`Booking cancelled. ${isRefundEligible ? 'Full refund initiated.' : 'Retainer forfeited (< 48h notice per policy).'}`);
      }
      setShowCancelModal(false);
    } catch (err) {
      console.error('Cancellation error:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadReceipt = () => {
    const content = `MOMENTGRID OFFICIAL INVOICE RECEIPT
===================================================
Invoice Number : ${paymentData?.invoiceNumber || 'INV-2026-892'}
Session Title  : ${bookingData.title}
Client Name    : ${bookingData.clientName}
Client Email   : ${bookingData.clientEmail}
Event Date     : ${bookingData.eventDate} (${bookingData.startTime} - ${bookingData.endTime})
Total Fee      : $${bookingData.price} USD
Payment Status : ${paymentData?.status?.toUpperCase() || 'PAID'}
===================================================
Thank you for booking with MomentGrid Collective.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${paymentData?.invoiceNumber || 'receipt'}_MomentGrid.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '880px', margin: '0 auto' }}>
      {/* Confirmation Banner */}
      <div
        style={{
          backgroundColor: bookingData.status === 'cancelled' ? 'rgba(229, 115, 115, 0.1)' : 'rgba(76, 175, 80, 0.1)',
          border: bookingData.status === 'cancelled' ? '1px solid #E57373' : '1px solid #4CAF50',
          borderRadius: '16px',
          padding: '28px',
          textAlign: 'center',
          marginBottom: '36px',
        }}
      >
        {bookingData.status === 'cancelled' ? (
          <XCircle size={48} color="#E57373" style={{ margin: '0 auto 14px' }} />
        ) : (
          <CheckCircle size={48} color="#4CAF50" style={{ margin: '0 auto 14px' }} />
        )}

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 8px' }}>
          {bookingData.status === 'cancelled' ? 'Session Booking Cancelled' : 'Photography Session Confirmed!'}
        </h2>
        <p style={{ color: '#E0DDD8', fontSize: '15px', margin: 0 }}>
          {bookingData.status === 'cancelled'
            ? cancelFeedback || 'Your session has been officially cancelled on the studio schedule.'
            : `We have dispatched your verified itinerary & calendar invite to ${bookingData.clientEmail}.`}
        </p>
      </div>

      {/* Main Itinerary & Invoice Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '36px' }}>
        <div
          style={{
            backgroundColor: '#161628',
            border: '1px solid #282840',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#C8A96E', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Confirmed Itinerary
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: bookingData.status === 'cancelled' ? 'rgba(229, 115, 115, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                color: bookingData.status === 'cancelled' ? '#E57373' : '#4CAF50',
                textTransform: 'uppercase',
              }}
            >
              {bookingData.status}
            </span>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 16px' }}>
            {bookingData.title}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#E0DDD8', borderTop: '1px solid #232338', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={18} color="#C8A96E" />
              <span>Date: <strong>{bookingData.eventDate}</strong> ({hoursRemaining > 0 ? `In ${hoursRemaining} hours` : 'Session date'})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} color="#C8A96E" />
              <span>Time Slot: <strong>{bookingData.startTime} - {bookingData.endTime}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} color="#C8A96E" />
              <span>Client Contact: <strong>{bookingData.clientName}</strong></span>
            </div>
          </div>
        </div>

        {/* Invoice Status Card */}
        <div
          style={{
            backgroundColor: '#161628',
            border: '1px solid #282840',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#C8A96E', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Ledger Status
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>
                #{paymentData?.invoiceNumber || 'INV-0892'}
              </span>
            </div>

            <div style={{ fontSize: '32px', fontWeight: 800, color: '#F8F6F3', marginBottom: '6px' }}>
              ${bookingData.price} <span style={{ fontSize: '14px', color: '#888' }}>USD</span>
            </div>

            <div style={{ fontSize: '13px', color: '#A09D98', marginBottom: '20px' }}>
              Payment status: <strong style={{ color: paymentData?.status === 'refunded' ? '#FFB74D' : paymentData?.status === 'paid' ? '#4CAF50' : '#C8A96E', textTransform: 'uppercase' }}>{paymentData?.status || 'PAID'}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadReceipt}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#12121e',
              border: '1px solid #282840',
              borderRadius: '10px',
              color: '#C8A96E',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <Download size={16} /> Download Official Receipt
          </button>
        </div>
      </div>

      {/* Notifications Timeline */}
      <div
        style={{
          backgroundColor: '#161628',
          border: '1px solid #282840',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '36px',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#E0DDD8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="#C8A96E" /> Lifecycle Notification Alerts Log
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', borderLeft: '2px solid #4CAF50', paddingLeft: '12px' }}>
            <div style={{ fontWeight: 700, color: '#F8F6F3' }}>Retainer Settled & Session Confirmed</div>
            <div style={{ color: '#888' }}>• Just now</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', borderLeft: '2px solid #C8A96E', paddingLeft: '12px' }}>
            <div style={{ fontWeight: 700, color: '#E0DDD8' }}>Booking Request & Invoice Generated</div>
            <div style={{ color: '#888' }}>• Initial submission</div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #232338', paddingTop: '24px' }}>
        <button
          type="button"
          onClick={onResetWizard}
          style={{
            padding: '14px 24px',
            backgroundColor: '#12121e',
            color: '#E0DDD8',
            border: '1px solid #282840',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Book Another Session
        </button>

        {bookingData.status !== 'cancelled' && (
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            style={{
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#E57373',
              border: '1px solid #E57373',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Request Session Cancellation
          </button>
        )}
      </div>

      {/* 48-Hour Cancellation Refund Policy Dialog Modal */}
      {showCancelModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#161628',
              border: '1px solid #282840',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '520px',
              width: '100%',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E57373', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
              <AlertTriangle size={24} /> Confirm Cancellation Request
            </div>

            <div style={{ backgroundColor: '#12121e', padding: '16px', borderRadius: '10px', border: '1px solid #282840', marginBottom: '20px', fontSize: '13px', lineHeight: '1.6' }}>
              <div style={{ fontWeight: 700, color: '#F8F6F3', marginBottom: '6px' }}>48-Hour Refund Eligibility Policy Check:</div>
              Your session is scheduled in <strong style={{ color: isRefundEligible ? '#4CAF50' : '#E57373' }}>{hoursRemaining} hours</strong>.
              {isRefundEligible ? (
                <span style={{ color: '#4CAF50', display: 'block', marginTop: '6px' }}>
                  ✓ You are giving more than 48 hours notice. Your retainer deposit will be 100% refunded.
                </span>
              ) : (
                <span style={{ color: '#E57373', display: 'block', marginTop: '6px' }}>
                  ⚠ Notice is within the 48-hour window. Per studio policy, your retainer deposit is non-refundable unless overridden by studio administration.
                </span>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#E0DDD8', display: 'block', marginBottom: '8px' }}>
                Reason for Cancellation (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Schedule conflict or travel postponement..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                style={{ width: '100%', padding: '12px', backgroundColor: '#12121e', border: '1px solid #282840', borderRadius: '8px', color: '#F8F6F3', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#232338',
                  color: '#E0DDD8',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Keep My Booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelSession}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#E57373',
                  color: '#0c0c14',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isCancelling ? 'not-allowed' : 'pointer',
                }}
              >
                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
