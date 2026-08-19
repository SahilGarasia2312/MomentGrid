'use strict';
'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Lock, Unlock, Check, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhotographerAvailabilityTab({ availabilityData, onManageBlockedDates }) {
  const [currentMonth, setCurrentMonth] = useState(availabilityData?.month || '2026-07');
  const [selectedDate, setSelectedDate] = useState('');
  const [actionMessage, setActionMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const availableDates = new Set(availabilityData?.available_dates || ['2026-07-10', '2026-07-11', '2026-07-14']);
  const bookedDates = new Set(availabilityData?.booked_dates || ['2026-07-18', '2026-07-25']);
  const blockedDates = new Set(availabilityData?.blocked_dates || ['2026-07-20', '2026-07-21']);

  const [yearStr, monthStr] = currentMonth.split('-');
  const yearNum = Number(yearStr);
  const monthNum = Number(monthStr);
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  const firstDayOfWeek = new Date(yearNum, monthNum - 1, 1).getDay();

  const handleMonthChange = (offset) => {
    let newM = monthNum + offset;
    let newY = yearNum;
    if (newM > 12) {
      newM = 1;
      newY++;
    } else if (newM < 1) {
      newM = 12;
      newY--;
    }
    setCurrentMonth(`${newY}-${String(newM).padStart(2, '0')}`);
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
  };

  const handleAction = async (actionType) => {
    if (!selectedDate) return;
    setIsProcessing(true);
    setActionMessage(null);
    try {
      if (onManageBlockedDates) {
        await onManageBlockedDates([selectedDate], actionType);
      }
      if (actionType === 'block') {
        blockedDates.add(selectedDate);
        availableDates.delete(selectedDate);
      } else {
        blockedDates.delete(selectedDate);
        availableDates.add(selectedDate);
      }
      setActionMessage(`Date ${selectedDate} successfully ${actionType}ed.`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Calendar Box */}
        <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: '#C8A96E' }} /> Monthly Availability Ledger
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleMonthChange(-1)}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', padding: '6px', color: '#B8B8C6', cursor: 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#C8A96E', minWidth: '80px', textAlign: 'center' }}>
                {currentMonth}
              </span>
              <button
                onClick={() => handleMonthChange(1)}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', padding: '6px', color: '#B8B8C6', cursor: 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '12px', color: '#9A9AA6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(74, 222, 128, 0.6)' }} /> Available
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff6b6b' }} /> Booked
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#C8A96E' }} /> Blocked
            </div>
          </div>

          {/* Days Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} style={{ fontSize: '12px', fontWeight: 600, color: '#9A9AA6', padding: '6px 0' }}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {[...Array(firstDayOfWeek)].map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '42px' }} />
            ))}
            {[...Array(daysInMonth)].map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isBooked = bookedDates.has(dateStr);
              const isBlocked = blockedDates.has(dateStr);
              const isSelected = selectedDate === dateStr;

              let bgColor = 'rgba(255, 255, 255, 0.03)';
              let borderColor = 'transparent';
              let textColor = '#F8F6F3';

              if (isBooked) {
                bgColor = 'rgba(255, 107, 107, 0.2)';
                borderColor = '#ff6b6b';
              } else if (isBlocked) {
                bgColor = 'rgba(200, 169, 110, 0.2)';
                borderColor = '#C8A96E';
              } else {
                bgColor = 'rgba(74, 222, 128, 0.08)';
              }

              if (isSelected) {
                borderColor = '#ffffff';
                textColor = '#ffffff';
              }

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleDateClick(dateStr)}
                  style={{
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    color: textColor,
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Action Box */}
        <div style={{ backgroundColor: '#161628', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F8F6F3', marginTop: 0, marginBottom: '12px' }}>
              Schedule Management & Override
            </h3>
            <p style={{ color: '#B8B8C6', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
              Select any specific day from the monthly calendar to block out personal leave or unblock open reservation slots for your studio coordinator.
            </p>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', marginTop: '20px' }}>
              <div style={{ fontSize: '12px', color: '#9A9AA6' }}>Selected Target Date</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#C8A96E', marginTop: '4px' }}>
                {selectedDate || 'Click any date to select'}
              </div>
            </div>

            {actionMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
                <Check size={16} /> {actionMessage}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            <button
              type="button"
              disabled={!selectedDate || isProcessing || bookedDates.has(selectedDate)}
              onClick={() => handleAction('block')}
              style={{
                flex: 1,
                backgroundColor: 'rgba(200, 169, 110, 0.2)',
                border: '1px solid #C8A96E',
                borderRadius: '10px',
                padding: '12px',
                color: '#C8A96E',
                fontWeight: 700,
                fontSize: '13px',
                cursor: !selectedDate ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Lock size={15} /> Block Date
            </button>

            <button
              type="button"
              disabled={!selectedDate || isProcessing || bookedDates.has(selectedDate)}
              onClick={() => handleAction('unblock')}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                padding: '12px',
                color: '#F8F6F3',
                fontWeight: 600,
                fontSize: '13px',
                cursor: !selectedDate ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Unlock size={15} /> Unblock Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
