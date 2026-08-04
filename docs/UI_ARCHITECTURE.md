# UI Architecture

**Project:** SHAKTI Runtime Integration and Operational Command Center

---

## 1. UI Architecture Principles
The SHAKTI Command Center UI is governed by five architectural principles:

| Principle | Description |
|---|---|
| Operational Density | Information is compact and dense. Every pixel serves a purpose. |
| Visual Hierarchy | Color, size, and position communicate priority without labels. |
| Independent Zones | Each dashboard zone is fully self-contained — it fetches, loads, errors, and renders independently. |
| Zero Business Logic | The UI renders API outputs. It does not compute, transform, or interpret operational data. |
| Dark-First | The entire application is designed for dark environments. No light mode toggle exists in v1. |

---

## 2. Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                        Dashboard                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     Header                            │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   main container                      │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                 12-col grid                     │  │  │
│  │  │  [Zone 1: col-span-12]                          │  │  │
│  │  │  [Zone 2: col-span-7]   [Zone 3: col-span-5]     │  │  │
│  │  │  ...                                            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. CSS Grid Usage
The dashboard grid is defined in `src/pages/Dashboard.tsx`:
```tsx
<div className="grid grid-cols-12 gap-2">
```

### Column Span Reference

| Zone Component | Default | md (768px) | lg (1024px) |
|---|---|---|---|
| `ExecutiveLayout` | col-span-12 | col-span-12 | col-span-12 |
| `OperationsLayout` | col-span-12 | col-span-12 | col-span-7 |
| `IntegrationLayout` | col-span-12 | col-span-12 | col-span-5 |
| `DecisionIntelligenceLayout` | col-span-12 | col-span-6 | col-span-4 |
| `ObservabilityLayout` | col-span-12 | col-span-6 | col-span-8 |
| `WorkflowLayout` | col-span-12 | col-span-12 | col-span-7 |
| `OperatorConsoleLayout` | col-span-12 | col-span-12 | col-span-5 |
| `RuntimeHealthLayout` | col-span-12 | col-span-7 | col-span-7 |
| `ReplayLayout` | col-span-12 | col-span-5 | col-span-5 |
| `EvidenceLayout` | col-span-12 | col-span-12 | col-span-12 |
| `RepositoryRegistryLayout` | col-span-12 | col-span-12 | col-span-6 |
| `BuildRegistryLayout` | col-span-12 | col-span-12 | col-span-6 |
| `MigrationQueueLayout` | col-span-12 | col-span-12 | col-span-6 |
| `ReviewQueueLayout` | col-span-12 | col-span-12 | col-span-6 |
| `CapabilityRegistryLayout` | col-span-12 | col-span-12 | col-span-12 |
| `EmployeeExecutionLayout` | col-span-12 | col-span-12 | col-span-12 |
| `EngineeringCapacityLayout` | col-span-12 | col-span-12 | col-span-6 |
| `DeliveryIntelligenceLayout` | col-span-12 | col-span-12 | col-span-6 |
| `CapabilityDependencyGraphLayout`| col-span-12| col-span-12 | col-span-12 |

---

## 4. Theme Strategy

### Color Palette
The entire application uses Tailwind CSS slate and semantic color scales:
- **Page background**: `bg-slate-950` (#020817)
- **Card surface**: `bg-slate-800/60` (rgba(30,41,59,0.6))
- **Card border**: `border-slate-700/50` (rgba(51,65,85,0.5))
- **Primary text**: `text-slate-100` (#f1f5f9)
- **Secondary text**: `text-slate-300` (#cbd5e1)
- **Muted text**: `text-slate-500` (#64748b)

### Semantic Status Colors
- **Online / Normal**: Emerald (`text-emerald-400`, `bg-emerald-400`)
- **Warning**: Yellow (`text-yellow-400`, `bg-yellow-400`)
- **Degraded**: Orange (`text-orange-400`, `bg-orange-400`)
- **Offline / Critical**: Red (`text-red-400`, `bg-red-400`)

All color decisions are centralized in `src/utils/format.ts`. Changing a severity color requires editing one function.
