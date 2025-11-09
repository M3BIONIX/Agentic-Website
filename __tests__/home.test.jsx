import { render, screen } from '@testing-library/react';
import HomePage from '@/pages/index';

describe('HomePage', () => {
  it('renders contact form inputs', () => {
    render(<HomePage />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('renders product search controls', () => {
    render(<HomePage />);

    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows the agent status panel', () => {
    render(<HomePage />);

    expect(screen.getByText(/agent status/i)).toBeInTheDocument();
    expect(screen.getByText(/no events received yet/i)).toBeInTheDocument();
  });
});

