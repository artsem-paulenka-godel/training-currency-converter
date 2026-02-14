import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { PageLayout } from "./PageLayout";

describe("PageLayout", () => {
  it("should render children content", () => {
    render(
      <PageLayout>
        <div data-testid="test-content">Test Content</div>
      </PageLayout>,
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render as a main landmark", () => {
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
    );

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
