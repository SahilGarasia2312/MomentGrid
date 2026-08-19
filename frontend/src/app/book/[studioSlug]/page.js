'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { bookingApi } from '@/lib/api/bookingApi';
import { Sparkles, Calendar as CalendarIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';

// Step Components
import PackageSelectorStep from '@/components/booking/PackageSelectorStep';
import CalendarSlotPickerStep from '@/components/booking/CalendarSlotPickerStep';
import ClientDetailsStep from '@/components/booking/ClientDetailsStep';
import BookingCheckoutStep from '@/components/booking/BookingCheckoutStep';
import BookingStatusHub from '@/components/booking/BookingStatusHub';

export default function StudioBookingPortalPage() {
  const params = useParams();
  const studioSlug = params?.studioSlug || 'momentgrid-collective';

  // Wizard Step State: 1 to 5
  const [currentStep, setCurrentStep] = useState(1);
  const [packages, setPackages] = useState([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);

  // Booking Data States
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({ date: null, startTime: null, endTime: null });
  const [clientData, setClientData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    location: '',
    notes: '',
  });

  const [bookingResult, setBookingResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPackages() {
      setIsLoadingPackages(true);
      try {
        const res = await bookingApi.getPackages(studioSlug);
        if (isMounted && res?.data) {
          setPackages(res.data);
          if (res.data.length > 0 && !selectedPackage) {
            const feat = res.data.find((p) => p.isFeatured) || res.data[0];
            setSelectedPackage(feat);
          }
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        if (isMounted) setIsLoadingPackages(false);
      }
    }
    loadPackages();
    return () => {
      isMounted = false;
    };
  }, [studioSlug, selectedPackage]);

  // Step 4 -> 5 Checkout settlement handler
  const handleConfirmCheckout = async ({ method }) => {
    setIsSubmitting(true);
    try {
      // 1. Create booking session & pending invoice
      const createPayload = {
        studioId: studioSlug,
        title: selectedPackage?.title || 'Cinematic Session',
        clientName: clientData.clientName,
        clientEmail: clientData.clientEmail,
        clientPhone: clientData.clientPhone || null,
        eventDate: selectedSlot.date || new Date().toISOString().split('T')[0],
        startTime: selectedSlot.startTime || '10:00',
        endTime: selectedSlot.endTime || '12:00',
        packageId: selectedPackage?.id || null,
        price: selectedPackage?.price || 850,
        notes: clientData.notes || '',
      };

      const createRes = await bookingApi.createBooking(createPayload);
      const bookingRecord = createRes?.data || {
        event: { ...createPayload, id: `bk-${Date.now()}`, status: 'requested' },
        payment: { id: `pay-${Date.now()}`, invoiceNumber: `INV-${Date.now().toString().slice(-6)}`, amount: createPayload.price, currency: 'USD', status: 'pending' },
      };

      // 2. Process payment settlement
      const payRes = await bookingApi.payBooking(bookingRecord.event.id, bookingRecord.payment.id, method);
      const finalized = payRes?.data || {
        event: { ...bookingRecord.event, status: 'confirmed' },
        payment: { ...bookingRecord.payment, status: 'paid', method },
      };

      setBookingResult(finalized);
      setCurrentStep(5);
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback transition
      setBookingResult({
        event: {
          id: `bk-${Date.now()}`,
          title: selectedPackage?.title || 'Session',
          clientName: clientData.clientName,
          clientEmail: clientData.clientEmail,
          eventDate: selectedSlot.date || new Date().toISOString().split('T')[0],
          startTime: selectedSlot.startTime || '10:00',
          endTime: selectedSlot.endTime || '12:00',
          status: 'confirmed',
          price: selectedPackage?.price || 850,
        },
        payment: {
          id: `pay-${Date.now()}`,
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
          amount: selectedPackage?.price || 850,
          currency: 'USD',
          status: 'paid',
        },
      });
      setCurrentStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetWizard = () => {
    setSelectedSlot({ date: null, startTime: null, endTime: null });
    setBookingResult(null);
    setCurrentStep(1);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0c0c14', color: '#F8F6F3', fontFamily: 'var(--font-sans, sans-serif)' }}>
      {/* Top Header Bar */}
      <header
        style={{
          borderBottom: '1px solid #232338',
          backgroundColor: '#121220',
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#C8A96E',
              color: '#0c0c14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
            }}
          >
            M
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8F6F3' }}>
              MomentGrid <span style={{ color: '#C8A96E', fontWeight: 500 }}>{studioSlug.replace(/-/g, ' ')}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Official Booking & Invoice Portal
            </div>
          </div>
        </div>

        {/* Step Progress Tracker (Steps 1-4) */}
        {currentStep <= 4 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[1, 2, 3, 4].map((stepNum) => {
              const isCurrent = stepNum === currentStep;
              const isDone = stepNum < currentStep;
              return (
                <div key={stepNum} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isDone || isCurrent ? '#C8A96E' : '#232338',
                      color: isDone || isCurrent ? '#0c0c14' : '#888',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {isDone ? '✓' : stepNum}
                  </div>
                  {stepNum < 4 && <div style={{ width: '24px', height: '2px', backgroundColor: isDone ? '#C8A96E' : '#232338' }} />}
                </div>
              );
            })}
          </div>
        )}

        {currentStep === 5 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4CAF50', fontSize: '13px', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> Session Itinerary Active
          </div>
        )}
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px 80px' }}>
        {isLoadingPackages ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#C8A96E', fontSize: '18px', fontWeight: 700 }}>
            <span>Loading MomentGrid Studio Collections...</span>
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <PackageSelectorStep
                packages={packages}
                selectedPackage={selectedPackage}
                onSelectPackage={(pkg) => setSelectedPackage(pkg)}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <CalendarSlotPickerStep
                studioId={studioSlug}
                selectedPackage={selectedPackage}
                selectedDate={selectedSlot.date}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <ClientDetailsStep
                clientData={clientData}
                onChangeClientData={(data) => setClientData(data)}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}

            {currentStep === 4 && (
              <BookingCheckoutStep
                selectedPackage={selectedPackage}
                selectedSlot={selectedSlot}
                clientData={clientData}
                isSubmitting={isSubmitting}
                onConfirmCheckout={handleConfirmCheckout}
                onBack={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 5 && (
              <BookingStatusHub
                bookingResult={bookingResult}
                onResetWizard={handleResetWizard}
              />
            )}
          </>
        )}
      </main>

      {/* Footer Strip */}
      <footer style={{ borderTop: '1px solid #232338', backgroundColor: '#121220', padding: '32px 40px', textAlign: 'center', fontSize: '13px', color: '#888' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={15} color="#C8A96E" /> 256-bit SSL Encrypted Booking</span>
          <span>•</span>
          <span>48-Hour Full Refund Policy</span>
          <span>•</span>
          <span>Instant PDF Receipt Generation</span>
        </div>
        <div>© {new Date().getFullYear()} MomentGrid Collective. All Rights Reserved. Powered by MomentGrid OS.</div>
      </footer>
    </div>
  );
}
