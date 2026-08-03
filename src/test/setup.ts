import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useQueries: vi.fn().mockReturnValue([]),
  keepPreviousData: (v: any) => v,
}));
