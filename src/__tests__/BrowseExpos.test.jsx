import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BrowseExpos from '../pages/attendee/BrowseExpos';

vi.mock('../api/expoApi', () => ({
  expoApi: {
    getAll: vi.fn().mockResolvedValue([
      {
        _id: 'expo-1',
        title: 'Karachi AI Summit',
        description: 'Deep learning and NLP conference.',
        theme: 'AI & Future',
        location: 'Expo Center Karachi',
        date: '2026-11-15T10:00:00.000Z',
      },
      {
        _id: 'expo-2',
        title: 'Web Dev Expo',
        description: 'Modern full-stack web development show.',
        theme: 'Website development',
        location: 'PC Hotel Lahore',
        date: '2026-12-01T10:00:00.000Z',
      },
    ]),
  },
}));

describe('BrowseExpos Component', () => {
  it('renders expos and search/filter controls', async () => {
    render(
      <BrowserRouter>
        <BrowseExpos />
      </BrowserRouter>
    );

    expect(screen.getByText('Browse All Expos & Conferences')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Karachi AI Summit')).toBeInTheDocument();
      expect(screen.getByText('Web Dev Expo')).toBeInTheDocument();
    });
  });

  it('filters expos based on keyword input', async () => {
    render(
      <BrowserRouter>
        <BrowseExpos />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Karachi AI Summit')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by title/i);
    fireEvent.change(searchInput, { target: { value: 'Karachi' } });

    expect(screen.getByText('Karachi AI Summit')).toBeInTheDocument();
    expect(screen.queryByText('Web Dev Expo')).not.toBeInTheDocument();
  });
});
