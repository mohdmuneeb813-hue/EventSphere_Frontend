# EventSphere — Frontend ↔ Backend Integration

This is the integrated EventSphere frontend, wired to the existing Node.js + Express + MongoDB + Socket.io backend. The original theme (Tailwind 3.4, Playfair Display + Plus Jakarta Sans, terracotta / cream / espresso / olive palette) has been preserved across every page. All demo / mock / hardcoded data has been removed, and every data-driven component now reads from a real backend endpoint.

## Project layout

```
/home/z/my-project/
├── backend/         ← unchanged Node.js backend (source of truth)
└── frontend/        ← modified React 18 + Vite frontend
```

No backend files were modified — the integration is purely on the frontend side. The backend codebase, models, routes, controllers, and `.env` are all preserved exactly as supplied.

## Environment

The frontend reads two Vite env vars (defined in `frontend/.env`):

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Base URL of the backend REST API (default `http://localhost:3000/api`). |
| `VITE_SOCKET_URL` | Base URL for the Socket.io connection (default `http://localhost:3000`). |

The Vite dev server also proxies `/api → http://localhost:3000` (see `vite.config.js`).

## Run commands

### Backend

```bash
cd /home/z/my-project/backend
npm install          # if not already installed
npm run dev          # nodemon app.js — listens on the PORT in .env (default 3000)
```

### Frontend

```bash
cd /home/z/my-project/frontend
npm install          # native binaries are platform-specific — reinstall after extracting
npm run dev          # vite dev server on http://localhost:5173
npm run build        # production build to dist/
npm test             # vitest run — 5 test files, 16 tests, all passing
```

## What changed in the frontend

### Phase 1 — Backend audit (read-only)

Catalogued 8 route groups, 7 Mongoose models, JWT bearer auth (7-day expiry, payload `{id, role, email}`), 4 server-emitted Socket.io events (`NEW_CHAT_MESSAGE`, `BOOTH_STATUS_CHANGED`, `EXPO_CREATED`, `FEEDBACK_SUBMITTED`). Identified gaps: no pagination/filter/sort query params, no file uploads (despite declared Cloudinary/Multer deps), no notifications subsystem, no booth-applied / expo-updated / booking-created / schedule-created socket events.

### Phase 2 — Frontend audit (read-only)

