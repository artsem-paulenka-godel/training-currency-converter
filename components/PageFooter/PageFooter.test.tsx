import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { PageFooter } from "@/components/PageFooter/PageFooter";

describe("PageFooter", () => {
  it("should render the static message about exchange rates", () => {
    render(<PageFooter />);

    expect(
      screen.getByText("Exchange rates are updated hourly"),
    ).toBeInTheDocument();
  });

  it("should render the copyright notice with dynamic year", () => {
    render(<PageFooter />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        `© ${currentYear} Godel Technologies. All rights reserved.`,
      ),
    ).toBeInTheDocument();
  });

  it("should not render last updated when lastUpdated is not provided", () => {
    render(<PageFooter />);

    expect(screen.queryByText(/Last updated:/)).not.toBeInTheDocument();
  });

  it("should render last updated when lastUpdated is provided", () => {
    const timestamp = 1707926400000; // 2024-02-14 16:00:00 UTC
    render(<PageFooter lastUpdated={timestamp} />);

    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it("should format the timestamp correctly", () => {
    const timestamp = 1707926400000; // 2024-02-14 16:00:00 UTC
    render(<PageFooter lastUpdated={timestamp} />);

    const expectedDate = new Date(timestamp).toLocaleString();
    expect(screen.getByText(`Last updated: ${expectedDate}`)).toBeInTheDocument();
  });

  it("should render all three elements when lastUpdated is provided", () => {
    const timestamp = 1707926400000;
    const { container } = render(<PageFooter lastUpdated={timestamp} />);

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(3);
  });

  it("should render two elements when lastUpdated is not provided", () => {
    const { container } = render(<PageFooter />);

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<PageFooter />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it("should have no accessibility violations with lastUpdated", async () => {
    const { container } = render(<PageFooter lastUpdated={1707926400000} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
