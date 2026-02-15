import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { FavoriteToggle } from "@/components/FavoriteToggle/FavoriteToggle";

describe("FavoriteToggle", () => {
  const defaultProps = {
    isFavorite: false,
    currencyCode: "USD",
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with accessible label and pressed state", () => {
    render(<FavoriteToggle {...defaultProps} />);

    const button = screen.getByRole("button", { name: /favorite usd/i });
    const label = screen.getByText("Favorite");

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(label).toHaveClass("sr-only");
  });

  it("should render without accessibility violations", async () => {
    const { container } = render(<FavoriteToggle {...defaultProps} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it("should toggle when pressing Enter", async () => {
    const user = userEvent.setup();

    render(<FavoriteToggle {...defaultProps} />);

    await user.tab();

    const button = screen.getByRole("button", { name: /favorite usd/i });

    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it("should toggle when pressing Space", async () => {
    const user = userEvent.setup();

    render(<FavoriteToggle {...defaultProps} />);

    await user.tab();

    const button = screen.getByRole("button", { name: /favorite usd/i });

    expect(button).toHaveFocus();

    await user.keyboard(" ");

    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });
});