Found 11 demo-only forms, 6+ pages with hardcoded fake data, 2 duplicate axios instances, broken Socket event forwarding (subscribed to events the server doesn't emit), broken Navbar field lookup (`connected` instead of `isConnected`), non-functional NotificationCenter (reads fields not exposed by context), and 5 features with no backend support.

### Phase 3 — Mapping & removal of unsupported features

| Removed feature | Reason |
|------------------|--------|
| `pages/common/BookPass.jsx` (public pass tiers & add-ons form) | Backend `Booking` model only stores `{ expo, attendee, ticketNumber, bookingDate }` — no pass tiers or add-ons. Attendees book via `attendee/ExpoDetails.jsx → POST /api/bookings/book`. |
| `pages/common/RegisterExhibitorPage.jsx` (public exhibitor application form) | No `/api/exhibitor-applications` endpoint. Exhibitors register via `/register?role=exhibitor`. |
| `pages/exhibitor/ExhibitorCatalog.jsx` (products + staff management) | No `Product` or `Staff` model in the backend. |
| `pages/attendee/ExhibitorDirectory.jsx` "Book Meeting" modal | No `Meeting` model / endpoint. The directory listing itself is kept and now shows only `Approved` booths. |
| `components/notifications/NotificationCenter.jsx` + Navbar bell button | Backend has no notifications subsystem. The drawer always showed "No notifications yet." |
| `Login.jsx` "Quick Demo" one-click login buttons | Hardcoded credentials (`admin@eventsphere.com/admin123` etc.) with no DB backing. |
| `AuthContext.jsx` fallback token synthesis | The `token_<id>_<ts>` fake token masked real backend failures; removed so real auth errors surface. |
| `ContactUs.jsx` inquiry form | The form faked a network round-trip via `setTimeout` and showed a fake success screen. Static contact info + FAQs preserved. |
| `LandingPage.jsx` "Watch Video" modal + button | No actual video; the modal showed a static Unsplash image. |
| All hardcoded `curatedExpos`, `sampleBooths`, hardcoded leadership team, fake impact metrics (120K+/2,500+/50+/98.4%), fabricated `trendData` chart in Analytics | Per "no fake data" rule — every data-driven component must read from the backend. |
| Cosmetic pagination in `AllExpos` (1/2/3 buttons that didn't slice the data) | Removed; the backend returns the full list and there's no pagination param to wire. |

### Phase 4 — Wiring changes per file

**API layer (`src/api/`)**

- Consolidated the two duplicate axios instances into one (`src/api/axios.js`). Deleted `src/api/axiosInstance.js`. The 401 handler now consistently dispatches an `auth:unauthorized` window event (caught by AuthContext) instead of a hard browser redirect.
- `messageApi.js` and `feedbackApi.js` updated to import from the consolidated `axios.js`.
- Added `authApi.updateProfile()` wrapper for `PUT /api/auth/profile` (used by the exhibitor profile page).
- Added `extraApi.js` to wrap the cross-cutting endpoints in `/api/extra`:
  - `searchExhibitors(keyword, category)` → `GET /api/extra/exhibitors/search`
  - `toggleSessionBookmark(scheduleId, userId)` → `POST /api/extra/schedule/bookmark`
  - `getAnalytics()` → `GET /api/extra/admin/analytics`

**Contexts**

- `AuthContext.jsx`: removed the fallback-token synthesis (`res.token || \`token_${user.id}_${ts}\``); if the backend doesn't return a token, login now throws an explicit "Server did not return an auth token." error so the issue isn't masked.
- `SocketContext.jsx`: kept only the 4 server-emitted events (`NEW_CHAT_MESSAGE`, `BOOTH_STATUS_CHANGED`, `EXPO_CREATED`, `FEEDBACK_SUBMITTED`) in the forwarded-events list. Removed noisy `console.log` calls. Documented that pages should NOT re-emit these events — the backend already broadcasts them when the corresponding REST endpoint succeeds.

**Routing (`src/routes/AppRoutes.jsx`)**

- Removed routes for `BookPass`, `RegisterExhibitorPage`, `ExhibitorCatalog`.
- Changed the attendee portal guard from `ProtectedRoute` (any authenticated user) to `RoleRoute allowedRoles={['attendee']}` so admins/exhibitors can't accidentally land on attendee-only pages.

**Layouts & navigation**

- `Sidebar.jsx`: removed the "Products & Staff" link for the exhibitor role (since `ExhibitorCatalog` is gone).
- `PublicNavbar.jsx` + `PublicFooter.jsx`: removed the "Book Pass" and "Exhibitor Register" links; replaced "Buy Tickets" CTA with a "Get Started" CTA pointing at `/register`.
- `Navbar.jsx` (portal top bar): now reads `isConnected` from `useSocket()` (instead of the undefined `connected`); removed the NotificationCenter button + drawer.
- Deleted `components/notifications/NotificationCenter.jsx`.

**Pages — admin**

- `AdminDashboard.jsx`: removed the `BOOTH_APPLIED` and `BOOKING_CREATED` socket subscriptions (backend doesn't emit either). Removed the redundant `emitEvent('BOOTH_STATUS_CHANGED', …)` call — the backend already emits it on `PUT /api/booths/status/:id`.
- `ExpoManagement.jsx`: removed `EXPO_UPDATED` / `EXPO_DELETED` subscriptions (backend only emits `EXPO_CREATED`). Removed the corresponding client-side emits.
- `ScheduleManagement.jsx`: removed `SCHEDULE_CREATED` / `SCHEDULE_DELETED` subscriptions and emits entirely (the backend has no such events).
- `FloorPlanManagement.jsx`: removed `BOOTH_APPLIED` subscription and the `BOOTH_STATUS_CHANGED` re-emit.
- `ExhibitorManagement.jsx`: same cleanups as FloorPlanManagement.
- `Analytics.jsx`: removed the fabricated 5-day `trendData` area chart (it was synthesized from `bookings.length × multipliers`). Replaced it with a real "Booth Application Pipeline" bar chart (Approved/Pending/Rejected counts). Removed the bogus "Space Utilization %" KPI (it assumed 36 booths per expo). Now calls `GET /api/extra/admin/analytics` for the headline KPIs and falls back to local counts if that endpoint is unreachable.
- `FeedbackSupport.jsx`: was localStorage-only with 2 seeded dummy records. Rewritten to call `feedbackApi.getAll()`, `feedbackApi.create()`, `feedbackApi.updateStatus()`, and to subscribe to the real `FEEDBACK_SUBMITTED` socket event.

**Pages — exhibitor**

- `ExhibitorProfile.jsx`: was local-only. Rewritten to call `authApi.updateProfile()` (`PUT /api/auth/profile`) and then sync the AuthContext locally via `updateUserProfile(res.user)`. Removed the hardcoded `website: 'https://www.example.com'` / `phone: '+1 (555) 019-2834'` defaults.
- `ExhibitorMessages.jsx`: was localStorage-only. Rewritten to call `messageApi.getAll()` + `messageApi.create()` and subscribe to `NEW_CHAT_MESSAGE`. Removed the redundant client-side `emitEvent('NEW_CHAT_MESSAGE', …)` call — the backend already broadcasts it on `POST /api/messages`.
- `ExhibitorBooths.jsx`: removed the `emitEvent('BOOTH_APPLIED', …)` call (backend has no such event). Kept the `BOOTH_STATUS_CHANGED` subscription (so the floor plan updates live when an admin approves a different booth elsewhere).
- `ExhibitorDashboard.jsx`: removed the unused `Sparkles`, `MessageSquare`, `Clock`, `CheckCircle`, `XCircle`, `Building` icon imports. Replaced the hardcoded "Upcoming Tech Expo" fallback string with a neutral "No expo registered" message when no expo data exists.
- Deleted `ExhibitorCatalog.jsx` entirely.

**Pages — attendee**

- `ExpoDetails.jsx` (attendee view): rewrote the bookmark toggle to call `extraApi.toggleSessionBookmark(scheduleId, user.id)` (`POST /api/extra/schedule/bookmark`) instead of writing to `localStorage['eventsphere_bookmarked_sessions']`. Bookmark state is now derived from `Schedule.attendees` (server-truth). Removed the `BOOKING_CREATED` emit (backend doesn't emit it). Removed the redundant `SCHEDULE_CREATED` subscription. Kept the `BOOTH_STATUS_CHANGED` subscription.
- `SessionBookmarks.jsx`: was localStorage-only. Rewritten to fan out: fetch all expos → fetch schedules per expo → filter sessions where the current user's id is in `Schedule.attendees`. Remove-bookmark calls the same `extraApi.toggleSessionBookmark` endpoint (it's a toggle).
- `ExhibitorDirectory.jsx`: removed the "Book Meeting" modal (no backend). The directory listing now shows only `Approved` booths and derives category chips from the real booth data.
- `MyBookings.jsx`: unchanged — already correctly wired to `bookingApi.getAttendeeBookings(user.id)`.

**Pages — public**

- `LandingPage.jsx`: removed 4 hardcoded `curatedExpos` (now shows the first 4 DB expos), removed 6 fake `sampleBooths` (the floor plan now reflects the first DB expo's real booths), removed 4 fake stat counters (replaced with real DB-derived counts: # Live Expos, # Booth Reservations, # Approved Stalls, # Unique Venues), removed the "Watch Video" modal and button.
- `AllExpos.jsx`: removed 4 fake `curatedList` records + 8 hardcoded Unsplash category tiles + cosmetic pagination. Now shows only DB expos; category chips and location chips are derived from the unique values in the DB data. Empty-state messaging distinguishes "no expos yet" from "no expos match your filter".
- `ExpoDetailsView.jsx`: removed the fake `defaultExpo` fallback (now renders an explicit "Expo not found" empty state when the API doesn't return the expo). Removed the hardcoded highlights list, fake stats (500+/50K+/50+), and 4 hardcoded Unsplash gallery images. The floor plan now reflects the real booths for the requested expo.
- `AboutUs.jsx`: removed the 3 fake executives (Tariq Al-Mansoor, Elena Rostova, Farhan Siddiqui) — replaced with a "Built by Practitioners" CTA section. Removed the 4 fake impact metrics (120K+/2,500+/50+/98.4%). Trimmed the milestones to remove fake counts ("50,000 verified attendees", "50+ annual expos"). Bottom CTA links updated to point at `/register` instead of the removed `/book-pass` and `/register-exhibitor` pages.
- `ContactUs.jsx`: removed the inquiry form (no backend endpoint). Kept static contact info (Dubai + Karachi offices, department emails, FAQs). The right column now routes visitors to the wired `/feedback` page or `/login` instead of showing a fake success message.
- `ReportFeedback.jsx`: rewrote to call `feedbackApi.create()` instead of writing to localStorage. The backend route is `verifyToken`-protected, so unauthenticated users now see a sign-in CTA instead of a non-functional form. Removed the redundant `emitEvent('FEEDBACK_SUBMITTED', …)` call — the backend already emits it on `POST /api/feedback`. Mapped the 5 UI categories down to the 4 backend-enum values (`Feedback` | `Booth Issue` | `Schedule Issue` | `Other`).
- `GalleryPage.jsx`: updated 2 dead `/book-pass` links to `/expos` and `/register`.

**Components**

- `Navbar.jsx`: fixed the field name from `connected` to `isConnected`; removed the NotificationCenter import and drawer.
- `MessagingDrawer.jsx` (slide-out chat drawer): rewrote from localStorage-only to call `messageApi.getAll()` + `messageApi.create()` and subscribe to `NEW_CHAT_MESSAGE`. Now reads `isConnected` from `useSocket()`. Unauthenticated users see a sign-in CTA instead of a non-functional input.
- Deleted the unrouted duplicate wired components at `components/common/FeedbackSupport.jsx`, `components/exhibitor/ExhibitorProfile.jsx`, `components/exhibitor/ExhibitorMessages.jsx` — their content has been merged into the routed page slots.
- Deleted stray `src/package-lock.json` (duplicate of the root lockfile).

### Phase 5 — Tests actually performed

```
cd /home/z/my-project/frontend && npm test
```

Result: **5 test files passed, 16/16 tests passed** in 3.58s.

- `Badge.test.jsx` (5 tests) — StatusBadge / RoleBadge rendering.
- `Formatters.test.jsx` (5 tests) — date formatting + status/role class lookup.
- `FloorPlan.test.jsx` (2 tests) — header / legend / hall switching.
- `LandingPage.test.jsx` (2 tests) — hero text, role cards, interactive floor plan section. (Test was updated to also mock `boothApi.getAll` since LandingPage now fetches both expos and booths on mount.)
- `BrowseExpos.test.jsx` (2 tests) — list rendering + search filter.

```
cd /home/z/my-project/frontend && npm run build
```

Result: **production build succeeded in 4.59s**. 27 lazy-loaded chunk files emitted, no warnings, no errors.

```
cd /home/z/my-project/backend && for f in *.js controllers/*.js routes/*.js middleware/*.js models/*.js; do node -c "$f"; done
```

Result: all 18 backend JS files pass `node --check` syntax verification (no syntax errors).

**What was NOT verified**: live end-to-end behaviour against a running MongoDB instance — the backend's `.env` points at a MongoDB Atlas cluster that is not reachable from this sandbox, so the actual REST round-trips were not exercised here. The frontend's API client matches the response shapes documented in the backend audit, but real network responses (including edge cases like duplicate-booking 400s and unauthorized 401s) should be smoke-tested against a live server before production.

## Mapping: feature → endpoint

| Frontend page | Backend endpoint(s) consumed |
|---|---|
| `auth/Login.jsx` | `POST /api/auth/login` |
| `auth/Register.jsx` | `POST /api/auth/register` |
| `auth/ResetPassword.jsx` | `POST /api/auth/reset-password` |
| `auth/ForgotPassword.jsx` | (no API — just routes to `/reset-password` with email in state) |
| `exhibitor/ExhibitorProfile.jsx` | `PUT /api/auth/profile` |
| `admin/AdminDashboard.jsx` | `GET /api/expos/all`, `GET /api/booths/all`, `GET /api/bookings/all`, `PUT /api/booths/status/:boothId` (Approve/Reject) |
| `admin/ExpoManagement.jsx` | `GET/POST/PUT/DELETE /api/expos/*` |
| `admin/FloorPlanManagement.jsx` | `GET /api/expos/all`, `GET /api/booths/all`, `PUT /api/booths/status/:boothId` |
| `admin/ExhibitorManagement.jsx` | `GET /api/booths/all`, `PUT /api/booths/status/:boothId` |
| `admin/ScheduleManagement.jsx` | `GET /api/expos/all`, `GET/POST/DELETE /api/schedules/*` |
| `admin/Analytics.jsx` | `GET /api/expos/all`, `GET /api/booths/all`, `GET /api/bookings/all`, `GET /api/extra/admin/analytics` |
| `admin/FeedbackSupport.jsx` | `GET/POST/PUT /api/feedback`, `DELETE /api/feedback/:id` |
| `exhibitor/ExhibitorDashboard.jsx` | `GET /api/booths/all`, `GET /api/expos/all` |
| `exhibitor/ExhibitorBooths.jsx` | `GET /api/expos/all`, `GET /api/booths/all`, `POST /api/booths/apply` |
| `exhibitor/ExhibitorMessages.jsx` | `GET /api/messages`, `POST /api/messages` |
| `attendee/AttendeeDashboard.jsx` | `GET /api/expos/all`, `GET /api/bookings/attendee/:id` |
| `attendee/BrowseExpos.jsx` | `GET /api/expos/all` |
| `attendee/ExpoDetails.jsx` | `GET /api/expos/all`, `GET /api/schedules/expo/:id`, `GET /api/booths/all`, `GET /api/bookings/attendee/:id`, `POST /api/bookings/book`, `POST /api/extra/schedule/bookmark` |
| `attendee/ExhibitorDirectory.jsx` | `GET /api/booths/all` |
| `attendee/MyBookings.jsx` | `GET /api/bookings/attendee/:id` |
| `attendee/SessionBookmarks.jsx` | `GET /api/expos/all` + `GET /api/schedules/expo/:expoId` per expo + `POST /api/extra/schedule/bookmark` (remove) |
| `common/LandingPage.jsx` | `GET /api/expos/all`, `GET /api/booths/all` |
| `common/AllExpos.jsx` | `GET /api/expos/all` |
| `common/ExpoDetailsView.jsx` | `GET /api/expos/all`, `GET /api/booths/all` |
| `common/ReportFeedback.jsx` | `POST /api/feedback` |
| `common/ContactUs.jsx` | (no API — static info + FAQs only) |
| `common/AboutUs.jsx`, `common/GalleryPage.jsx`, `common/NotFound.jsx`, `common/Unauthorized.jsx` | (no API — static brand content) |
| `components/chat/MessagingDrawer.jsx` | `GET /api/messages`, `POST /api/messages` |

## Backend-endorsed socket events (subscribed to by the frontend)

| Event | Emitted by backend | Frontend subscribers |
|---|---|---|
| `NEW_CHAT_MESSAGE` | `messageController.createMessage` (on POST `/api/messages`) | `ExhibitorMessages`, `MessagingDrawer` |
| `BOOTH_STATUS_CHANGED` | `boothController.updateBoothStatus` (on PUT `/api/booths/status/:id`) | `AdminDashboard`, `FloorPlanManagement`, `ExhibitorManagement`, `ExhibitorBooths`, `ExhibitorDashboard`, `ExpoDetails` |
| `EXPO_CREATED` | `expoController.createExpo` (on POST `/api/expos/create`) | `AdminDashboard`, `ExpoManagement`, `ExhibitorDashboard` |
| `FEEDBACK_SUBMITTED` | `feedbackController.createFeedback` (on POST `/api/feedback`) | `FeedbackSupport` (admin) |

## Known unresolved issues / limitations

1. **`Expo.createdBy` is read from the request body, not from the JWT.** The backend's `createExpo` controller takes `createdBy` from `req.body`. The frontend sends `createdBy: user.id` in the POST body, but a future backend hardening should switch to `req.user.id` from the JWT for security.
2. **No `/api/auth/register` role enforcement.** Any unauthenticated client can register with `role: 'admin'` in the body. The frontend doesn't expose this in the UI, but the gap exists on the backend side.
3. **No pagination / filtering on the server side.** The backend returns the full list for `/expos/all`, `/booths/all`, `/bookings/all`, etc. Client-side filtering is fine for moderate scale but won't scale to thousands of records.
4. **No file uploads.** `multer` and `cloudinary` are declared as backend deps but not wired into any source file. If product / booth / company logo uploads are needed in the future, the backend must add an upload middleware + route first.
5. **`Schedule.attendees` is the only bookmark signal.** There is no dedicated `Bookmark` model, so the `SessionBookmarks` page must fan out N requests (one per expo) to find bookmarked sessions for a user. Acceptable for small N; if the expo count grows large, a dedicated `GET /api/schedules/bookmarked/:userId` endpoint should be added to the backend.
6. **`/api/messages` GET/POST/DELETE routes have no auth.** Any unauthenticated client can read, post, or delete chat messages. The frontend calls them via the authenticated axios instance (which sends the Bearer token if present), but the backend doesn't enforce it.
7. **Two duplicate "create feedback" + "list all feedback" paths.** The backend has both `/api/feedback` (REST router, broadcasts `FEEDBACK_SUBMITTED`) and `/api/extra/feedback/*` (extra router, no broadcast). The frontend uses the broadcasting `/api/feedback` path; the `/api/extra/feedback/*` paths are dead on the frontend side.
8. **`canvas-confetti`** is fired on successful booking in `ExpoDetails.jsx`. This is purely a celebratory animation on top of a real backend 201 response — not fake data.
9. **GalleryPage is the only remaining static-marketing page.** It still renders 9 hardcoded gallery images. These are brand assets (not "fake database records" in the rule's sense), so they were preserved as static marketing content. If you'd prefer to remove them too, the page can be deleted.

## Final deliverables

- All frontend source files are in `/home/z/my-project/frontend/src/`.
- All backend source files are unchanged in `/home/z/my-project/backend/`.
- The production build output is in `/home/z/my-project/frontend/dist/`.
- This README documents the full mapping.

The frontend now displays only real backend data, with proper loading / empty / error states on every data-driven page, and the original terracotta / cream / espresso / olive theme is preserved.

---

## Round 2 — Backend hardening, seed script, and visual polish

After the initial integration, the user asked for: (a) the 9 documented backend gaps to be addressed, (b) a seed script to bootstrap real DB data, (c) visual polish to remove the stark "first letter as thumbnail" pattern, and (d) live smoke-test verification. All four are done.

### Backend changes (with user approval)

The backend code was modified for the first time. Files touched:

1. **`backend/controllers/expoController.js`** — `createExpo` now sources `createdBy` from `req.user.id` (JWT) instead of `req.body.createdBy`. `getAllExpos` now supports optional `?page=&limit=` pagination; when neither query param is provided, it returns the full list (back-compat with the frontend). When paginated, the response shape is `{ page, limit, total, totalPages, expos }`. `updateExpo` strips `createdBy` from the body so an admin can't reassign the authorship via the update endpoint.

2. **`backend/routes/authRoutes.js`** — `POST /api/auth/register` now blocks admin self-promotion. The first admin (when zero admins exist in the DB) can self-register; afterwards, an authenticated admin can create another admin via an `Authorization: Bearer <token>` header. The `role` field is validated against the enum `['admin', 'exhibitor', 'attendee']`. `companyDetails` is now properly accepted from the body for exhibitor registrations (was hardcoded to `{}` previously).

3. **`backend/routes/messageRoutes.js`** — All three routes (`GET /`, `POST /`, `DELETE /:id`) now require `verifyToken`. Previously the entire chat subsystem was unauthenticated.

4. **`backend/controllers/extraController.js`** — Removed the duplicate `sendMessage`, `getMessages`, `submitFeedback`, and `getAllFeedbacks` handlers. The canonical paths under `/api/messages` and `/api/feedback` are what the frontend uses (and they're the ones that broadcast the corresponding Socket.io events). The `toggleSessionBookmark` handler now also defensively verifies that the body's `userId` matches `req.user.id` (defense in depth on top of the JWT check).

5. **`backend/routes/extraRoutes.js`** — Removed the duplicate routes for `/message/send`, `/messages/:user1/:user2`, `/feedback/submit`, and `/feedback/all`. Only `/exhibitors/search`, `/schedule/bookmark`, and `/admin/analytics` remain in the `extra` router.

6. **`backend/controllers/scheduleController.js`** — Added `getBookmarkedSchedules(userId)` which returns all sessions where the user's id is in `Schedule.attendees`, with the parent `expo` populated (`title, location, date, theme, description`) so the frontend can render the expo title without a second fan-out request. The handler also enforces that `req.user.id === req.params.userId` (defense in depth).

7. **`backend/routes/scheduleRoutes.js`** — Added `GET /api/schedules/bookmarked/:userId` (auth required).

8. **`backend/seed.js`** — New file (170 lines). Idempotent upsert script that creates 5 users (1 admin + 2 exhibitors + 2 attendees), 3 expos, 5 booths (mix of statuses), 6 sessions (with 4 attendee bookmarks pre-applied), 3 bookings, 3 chat messages, and 2 feedback tickets. Passwords are bcrypt-hashed (salt rounds = 10, matching the auth controller cost). Re-running the script is safe — it won't create duplicates.

9. **`backend/package.json`** — Added `"seed": "node seed.js"` script.

### Frontend changes to align with backend

1. **`src/pages/admin/ExpoManagement.jsx`** — Removed the `createdBy: user.id` from the POST body (backend now reads it from the JWT). Removed the now-unused `useAuth` import.

2. **`src/api/scheduleApi.js`** — Added `getBookmarked(userId)` method that calls the new `GET /api/schedules/bookmarked/:userId` endpoint. Documented the backend contract.

3. **`src/pages/attendee/SessionBookmarks.jsx`** — Rewrote to use the new single-request `scheduleApi.getBookmarked(user.id)` instead of the N-request fan-out (one per expo). Cleaner code, single network round-trip.

### Visual polish

1. **`src/utils/themeIcons.js`** — New helper that maps an expo's theme string to the most-relevant lucide icon (e.g. "AI" → `Cpu`, "Fashion" → `Shirt`, "Food" → `Utensils`, "Environment" → `Leaf`). 19 keyword patterns; falls back to `Sparkles` when nothing matches.

2. **`src/pages/common/LandingPage.jsx`** — The expo card thumbnails (which previously showed the expo's first letter as a serif glyph) now render a theme-aware lucide icon with a soft radial gradient wash, matching the warm terracotta/cream palette.

3. **`src/pages/common/AllExpos.jsx`** — Same theme-icon treatment for the row-view thumbnails.

### Live smoke-test results (against MongoDB Atlas)

The backend `.env` points at a real MongoDB Atlas cluster, so the smoke tests exercise actual REST round-trips. Run via a single Bash session (start server → wait for ready → run 9 curl calls → kill server):

```
1. Public list expos:      6 expos returned        ✓
2. Public list booths:     8 booths returned       ✓
3. Analytics as admin:     {totalUsers:16, totalExhibitors:3, totalAttendees:9, totalBookings:7, totalBooths:8, approvedBooths:4}   ✓
4. Analytics as attendee:  HTTP 403 "Forbidden: insufficient permissions"   ✓
5. Messages without auth:  HTTP 401 "No token provided, access denied"       ✓ (hardened)
6. Messages as attendee:   5 messages returned     ✓
7. Bookmarked sessions:     2 bookmarked sessions (single-request endpoint)   ✓
8. Register new admin:    HTTP 403 "Admin accounts can only be created..."   ✓ (bootstrap guard)
9. List feedback as admin: 3 feedback tickets      ✓
```

### Test + build verification after all changes

```
cd /home/z/my-project/frontend && npm test    →  5 files, 16/16 tests passed (3.59s)
cd /home/z/my-project/frontend && npm run build →  ✓ built in 4.59s
node --check backend/seed.js + 18 other backend files  →  all OK
```

### Remaining documented limitations

- **No file uploads** — `multer` and `cloudinary` are declared in `backend/package.json` but still not wired into any source file. Adding booth / company-logo upload support requires implementing an upload middleware + route on the backend. Not implemented in this round.
- **No dedicated `Bookmark` model** — Bookmarks still piggyback on `Schedule.attendees`. The new `/api/schedules/bookmarked/:userId` endpoint collapses the frontend fan-out, so the user-visible cost is one request now. If the schedule collection grows very large, adding a separate `Bookmark` collection or an index on `attendees` would be a good follow-up.
- **`canvas-confetti`** is still fired on successful booking in `ExpoDetails.jsx` — this is a celebratory animation on top of a real 201 response, not fake data.
- **`GalleryPage.jsx`** is still a static brand gallery. The 9 hardcoded gallery images are brand assets (not fake database records in the rule's sense), so they remain. If you want them gone, the page can be deleted in 1 line.
- **Express 5 unhandled-async-error caveat** — the controllers all wrap their bodies in `try/catch`, so this is fine for now. A future hardening pass could add a centralized `asyncHandler` wrapper.

### Run commands

```bash
# Backend
cd /home/z/my-project/backend
npm install          # if not already installed
npm run seed         # one-time: seed the DB with demo data (idempotent)
npm run dev          # nodemon app.js — listens on PORT from .env (default 3000)

# Frontend
cd /home/z/my-project/frontend
npm install          # if not already installed
npm run dev          # vite dev server on http://localhost:5173
npm run build        # production build to dist/
npm test             # vitest run — 5 test files, 16 tests, all passing
```

### Demo credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@eventsphere.com` | `admin123` |
| Exhibitor | `exhibitor@example.com` | `exhibitor123` |
| Exhibitor | `exhibitor2@example.com` | `exhibitor123` |
| Attendee | `attendee@example.com` | `attendee123` |
| Attendee | `attendee2@example.com` | `attendee123` |
