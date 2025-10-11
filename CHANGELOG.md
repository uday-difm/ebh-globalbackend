# Changelog

All notable changes to this project will be documented in this file.

## [2025-10-11]

- Patched axios and nodemailer to resolve security advisories (`npm audit fix`).
- Deferred analytics/ads scripts with `next/script` and lazy loading to cut render blocking.
- Trimmed home blog payload and optimized hero/ISSN images for faster page loads.
- Added fallback-aware magazine fetching with multi-origin retries to reduce fetch failures.
- Restored requested GIF branding in the header and footer while keeping loader import fixes.
- Updated README with project-specific setup, environment, and API details.
