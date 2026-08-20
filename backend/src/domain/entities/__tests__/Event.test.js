'use strict';

const Event = require('../Event');

describe('Event domain entity', () => {
  it('should construct with correct defaults', () => {
    const event = new Event({
      studioId: 'studio_1',
      title: 'Wedding',
      clientName: 'Jane',
      clientEmail: 'Jane@Test.com',
      eventDate: '2026-10-01',
      startTime: '10:00',
      endTime: '12:00',
    });
    expect(event.clientEmail).toBe('jane@test.com'); // lowercased
    expect(event.assignedStaffIds).toEqual([]);
    expect(event.price).toBe(0);
    expect(event.status).toBe('confirmed');
  });

  it('should expose all required booking lifecycle statuses', () => {
    expect(Event.STATUSES.REQUESTED).toBe('requested');
    expect(Event.STATUSES.CONFIRMED).toBe('confirmed');
    expect(Event.STATUSES.RESCHEDULE_REQUESTED).toBe('reschedule_requested');
    expect(Event.STATUSES.RESCHEDULED).toBe('rescheduled');
    expect(Event.STATUSES.COMPLETED).toBe('completed');
    expect(Event.STATUSES.CANCELLED).toBe('cancelled');
    expect(Event.STATUSES.REFUNDED).toBe('refunded');
  });

  it('should be frozen — statuses cannot be mutated', () => {
    expect(() => { Event.STATUSES.REQUESTED = 'hacked'; }).toThrow();
  });
});
