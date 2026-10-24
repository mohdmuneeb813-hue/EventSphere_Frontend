import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FloorPlanView from '../components/floorplan/FloorPlanView';

describe('FloorPlanView Component', () => {
  it('renders floor plan header and legend', () => {
    render(<FloorPlanView booths={[]} currentExpoTitle="Tech Summit 2026" />);

    expect(screen.getByText('Interactive Expo Floor Plan')).toBeInTheDocument();
    expect(screen.getByText(/Tech Summit 2026/)).toBeInTheDocument();
    expect(screen.getAllByText('Available').length).toBeGreaterThan(0);
    expect(screen.getByText('Occupied (Approved)')).toBeInTheDocument();
  });

  it('renders hall selection tabs and switches halls', () => {
    render(<FloorPlanView booths={[]} />);

    const hallBBtn = screen.getByText('Hall B');
    expect(hallBBtn).toBeInTheDocument();

    fireEvent.click(hallBBtn);
    expect(screen.getAllByText('B-01').length).toBeGreaterThan(0);
  });
});
