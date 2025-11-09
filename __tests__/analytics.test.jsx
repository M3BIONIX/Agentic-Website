import { render, screen } from '@testing-library/react';
import AnalyticsPage from '@/pages/analytics';

describe('AnalyticsPage', () => {
  it('renders key performance indicators', () => {
    render(<AnalyticsPage />);

    expect(screen.getByText(/key metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/Agent-driven conversions/i)).toBeInTheDocument();
  });

  it('renders filters and session table', () => {
    render(<AnalyticsPage />);

    expect(screen.getByLabelText(/time range/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Agent Sessions/i)).toBeInTheDocument();
  });
});

