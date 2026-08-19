'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { bookingApi } from '@/lib/api/bookingApi';

export default function CalendarSlotPickerStep({
  studioId = 'momentgrid-collective',
  selectedPackage,
  selectedDate,
  selectedSlot,
  onSelectSlot,
  onBack,
  onNext,
}) {
  const [slots, setSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Generate 14 upcoming selectable days
  const upcomingDays = React.useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      list.push({ iso, weekday, monthDay });
    }
    return list;
  }, []);

  const [activeDate, setActiveDate] = useState(selectedDate || upcomingDays[0]?.iso);

  useEffect(() => {
    let isMounted = true;
    async function fetchSlots() {
      if (!activeDate) return;
      setIsLoadingSlots(true);
      try {
        const res = await bookingApi.checkAvailability({
          studioId,
          date: activeDate,
          packageId: selectedPackage?.id || null,
        });
        if (isMounted && res?.data) {
          setSlots(res.data);
        }
      } catch (err) {
        console.error('Failed to load availability slots:', err);
      } finally {
        if (isMounted) setIsLoadingSlots(false);
      }
    }
    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [activeDate, studioId, selectedPackage]);

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
          <Sparkles size={14} color="#C8A96E" /> Step 2 of 4 • Real-time Studio Availability
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#F8F6F3', margin: '0 0 12px' }}>
          Select Date & Time Slot
        </h2>
        <p style={{ color: '#A09D98', fontSize: '15px', maxWidth: '620px', margin: '0 auto', lineHeight: '1.6' }}>
          Our studio calendar updates automatically to guarantee your artist crew is dedicated exclusively to your collection session.
        </p>
      </div>

      {/* Selected Package Banner */}
      {selectedPackage && (
        <div
          style={{
            backgroundColor: '#161628',
            border: '1px solid #232338',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Selected Collection:
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8F6F3' }}>
              {selectedPackage.title} ({selectedPackage.durationMinutes || 120} Mins)
            </div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#C8A96E' }}>
            ${selectedPackage.price} {selectedPackage.currency || 'USD'}
          </div>
        </div>
      )}

      {/* Date Carousel */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#E0DDD8', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={16} color="#C8A96E" />
          <span>Select Shoot Date (Next 14 Days Available):</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '12px',
            scrollbarWidth: 'thin',
          }}
        >
          {upcomingDays.map((day) => {
            const isSelected = activeDate === day.iso;
            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => {
                  setActiveDate(day.iso);
                  onSelectSlot({ date: day.iso, startTime: null, endTime: null });
                }}
                style={{
                  minWidth: '96px',
                  padding: '16px 12px',
                  backgroundColor: isSelected ? '#C8A96E' : '#161628',
                  color: isSelected ? '#0c0c14' : '#E0DDD8',
                  border: isSelected ? '2px solid #C8A96E' : '1px solid #232338',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', opacity: isSelected ? 0.8 : 0.6, marginBottom: '6px' }}>
                  {day.weekday}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 700 }}>{day.monthDay}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#E0DDD8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="#C8A96E" />
          <span>Available Time Slots for {activeDate}:</span>
        </div>

        {isLoadingSlots ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161628', borderRadius: '12px', color: '#C8A96E' }}>
            <span>Computing calendar clashes and operating hours...</span>
          </div>
        ) : slots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161628', borderRadius: '12px', color: '#A09D98' }}>
            <AlertCircle size={32} color="#E57373" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#F8F6F3' }}>No Open Slots on This Date</div>
            <p style={{ margin: '6px 0 0', fontSize: '14px' }}>All lead photographers are fully booked or on holiday. Please select an alternate date above.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {slots.map((slot, idx) => {
              const isBooked = slot.status === 'booked';
              const isChosen = selectedSlot?.date === activeDate && selectedSlot?.startTime === slot.startTime;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isBooked}
                  onClick={() => onSelectSlot({ date: activeDate, startTime: slot.startTime, endTime: slot.endTime })}
                  style={{
                    padding: '18px 16px',
                    backgroundColor: isChosen ? '#C8A96E' : isBooked ? '#12121e' : '#161628',
                    color: isChosen ? '#0c0c14' : isBooked ? '#555' : '#E0DDD8',
                    border: isChosen ? '2px solid #C8A96E' : isBooked ? '1px dashed #28283c' : '1px solid #282840',
                    borderRadius: '12px',
                    cursor: isBooked ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: isChosen ? '0 8px 24px rgba(200, 169, 110, 0.25)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: 700,
                      color: isChosen ? '#0c0c14' : isBooked ? '#E57373' : '#4CAF50',
                    }}
                  >
                    {isBooked ? 'Booked / Reserved' : isChosen ? '✓ Selected Slot' : 'Available Slot'}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #232338', paddingTop: '24px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '14px 28px',
            backgroundColor: '#161628',
            color: '#E0DDD8',
            border: '1px solid #232338',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Back to Collections
        </button>

        <button
          type="button"
          disabled={!selectedSlot?.startTime}
          onClick={onNext}
          style={{
            padding: '16px 36px',
            backgroundColor: selectedSlot?.startTime ? '#C8A96E' : '#232338',
            color: selectedSlot?.startTime ? '#0c0c14' : '#666',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: selectedSlot?.startTime ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: selectedSlot?.startTime ? '0 8px 24px rgba(200, 169, 110, 0.3)' : 'none',
          }}
        >
          Proceed to Client Details →
        </button>
      </div>
    </div>
  );
}
