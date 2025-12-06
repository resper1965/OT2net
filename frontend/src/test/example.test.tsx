import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

describe("Example Test", () => {
  it("should render correctly", () => {
    expect(true).toBe(true);
  });

  it("should have testing library configured", () => {
    const { container } = render(<div>Test</div>);
    expect(container).toBeTruthy();
  });
});

