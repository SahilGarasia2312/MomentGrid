'use strict';

const EventTeamAssignment = require('../EventTeamAssignment');
const EventActivity = require('../EventActivity');
const EventComment = require('../EventComment');

describe('Collaboration Domain Entities', () => {
  it('EventTeamAssignment validates roles', () => {
    expect(() => new EventTeamAssignment({ eventId: 'e1', userId: 'u1', role: 'Hacker' })).toThrow('Invalid role: Hacker');
    const t = new EventTeamAssignment({ eventId: 'e1', userId: 'u1', role: 'Lead Photographer' });
    expect(t.role).toBe('Lead Photographer');
  });

  it('EventActivity validates action', () => {
    expect(() => new EventActivity({ eventId: 'e1' })).toThrow('Activity requires an action description.');
    const a = new EventActivity({ eventId: 'e1', action: 'Task created' });
    expect(a.actorName).toBe('System');
  });

  it('EventComment validates text and author', () => {
    expect(() => new EventComment({ eventId: 'e1', authorId: 'u1' })).toThrow('Comment text is required.');
    const c = new EventComment({ eventId: 'e1', authorId: 'u1', text: 'Hello' });
    expect(c.referenceType).toBe('EVENT');
  });
});
