import { render, screen } from '@testing-library/react';
import DocsPage from '@/pages/docs';

describe('DocsPage', () => {
  it('renders documentation sections and sidebar links', () => {
    render(<DocsPage />);

    expect(screen.getByText(/knowledge base/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /introduction/i })).toBeInTheDocument();
    expect(screen.getByText(/Designing Tools/i)).toBeInTheDocument();
  });

  it('renders the training request form', () => {
    render(<DocsPage />);

    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/focus area/i)).toBeInTheDocument();
  });
});

