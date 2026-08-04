# Architecture Overview

This document provides a technical overview of the SHAKTI Command Center frontend architecture.

## 1. Directory Tree
```
src/
├── api/                    # 12 Axios clients + endpoint configurations
│   ├── client.ts           # Control Plane client
│   ├── setuEndpoints.ts    # Setu PMC client
│   ├── ...                 # Other microservice endpoint definitions
├── components/
│   ├── dashboard/
│   │   ├── DashboardCard.tsx      # Card shell managing loading/error states
│   │   ├── DashboardProvider.tsx  # Dashboard configuration context
│   │   ├── layouts/               # 19 layout modules
│   │   └── primitives/            # 16 stateless presentational tiles
│   └── ui/
│       └── skeleton.tsx    # Skeleton screen loaders
├── hooks/                  # TanStack query hooks per microservice
├── config/
│   └── dashboard.config.ts # Default 19-zone configuration parameters
├── pages/
│   └── Dashboard.tsx       # Root grid layout page composing the layouts
├── types/                  # TypeScript interface definitions
└── utils/                  # String formatters, mappers, and time helpers
```

## 2. Core Architectural Design Decisions

### Configuration-Driven Layout
The visibility and grid sizing properties of the 19 layouts are managed through a configuration scheme defined in `src/config/dashboard.config.ts`. The `DashboardProvider` exposes this configuration context to the page renderer, allowing zones to be customized or toggled dynamically without refactoring layout source files.

### Separation of Concerns
We enforce a strict separation between smart layout containers and presentational tiles:
- **Layouts (`src/components/dashboard/layouts/`)**: Smart containers. They invoke `TanStack Query` hooks, monitor state flags (isFetching, isError), parse query payloads, and pass parameters down.
- **Primitives (`src/components/dashboard/primitives/`)**: Presentational tiles. They are purely presentational, memoized, stateless React modules that receive metrics via props and render UI structures.

### Height-Stable Scroll Strategy
To ensure maximum page stability:
- Sibling cards in the same CSS grid row are kept visually identical in height regardless of backend dataset scaling.
- Layouts implement max-height boundaries (`max-h-[...]`) coupled with vertical scroll behaviors (`overflow-y-auto`) on all inner data tables or lists.
- Table layout components configure sticky headers (`thead` with solid backgrounds) to stay pinned at the top when users scroll internally.

## 3. Data Integration & Polling
Data sync is managed using TanStack Query, which maintains local caches and polls backend microservices periodically on background threads (using intervals between 5s to 15s depending on metrics severity).

## 4. Error Boundaries & Fallbacks
- **Zone-Level Error Boundaries**: Each of the 19 layout zones is individually wrapped in a React `<ErrorBoundary>`. If a widget experiences a component render crash, only that specific card shows a fallback recovery screen with a "Reload Zone" action, leaving the rest of the dashboard active.
- **Unified Card Shell**: The `DashboardCard` wrapper handles standard data loaders, empty indications, offline warning banners, and trace markers.
