'use strict';
'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Clock, DollarSign, Download, ShieldCheck, X } from 'lucide-react';

export default function ClientPaymentsTab({ payments = [], onPayInvoice }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payMethod, setPayMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  const displayPayments = payments.length > 0 ? payments : [
    {
      id: 'pay-sample-1',
      invoiceNumber: 'INV-2026-089',
      description: 'Photography Session Retainer & Digital Asset Package',
      amount: 1250,
      currency: 'USD',
      status: 'pending',
      dueDate: '2026-08-01',
      paidAt: null,
    },
    {
      id: 'pay-sample-2',
      invoiceNumber: 'INV-2026-042',
      description: 'Autumn Golden Hour Lookbook Deposit',
      amount: 500,
      currency: 'USD',
      status: 'paid',
      dueDate: '2026-07-01',
      paidAt: '2026-06-29T14:15:00Z',
    },
  ];

  const pendingAmount = displayPayments
    .filter((p) => p.status === 'pending' || p.status === 'overdue')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const handleConfirmPay = async () => {
    if (!selectedInvoice) return;
    setIsProcessing(true);
    if (onPayInvoice) {
      await onPayInvoice(selectedInvoice.id || selectedInvoice._id, payMethod);
    }
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedInvoice(null);
    }, 800);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> Paid & Receipt Issued
          </span>
        );
      case 'pending':
        return (
          <span style={{ backgroundColor: 'rgba(200, 169, 110, 0.15)', color: '#C8A96E', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> Payment Due
          </span>
        );
      case 'overdue':
        return (
          <span style={{ backgroundColor: 'rgba(255, 107, 107, 0.15)', color: '#ff6b6b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={13} /> Overdue
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#161628',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#F8F6F3', margin: 0 }}>
            Invoices & Secure Payments Ledger
          </h2>
          <p style={{ color: '#B8B8C6', fontSize: '14px', margin: '4px 0 0 0' }}>
            Settle session retainers securely with PCI-DSS encrypted payment gateways or download tax receipts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px 20px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '12px', color: '#9A9AA6' }}>Total Outstanding Balance</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: pendingAmount > 0 ? '#C8A96E' : '#4ade80', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <DollarSign size={20} /> {pendingAmount.toLocaleString()} USD
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayPayments.map((pay) => (
          <div
            key={pay.id}
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: pay.status === 'paid' ? 'rgba(74, 222, 128, 0.12)' : 'rgba(200, 169, 110, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: pay.status === 'paid' ? '#4ade80' : '#C8A96E',
                }}
              >
                <CreditCard size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#F8F6F3' }}>{pay.invoiceNumber}</span>
                  {getStatusBadge(pay.status)}
                </div>
                <div style={{ fontSize: '14px', color: '#B8B8C6' }}>{pay.description}</div>
                <div style={{ fontSize: '12px', color: '#9A9AA6', marginTop: '4px' }}>
                  {pay.status === 'paid'
                    ? `Paid on ${new Date(pay.paidAt || Date.now()).toLocaleDateString()}`
                    : `Payment due by ${pay.dueDate}`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#F8F6F3' }}>
                  ${pay.amount.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: '#9A9AA6' }}>{pay.currency}</span>
                </div>
              </div>

              {pay.status === 'pending' || pay.status === 'overdue' ? (
                <button
                  onClick={() => setSelectedInvoice(pay)}
                  style={{
                    background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: '#121220',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(200, 169, 110, 0.25)',
                  }}
                >
                  Pay Now
                </button>
              ) : (
                <button
                  onClick={() => alert(`Downloading PDF Receipt for ${pay.invoiceNumber}...`)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    color: '#B8B8C6',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Download size={15} /> Receipt
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Online Checkout Simulation Modal */}
      {selectedInvoice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#161628',
              border: '1px solid rgba(200, 169, 110, 0.4)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '440px',
              padding: '28px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8A96E', fontSize: '16px', fontWeight: 700 }}>
                <ShieldCheck size={18} /> Secure Checkout Portal
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{ background: 'transparent', border: 'none', color: '#9A9AA6', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#9A9AA6' }}>Invoice #{selectedInvoice.invoiceNumber}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3', marginTop: '4px' }}>
                ${selectedInvoice.amount.toLocaleString()} USD
              </div>
              <div style={{ fontSize: '12px', color: '#B8B8C6', marginTop: '4px' }}>{selectedInvoice.description}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#B8B8C6', marginBottom: '10px' }}>
                Select Payment Method
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: payMethod === 'credit_card' ? 'rgba(200, 169, 110, 0.12)' : 'rgba(255,255,255,0.03)',
                    border: payMethod === 'credit_card' ? '1px solid #C8A96E' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    value="credit_card"
                    checked={payMethod === 'credit_card'}
                    onChange={() => setPayMethod('credit_card')}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8F6F3' }}>Credit / Debit Card (Stripe PCI)</div>
                    <div style={{ fontSize: '11px', color: '#9A9AA6' }}>Visa, Mastercard, American Express</div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: payMethod === 'bank_transfer' ? 'rgba(200, 169, 110, 0.12)' : 'rgba(255,255,255,0.03)',
                    border: payMethod === 'bank_transfer' ? '1px solid #C8A96E' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    value="bank_transfer"
                    checked={payMethod === 'bank_transfer'}
                    onChange={() => setPayMethod('bank_transfer')}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8F6F3' }}>Direct Bank ACH Transfer</div>
                    <div style={{ fontSize: '11px', color: '#9A9AA6' }}>Instant bank verification with Plaid</div>
                  </div>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#B8B8C6',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPay}
                disabled={isProcessing}
                style={{
                  background: 'linear-gradient(135deg, #C8A96E 0%, #9A7B4F 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  color: '#121220',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(200, 169, 110, 0.25)',
                }}
              >
                {isProcessing ? 'Processing Payment...' : `Confirm Pay $${selectedInvoice.amount}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
