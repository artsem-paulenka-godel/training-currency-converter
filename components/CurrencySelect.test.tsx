import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencySelect from './CurrencySelect';
import { CURRENCIES } from '@/utils/currency';
import favorites from '@/utils/favorites';

// Reset favorites before each test
beforeEach(() => {
  localStorage.clear();
  jest.resetModules();
  // Clear the in-memory favorites list
  while (favorites.list().length > 0) {
    favorites.remove(favorites.list()[0]);
  }
});

describe('CurrencySelect', () => {
  it('should render select with all currencies', () => {
    render(<CurrencySelect value="USD" onChange={jest.fn()} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    // Check that all currencies are in the select
    CURRENCIES.forEach((currency) => {
      const option = screen.getByRole('option', {
        name: new RegExp(`${currency.code} - ${currency.name}`),
      });
      expect(option).toBeInTheDocument();
    });
  });

  it('should display selected currency', () => {
    render(<CurrencySelect value="EUR" onChange={jest.fn()} />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('EUR');
  });

  it('should call onChange when currency is selected', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(<CurrencySelect value="USD" onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'EUR');
    
    expect(handleChange).toHaveBeenCalledWith('EUR');
  });

  it('should display label when provided', () => {
    render(
      <CurrencySelect value="USD" onChange={jest.fn()} label="From Currency" />
    );
    
    expect(screen.getByText('From Currency')).toBeInTheDocument();
  });

  it('should render dropdown icon', () => {
    const { container } = render(
      <CurrencySelect value="USD" onChange={jest.fn()} />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have all major currencies in correct format', () => {
    render(<CurrencySelect value="USD" onChange={jest.fn()} />);
    
    expect(screen.getByRole('option', { name: /USD - US Dollar/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /EUR - Euro/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /GBP - British Pound/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /JPY - Japanese Yen/ })).toBeInTheDocument();
  });

  it('toggles favorite when star is clicked', async () => {
    const user = userEvent.setup();
    render(<CurrencySelect value="EUR" onChange={jest.fn()} />);

    const starButton = screen.getByRole('button', { name: /Favorite currency|Unfavorite currency/ });
    // initially not favorite
    expect(starButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(starButton);
    expect(starButton).toHaveAttribute('aria-pressed', 'true');
    // filled star should be present
    expect(screen.queryByTestId('star-filled')).toBeInTheDocument();

    await user.click(starButton);
    expect(starButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByTestId('star-outline')).toBeInTheDocument();
  });

  it('shows limit warning when trying to add 6th favorite', async () => {
    const user = userEvent.setup();
    
    // Pre-fill 5 favorites
    favorites.add('USD');
    favorites.add('EUR');
    favorites.add('GBP');
    favorites.add('JPY');
    favorites.add('CHF');
    
    // Render with a non-favorited currency
    render(<CurrencySelect value="CAD" onChange={jest.fn()} />);
    
    const starButton = screen.getByRole('button', { name: /Favorite currency/ });
    expect(starButton).toHaveAttribute('aria-pressed', 'false');
    
    // Try to add 6th favorite
    await user.click(starButton);
    
    // Should show warning message
    expect(screen.getByText(/Maximum 5 favorites/i)).toBeInTheDocument();
    
    // Should still not be favorited
    expect(starButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('auto-dismisses limit warning after timeout', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    // Pre-fill 5 favorites
    favorites.add('USD');
    favorites.add('EUR');
    favorites.add('GBP');
    favorites.add('JPY');
    favorites.add('CHF');
    
    render(<CurrencySelect value="CAD" onChange={jest.fn()} />);
    
    const starButton = screen.getByRole('button', { name: /Favorite currency/ });
    await user.click(starButton);
    
    // Warning should be visible
    expect(screen.getByText(/Maximum 5 favorites/i)).toBeInTheDocument();
    
    // Advance time by 3 seconds
    jest.advanceTimersByTime(3000);
    
    // Warning should be gone
    await waitFor(() => {
      expect(screen.queryByText(/Maximum 5 favorites/i)).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  it('renders favorites at top of dropdown with star prefix', async () => {
    // Add some favorites
    favorites.add('EUR');
    favorites.add('GBP');
    
    render(<CurrencySelect value="USD" onChange={jest.fn()} />);
    
    // Wait for component to sync with favorites
    await waitFor(() => {
      // Favorites should have star emoji prefix
      expect(screen.getByRole('option', { name: /⭐ EUR - Euro/ })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /⭐ GBP - British Pound/ })).toBeInTheDocument();
    });
  });

  it('favorites appear before non-favorites in dropdown', async () => {
    favorites.add('JPY');
    
    render(<CurrencySelect value="USD" onChange={jest.fn()} />);
    
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      // First option should be the favorite (JPY)
      expect(options[0]).toHaveTextContent('⭐ JPY');
    });
  });
});
