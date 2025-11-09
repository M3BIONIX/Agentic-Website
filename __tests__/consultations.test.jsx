import { render, screen } from '@testing-library/react';
import ConsultationPage from '@/pages/consultations';

describe('ConsultationPage', () => {
  it('renders the consultation booking form', () => {
    render(<ConsultationPage />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/primary objective/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
  });

  it('lists FAQ entries for agents to reveal', () => {
    render(<ConsultationPage />);

    expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument();
    expect(screen.getByText(/How long does a consultation/i)).toBeInTheDocument();
  });
});

