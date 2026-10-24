import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, RoleBadge } from '../components/common/Badge';

describe('Badge Components', () => {
  it('renders Approved status badge correctly', () => {
    render(<StatusBadge status="Approved" />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('renders Pending status badge correctly', () => {
    render(<StatusBadge status="Pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders Rejected status badge correctly', () => {
    render(<StatusBadge status="Rejected" />);
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders role badge with uppercase text', () => {
    render(<RoleBadge role="admin" />);
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('renders exhibitor role badge correctly', () => {
    render(<RoleBadge role="exhibitor" />);
    expect(screen.getByText('EXHIBITOR')).toBeInTheDocument();
  });
});
