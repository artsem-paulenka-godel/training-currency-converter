import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RefreshingRatesButton } from "@/components/RefreshingRatesButton/RefreshingRatesButton";

describe("RefreshingRatesButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render refresh button in idle state", () => {
    render(<RefreshingRatesButton onClick={jest.fn()} isRefreshing={false} />);

    expect(
      screen.getByRole("button", { name: /refresh rates/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: /refreshing rates/i }),
    ).not.toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <RefreshingRatesButton onClick={handleClick} isRefreshing={false} />,
    );

    const refreshButton = screen.getByRole("button", {
      name: /refresh rates/i,
    });

    await user.click(refreshButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should show disabled spinner state while refreshing", () => {
    render(<RefreshingRatesButton onClick={jest.fn()} isRefreshing />);

    const refreshButton = screen.getByRole("button", {
      name: /refresh rates/i,
    });

    expect(refreshButton).toBeDisabled();
    expect(refreshButton).toHaveAttribute("title", "Refresh rates");
    expect(
      screen.getByRole("status", { name: /refreshing rates/i }),
    ).toBeInTheDocument();
  });
});
