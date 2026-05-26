# Kalanjiyam Admin Dashboard

React single-page application that gives administrators full control over the Kalanjiyam company website. Through this dashboard you can edit every piece of content shown on the public site and review all form submissions sent by visitors.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Routing](#routing)
- [Pages Reference](#pages-reference)
- [Reusable UI Components](#reusable-ui-components)
- [API Layer](#api-layer)
- [Key Patterns](#key-patterns)
- [Submission Pages In Depth](#submission-pages-in-depth)
- [Deployment on Render](#deployment-on-render)

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| React Router | v7 | Client-side routing |
| Vite | 8 | Dev server & production bundler |
| Axios | 1.x | HTTP client with interceptors |
| lucide-react | 1.x | Icon library |
| react-pdf | 10.x | In-browser PDF viewer |

---

## Project Structure

```
kalanjiyum-admin-frontend/
├── public/
│   └── _redirects                  # Netlify/Render SPA fallback rule
├── src/
│   ├── api/
│   │   ├── client.js               # Axios instance, interceptors, helper functions
│   │   ├── auth.js                 # login(), logout()
│   │   ├── content.js              # All 48 CRUD functions for site content
│   │   └── submissions.js          # Submission fetch, delete, viewed tracking
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx     # App shell: sidebar + topbar + mobile overlay
│   │   │   └── Sidebar.jsx         # Navigation links grouped by section
│   │   └── ui/
│   │       ├── PageHeader.jsx      # Page title, subtitle, optional action slot
│   │       ├── DataTable.jsx       # Paginated table with mobile card fallback
│   │       ├── SimpleCrudTab.jsx   # Full add/edit/delete flow in one component
│   │       ├── ContentTabs.jsx     # Scrollable horizontal tab navigation
│   │       ├── FormModal.jsx       # Modal wrapper for add/edit forms
│   │       ├── DetailModal.jsx     # Read-only detail view modal
│   │       ├── ConfirmModal.jsx    # Delete confirmation dialog
│   │       ├── Toast.jsx           # Context-based toast notifications
│   │       ├── ImageUpload.jsx     # File upload with preview and URL fallback
│   │       ├── EmptyState.jsx      # Placeholder when a list is empty
│   │       ├── ItemCard.jsx        # Card wrapper with Edit/Delete buttons
│   │       ├── TagEditor.jsx       # Interactive tag/array input
│   │       └── IconSelect.jsx      # Dropdown to pick a lucide-react icon
│   ├── context/
│   │   └── AuthContext.jsx         # Auth state (token + user), signIn, signOut
│   ├── hooks/
│   │   ├── useAuth.js              # Consumes AuthContext
│   │   └── useCrud.js              # Fetches a list, exposes reload + setItems
│   ├── pages/
│   │   ├── Login.jsx               # Email + password login form
│   │   ├── Dashboard.jsx           # Overview: unread badges, recent submissions
│   │   ├── submissions/
│   │   │   ├── ContactEnquiries.jsx
│   │   │   ├── JobApplications.jsx
│   │   │   ├── InternshipApplications.jsx
│   │   │   ├── FileViewer.jsx      # Modal PDF / image viewer
│   │   │   ├── downloadAs.js       # Force-download a file via blob
│   │   │   ├── exportCsv.js        # Build and trigger CSV download
│   │   │   └── Submissions.css     # Shared styles for all submission pages
│   │   └── content/
│   │       ├── Home.jsx            # Stats, Features, Testimonials tabs
│   │       ├── About.jsx           # Who We Are, Mission/Vision, Core Values, Gallery
│   │       ├── Services.jsx        # Services list + Process steps
│   │       ├── Portfolio.jsx       # Filter topics + Portfolio items
│   │       ├── Careers.jsx         # Job listings + Why Join Us reasons
│   │       ├── Internship.jsx      # 6 tabs: Domains, Reasons, Benefits, Steps, Eligibility, FAQs
│   │       └── Locations.jsx       # Locations + Footer contact + Headquarters
│   ├── App.jsx                     # Route definitions + lazy loading + auth guard
│   └── main.jsx                    # React root render
├── .env                            # Local dev environment variables
├── .env.production                 # Production environment variables
├── vite.config.js                  # Vite config (React plugin)
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- The backend API running (locally or on Render)

### 1. Install dependencies

```bash
cd kalanjiyum-admin-frontend
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5005/api
```

Replace the URL with wherever your backend is running. See [Environment Variables](#environment-variables) for details.

### 3. Start the dev server

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

### 4. Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static host.

### Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle into `dist/` |
| `npm run preview` | Locally serve the `dist/` folder to test the production build |
| `npm run lint` | Run ESLint across the project |

---

## Environment Variables

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

This is the **only** environment variable the app needs. It sets the base URL for every API request.

### Important: variables are baked at build time

Vite replaces all `import.meta.env.VITE_*` references at build time — the final JavaScript bundle contains the literal URL string, not a runtime lookup. This means:

- Changing `VITE_API_BASE_URL` on Render **does not take effect** until you trigger a new deploy (which rebuilds the bundle).
- You cannot change the API URL by simply restarting the service.

For local development, put the variable in `.env`. For production, set it in the Render dashboard under **Environment** before deploying.

---

## Authentication

### How it works

1. User visits `/login` and submits their email and password.
2. The app calls `POST /api/auth/login`. On success the backend returns a signed JWT token.
3. The token is stored in `localStorage` under the key `admin_token`.
4. Every subsequent API request automatically includes `Authorization: Bearer <token>` via an Axios request interceptor in `src/api/client.js`.
5. If the backend returns `401 Unauthorized` (expired or invalid token), the response interceptor removes the token from localStorage and redirects the browser to `/login`.
6. Tokens expire after 8 hours (configurable on the backend via `Jwt:ExpiresHours`).

### ProtectedRoute

All routes except `/login` are wrapped in a `ProtectedRoute` component. It reads the token from `AuthContext`. If no token exists, it immediately redirects to `/login`.

### AuthContext (`src/context/AuthContext.jsx`)

Provides three things to the whole app:

| Value | Type | Description |
|---|---|---|
| `token` | `string \| null` | Current JWT token |
| `user` | `{ email }` | Logged-in user info |
| `signIn(token, user)` | function | Stores token + user, updates state |
| `signOut()` | function | Clears token + user, redirects to login |

Access it anywhere via the `useAuth()` hook:

```js
const { user, signOut } = useAuth()
```

---

## Routing

All routes are defined in `App.jsx`. Page components are lazy-loaded with `React.lazy()` wrapped in `<Suspense>`.

| Path | Component | Auth Required | Description |
|---|---|---|---|
| `/login` | `Login` | No | Email + password login form |
| `/` | `Dashboard` | Yes | Overview with unread counts and recent submissions |
| `/submissions/contact` | `ContactEnquiries` | Yes | Contact form submissions |
| `/submissions/jobs` | `JobApplications` | Yes | Job application submissions |
| `/submissions/internship` | `InternshipApplications` | Yes | Internship application submissions |
| `/content/home` | `Home` | Yes | Home page content editor |
| `/content/about` | `About` | Yes | About page content editor |
| `/content/services` | `Services` | Yes | Services page content editor |
| `/content/portfolio` | `Portfolio` | Yes | Portfolio page content editor |
| `/content/careers` | `Careers` | Yes | Careers page content editor |
| `/content/internship` | `Internship` | Yes | Internship page content editor |
| `/content/locations` | `Locations` | Yes | Locations page content editor |
| `*` | — | — | Catch-all, redirects to `/` |

---

## Pages Reference

### Dashboard (`/`)

The landing page after login. Shows:
- **Submissions** section — three cards (Contact, Job Applications, Internship Applications), each with a red unread badge showing how many submissions haven't been opened yet
- **Content Management** section — quick links to all 7 content editors
- **Recent Submissions** — a list of the latest submissions across all three types, sorted by date

The unread count is fetched from `GET /api/submissions/unread-counts` which computes the count server-side, making it accurate even if old viewed IDs exist from a previous DB state.

---

### Login (`/login`)

Simple card form with email and password fields. Password field has a show/hide toggle. On success, stores the token and redirects to `/`. Errors are shown inline below the form.

---

### Content Pages (`/content/*`)

Each content page manages one section of the public website. They all follow the same pattern:

- Multiple tabs via `ContentTabs`
- Each tab uses `SimpleCrudTab` (or a custom form for single-record sections)
- Add opens a `FormModal`, Edit populates the same modal with existing data, Delete triggers `ConfirmModal`
- Changes are immediately reflected (list reloads after save/delete)
- Toast notifications confirm success or report errors

**Home** — 3 tabs: *Stats* (counter numbers with animated suffix), *Features* (feature cards), *Testimonials*

**About** — 4 tabs: *Who We Are* (ordered paragraphs, edited as a bulk text input), *Mission & Vision*, *Core Values*, *Gallery* (image slides)

**Services** — 2 tabs: *Services* (full service cards with bullet lists), *Process Steps*

**Portfolio** — 2 tabs: *Topics* (filter categories with sub-filters), *Items* (portfolio projects with highlights array)

**Careers** — 2 tabs: *Jobs* (open listings with type/location), *Why Join Us* (reason cards)

**Internship** — 6 tabs: *Domains*, *Reasons*, *Benefits*, *Steps*, *Eligibility*, *FAQs*

**Locations** — 3 tabs: *Locations* (office addresses + map URLs), *Footer Contact* (single-record edit), *Headquarters* (single-record edit)

---

### Submission Pages (`/submissions/*`)

Described in detail in [Submission Pages In Depth](#submission-pages-in-depth).

---

## Reusable UI Components

All components live in `src/components/ui/`.

### PageHeader

Renders the page title, optional subtitle, and an optional action area (right-aligned). Used at the top of every page. The action slot is where toolbars (search input, refresh button, export button) are placed.

```jsx
<PageHeader title="Job Applications" subtitle="6 total" action={<Toolbar />} />
```

---

### DataTable

A full-featured data table. Features:
- Renders columns defined by a `columns` array (key, label, width, optional render function)
- Pagination controls (previous/next page) driven by `page`, `totalPages`, `onPage` props
- Loading skeleton state
- **Mobile fallback**: when screen is narrow, renders each row using a `mobileCard` render prop instead of the table layout

```jsx
<DataTable columns={COLUMNS} rows={rows} page={page} totalPages={5} onPage={load} mobileCard={r => <Card row={r} />} />
```

---

### SimpleCrudTab

The most-used component in the app. Wraps a complete add/edit/delete workflow for a list of items. Given a fetch function and a form renderer, it handles:
- Fetching the list on mount
- Empty state display
- Opening `FormModal` for add and edit
- Calling create/update/delete API functions
- Showing `ConfirmModal` before deleting
- Showing `Toast` on success or error

This eliminates the boilerplate that would otherwise be repeated across every content tab.

---

### ContentTabs

Horizontal scrollable tab bar. Fades at the right edge when tabs overflow. Highlights the active tab. Used by every content page to switch between sub-sections.

---

### FormModal

Modal dialog for add/edit forms. Features:
- Accepts any form JSX as children
- **Unsaved changes warning**: if the user tries to close after making changes, shows a confirmation dialog
- Shows a spinner and disables the Save button while the API call is in flight
- Save / Cancel buttons in the footer

---

### DetailModal

Read-only version of the modal. Used by submission pages to show full application details. Closeable via the × button or the Escape key. Has no Save button.

---

### ConfirmModal

Delete confirmation dialog. Shows a warning icon, a message asking the user to confirm, and Cancel / Delete buttons. The Delete button shows a spinner while the delete API call is in progress.

---

### Toast (`src/components/ui/Toast.jsx`)

Context-based notification system. Usage anywhere in the app:

```js
const { showToast } = useContext(ToastContext)
showToast('Saved successfully', 'success')
showToast('Something went wrong', 'error')
```

Toasts auto-dismiss after 3.5 seconds and stack vertically in the top-right corner.

---

### ImageUpload

File upload component that:
1. Lets the user pick an image file
2. Uploads it via `POST /api/submissions/upload`
3. Shows a preview of the uploaded image
4. Falls back to a plain URL text input if the user wants to paste a link directly
5. Stores the absolute URL (not a relative path) so it passes browser URL validation on `type="url"` inputs

---

### EmptyState

Centered placeholder shown when a list has no items. Accepts icon, title, subtitle, and an optional CTA button label + click handler.

---

### ItemCard

Card wrapper for list items in content sections. Renders a slot for item content plus Edit and Delete icon buttons in the top-right corner.

---

### TagEditor

Text input for managing an array of string values (skills, tools, bullet points, etc.). Press Enter to add a tag, Backspace on an empty input to remove the last tag. Tags display as removable chips.

---

### IconSelect

A dropdown that shows 23 named lucide-react icons and lets the user pick one by clicking. The selected icon is shown as a preview. Used in forms where the admin needs to choose a display icon for a card or section (Target, Eye, IndianRupee, Users, Lightbulb, ShieldCheck, Settings, Globe, Cpu, Code2, Rocket, and more).

---

## API Layer

### Axios Client (`src/api/client.js`)

A configured Axios instance shared by all API modules. It:
- Sets `baseURL` to `import.meta.env.VITE_API_BASE_URL`
- Attaches `Authorization: Bearer <token>` from `localStorage` on every request
- On `401` response: removes the token and redirects to `/login`

Helper functions exported from this file:

| Function | Method | Usage |
|---|---|---|
| `get(path)` | GET | Read data |
| `post(path, body)` | POST | Create |
| `put(path, body)` | PUT | Full replace update |
| `patch(path, body)` | PATCH | Partial update |
| `del(path)` | DELETE | Delete |
| `uploadFile(path, file)` | POST multipart | File upload |

---

### Auth API (`src/api/auth.js`)

| Function | Endpoint | Description |
|---|---|---|
| `login(email, password)` | POST `/auth/login` | Returns `{ token, user }` |
| `logout()` | POST `/auth/logout` | No-op on backend; called for completeness |

---

### Content API (`src/api/content.js`)

48 functions covering all site content. Every section follows the same four-function pattern: `getX()`, `createX(body)`, `updateX(id, body)`, `deleteX(id)`.

| Section | Functions |
|---|---|
| Home Stats | `getHomeStats`, `createHomeStat`, `updateHomeStat`, `deleteHomeStat` |
| Home Features | `getHomeFeatures`, `createHomeFeature`, `updateHomeFeature`, `deleteHomeFeature` |
| Testimonials | `getTestimonials`, `createTestimonial`, `updateTestimonial`, `deleteTestimonial` |
| Who We Are | `getWhoWeAreText`, `updateWhoWeAreText` (bulk replace, no id) |
| Mission & Vision | `getMissionVision`, `createMissionVision`, `updateMissionVision`, `deleteMissionVision` |
| Core Values | `getCoreValues`, `createCoreValue`, `updateCoreValue`, `deleteCoreValue` |
| Gallery | `getGallerySlides`, `createGallerySlide`, `updateGallerySlide`, `deleteGallerySlide` |
| Services | `getServices`, `createService`, `updateService`, `deleteService` |
| Service Steps | `getServiceProcess`, `createServiceStep`, `updateServiceStep`, `deleteServiceStep` |
| Portfolio Topics | `getPortfolioTopics`, `createPortfolioTopic`, `updatePortfolioTopic`, `deletePortfolioTopic` |
| Portfolio Items | `getPortfolioItems`, `createPortfolioItem`, `updatePortfolioItem`, `deletePortfolioItem` |
| Career Jobs | `getJobs`, `createJob`, `updateJob`, `deleteJob` |
| Career Reasons | `getCareersReasons`, `createCareersReason`, `updateCareersReason`, `deleteCareersReason` |
| Intern Domains | `getInternDomains`, `createInternDomain`, `updateInternDomain`, `deleteInternDomain` |
| Intern Reasons | `getInternReasons`, `createInternReason`, `updateInternReason`, `deleteInternReason` |
| Intern Benefits | `getInternBenefits`, `createInternBenefit`, `updateInternBenefit`, `deleteInternBenefit` |
| Intern Steps | `getInternSteps`, `createInternStep`, `updateInternStep`, `deleteInternStep` |
| Eligibility | `getEligibilityCards`, `createEligibilityCard`, `updateEligibilityCard`, `deleteEligibilityCard` |
| Intern FAQs | `getInternFAQs`, `createInternFAQ`, `updateInternFAQ`, `deleteInternFAQ` |
| Locations | `getLocations`, `createLocation`, `updateLocation`, `deleteLocation` |
| Footer Contact | `getFooterContact`, `updateFooterContact` (single row, no id) |
| Headquarters | `getHeadquarters`, `updateHeadquarters` (single row, no id) |

---

### Submissions API (`src/api/submissions.js`)

| Function | Endpoint | Description |
|---|---|---|
| `getContactSubmissions(page, limit)` | GET `/submissions/contact` | Paginated contact enquiries |
| `getJobSubmissions(page, limit)` | GET `/submissions/jobs` | Paginated job applications |
| `getInternshipSubmissions(page, limit)` | GET `/submissions/internship` | Paginated internship applications |
| `getUnreadCounts()` | GET `/submissions/unread-counts` | Accurate unread count per type |
| `getViewedSubmissions()` | GET `/submissions/viewed` | Raw array of viewed IDs per type |
| `markSubmissionViewed(type, id)` | POST `/submissions/view` | Mark a submission as opened |
| `deleteContactSubmission(id)` | DELETE `/submissions/contact/{id}` | Delete an enquiry |
| `deleteJobSubmission(id)` | DELETE `/submissions/jobs/{id}` | Delete a job application |
| `deleteInternshipSubmission(id)` | DELETE `/submissions/internship/{id}` | Delete an internship application |

---

## Key Patterns

### SimpleCrudTab pattern

Every content tab that manages a list of items uses `SimpleCrudTab`. You pass it:
- `fetchFn` — async function to load the list
- `createFn` / `updateFn` / `deleteFn` — API functions
- `renderForm` — a function that returns the form JSX given `(item, onChange)`
- `renderItem` — how to display each item in the list

`SimpleCrudTab` handles all state: loading, the current list, which item is being edited, the modal open/close state, and the delete confirmation.

---

### useCrud hook

For pages that need more control than `SimpleCrudTab` offers, `useCrud(fetchFn)` fetches a list on mount and exposes:

```js
const { items, loading, reload, setItems } = useCrud(getServices)
```

Call `reload()` after a mutation to refresh the list.

---

### FormModal + Toast flow

The standard workflow for any save action:

1. User clicks Add or Edit → `FormModal` opens
2. User fills in the form
3. User clicks Save → spinner appears, button disabled
4. API call resolves → modal closes, `showToast('Saved', 'success')` fires
5. If the API call rejects → modal stays open, `showToast('Error: ...', 'error')` fires

---

### Pagination pattern

Paginated endpoints return `{ items: [...], total: N }`. The standard component state:

```js
const [rows, setRows]   = useState([])
const [page, setPage]   = useState(1)
const [total, setTotal] = useState(0)
const LIMIT = 20

const load = useCallback((p) => {
    setLoading(true)
    getXxxSubmissions(p, LIMIT)
        .then(data => { setRows(data.items ?? data); setTotal(data.total ?? data.length); setPage(p) })
        .finally(() => setLoading(false))
}, [])
```

`DataTable` receives `page`, `totalPages = Math.ceil(total / LIMIT)`, and `onPage={load}`.

---

## Submission Pages In Depth

All three submission pages (Contact, Job Applications, Internship Applications) share the same structure and features.

### Unread dot indicator

Each row in the table has a small coloured dot in the first column:
- **Blue dot** — this submission has not been opened yet
- **Grey dot** — already viewed

On the mobile card layout, the dot appears on the avatar in the top-right corner. When the admin clicks **View** on any submission, `markSubmissionViewed(type, id)` is called immediately and the dot turns grey without a page reload.

### Search

A search box in the toolbar filters the currently-loaded page of rows client-side. Matches against name, email, and key fields (domain, role, position, etc.). When a search is active, the subtitle shows the match count instead of the total.

### Pagination

20 rows per page. The toolbar includes a **Refresh** button that re-fetches the current page.

### View modal

Clicking **View** opens a `DetailModal` with all fields for that submission displayed in a two-column grid. Files (resume, photo, bonafide, ID proof) are shown with **View** and **Download** buttons.

### File Viewer

The **View** button on a file opens a `FileViewer` modal, which renders:
- Images (`jpg`, `jpeg`, `png`) directly via an `<img>` tag
- PDFs via `react-pdf` (uses `fetch()` internally — the backend must serve static files with CORS headers for this to work)

The **Download** button triggers a force-download via a Blob URL so the browser saves the file instead of opening it in a tab.

### Delete

The trash icon on each row opens `ConfirmModal`. On confirm:
1. The delete API is called
2. The row is removed from local state immediately (no re-fetch)
3. The total count decrements by 1
4. The submission's ID is removed from the local `viewedIds` set so the unread dot count remains accurate

### CSV Export

The **Export CSV** button fetches all submissions (limit 9999) and downloads a `.csv` file with one row per submission. All fields are included, with file URLs resolved to absolute paths.

---

## Deployment on Render

This SPA is deployed as a **Static Site** on [Render](https://render.com).

### Build settings

| Setting | Value |
|---|---|
| Build Command | `npm run build` |
| Publish Directory | `dist` |

### Environment variable

Set `VITE_API_BASE_URL` in the Render dashboard **before** the first deploy. Because Vite bakes this value into the bundle at build time, you must trigger a new deploy any time you change it — saving the variable in Render alone is not enough.

### SPA routing

React Router handles all navigation client-side. Without a fallback rule, refreshing any route other than `/` returns a 404 from the static server because the file doesn't exist on disk.

**Fix:** The `public/_redirects` file included in the repo contains:

```
/* /index.html 200
```

This tells Render's static server to serve `index.html` for every path, letting React Router take over. Alternatively, add a Redirect/Rewrite rule in the Render dashboard with source `/*` and destination `/index.html`.

### CORS

The admin frontend makes API requests to the backend. The backend's `AllowedOrigins` config must include this site's Render URL. If you add a custom domain later, add it to `AllowedOrigins` on the backend and redeploy the backend.

### PDF viewing

`react-pdf` fetches PDFs via the browser's `fetch()` API, which enforces CORS. The backend serves uploaded files as static assets — `app.UseCors(...)` must be placed **before** `app.UseStaticFiles()` in `Program.cs`, otherwise static file responses won't carry CORS headers and PDFs will fail to load in the viewer.
