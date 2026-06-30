# TACO Engineering Executive Dashboard

Engineering Executive Dashboard for **PT. Taco Anugrah Corporindo** — dark industrial theme, built with React 19, Vite, TypeScript, TailwindCSS, and Recharts.

## Features

- **Executive Summary** — Attendance, Overtime, Work Order, and Engineering KPI overview
- **Attendance** — Daily headcount tracking with trend charts and records table
- **Overtime** — OT hours by shift, team, and employee
- **Work Orders** — Searchable, sortable WO table with status breakdown
- **Analysis** — Weekly/Monthly trends, Breakdown Pareto, MTTR/MTBF charts
- **Preventive Maintenance** — PM compliance gauge, schedule, and overdue tracker
- **Utility Monitoring** — Power, water, steam, compressed air, and boiler status
- **Team Performance** — Leaderboard by team and technician
- **Reports** — Period summaries with CSV/PDF export hooks
- **Asset Registry** — Full equipment list with search and status filter
- **Settings** — Google Sheets integration config, refresh interval, thresholds

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | TailwindCSS v4 |
| Charts | Recharts |
| Routing | Wouter |
| State / Data | TanStack Query v5 |
| Animation | Framer Motion |
| Icons | Lucide React |

## Local Development

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

### Install

```bash
# from the repo root
pnpm install
```

### Environment

Copy the example env file and fill in any optional values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Dev server port (default: 3000) |
| `BASE_PATH` | No | URL base path (default: `/`) |
| `VITE_GOOGLE_SPREADSHEET_ID` | No | Google Sheet ID for live data |
| `VITE_GOOGLE_CLIENT_EMAIL` | No | Service account email |
| `VITE_GOOGLE_PRIVATE_KEY` | No | Service account private key |

### Run dev server

```bash
pnpm --filter @workspace/taco-dashboard run dev
# or from inside artifacts/taco-dashboard:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
pnpm --filter @workspace/taco-dashboard run build
# or from inside artifacts/taco-dashboard:
npm run build
```

Output is written to `artifacts/taco-dashboard/dist/`.

### Preview production build

```bash
npm run serve
```

## Deployment

### Vercel (recommended)

1. Import the repository into Vercel.
2. Set the **Root Directory** to `artifacts/taco-dashboard`.
3. Vercel auto-detects Vite; the included `vercel.json` handles SPA routing.
4. Add any `VITE_*` environment variables in the Vercel dashboard.

### Manual / Static host

Upload the contents of `dist/` to any static host (Netlify, S3, GitHub Pages).  
The `vercel.json` rewrites rule translates to: redirect all 404s → `index.html`.

## Google Sheets Integration

The dashboard ships with mock data out of the box.  
To connect live data:

1. Create a Google Cloud service account with access to your spreadsheet.
2. Share your spreadsheet with the service account email.
3. Set `VITE_GOOGLE_SPREADSHEET_ID`, `VITE_GOOGLE_CLIENT_EMAIL`, `VITE_GOOGLE_PRIVATE_KEY` in `.env`.
4. The service layer in `src/services/googleSheetService.ts` is the drop-in replacement for `src/services/dashboardService.ts`.

Expected sheet tab names:

| Tab | Data |
|---|---|
| `WO_Summary` | Work order records |
| `Technicians` | Technician list |
| `PM_Schedule` | Preventive maintenance schedule |
| `Attendance` | Daily attendance records |
| `Overtime` | Overtime records |
| `Utility` | Utility readings |

## Project Structure

```
artifacts/taco-dashboard/
├── src/
│   ├── components/
│   │   ├── cards/          # AnimatedCard, ChartCard, GaugeCard, SummaryCard
│   │   ├── layout/         # PageHeader, Sidebar
│   │   ├── tables/         # WorkOrderTable
│   │   └── ui/             # FilterBar, StatusBadge, ProgressBar, LoadingSkeleton
│   ├── data/
│   │   └── mockData.ts     # All mock data (swap with live service later)
│   ├── hooks/
│   │   └── useDashboard.ts # Central TanStack Query hook
│   ├── pages/              # One file per route
│   ├── services/
│   │   ├── dashboardService.ts      # Active service (uses mock data)
│   │   └── googleSheetService.ts   # Drop-in Google Sheets service
│   ├── types/
│   │   └── index.ts        # All TypeScript interfaces
│   └── utils/
│       └── formatters.ts   # Date/hour formatters
├── .env.example
├── vercel.json
└── vite.config.ts
```

## License

MIT
