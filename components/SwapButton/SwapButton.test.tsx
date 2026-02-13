import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SwapButton } from "@/components/SwapButton/SwapButton";

describe("SwapButton", () => {
  it("should render button with swap icon", () => {
    render(<SwapButton onClick={jest.fn()} />);

    const button = screen.getByRole("button", { name: /swap currencies/i });
    expect(button).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<SwapButton onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /swap currencies/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should have proper accessibility attributes", () => {
    render(<SwapButton onClick={jest.fn()} />);

    const button = screen.getByRole("button", { name: /swap currencies/i });
    expect(button).toHaveAttribute("aria-label", "Swap currencies");
    expect(button).toHaveAttribute("title", "Swap currencies");
  });
});
