import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CurrencySelect } from "@/components/CurrencySelect/CurrencySelect";
import { CURRENCIES } from "@/utils/currency/currency";

describe("CurrencySelect", () => {
  it("should render select with all currencies", () => {
    render(<CurrencySelect value="USD" onChange={jest.fn()} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Check that all currencies are in the select
    CURRENCIES.forEach((currency) => {
      const option = screen.getByRole("option", {
        name: `${currency.code} - ${currency.name}`,
      });
      expect(option).toBeInTheDocument();
    });
  });

  it("should display selected currency", () => {
    render(<CurrencySelect value="EUR" onChange={jest.fn()} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("EUR");
  });

  it("should call onChange when currency is selected", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<CurrencySelect value="USD" onChange={handleChange} />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "EUR");

    expect(handleChange).toHaveBeenCalledWith("EUR");
  });

  it("should display label when provided", () => {
    render(
      <CurrencySelect value="USD" onChange={jest.fn()} label="From Currency" />,
    );

    expect(screen.getByText("From Currency")).toBeInTheDocument();
  });

  it("should have correct styling classes", () => {
    render(<CurrencySelect value="USD" onChange={jest.fn()} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("w-full", "border", "rounded-lg");
  });

  it("should render dropdown icon", () => {
    const { container } = render(
      <CurrencySelect value="USD" onChange={jest.fn()} />,
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have all major currencies in correct format", () => {
    render(<CurrencySelect value="USD" onChange={jest.fn()} />);

    expect(
      screen.getByRole("option", { name: /USD - US Dollar/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /EUR - Euro/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /GBP - British Pound/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /JPY - Japanese Yen/ }),
    ).toBeInTheDocument();
  });
});
