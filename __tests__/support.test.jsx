import { render, screen } from '@testing-library/react';
import SupportPage from '@/pages/support';

describe('SupportPage', () => {
  it('renders ticket list and detail panels', () => {
    render(<SupportPage />);

    expect(screen.getByText(/Open Tickets/i)).toBeInTheDocument();
    expect(screen.getByText(/Ticket Detail/i)).toBeInTheDocument();
  });

  it('renders response tools and checklist', () => {
    render(<SupportPage />);

    expect(screen.getByLabelText(/template/i)).toBeInTheDocument();
    expect(screen.getByText(/Resolution Checklist/i)).toBeInTheDocument();
  });
});

