import { describe, it, expect } from "vitest";
import { cn } from "@bhiv/utils";
import { Button, Card, Skeleton, ErrorBoundary } from "@bhiv/ui";
import { DashboardProvider, MetricCardFramework } from "@bhiv/dashboard-sdk";
import { DashboardGrid, LayoutZone } from "@bhiv/dashboard-layout";

describe("SDK Smoke Test — Resolution & Compilation", () => {
  it("should successfully import and resolve all SDK components", () => {
    expect(cn).toBeDefined();
    expect(Button).toBeDefined();
    expect(Card).toBeDefined();
    expect(Skeleton).toBeDefined();
    expect(ErrorBoundary).toBeDefined();
    expect(DashboardProvider).toBeDefined();
    expect(MetricCardFramework).toBeDefined();
    expect(DashboardGrid).toBeDefined();
    expect(LayoutZone).toBeDefined();
  });

  it("should execute cn utility correctly", () => {
    const className = cn("class1", { class2: true, class3: false });
    expect(className).toBe("class1 class2");
  });
});
