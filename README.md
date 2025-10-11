## Earth by Humans Web App

Earth by Humans is a content-heavy Next.js 15 application that powers blogs, magazines, quizzes, and dashboard workflows backed by a MySQL database and IONOS S3 assets.

## Prerequisites

- Node.js 20+
- npm 10+ (or compatible package manager)
- MySQL database
- IONOS S3 bucket credentials (or compatible S3 provider)
- SMTP credentials for transactional email

## Project Structure

- `src/app` – App Router routes, API handlers, and layouts
- `src/common` & `src/component` – Shared UI building blocks
- `src/lib` – Database, email, configuration utilities
- `src/utils` – Ancillary helpers (e.g., S3 upload)
- `public/` – Static assets

## Environment Configuration

Copy `.env.example` to `.env.local` (or `.env`) and fill in real values:

```bash
cp .env.example .env.local
```

Key variables:

| Variable | Description |
| --- | --- |
| `HOST`, `USER`, `PASSWORD`, `DATABASE` | MySQL connection info |
| `NEXT_PUBLIC_SITE_URL` | Base URL used by client fetch fallbacks |
| `ACCESSKEY`, `SECRETKEY`, `REGION`, `BUCKET` | IONOS S3 credentials |
| `EMAIL_*` | SMTP host/port/credentials |
| `JWT_SECRET_KEY` | Secret used for auth tokens |

> Never commit secrets. Use `.env.local` for local development and appropriate secret storage in CI/CD.

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
| `npm run build` | Create a production bundle |
| `npm run start` | Run the production server |
| `npm run lint` | Execute ESLint via `next lint` |

## Deployment

1. Ensure environment variables are configured on the hosting platform (Vercel, Docker, etc.).
2. Run `npm run build` to compile the app.
3. Deploy the `.next` build output or use platform-specific integration (e.g., Vercel).

For Docker-based deployments provide build stages for the Next.js app and any supporting services (MySQL, Redis, etc.), and ensure `NODE_ENV=production` is set.

## API Overview

- **Blogs** – `/api/blogs`, `/api/blogs/[slug]`
- **Magazines** – `/api/magazine`, `/api/magazine/[slug]`
- **Dashboard** – `/api/dashboard/*` endpoints for admin and content operations
- **Quizzes** – `/api/quizess/*`
- **Auth** – `/api/auth/*`

All routes live under `src/app/api`. Each handler returns JSON and uses the shared MySQL pool from `src/lib/db.js`.

For a Postman collection or Swagger spec, export routes using the above structure or document them in `docs/api.md` (create as needed).

## Testing & Quality

- Linting: `npm run lint`
- Production build check: `npm run build`
- Add future unit/integration tests under `__tests__/` or co-located with modules using your preferred runner (Vitest/Jest/Playwright).

## Contributing

1. Create a feature branch from `premm`.
2. Make changes and ensure lint/build succeed.
3. Open a PR describing the change, affected routes, and testing performed.

## License

Internal project – distribution restricted to Earth by Humans.
