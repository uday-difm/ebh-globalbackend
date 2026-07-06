## Earth by Humans Web App

Earth by Humans is a content-heavy Next.js 16 application that powers blogs, magazines, quizzes, and dashboard workflows backed by a MySQL database and IONOS S3 assets.

## Prerequisites

- Node.js 20+
- npm 10+ (or compatible package manager)
- MySQL database
- IONOS S3 bucket credentials (or compatible S3 provider)
- SMTP credentials for transactional email

## Project Structure

- `src/app` – App Router routes, API handlers, and layouts
- `src/components` – Shared UI building blocks, providers, and admin/CRM dashboards (consolidated)
- `src/common` – Global site layouts (Header, Footer, Cookie Banner)
- `src/lib` – Database connection, route synchronization, NextAuth config, and utilities
- `src/utils` – Ancillary helpers (e.g., S3 upload)
- `public/` – Static assets

## Architecture & Integration Details

### 1. Next.js 16 Proxy Routing
The application handles redirections, CORS, maintenance locks, and admin authorization guards at the Edge level using Next.js 16's native `src/proxy.js` entrypoint.
- **Maintenance Mode**: Restores full public traffic redirection to `/maintenance` based on DB flags, while preserving developer access to `/admin`, `/crm`, and `/preview`.
- **Recursion Guard**: Uses `x-internal-check` to bypass middleware loopbacks and deadlocks for internal loopback API fetch calls.

### 2. Auto-Revalidating Route Sync
Using Next.js `instrumentation.js` registers, the server dynamically boots `src/lib/routeSync.js` on startup (limited strictly to `process.env.NEXT_RUNTIME === "nodejs"` to avoid Edge runtime exceptions). It scans folder structures, updates routes in the database, and prunes obsolete pages automatically.

### 3. Interactive Quiz Dashboard
A complete quiz manager is built into the content administration panel:
- **Admin Dashboard**: `/admin/quizzes` allows editors to manage question banks, correct answers, option lists, and view play counts.
- **API Endpoints**: `/api/admin/quizzes` and `/api/admin/quizzes/[id]` support full CRUD.
- **Visitor Page**: `/quizzes` contains dynamic question fetching with loading indicators and fail-safe unseeded datasets.

### 4. GDPR Consent Logs & Telemetry
- **Telemetry**: `<GlobalAnalytics />` is integrated into the RootLayout to ping visitor stats to `/api/visitors/ping` dynamically.
- **Consent Banner**: `<CookiesBanner />` records and syncs opt-in choices, dispatches storage change events, and saves consent state directly to the relational `cookieConsentLog` table for live compliance charts in `/crm/consent`.

## Environment Configuration

Copy `.env.example` to `.env` and fill in real values:

Key variables:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | MySQL connection string for Prisma client |
| `NEXT_PUBLIC_SITE_ID` | Site identification tag (e.g. `ebh`) |
| `ACCESSKEY`, `SECRETKEY`, `REGION`, `BUCKET` | IONOS S3 credentials |
| `EMAIL_*` | SMTP host/port/credentials |
| `JWT_SECRET_KEY` | Secret used for auth tokens |

## Running the App

```bash
npm install
npm run dev
```

The site is served at [http://localhost:3000](http://localhost:3000).

### Useful Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Turbopack dev server |
| `npm run build` | Generate production build (builds Prisma models first) |
| `npm run start` | Run the production server |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema changes directly to MySQL |

## Deployment

1. Ensure environment variables are configured on the hosting platform (Vercel, Docker, etc.).
2. Run `npm run build` to compile the app.
3. Deploy the `.next` build output or use platform-specific integration (e.g., Vercel).

For Docker-based deployments provide build stages for the Next.js app and any supporting services (MySQL, Redis, etc.), and ensure `NODE_ENV=production` is set.

## API Overview

- **Blogs** – `/api/blogs`, `/api/blogs/[slug]` (scoped to `ebh`)
- **Magazines** – `/api/magazine`, `/api/magazine/[slug]`
- **Dashboard** – `/api/admin/*` endpoints for admin and content operations
- **Quizzes** – `/api/admin/quizzes/*` (Admin CRUD) and `/api/quizzes` (Visitor UI)
- **Auth** – `/api/auth/*`
- **Analytics** – `/api/visitors/ping` and `/api/visitors/consent`

## License

Internal project – distribution restricted to Earth by Humans.
