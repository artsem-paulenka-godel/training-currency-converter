import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ConversionHistory } from "@/components/ConversionHistory/ConversionHistory";
import { ConversionResult } from "@/types";
import { formatAmount } from "@/utils/currency/currency";

describe("ConversionHistory", () => {
  const conversionOne: ConversionResult = {
    from: "USD",
    to: "EUR",
    amount: 100,
    result: 85.5,
    rate: 0.855,
    timestamp: 1700000000000,
  };

  const conversionTwo: ConversionResult = {
    from: "GBP",
    to: "JPY",
    amount: 12.5,
    result: 2300,
    rate: 184,
    timestamp: 1700003600000,
  };

  const defaultProps = {
    history: [conversionOne, conversionTwo],
    showHistory: true,
    onToggle: jest.fn(),
    onClear: jest.fn(),
    onLoadConversion: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without accessibility violations", async () => {
    const { container } = render(<ConversionHistory {...defaultProps} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it("should show clear button when history exists", () => {
    render(<ConversionHistory {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /clear history/i }),
    ).toBeInTheDocument();
  });

  it("should hide clear button when history is empty", () => {
    render(
      <ConversionHistory {...defaultProps} history={[]} showHistory={true} />,
    );

    expect(
      screen.queryByRole("button", { name: /clear history/i }),
    ).not.toBeInTheDocument();
  });

  it("should show empty state when history is empty and visible", () => {
    render(
      <ConversionHistory {...defaultProps} history={[]} showHistory={true} />,
    );

    expect(screen.getByText(/no conversion history yet/i)).toBeInTheDocument();
  });

  it("should hide history list when showHistory is false", () => {
    render(
      <ConversionHistory {...defaultProps} showHistory={false} history={[]} />,
    );

    expect(
      screen.queryByText(/no conversion history yet/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/rate: 1/i)).not.toBeInTheDocument();
  });

  it("should call onToggle when toggle button is clicked", async () => {
    const user = userEvent.setup();

    render(<ConversionHistory {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /hide/i }));

    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it("should call onClear when clear button is clicked", async () => {
    const user = userEvent.setup();

    render(<ConversionHistory {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /clear history/i }));

    expect(defaultProps.onClear).toHaveBeenCalledTimes(1);
  });

  it("should call onLoadConversion when a history item is clicked", async () => {
    const user = userEvent.setup();

    render(<ConversionHistory {...defaultProps} />);

    await user.click(
      screen.getByText(
        `${formatAmount(conversionOne.amount)} ${conversionOne.from} → ${formatAmount(conversionOne.result)} ${conversionOne.to}`,
      ),
    );

    expect(defaultProps.onLoadConversion).toHaveBeenCalledWith(conversionOne);
  });

  it("should render conversion details and timestamps for each entry", () => {
    const toLocaleSpy = jest
      .spyOn(Date.prototype, "toLocaleString")
      .mockImplementationOnce(() => "Feb 13, 2026, 10:00 AM")
      .mockImplementationOnce(() => "Feb 13, 2026, 10:05 AM");

    render(<ConversionHistory {...defaultProps} />);

    expect(
      screen.getByText(
        `${formatAmount(conversionOne.amount)} ${conversionOne.from} → ${formatAmount(conversionOne.result)} ${conversionOne.to}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Rate: 1 ${conversionOne.from} = ${formatAmount(conversionOne.rate, 4)} ${conversionOne.to}`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Feb 13, 2026, 10:00 AM")).toBeInTheDocument();

    expect(
      screen.getByText(
        `${formatAmount(conversionTwo.amount)} ${conversionTwo.from} → ${formatAmount(conversionTwo.result)} ${conversionTwo.to}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Rate: 1 ${conversionTwo.from} = ${formatAmount(conversionTwo.rate, 4)} ${conversionTwo.to}`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Feb 13, 2026, 10:05 AM")).toBeInTheDocument();

    toLocaleSpy.mockRestore();
  });

  it("should show Hide label and count when history is visible", () => {
    render(<ConversionHistory {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Hide (2)" }),
    ).toBeInTheDocument();
  });

  it("should show Show label and count when history is hidden", () => {
    render(
      <ConversionHistory {...defaultProps} showHistory={false} history={[]} />,
    );

    expect(
      screen.getByRole("button", { name: "Show (0)" }),
    ).toBeInTheDocument();
  });
});
