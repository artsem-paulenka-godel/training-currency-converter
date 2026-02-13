import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AmountInput } from "@/components/AmountInput/AmountInput";

describe("AmountInput", () => {
  it("should render input field", () => {
    render(<AmountInput value="100" onChange={jest.fn()} />);

    const input = screen.getByPlaceholderText("Enter amount");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(100);
  });

  it("should call onChange when value changes", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<AmountInput value="100" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Enter amount");
    await user.clear(input);
    await user.type(input, "200");

    expect(handleChange).toHaveBeenCalled();
  });

  it("should display label when provided", () => {
    render(<AmountInput value="100" onChange={jest.fn()} label="Amount" />);

    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  it("should apply error styling when error exists", () => {
    render(<AmountInput value="" onChange={jest.fn()} error="Error message" />);

    const input = screen.getByPlaceholderText("Enter amount");
    expect(input).toHaveClass("border-red-300");
  });

  it("should not apply error styling when error prop is null", () => {
    render(<AmountInput value="100" onChange={jest.fn()} error={null} />);

    const input = screen.getByPlaceholderText("Enter amount");
    expect(input).not.toHaveClass("border-red-300");
  });

  it("should have correct input type and attributes", () => {
    render(<AmountInput value="100" onChange={jest.fn()} />);

    const input = screen.getByPlaceholderText("Enter amount");
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("step", "1");
    expect(input).toHaveAttribute("min", "0");
  });
});
