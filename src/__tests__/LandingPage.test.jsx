import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LandingPage from '../pages/common/LandingPage';

// Mock expoApi + boothApi (LandingPage now fetches both on mount).
vi.mock('../api/expoApi', () => ({
  expoApi: {
    getAll: vi.fn().mockResolvedValue([
      {
        _id: 'test-1',
        title: 'Future Tech Expo 2026',
        description: 'Premier technology and robotics convention.',
        theme: 'Robotics & AI',
        location: 'Expo Convention Center',
        date: '2026-11-20T10:00:00.000Z',
      },
    ]),
  },
}));

vi.mock('../api/boothApi', () => ({
  boothApi: {
    getAll: vi.fn().mockResolvedValue([
      {
        _id: 'b-1',
        boothNumber: 'A-01',
        status: 'Approved',
        category: 'Tech & AI',
        expo: { _id: 'test-1' },
        exhibitor: { _id: 'u-1', name: 'Acme Corp' },
      },
    ]),
  },
}));

describe('LandingPage Component', () => {
  it('renders landing hero section and brand titles', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/EXPO/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/World-Class/i).length).toBeGreaterThan(0);
    await waitFor(() =>
      expect(screen.getByText(/Interactive 2D Hall Floor Plan/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Different Industries/i)).toBeInTheDocument();
  });

  it('renders call to action buttons and role cards', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Explore Upcoming Expos')).toBeInTheDocument();
    expect(screen.getByText(/Become an Exhibitor/i)).toBeInTheDocument();
    expect(screen.getByText('Event Organizers (Admin)')).toBeInTheDocument();
    expect(screen.getByText('Exhibitors & Vendors')).toBeInTheDocument();
    expect(screen.getByText('Visitors & Attendees')).toBeInTheDocument();
  });
});
