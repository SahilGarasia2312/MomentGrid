'use strict';
'use client';

import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Building, Lock, CheckCircle2, ArrowRight, X, RefreshCw } from 'lucide-react';

export default function MockRazorpayCheckoutModal({
  isOpen,
  onClose,
  milestone = 'advance',
  amount = 960,
  currency = 'USD',
  clientEmail = 'elena.rossi@momentgrid.com',
  onSuccess,
}) {
  const [method, setMethod] = useState('razorpay_upi');
  const [upiId, setUpiId] = useState('elena.rossi@okaxis');
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 1111');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('select'); // 'select' | 'processing' | 'success'

  if (!isOpen) return null;

  const formatMoney = (val) => {
    if (currency === 'INR') {
      return `₹${Math.round(val * 83).toLocaleString('en-IN')}`;
    }
    return `$${Number(val).toLocaleString()}`;
  };

  const handlePay = () => {
    setIsProcessing(true);
    setStep('processing');

    // Simulate 1.5s cryptographic Razorpay order verification & bank handshake
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      setTimeout(() => {
        onSuccess &&
          onSuccess({
            milestone,
            amount,
            method,
            razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            razorpayOrderId: `order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            razorpaySignature: `sig_verified_${Date.now()}`,
            note: `Verified ${milestone} deposit via Razorpay (${method === 'razorpay_upi' ? upiId : 'Visa Card ending 1111'}).`,
          });
        onClose && onClose();
        setStep('select');
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-[#111122] border border-white/20 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col">
        
        {/* Razorpay header banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 font-black text-lg shadow-lg">
              R
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">Razorpay Trusted Checkout</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-0.5">
                <Lock className="w-3 h-3" />
                <span>256-Bit Bank Grade SSL Encryption</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <span className="text-xs uppercase tracking-wider text-white/50 font-bold">Payable Milestone</span>
              <h4 className="font-bold text-white text-base capitalize mt-0.5">
                {milestone === 'advance' ? 'Milestone 01 • Advance Deposit' : 'Milestone 02 • Remaining Balance'}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-white/50 font-bold">Amount Due</span>
              <div className="font-black text-xl text-[#C8A96E]">{formatMoney(amount)}</div>
            </div>
          </div>

          {step === 'processing' ? (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto text-[#C8A96E]" />
              <h4 className="text-lg font-bold">Verifying Cryptographic Handshake...</h4>
              <p className="text-xs text-white/60 max-w-xs mx-auto">
                Connecting to Razorpay payment gateway (`api.razorpay.com/v1/orders`). Do not refresh or close this window.
              </p>
            </div>
          ) : step === 'success' ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
              <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-400" />
              <h4 className="text-xl font-bold text-emerald-300">Payment Verification Successful!</h4>
              <p className="text-xs text-white/70">
                Generating electronic tax receipt and updating MomentGrid studio ledger...
              </p>
            </div>
          ) : (
            <>
              {/* Payment Method Selector Tabs */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Select Preferred Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('razorpay_upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                      method === 'razorpay_upi'
                        ? 'bg-[#C8A96E]/20 border-[#C8A96E] text-[#C8A96E]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('razorpay_card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                      method === 'razorpay_card'
                        ? 'bg-[#C8A96E]/20 border-[#C8A96E] text-[#C8A96E]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Card / EMI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('razorpay_netbanking')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                      method === 'razorpay_netbanking'
                        ? 'bg-[#C8A96E]/20 border-[#C8A96E] text-[#C8A96E]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span>NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Dynamic inputs */}
              {method === 'razorpay_upi' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/70">Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@okaxis / 9876543210@paytm"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-white/40">Supports Google Pay, PhonePe, Paytm, BHIM, and Axis Pay.</p>
                </div>
              )}

              {method === 'razorpay_card' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/70">Card Number (Visa / MasterCard / Amex)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-white/70">Expiry Date</label>
                      <input type="text" defaultValue="08/29" className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-white/70">CVV / CVC</label>
                      <input type="password" defaultValue="892" maxLength={4} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold" />
                    </div>
                  </div>
                </div>
              )}

              {method === 'razorpay_netbanking' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/70">Select Partner Bank</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold">
                    <option>HDFC Bank Corporate / Retail Netbanking</option>
                    <option>ICICI Bank iMobile & Internet Banking</option>
                    <option>State Bank of India (SBI YONO)</option>
                    <option>Axis Bank Internet Banking</option>
                    <option>Citibank / HSBC Global Banking</option>
                  </select>
                </div>
              )}

              {/* Pay trigger */}
              <button
                type="button"
                onClick={handlePay}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 hover:brightness-110 transition-all"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Authorize & Pay {formatMoney(amount)} via Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

        </div>

        <div className="p-4 bg-black/40 border-t border-white/10 text-center text-[11px] text-white/40 flex items-center justify-center gap-2">
          <span>MomentGrid Simulated Gateway • PCI-DSS Level 1 Compliant</span>
        </div>

      </div>
    </div>
  );
}
