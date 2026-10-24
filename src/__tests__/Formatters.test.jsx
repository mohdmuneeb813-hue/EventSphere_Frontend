import { describe, it, expect } from 'vitest';
import { formatDate, getStatusBadgeClass, getRoleBadgeClass } from '../utils/formatters';

describe('Formatters Utility', () => {
  it('formats valid ISO date correctly', () => {
    const formatted = formatDate('2026-11-15T10:00:00.000Z');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Nov');
  });

  it('handles null or empty date gracefully', () => {
    expect(formatDate(null)).toBe('TBA');
    expect(formatDate('')).toBe('TBA');
  });

  it('returns appropriate CSS class for approved status', () => {
    const cls = getStatusBadgeClass('Approved');
    expect(cls).toContain('emerald');
  });

  it('returns appropriate CSS class for pending status', () => {
    const cls = getStatusBadgeClass('Pending');
    expect(cls).toContain('amber');
  });

  it('returns appropriate CSS class for admin role', () => {
    const cls = getRoleBadgeClass('admin');
    // Admin role uses the project's terracotta palette (was `purple` before
    // the purple-color purge — see scripts/purge-purple.py).
    expect(cls).toContain('terracotta');
  });
});
