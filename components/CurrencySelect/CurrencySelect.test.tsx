import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
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

  it("should render without accessibility violations", async () => {
    const { container } = render(
      <CurrencySelect value="USD" onChange={jest.fn()} />,
    );

    expect(await axe(container)).toHaveNoViolations();
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

  it("should render favorites optgroup before all currencies", () => {
    const favorites = ["EUR", "JPY"];

    render(
      <CurrencySelect value="USD" onChange={jest.fn()} favorites={favorites} />,
    );

    const optgroups = screen.getAllByRole("group");

    expect(optgroups[0]).toHaveAttribute("label", "Favorites");
    expect(optgroups[1]).toHaveAttribute("label", "All currencies");

    const options = screen
      .getAllByRole("option")
      .map((option) => option.getAttribute("value"));

    expect(options[0]).toBe("EUR");
    expect(options[1]).toBe("JPY");
    expect(options.filter((value) => value === "EUR")).toHaveLength(1);
  });

  it("should render favorite toggle button when provided", () => {
    const handleToggle = jest.fn();

    render(
      <CurrencySelect
        value="USD"
        onChange={jest.fn()}
        isFavorite={false}
        onToggleFavorite={handleToggle}
      />,
    );

    const button = screen.getByRole("button", { name: /favorite usd/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("should call onToggleFavorite with the selected code", async () => {
    const user = userEvent.setup();
    const handleToggle = jest.fn();

    render(
      <CurrencySelect
        value="EUR"
        onChange={jest.fn()}
        isFavorite
        onToggleFavorite={handleToggle}
      />,
    );

    const button = screen.getByRole("button", { name: /unfavorite eur/i });

    await user.click(button);

    expect(handleToggle).toHaveBeenCalledWith("EUR");
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
