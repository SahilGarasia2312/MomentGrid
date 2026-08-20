'use strict';

const EventTimelineItem = require('../EventTimelineItem');
const EventTask = require('../EventTask');
const EventShot = require('../EventShot');
const EventDeliverable = require('../EventDeliverable');

describe('Event Production Domain Entities', () => {
  describe('EventTimelineItem', () => {
    it('validates start and end time', () => {
      expect(() => new EventTimelineItem({ eventId: 'e1', title: 't', startTime: '12:00', endTime: '10:00' })).toThrow();
      const valid = new EventTimelineItem({ eventId: 'e1', title: 't', startTime: '10:00', endTime: '12:00' });
      expect(valid.status).toBe('PENDING');
    });
  });

  describe('EventTask', () => {
    it('validates required fields', () => {
      expect(() => new EventTask({ eventId: 'e1' })).toThrow('Task name is required.');
      const t = new EventTask({ eventId: 'e1', task: 'Edit' });
      expect(t.status).toBe('TODO');
    });
    
    it('validates status', () => {
      expect(() => new EventTask({ eventId: 'e1', task: 't', status: 'HACKED' })).toThrow();
    });
  });

  describe('EventShot', () => {
    it('validates required fields', () => {
      expect(() => new EventShot({ eventId: 'e1' })).toThrow('Shot name is required.');
      const s = new EventShot({ eventId: 'e1', shot: 'Bride' });
      expect(s.status).toBe('PENDING');
    });
  });

  describe('EventDeliverable', () => {
    it('validates required fields', () => {
      expect(() => new EventDeliverable({ eventId: 'e1' })).toThrow('Deliverable title is required.');
      const d = new EventDeliverable({ eventId: 'e1', title: 'Photos' });
      expect(d.status).toBe('PENDING');
    });
  });
});
