import { render, screen } from '@testing-library/react';
import PageFooter from './PageFooter';

describe('PageFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the exchange rate update message', () => {
    render(<PageFooter />);
    
    expect(screen.getByText('Exchange rates are updated hourly')).toBeInTheDocument();
  });

  it('should render copyright notice with current year', () => {
    render(<PageFooter />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Godel Technologies. All rights reserved.`)).toBeInTheDocument();
  });

  it('should not render last updated when timestamp is not provided', () => {
    render(<PageFooter />);
    
    expect(screen.queryByText(/Last updated:/)).not.toBeInTheDocument();
  });

  it('should render last updated when timestamp is provided', () => {
    const timestamp = new Date('2025-01-15T10:30:00').getTime();
    render(<PageFooter lastUpdated={timestamp} />);
    
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it('should format the last updated timestamp correctly', () => {
    const timestamp = new Date('2025-01-15T10:30:00').getTime();
    render(<PageFooter lastUpdated={timestamp} />);
    
    const formattedDate = new Date(timestamp).toLocaleString();
    expect(screen.getByText(`Last updated: ${formattedDate}`)).toBeInTheDocument();
  });

  it('should have proper responsive styling classes', () => {
    const { container } = render(<PageFooter />);
    
    const footerDiv = container.querySelector('.text-center.mt-8.text-gray-600.text-sm');
    expect(footerDiv).toBeInTheDocument();
  });

  it('should render copyright with proper spacing and border', () => {
    const { container } = render(<PageFooter />);
    
    const copyrightParagraph = container.querySelector('.mt-4.border-t.border-gray-200.pt-4');
    expect(copyrightParagraph).toBeInTheDocument();
  });
});
