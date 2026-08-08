import "@testing-library/jest-dom";
import { vi } from "vitest";
import Module from "module";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface NodeModulePrivate {
  _resolveFilename: (
    request: string,
    parent: unknown,
    isMain: boolean,
    options: unknown
  ) => string;
}

// Hijack Node module resolution to deduplicate react and react-dom instances in test runner
const nodeModulePrivate = Module as unknown as NodeModulePrivate;
const originalResolveFilename = nodeModulePrivate._resolveFilename;

nodeModulePrivate._resolveFilename = function (
  request: string,
  parent: unknown,
  isMain: boolean,
  options: unknown
) {
  if (request === "react" || request.startsWith("react/")) {
    const target = request === "react" ? "./node_modules/react" : `./node_modules/react/${request.slice(6)}`;
    return originalResolveFilename.call(this, path.resolve(__dirname, "../../", target), parent, isMain, options);
  }
  if (request === "react-dom" || request.startsWith("react-dom/")) {
    const target = request === "react-dom" ? "./node_modules/react-dom" : `./node_modules/react-dom/${request.slice(10)}`;
    return originalResolveFilename.call(this, path.resolve(__dirname, "../../", target), parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useQueries: vi.fn().mockReturnValue([]),
  keepPreviousData: (v: unknown) => v,
}));
