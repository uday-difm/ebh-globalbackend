# API Overview

All endpoints are implemented with the Next.js App Router under `src/app/api`. They return JSON responses and rely on MySQL via `src/lib/db.js`.

## Authentication

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user and set cookies |
| POST | `/api/auth/logout` | Clear the auth cookie |
| GET | `/api/auth/status` | Return current user session state |

All auth routes expect and return JSON; tokens are handled server-side via HTTP-only cookies.

## Blogs

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/blogs` | List blogs; supports pagination with `page` and `limit` query params |
| GET | `/api/blogs/[slug]` | Fetch a single blog by slug |
| GET | `/api/categoriesHome` | Category list for the blog home page |

## Magazines

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/magazine` | List published magazines (`status = 1`) |
| GET | `/api/magazine/[slug]` | Fetch magazine details by slug |

## Dashboard (Admin)

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/dashboard/count` | High-level metrics for dashboard cards |
| GET | `/api/dashboard/blog` | Admin blog listing |
| POST | `/api/dashboard/blog/add-blog` | Create a blog |
| PATCH | `/api/dashboard/blog/updateBlogBySlug/[slug]` | Update a blog |
| DELETE | `/api/dashboard/blog/delete-blog/[slug]` | Delete a blog |
| Similar routes | `/api/dashboard/magazine/*` | CRUD for magazines |

## Quizzes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/quizess/quiz` | Fetch quiz definitions |
| POST | `/api/quizess/quiz-play` | Submit quiz results |
| GET/POST | `/api/quizess/*` | Additional analytics endpoints (see source for specifics) |

## Utility Routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/subscribe` | Subscribe an email address |
| POST | `/api/contact-us` | Submit contact inquiries |
| POST | `/api/upload-image` | Upload media to S3 bucket |

## Error Handling

Each handler returns appropriate HTTP status codes with a JSON body `{ message, error }` when failures occur. Consult individual route files for detailed request/response schemas.

## Postman/Swagger

Generate new collections using this reference. Exported collections should match versions tracked in `docs/postman/` (create per release as needed).
