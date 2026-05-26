# Kalanjiyam Backend API

ASP.NET Core 10 REST API that powers both the public-facing Kalanjiyam website and the admin dashboard. It manages all site content (home, about, services, portfolio, careers, internship, locations), handles form submissions (contact, job applications, internship applications), accepts file uploads, and issues JWT tokens for admin authentication.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Database](#database)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [File Uploads](#file-uploads)
- [Data Seeding](#data-seeding)
- [Deployment on Render](#deployment-on-render)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | ASP.NET Core 10 (Minimal Hosting) |
| ORM | Entity Framework Core 10 |
| Database | PostgreSQL (via Npgsql provider) |
| Auth | JWT Bearer tokens (HS256) |
| Password hashing | BCrypt.Net |
| JSON | System.Text.Json with camelCase policy |

---

## Project Structure

```
WebApplication1/
├── Controllers/
│   ├── AuthController.cs          # Login / logout
│   ├── HomeController.cs          # Home page stats & features
│   ├── AboutController.cs         # About page sections
│   ├── ServicesController.cs      # Services & process steps
│   ├── PortfolioController.cs     # Portfolio topics & items
│   ├── CareersController.cs       # Job listings & reasons
│   ├── InternshipController.cs    # Internship domains, FAQs, etc.
│   ├── LocationsController.cs     # Office locations & footer info
│   ├── TestimonialsController.cs  # Testimonials
│   └── SubmissionsController.cs   # Contact / job / intern forms + file upload
├── Models/
│   ├── ContentModels.cs           # All site content entity classes
│   └── SubmissionModels.cs        # Form submission + viewed-tracking entities
├── Services/
│   ├── AppDbContext.cs            # EF Core DbContext, JSON converters, value comparers
│   └── DataSeeder.cs             # Seeds initial data from /data/*.json on first run
├── Migrations/                    # EF Core migration files
├── data/                          # JSON seed files (one per content section)
├── wwwroot/uploads/               # Uploaded files (runtime, ephemeral on Render)
├── Program.cs                     # App bootstrap: DI, middleware pipeline, CORS, JWT
└── appsettings.json               # Local development configuration
```

---

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- PostgreSQL 14+ running locally
- (Optional) An IDE — Visual Studio 2022 or Rider

### 1. Clone and navigate

```bash
git clone <repo-url>
cd WebApplication1/WebApplication1
```

### 2. Create the local database

```sql
-- in psql or pgAdmin
CREATE DATABASE Klj;
```

### 3. Configure local settings

`appsettings.json` is already set up for local development. Adjust the connection string if your Postgres credentials differ:

```json
"ConnectionStrings": {
  "Default": "Host=localhost;Port=5432;Database=Klj;Username=postgres;Password=YOUR_PASSWORD"
}
```

### 4. Apply migrations and run

```bash
dotnet ef database update
dotnet run
```

The API starts on `https://localhost:7xxx` and `http://localhost:5xxx` (exact ports shown in console output).

On first run, `DataSeeder` automatically populates every table from the JSON files in the `data/` folder.

---

## Configuration

The app reads configuration from `appsettings.json` locally and from **environment variables** on Render (environment variables always override the JSON file).

### All settings

| Key | What it does | Example |
|---|---|---|
| `ConnectionStrings__Default` | PostgreSQL connection string | `Host=...;Database=...` |
| `AllowedOrigins__0`, `__1`, ... | CORS whitelist (array) | `https://your-admin.onrender.com` |
| `Jwt__Key` | Secret used to sign tokens (keep this private, min 32 chars) | `some-long-random-string` |
| `Jwt__Issuer` | JWT issuer claim | `kalanjiyam-admin` |
| `Jwt__Audience` | JWT audience claim | `kalanjiyam-admin` |
| `Jwt__ExpiresHours` | Token lifetime in hours | `8` |
| `AdminUser__Email` | Admin login email | `admin@kalanjiyam.com` |
| `AdminUser__Password` | Admin password — plain text **or** BCrypt hash | `Admin@123` or `$2a$11$...` |

> **Note on environment variable naming:** ASP.NET Core maps double-underscores (`__`) to config section separators (`:`) when reading environment variables. So `Jwt__Key` on Render becomes `Jwt:Key` in code.

### Setting a BCrypt password

To store a hashed password instead of plain text:

```csharp
// Run once in a scratch console app or a test
Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("YourPassword"));
```

Paste the output (starting with `$2a$`) as the `AdminUser__Password` environment variable. The `AuthController` detects the `$2` prefix and uses BCrypt verification automatically. Plain text passwords also work and are compared directly.

---

## Database

### EF Core Migrations

Migrations live in the `Migrations/` folder. To create a new migration after changing a model:

```bash
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

On app startup, `db.Database.Migrate()` is called automatically, so the schema is always up to date when the app starts (both locally and on Render).

### JSON columns

Several models store arrays and complex objects in PostgreSQL `jsonb` columns:

- `Service.Items` — list of bullet-point strings
- `PortfolioTopic.SubFilters` — filter tag strings
- `PortfolioItem.Highlights` — highlight strings
- `InternDomain.Roles` — role name strings
- `InternDomain.TagGroups` — nested objects (label + tags array), stored as full JSONB
- `InternshipApplication.Skills` / `.Tools` — applicant skill/tool lists
- `ViewedSubmissionsRow.Contact` / `.Jobs` / `.Intern` — integer arrays of viewed submission IDs

EF Core value comparers are registered in `AppDbContext.OnModelCreating` so that EF correctly detects changes to these array/list properties and generates `UPDATE` statements when they are modified.

---

## Authentication

All `[Authorize]` endpoints require a valid JWT Bearer token in the request header:

```
Authorization: Bearer <token>
```

### How it works

1. `POST /api/auth/login` — sends email + password, receives a signed JWT token.
2. The token contains the admin's email claim and is signed with `Jwt:Key`.
3. Token lifetime defaults to 8 hours (configurable via `Jwt:ExpiresHours`).
4. The admin frontend stores the token in `localStorage` and attaches it to every API request via an Axios interceptor.
5. When a token expires or is invalid, the server returns `401 Unauthorized` and the frontend redirects to the login page.

**There is one admin account.** Credentials are stored entirely in configuration — there is no admin user table in the database.

---

## API Reference

All routes are prefixed with `/api`. Responses use camelCase JSON. `null` fields are omitted from responses.

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login with email + password. Returns `{ token, user }`. |
| POST | `/api/auth/logout` | No | No-op endpoint (token is stateless; client discards it). |

**Login request body:**
```json
{ "email": "admin@kalanjiyam.com", "password": "Admin@123" }
```

---

### Home

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/home/stats` | No | Animated counter stats shown on the home page. |
| POST | `/api/home/stats` | Yes | Add a new stat. |
| PUT | `/api/home/stats/{id}` | Yes | Update a stat. |
| DELETE | `/api/home/stats/{id}` | Yes | Delete a stat. |
| GET | `/api/home/features` | No | Feature cards shown on the home page. |
| POST | `/api/home/features` | Yes | Add a feature. |
| PUT | `/api/home/features/{id}` | Yes | Update a feature. |
| DELETE | `/api/home/features/{id}` | Yes | Delete a feature. |

**HomeStat fields:** `end` (number), `suffix` (e.g. `"+"`), `label`, `static` (bool — if true, shows the number without animation)

---

### Testimonials

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/testimonials` | No | All testimonials. |
| POST | `/api/testimonials` | Yes | Add testimonial. |
| PUT | `/api/testimonials/{id}` | Yes | Update. |
| DELETE | `/api/testimonials/{id}` | Yes | Delete. |

---

### About

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/about/who-we-are` | No | Ordered paragraphs for the "Who We Are" section. |
| PUT | `/api/about/who-we-are` | Yes | Replace all paragraphs at once (array of strings). |
| GET | `/api/about/mission-vision` | No | Mission & vision cards. |
| POST | `/api/about/mission-vision` | Yes | Add a card. |
| PUT | `/api/about/mission-vision/{id}` | Yes | Update. |
| DELETE | `/api/about/mission-vision/{id}` | Yes | Delete. |
| GET | `/api/about/core-values` | No | Core value cards. |
| POST | `/api/about/core-values` | Yes | Add. |
| PUT | `/api/about/core-values/{id}` | Yes | Update. |
| DELETE | `/api/about/core-values/{id}` | Yes | Delete. |
| GET | `/api/about/gallery` | No | Gallery slides (image URL + caption). |
| POST | `/api/about/gallery` | Yes | Add a slide. |
| PUT | `/api/about/gallery/{id}` | Yes | Update. |
| DELETE | `/api/about/gallery/{id}` | Yes | Delete. |

---

### Services

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/services` | No | All services. |
| POST | `/api/services` | Yes | Add a service. |
| PUT | `/api/services/{id}` | Yes | Update. |
| DELETE | `/api/services/{id}` | Yes | Delete. |
| GET | `/api/services/steps` | No | "How we work" process steps. |
| POST | `/api/services/steps` | Yes | Add a step. |
| PUT | `/api/services/steps/{id}` | Yes | Update. |
| DELETE | `/api/services/steps/{id}` | Yes | Delete. |

**Service fields:** `title`, `shortDescription`, `desc`, `color`, `bg`, `icon`, `anchor`, `image`, `items` (string array of bullet points)

---

### Portfolio

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/portfolio/topics` | No | Filter topic categories. |
| POST | `/api/portfolio/topics` | Yes | Add a topic. |
| PUT | `/api/portfolio/topics/{id}` | Yes | Update. |
| DELETE | `/api/portfolio/topics/{id}` | Yes | Delete. |
| GET | `/api/portfolio/items` | No | All portfolio items. |
| POST | `/api/portfolio/items` | Yes | Add an item. |
| PUT | `/api/portfolio/items/{id}` | Yes | Update. |
| DELETE | `/api/portfolio/items/{id}` | Yes | Delete. |

**PortfolioTopic** uses a string `id` (slug like `"web"`). **PortfolioItem fields:** `topic`, `subCategory`, `tag`, `featured` (bool), `title`, `description`, `highlights` (string array), `phase` (optional string)

---

### Careers

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/careers/jobs` | No | Open job listings. |
| POST | `/api/careers/jobs` | Yes | Add a job. |
| PUT | `/api/careers/jobs/{id}` | Yes | Update. |
| DELETE | `/api/careers/jobs/{id}` | Yes | Delete. |
| GET | `/api/careers/reasons` | No | "Why join us" reason cards. |
| POST | `/api/careers/reasons` | Yes | Add a reason. |
| PUT | `/api/careers/reasons/{id}` | Yes | Update. |
| DELETE | `/api/careers/reasons/{id}` | Yes | Delete. |

---

### Internship

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/internship/domains` | No | Internship domain cards. |
| POST | `/api/internship/domains` | Yes | Add a domain. |
| PUT | `/api/internship/domains/{id}` | Yes | Update. |
| DELETE | `/api/internship/domains/{id}` | Yes | Delete. |
| GET | `/api/internship/reasons` | No | Reasons to join internship. |
| POST | `/api/internship/reasons` | Yes | Add. |
| PUT | `/api/internship/reasons/{id}` | Yes | Update. |
| DELETE | `/api/internship/reasons/{id}` | Yes | Delete. |
| GET | `/api/internship/benefits` | No | Internship benefit items. |
| POST | `/api/internship/benefits` | Yes | Add. |
| PUT | `/api/internship/benefits/{id}` | Yes | Update. |
| DELETE | `/api/internship/benefits/{id}` | Yes | Delete. |
| GET | `/api/internship/steps` | No | Application process steps. |
| POST | `/api/internship/steps` | Yes | Add. |
| PUT | `/api/internship/steps/{id}` | Yes | Update. |
| DELETE | `/api/internship/steps/{id}` | Yes | Delete. |
| GET | `/api/internship/eligibility` | No | Eligibility cards. |
| POST | `/api/internship/eligibility` | Yes | Add. |
| PUT | `/api/internship/eligibility/{id}` | Yes | Update. |
| DELETE | `/api/internship/eligibility/{id}` | Yes | Delete. |
| GET | `/api/internship/faqs` | No | Internship FAQ items. |
| POST | `/api/internship/faqs` | Yes | Add. |
| PUT | `/api/internship/faqs/{id}` | Yes | Update. |
| DELETE | `/api/internship/faqs/{id}` | Yes | Delete. |

---

### Locations

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/locations` | No | All office locations. |
| POST | `/api/locations` | Yes | Add a location. |
| PUT | `/api/locations/{id}` | Yes | Update. |
| DELETE | `/api/locations/{id}` | Yes | Delete. |
| GET | `/api/locations/footer-contact` | No | Footer contact info (email, hours, address). |
| PUT | `/api/locations/footer-contact` | Yes | Update footer contact (single row, upsert). |
| GET | `/api/locations/hq` | No | Headquarters info with map embed URL. |
| PUT | `/api/locations/hq` | Yes | Update headquarters (single row, upsert). |

---

### Submissions

Form submissions from the public website. All GET/DELETE endpoints require auth; POST endpoints are public (anyone can submit a form).

#### Contact Enquiries

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/submissions/contact` | Yes | Paginated list. Query params: `page` (default 1), `limit` (default 20). |
| POST | `/api/submissions/contact` | No | Create a new enquiry. Sets `submittedAt` automatically. |
| DELETE | `/api/submissions/contact/{id}` | Yes | Delete an enquiry. Also removes the ID from the viewed list. |

**ContactEnquiry fields:** `name`, `email`, `phone`?, `orgName`?, `address`?, `message`

#### Job Applications

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/submissions/jobs` | Yes | Paginated list. |
| POST | `/api/submissions/jobs` | No | Submit a job application. |
| DELETE | `/api/submissions/jobs/{id}` | Yes | Delete. Also removes from viewed list. |

**JobApplication fields:** `firstName`, `lastName`, `email`, `phone`?, `position`?, `address`?, `resumeUrl`?, `photoUrl`?

#### Internship Applications

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/submissions/internship` | Yes | Paginated list. |
| POST | `/api/submissions/internship` | No | Submit an internship application. |
| DELETE | `/api/submissions/internship/{id}` | Yes | Delete. Also removes from viewed list. |

**InternshipApplication fields:** `fullName`, `gender`?, `dob`?, `email`, `phone`?, `fullAddress`?, `district`?, `state`?, `pincode`?, `collegeName`?, `collegeLocation`?, `registerNo`?, `qualification`?, `department`?, `currentStatus`?, `passedYear`?, `domain`?, `role`?, `mode`?, `duration`?, `startDate`?, `endDate`?, `skills`? (array), `tools`? (array), `experience`?, `resumeUrl`?, `bonafideUrl`?, `idProofUrl`?

#### Pagination response shape

All paginated endpoints return:
```json
{
  "items": [ ...records... ],
  "total": 42
}
```

#### Viewed / Unread tracking

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/submissions/viewed` | Yes | Returns the raw viewed ID arrays: `{ contact: [1,3], jobs: [2], intern: [] }` |
| POST | `/api/submissions/view` | Yes | Mark a submission as viewed. Body: `{ "type": "contact" \| "jobs" \| "intern", "id": 5 }` |
| GET | `/api/submissions/unread-counts` | Yes | Returns the actual unread count per type: `{ contact: 0, jobs: 1, intern: 0 }` |

The unread-counts endpoint is what the admin dashboard uses. It queries the DB directly — counting rows whose ID is not in the viewed set — so it is always accurate even if the viewed list contains IDs from previously deleted submissions.

#### File Upload

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/submissions/upload` | No | Upload a single file. Returns `{ "url": "/uploads/filename.ext" }` |

**Rules:**
- Max size: 5 MB
- Allowed types: `.pdf`, `.doc`, `.docx`, `.jpg`, `.jpeg`, `.png`
- Files are stored in `wwwroot/uploads/` with a UUID filename
- The returned URL is a relative path — prepend the API origin to get the full URL

> **Important:** Render's filesystem is ephemeral. Uploaded files are lost when the container restarts. For persistent file storage, integrate a cloud service (Cloudinary, AWS S3, etc.) and change only the upload endpoint to write there instead of disk.

---

## File Uploads

The upload endpoint saves files to `{WebRootPath}/uploads/`. It:

1. Validates file size (max 5 MB)
2. Validates file extension against the allowed list
3. Generates a UUID filename to prevent collisions and path traversal
4. Returns the relative URL `/uploads/<uuid>.<ext>`

The `wwwroot/` folder is served as static files by `app.UseStaticFiles()`. CORS is applied **before** static file serving in the middleware pipeline, so uploaded files (especially PDFs fetched by `react-pdf` via `fetch()`) include the correct `Access-Control-Allow-Origin` header.

---

## Data Seeding

`DataSeeder.Seed()` is called on every app start. It does nothing if `HomeStats` table is already populated — so seeding only runs once on a completely fresh database.

Seed data is loaded from JSON files in the `data/` directory:

```
data/
├── home-stats.json
├── home-features.json
├── testimonials.json
├── about-who-we-are.json
├── about-mission-vision.json
├── about-core-values.json
├── about-gallery.json
├── services.json
├── service-steps.json
├── portfolio-topics.json
├── portfolio-items.json
├── careers-jobs.json
├── careers-reasons.json
├── internship-domains.json
├── internship-reasons.json
├── internship-benefits.json
├── internship-steps.json
├── internship-eligibility.json
├── internship-faqs.json
├── locations.json
├── footer-contact.json
└── hq.json
```

To reset all content to defaults: clear the database (drop all tables or truncate), then restart the app. Migrations will re-run and the seeder will populate fresh data.

---

## Deployment on Render

This API is deployed as a **Web Service** on [Render](https://render.com).

### Build & Start commands

```
Build:  dotnet publish -c Release -o out
Start:  dotnet out/WebApplication1.dll
```

### Required environment variables on Render

Set these in the Render dashboard under **Environment**:

| Variable | Value |
|---|---|
| `ConnectionStrings__Default` | Render PostgreSQL internal connection string |
| `AllowedOrigins__0` | URL of your admin frontend (e.g. `https://company-admin-xxx.onrender.com`) |
| `AllowedOrigins__1` | URL of your public site (e.g. `https://kalanjiyam-company-xxx.onrender.com`) |
| `Jwt__Key` | A long random secret string (at least 32 characters) |
| `Jwt__Issuer` | `kalanjiyam-admin` |
| `Jwt__Audience` | `kalanjiyam-admin` |
| `AdminUser__Email` | Your admin email |
| `AdminUser__Password` | Plain text password or BCrypt hash |

### Database

Create a **PostgreSQL** service on Render and link it to this web service. The database persists independently — it is **not** lost on container restart or redeploy. Migrations run automatically on startup.

### PORT binding

Render sets a `PORT` environment variable. `Program.cs` reads this and calls `builder.WebHost.UseUrls($"http://+:{port}")` so the app binds on the correct port automatically.

### CORS

Only origins listed in `AllowedOrigins` can make cross-origin requests. If you add a new frontend URL (e.g. a custom domain), add it as another `AllowedOrigins__N` environment variable on Render and redeploy.
