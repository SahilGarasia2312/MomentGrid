'use strict';
'use client';

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, DollarSign, Sparkles, Lock, FileText } from 'lucide-react';

export default function BookingCheckoutStep({
  selectedPackage,
  selectedSlot,
  clientData,
  onConfirmCheckout,
  isSubmitting = false,
  onBack,
}) {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const price = selectedPackage?.price || 850;
  const currency = selectedPackage?.currency || 'USD';
  const retainerDeposit = Math.min(price, Math.round(price * 0.5)); // 50% retainer or full

  const handlePay = (e) => {
    e.preventDefault();
    onConfirmCheckout({ method: paymentMethod });
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#C8A96E',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '10px',
          }}
        >
          <Sparkles size={14} color="#C8A96E" /> Step 4 of 4 • Retainer Invoice Settlement
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 12px' }}>
          Secure Invoice & Checkout
        </h2>
        <p style={{ color: '#A09D98', fontSize: '15px', maxWidth: '620px', margin: '0 auto', lineHeight: '1.6' }}>
          Confirm your session itinerary and settle your retainer fee via our PCI-DSS encrypted payment ledger.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '32px', maxWidth: '1000px', margin: '0 auto 40px' }}>
        {/* Left Column: Invoice Summary Card */}
        <div
          style={{
            backgroundColor: '#161628',
            border: '1px solid #282840',
            borderRadius: '16px',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #232338', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#C8A96E', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Invoice Summary
              </span>
              <span style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>
                #INV-{Date.now().toString().slice(-6)}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Session Collection:</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3' }}>{selectedPackage?.title}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
              <span style={{ color: '#A09D98' }}>Shoot Date:</span>
              <span style={{ color: '#F8F6F3', fontWeight: 600 }}>{selectedSlot?.date}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
              <span style={{ color: '#A09D98' }}>Reserved Time Slot:</span>
              <span style={{ color: '#F8F6F3', fontWeight: 600 }}>{selectedSlot?.startTime} - {selectedSlot?.endTime}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
              <span style={{ color: '#A09D98' }}>Client Contact:</span>
              <span style={{ color: '#F8F6F3', fontWeight: 600 }}>{clientData.clientName}</span>
            </div>

            <div style={{ borderTop: '1px solid #232338', margin: '16px 0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{ color: '#A09D98' }}>Package Subtotal:</span>
                <span style={{ color: '#F8F6F3', fontWeight: 600 }}>${price} {currency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{ color: '#A09D98' }}>Taxes & Studio Fees:</span>
                <span style={{ color: '#4CAF50', fontWeight: 600 }}>Included ($0)</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#12121e', padding: '18px', borderRadius: '12px', border: '1px solid #232338' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#E0DDD8' }}>Retainer Deposit Due Now:</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#C8A96E' }}>${retainerDeposit} {currency}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Remaining balance (${price - retainerDeposit} {currency}) is settled upon final proof gallery delivery.
            </div>
          </div>
        </div>

        {/* Right Column: Payment Method Selector & Gateway */}
        <form
          onSubmit={handlePay}
          style={{
            backgroundColor: '#161628',
            border: '1px solid #282840',
            borderRadius: '16px',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#E0DDD8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} color="#C8A96E" /> Select Payment Settlement Method:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[
              { id: 'credit_card', label: 'Credit Card (Stripe)' },
              { id: 'bank_transfer', label: 'Bank ACH (Plaid)' },
              { id: 'cash', label: 'Pay at Studio' },
            ].map((pm) => {
              const isSel = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  style={{
                    padding: '12px 10px',
                    backgroundColor: isSel ? '#C8A96E' : '#12121e',
                    color: isSel ? '#0c0c14' : '#E0DDD8',
                    border: isSel ? '2px solid #C8A96E' : '1px solid #232338',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {pm.label}
                </button>
              );
            })}
          </div>

          {paymentMethod === 'credit_card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#A09D98', marginBottom: '6px', display: 'block' }}>Cardholder Name</label>
                <input
                  type="text"
                  value={clientData.clientName}
                  readOnly
                  style={{ width: '100%', padding: '12px', backgroundColor: '#12121e', border: '1px solid #282840', borderRadius: '8px', color: '#A09D98', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#E0DDD8', marginBottom: '6px', display: 'block' }}>Card Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ width: '100%', padding: '12px 38px 12px 12px', backgroundColor: '#12121e', border: '1px solid #282840', borderRadius: '8px', color: '#F8F6F3', fontSize: '14px', outline: 'none' }}
                  />
                  <CreditCard size={18} color="#C8A96E" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#E0DDD8', marginBottom: '6px', display: 'block' }}>Expiration (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#12121e', border: '1px solid #282840', borderRadius: '8px', color: '#F8F6F3', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#E0DDD8', marginBottom: '6px', display: 'block' }}>CVC Security Code</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#12121e', border: '1px solid #282840', borderRadius: '8px', color: '#F8F6F3', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bank_transfer' && (
            <div style={{ backgroundColor: '#12121e', padding: '16px', borderRadius: '10px', border: '1px solid #282840', fontSize: '13px', color: '#A09D98', lineHeight: '1.6' }}>
              <div style={{ color: '#F8F6F3', fontWeight: 600, marginBottom: '6px' }}>Direct Bank ACH Settlement via Plaid</div>
              Upon clicking authorize below, your bank account will be securely debited for the retainer deposit (${retainerDeposit} USD) without interchange surcharge.
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div style={{ backgroundColor: '#12121e', padding: '16px', borderRadius: '10px', border: '1px solid #282840', fontSize: '13px', color: '#A09D98', lineHeight: '1.6' }}>
              <div style={{ color: '#F8F6F3', fontWeight: 600, marginBottom: '6px' }}>Studio Counter Settlement</div>
              Your session time slot will be held temporarily for 48 hours. Please settle your retainer deposit via wire or cash at the studio office to lock in confirmation.
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}>
            <ShieldCheck size={16} color="#4CAF50" />
            <span>Encrypted with 256-bit SSL TLS security. Cancellation up to 48h prior for full refund.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #232338', paddingTop: '20px', marginTop: 'auto' }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onBack}
              style={{
                padding: '14px 24px',
                backgroundColor: '#12121e',
                color: '#E0DDD8',
                border: '1px solid #232338',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Back to Details
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '16px 36px',
                backgroundColor: isSubmitting ? '#555' : '#C8A96E',
                color: '#0c0c14',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSubmitting ? 'none' : '0 8px 24px rgba(200, 169, 110, 0.3)',
              }}
            >
              {isSubmitting ? 'Processing Ledger...' : `Pay $${retainerDeposit} & Confirm Session →`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
