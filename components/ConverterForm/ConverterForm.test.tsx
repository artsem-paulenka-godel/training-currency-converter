import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ConverterForm } from "@/components/ConverterForm/ConverterForm";
import { ExchangeRates } from "@/types";

const mockExchangeRates: ExchangeRates = {
  base: "USD",
  rates: {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110,
  },
  timestamp: Date.now(),
};

describe("ConverterForm", () => {
  const defaultProps = {
    amount: "100",
    fromCurrency: "USD",
    toCurrency: "EUR",
    result: 85,
    validationError: null,
    exchangeRates: mockExchangeRates,
    favorites: [],
    favoriteLimitMessage: null,
    favoriteStorageMessage: null,
    onAmountChange: jest.fn(),
    onFromCurrencyChange: jest.fn(),
    onToCurrencyChange: jest.fn(),
    onSwap: jest.fn(),
    onToggleFavorite: jest.fn(),
    onRefreshRates: jest.fn(),
    isRefreshingRates: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without accessibility violations", async () => {
    const { container } = render(<ConverterForm {...defaultProps} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it("should render all form elements", () => {
    render(<ConverterForm {...defaultProps} />);

    expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /swap currencies/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refresh rates/i }),
    ).toBeInTheDocument();
  });

  it("should display conversion result when no validation error", () => {
    render(<ConverterForm {...defaultProps} />);

    expect(screen.getByText("Converted Amount")).toBeInTheDocument();
    expect(screen.getByText(/€85.00/)).toBeInTheDocument();
  });

  it("should not display result when validation error exists", () => {
    render(
      <ConverterForm
        {...defaultProps}
        validationError="Please enter a valid amount"
      />,
    );

    expect(screen.queryByText("Converted Amount")).not.toBeInTheDocument();
  });

  it("should call onAmountChange when amount input changes", async () => {
    const user = userEvent.setup();

    render(<ConverterForm {...defaultProps} />);

    const input = screen.getByPlaceholderText("Enter amount");
    await user.clear(input);
    await user.type(input, "200");

    expect(defaultProps.onAmountChange).toHaveBeenCalled();
  });

  it("should call onFromCurrencyChange when from currency changes", async () => {
    const user = userEvent.setup();

    render(<ConverterForm {...defaultProps} />);

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "GBP");

    expect(defaultProps.onFromCurrencyChange).toHaveBeenCalledWith("GBP");
  });

  it("should call onToCurrencyChange when to currency changes", async () => {
    const user = userEvent.setup();

    render(<ConverterForm {...defaultProps} />);

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[1], "JPY");

    expect(defaultProps.onToCurrencyChange).toHaveBeenCalledWith("JPY");
  });

  it("should call onSwap when swap button is clicked", async () => {
    const user = userEvent.setup();

    render(<ConverterForm {...defaultProps} />);

    const swapButton = screen.getByRole("button", { name: /swap currencies/i });
    await user.click(swapButton);

    expect(defaultProps.onSwap).toHaveBeenCalledTimes(1);
  });

  it("should call onRefreshRates when refresh button is clicked", async () => {
    const user = userEvent.setup();

    render(<ConverterForm {...defaultProps} />);

    const refreshButton = screen.getByRole("button", {
      name: /refresh rates/i,
    });

    await user.click(refreshButton);

    expect(defaultProps.onRefreshRates).toHaveBeenCalledTimes(1);
  });

  it("should show disabled spinner state when refreshing rates", () => {
    render(<ConverterForm {...defaultProps} isRefreshingRates />);

    const refreshButton = screen.getByRole("button", {
      name: /refresh rates/i,
    });

    expect(refreshButton).toBeDisabled();
    expect(
      screen.getByRole("status", { name: /refreshing rates/i }),
    ).toBeInTheDocument();
  });

  it("should calculate and display exchange rate correctly", () => {
    render(<ConverterForm {...defaultProps} />);

    // Rate should be EUR/USD = 0.85/1 = 0.85
    expect(screen.getByText(/1 USD = 0.8500 EUR/)).toBeInTheDocument();
  });

  it("should handle cross-currency rate calculation", () => {
    render(
      <ConverterForm
        {...defaultProps}
        fromCurrency="GBP"
        toCurrency="JPY"
        result={150.68}
      />,
    );

    // Rate should be JPY/GBP = 110/0.73 ≈ 150.6849
    expect(screen.getByText(/1 GBP = 150.6849 JPY/)).toBeInTheDocument();
  });

  it("should display validation error below the input row", () => {
    const errorMessage = "Amount must be greater than zero";

    render(<ConverterForm {...defaultProps} validationError={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    // Error should be displayed as a separate element below the row
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toHaveClass("text-red-600");
  });

  it("should render without exchange rates", () => {
    render(<ConverterForm {...defaultProps} exchangeRates={null} />);

    expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
    expect(screen.queryByText(/1 USD =/)).not.toBeInTheDocument();
  });

  it("should announce favorite limit message", () => {
    const limitMessage = "You can only favorite up to five currencies.";

    render(
      <ConverterForm {...defaultProps} favoriteLimitMessage={limitMessage} />,
    );

    const message = screen.getByText(limitMessage);

    expect(message).toBeInTheDocument();
    expect(message).toHaveAttribute("aria-live", "polite");
    expect(message).toHaveAttribute("role", "status");
  });

  it("should announce storage availability message", () => {
    const storageMessage = "Favorites will not persist across sessions.";

    render(
      <ConverterForm
        {...defaultProps}
        favoriteStorageMessage={storageMessage}
      />,
    );

    const message = screen.getByText(storageMessage);

    expect(message).toBeInTheDocument();
    expect(message).toHaveAttribute("aria-live", "polite");
    expect(message).toHaveAttribute("role", "status");
  });

  it("should handle result of null gracefully", () => {
    render(<ConverterForm {...defaultProps} result={null} />);

    expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
    expect(screen.queryByText("Converted Amount")).not.toBeInTheDocument();
  });
});
