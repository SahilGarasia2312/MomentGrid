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
    expect(event.status).toBe('DRAFT');
  });

  it('should throw if title is empty', () => {
    expect(() => new Event({ title: '' })).toThrow('Event title is required.');
  });

  it('should throw if startTime > endTime', () => {
    expect(() => new Event({
      title: 'Valid',
      eventDate: '2026-10-01',
      startTime: '14:00',
      endTime: '12:00'
    })).toThrow('Start time cannot be after end time.');
  });

  it('should transition to valid state', () => {
    const event = new Event({ title: 'Valid' });
    event.transitionTo(Event.STATUSES.PLANNED);
    expect(event.status).toBe(Event.STATUSES.PLANNED);
  });

  it('should throw on invalid state transition', () => {
    const event = new Event({ title: 'Valid', status: Event.STATUSES.DRAFT });
    expect(() => event.transitionTo(Event.STATUSES.COMPLETED)).toThrow('Invalid status transition');
  });

  it('should expose all required booking lifecycle statuses', () => {
    expect(Event.STATUSES.REQUESTED).toBe('requested');
    expect(Event.STATUSES.LEGACY_CONFIRMED).toBe('confirmed');
    expect(Event.STATUSES.RESCHEDULE_REQUESTED).toBe('reschedule_requested');
    expect(Event.STATUSES.RESCHEDULED).toBe('rescheduled');
    expect(Event.STATUSES.LEGACY_COMPLETED).toBe('completed');
    expect(Event.STATUSES.LEGACY_CANCELLED).toBe('cancelled');
    expect(Event.STATUSES.REFUNDED).toBe('refunded');
  });

  it('should be frozen — statuses cannot be mutated', () => {
    expect(() => { Event.STATUSES.REQUESTED = 'hacked'; }).toThrow();
  });
});
