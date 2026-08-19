'use strict';
'use client';

import React from 'react';
import { Printer, Download, Mail, CheckCircle2, Building2, MapPin, Phone, Globe, Shield } from 'lucide-react';

export default function ItemizedInvoiceView({
  invoice,
  currency = 'USD',
}) {
  if (!invoice) return null;

  const {
    invoiceNumber = 'INV-2026-089',
    clientEmail = 'elena.rossi@momentgrid.com',
    bookingId = 'booking-momentgrid-como-2026',
    description,
    invoiceItems = [],
    taxRate = 18,
    amountPaid = 960,
    status = 'advance_paid',
    createdAt,
    dueDate,
  } = invoice;

  const itemsSubtotal = invoiceItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const taxAmount = Math.round((itemsSubtotal * taxRate) / 100);
  const grandTotal = itemsSubtotal + taxAmount;
  const balanceDue = Math.max(0, grandTotal - amountPaid);

  const formatMoney = (val) => {
    if (currency === 'INR') {
      return `₹${Math.round(val * 83).toLocaleString('en-IN')}`;
    }
    return `$${Number(val).toLocaleString()}`;
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161628] p-4 sm:p-6 rounded-3xl border border-white/10 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-white">Itemized Tax Invoice Manifest</h2>
          <p className="text-xs text-white/60">
            Printable financial record compliant with digital billing and GST / Sales Tax documentation standards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96E] to-[#967d4f] text-black font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Printable Sheet */}
      <div className="bg-[#161628] rounded-3xl border border-white/10 p-6 sm:p-12 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/10 print:border-gray-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C8A96E] flex items-center justify-center text-black font-extrabold text-sm print:bg-black print:text-white">
                MG
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white print:text-black">MOMENTGRID STUDIOS</span>
            </div>
            <p className="text-xs text-white/50 print:text-gray-600 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C8A96E] print:text-gray-700" />
              <span>San Francisco • Milan • Jaipur Destination Collective</span>
            </p>
            <p className="text-xs text-white/50 print:text-gray-600 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#C8A96E] print:text-gray-700" />
              <span>www.momentgrid.com • billing@momentgrid.com</span>
            </p>
          </div>

          <div className="text-left md:text-right space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8A96E] print:text-gray-700">TAX INVOICE</span>
            <h3 className="text-2xl font-black text-white print:text-black">{invoiceNumber}</h3>
            <p className="text-xs text-white/60 print:text-gray-600">Issued: {createdAt ? new Date(createdAt).toLocaleDateString() : 'Today'}</p>
            <p className="text-xs text-white/60 print:text-gray-600">Due Date: {dueDate ? new Date(dueDate).toLocaleDateString() : 'Upon Delivery'}</p>
          </div>
        </div>

        {/* Client & Booking details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/5 print:bg-gray-50 print:border-gray-200">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/40 print:text-gray-500">BILLED TO CLIENT:</span>
            <h4 className="text-base font-bold text-white print:text-black mt-1">{clientEmail}</h4>
            <p className="text-xs text-white/60 print:text-gray-600 mt-0.5">Booking Reference: #{bookingId}</p>
            <p className="text-xs text-white/60 print:text-gray-600">Event Description: {description}</p>
          </div>
          <div className="md:text-right flex flex-col md:items-end justify-center">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/40 print:text-gray-500">PAYMENT STATUS:</span>
            <div className="mt-1">
              {status === 'paid' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 print:bg-emerald-100 print:text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PAID IN FULL</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] font-bold text-xs border border-[#C8A96E]/30 print:bg-amber-100 print:text-amber-800">
                  <span>ADVANCE DEPOSIT PAID</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/50 print:border-gray-300 print:text-gray-600">
                <th className="py-3 px-4">Item & Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Rate</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm print:divide-gray-200">
              {invoiceItems.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-white/5 transition-colors print:hover:bg-transparent">
                  <td className="py-4 px-4 font-medium text-white print:text-black">
                    {item.title}
                  </td>
                  <td className="py-4 px-4 text-center text-white/70 print:text-gray-700">
                    {item.quantity || 1}
                  </td>
                  <td className="py-4 px-4 text-right text-white/70 print:text-gray-700">
                    {formatMoney(item.unitPrice || item.total)}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-white print:text-black">
                    {formatMoney(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Balance Breakdown */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-6 border-t border-white/10 print:border-gray-300">
          <div className="max-w-md space-y-2 text-xs text-white/60 print:text-gray-600">
            <h5 className="font-bold text-white print:text-black flex items-center gap-1.5 text-sm">
              <Shield className="w-4 h-4 text-[#C8A96E]" />
              <span>Studio Terms & Licensing Notice</span>
            </h5>
            <p>
              Digital master photographs are delivered via secure Cloudinary vault upon full balance settlement (`Milestone 02`). 
              All payments are verified instantly via our cryptographic Razorpay gateway.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-3 bg-white/5 p-6 rounded-2xl border border-white/5 print:bg-gray-50 print:border-gray-200 text-sm">
            <div className="flex justify-between text-white/70 print:text-gray-700">
              <span>Items Subtotal:</span>
              <span className="font-bold text-white print:text-black">{formatMoney(itemsSubtotal)}</span>
            </div>
            <div className="flex justify-between text-white/70 print:text-gray-700">
              <span>GST / Sales Tax ({taxRate}%):</span>
              <span className="font-bold text-white print:text-black">{formatMoney(taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-white print:text-black pt-2 border-t border-white/10 print:border-gray-300 text-base">
              <span>Grand Total:</span>
              <span>{formatMoney(grandTotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-400 print:text-emerald-700 pt-1">
              <span>Less: Collected Deposits:</span>
              <span className="font-bold">-{formatMoney(amountPaid)}</span>
            </div>
            <div className="flex justify-between font-black text-lg text-[#C8A96E] print:text-black pt-3 border-t border-white/10 print:border-gray-300">
              <span>Balance Due:</span>
              <span>{formatMoney(balanceDue)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
