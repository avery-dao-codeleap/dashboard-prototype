# RookPay Dashboard — User Stories

**Date:** 2026-03-03
**Author:** Avery Dao
**Status:** Draft
**Audience:** Development team

---

## Roles

- **Superadmin** — keySquare/Rook internal team (Nils, Avery, ops). Full cross-game access.
- **Game Admin** — external game studio team. Scoped to their own game only.

---

## 1. Authentication

---

### US-01 — Sign in
**As a** user,
**I want to** sign in with my username and password,
**so that** I can access the dashboard.

**Acceptance Criteria:**
- Login screen is shown before any authenticated content
- Username and password fields are required
- Incorrect credentials show an inline error message
- On success, user is redirected to the Overview page
- Session persists until explicit sign-out

---

### US-02 — Show/hide password on login
**As a** user,
**I want to** toggle password visibility on the login form,
**so that** I can verify what I'm typing without retyping.

**Acceptance Criteria:**
- Password field defaults to masked (`type="password"`)
- "Show" button reveals the password (`type="text"`)
- Button label toggles between "Show" and "Hide"

---

### US-03 — Sign out
**As a** user,
**I want to** sign out from any page,
**so that** my session is ended and the next person can log in.

**Acceptance Criteria:**
- "Sign Out" is always visible in the sidebar
- Clicking it clears the session and returns to the login screen
- All in-memory state (role, selected game, environment) resets to defaults

---

## 2. Navigation & Shell

---

### US-04 — Switch environment (Sandbox / Production)
**As a** user,
**I want to** toggle between Sandbox and Production environments,
**so that** I can view test data separately from real transaction data.

**Acceptance Criteria:**
- Toggle is always visible in the top bar for both roles
- Active environment is visually highlighted
- Switching environment updates all page data (overview vitals, transactions, config) globally
- An amber warning banner is shown when Sandbox is active: "⚠ You are viewing Sandbox data — not real transactions"
- Banner is hidden when Production is active

---

### US-05 — Switch game (Superadmin)
**As a** Superadmin,
**I want to** switch between games using the top bar dropdown,
**so that** I can manage multiple games without logging out.

**Acceptance Criteria:**
- Game switcher dropdown lists all registered games
- Selected game name is shown in the button
- Switching game updates all scoped pages (Overview, Transactions, Config, Products)
- Active game is visually highlighted in the dropdown

---

### US-06 — Locked game context (Game Admin)
**As a** Game Admin,
**I want to** see my game name displayed in the top bar without a dropdown,
**so that** it's clear which game I'm managing.

**Acceptance Criteria:**
- Game switcher button is not shown for Game Admin
- A static label displays the Game Admin's assigned game name
- No other games are accessible from the UI

---

### US-07 — Role-gated sidebar
**As a** Game Admin,
**I want** the sidebar to only show pages relevant to my role,
**so that** I'm not exposed to admin-only features.

**Acceptance Criteria:**
- Game Admin sidebar: Overview, Transactions, Config, Products (Soon)
- Superadmin sidebar additionally shows: Users, Audit Log (Soon), Settings (Soon)
- Hidden items are fully removed from the DOM for Game Admin — not just visually hidden
- "Soon" items are visually disabled (reduced opacity, not clickable)

---

## 3. Overview

---

### US-08 — View revenue vitals
**As a** user,
**I want to** see key revenue metrics on the Overview page,
**so that** I can quickly assess game performance.

**Acceptance Criteria:**
- Four metric cards shown: Revenue, ARPU, Refunds, Net Revenue
- Each card shows current value and MoM delta
- Positive delta shown in green with ▲, negative in red with ▼
- Values are scoped to the selected game and environment
- Superadmin with no game selected sees aggregate across all games

---

### US-09 — View revenue chart
**As a** user,
**I want to** see a revenue-over-time chart,
**so that** I can identify trends.

**Acceptance Criteria:**
- Line chart shows Revenue (indigo) and Refunds (rose) as dual series
- X-axis shows dates within the selected date range
- Chart respects the selected game and environment context

---

### US-10 — View quick stats
**As a** user,
**I want to** see transaction summary stats alongside the chart,
**so that** I have a quick snapshot without going to the Transactions page.

**Acceptance Criteria:**
- Panel shows: Transactions (count), Unique buyers, Avg order value, Refund rate, Fees estimate, Fees saved
- Data is scoped to selected game + environment + date range

---

### US-11 — View recent transactions on Overview
**As a** user,
**I want to** see the last 5 transactions on the Overview page,
**so that** I can spot recent activity at a glance.

**Acceptance Criteria:**
- Table shows: Invoice ID, User ID, Product, Platform, Amount, Status, Date
- Each row is clickable and navigates to Transaction Detail
- Footer link "View all transactions →" navigates to the full Transactions page

---

### US-12 — Filter Overview by date range
**As a** user,
**I want to** filter the Overview by date range,
**so that** I can compare different time periods.

**Acceptance Criteria:**
- Date range selector supports: This month, Last 7 days, Last month, Custom range
- Changing the range updates vitals, chart, and quick stats simultaneously

---

## 4. Transactions

---

### US-13 — View transaction list
**As a** user,
**I want to** view a paginated list of all transactions,
**so that** I can browse and audit payment activity.

**Acceptance Criteria:**
- Table columns: Invoice ID, User ID, Product, Platform, Amount, Status, Date
- Superadmin with no game selected also sees a Game column
- Status badges: Paid (green), Refunded (rose), Cancelled (grey)
- Rows are paginated — 25 per page
- Pagination shows "Showing X–Y of N" and Prev / Next buttons
- Prev is disabled on page 1

---

### US-14 — Filter transactions
**As a** user,
**I want to** filter transactions by date range, status, and platform,
**so that** I can narrow down to relevant records.

**Acceptance Criteria:**
- Filters: Date range, Status (All / Paid / Refunded / Cancelled), Platform (All / iOS / Android)
- Filters apply simultaneously and reset pagination to page 1
- Active filter state is preserved when navigating back from detail view

---

### US-15 — Search transactions by User ID
**As a** user,
**I want to** search transactions by User ID,
**so that** I can find all purchases from a specific user.

**Acceptance Criteria:**
- Search input filters the table in real time (or on submit)
- Partial matches are supported
- No results state is shown when nothing matches

---

### US-16 — View transaction detail
**As a** user,
**I want to** view the full detail of a transaction,
**so that** I can investigate individual payments.

**Acceptance Criteria:**
- Clicking a transaction row navigates to a full detail page
- Detail page shows two cards: Transaction Details (Invoice ID, User ID, provider, method, currency, amount, paid at) and Product (SKU, name, quantity, platform, environment)
- Custom Parameters card shows key/value pairs from the order
- Timeline card shows: Created → Webhook sent (with HTTP status) → Paid/Refunded/Cancelled
- Webhook status shows ✓ 200 OK (green) or ✗ error code (red)
- "← Back to Transactions" button preserves list state (filters, page)

---

### US-17 — Export transactions as CSV
**As a** user,
**I want to** export filtered transactions as a CSV file,
**so that** I can do offline analysis.

**Acceptance Criteria:**
- "Export CSV" button opens a modal
- Modal allows: date range selection, toggle to apply current filters, fixed format (CSV)
- "Download CSV" button triggers file download
- Export respects active game + environment scope

---

## 5. Configuration

---

### US-18 — View configuration progress
**As a** user,
**I want to** see a progress tracker showing which config steps are complete,
**so that** I know what still needs to be set up.

**Acceptance Criteria:**
- Progress bar shows X/7 completed with a percentage
- Checklist items: Validation Rule, User Validation cURL, Purchase Callback, Refund Callback, Test User ID, iOS credentials, Android credentials
- Each checklist item is clickable and scrolls to the relevant field
- Completed items are visually distinguished (green checkmark)
- Progress updates in real time as fields are filled

---

### US-19 — Configure validation rule
**As a** user,
**I want to** set a JMESPath validation rule,
**so that** the SDK can evaluate user eligibility for purchases.

**Acceptance Criteria:**
- Text input accepts JMESPath expressions
- Link to jmespath.org documentation is shown
- "Save Changes" button persists the rule
- Both Superadmin and Game Admin can edit this field

---

### US-20 — Configure endpoints
**As a** user,
**I want to** configure the User Validation, Purchase Callback, and Refund Callback endpoints,
**so that** the SDK knows where to send purchase events and validations.

**Acceptance Criteria:**
- Three text inputs: User Validation cURL, Purchase Callback Endpoint, Refund Callback Endpoint
- URL format validation on save
- Endpoints are shared across platforms (iOS and Android) within the same environment
- Both Superadmin and Game Admin can edit
- "Save Changes" button persists all three at once

---

### US-21 — Test the user validation endpoint
**As a** user,
**I want to** test my User Validation endpoint directly from the dashboard,
**so that** I can confirm it's reachable before going live.

**Acceptance Criteria:**
- "Try it out" button triggers a test request against the saved cURL
- A response panel appears showing: HTTP status code (green for 2xx, red otherwise) and response body
- Response body is scrollable and has a copy button
- Button shows "Executing…" while the request is in flight and re-enables on completion

---

### US-22 — Set Test User ID
**As a** user,
**I want to** set a Test User ID,
**so that** sandbox purchases can be validated against a known test account.

**Acceptance Criteria:**
- Text input accepts any string value
- Both roles can edit
- Saved value is scoped to the selected environment

---

### US-23 — View Xsolla credentials (Game Admin)
**As a** Game Admin,
**I want to** view my Xsolla credentials in read-only mode,
**so that** I can reference them without being able to accidentally change them.

**Acceptance Criteria:**
- Login Project ID, Merchant ID, and Xsolla Project ID are visible as read-only inputs
- API Key field is not shown at all for Game Admin
- Webhook URL is visible as read-only with a copy button
- No "Save changes" button is shown on platform cards for Game Admin
- Platform inputs have a greyed-out style indicating non-editable state

---

### US-24 — Edit Xsolla credentials (Superadmin)
**As a** Superadmin,
**I want to** edit Xsolla credentials per platform per environment,
**so that** I can configure payment integration for each game.

**Acceptance Criteria:**
- Login Project ID, Merchant ID, Xsolla Project ID are editable text inputs
- API Key is masked by default with a Show/Hide toggle
- Webhook URL is always read-only (grey background, copy button only)
- Each platform card (iOS, Android) has its own "Save changes" button
- Changes are scoped to the selected game + environment

---

### US-25 — Copy Webhook URL
**As a** Superadmin,
**I want to** copy the Webhook URL to clipboard from the Config page,
**so that** I can paste it into the Xsolla dashboard.

**Acceptance Criteria:**
- Copy icon (⎘) is shown next to the Webhook URL field
- Clicking it copies the URL to the clipboard
- Visual feedback confirms the copy action

---

### US-26 — Export RookConfig.json
**As a** Superadmin,
**I want to** export the RookConfig.json files for all platform/environment combinations,
**so that** I can send the SDK configuration to the game studio.

**Acceptance Criteria:**
- "Export RookConfig.json files" button is visible on the Config page
- Clicking triggers a download of configuration files for all platform + environment combinations
- Exported files reflect the currently saved configuration values

---

### US-27 — Switch payment provider tab
**As a** Superadmin,
**I want to** switch between Xsolla and AppCharge provider tabs,
**so that** I can manage multiple payment providers for a game.

**Acceptance Criteria:**
- Provider tabs shown: Xsolla, AppCharge, + Add Provider
- AppCharge tab and + Add Provider are Superadmin only (hidden from Game Admin)
- AppCharge tab shows an empty state with a "Set up AppCharge" CTA when not configured
- Active tab is visually highlighted

---

## 6. User Management (Superadmin only)

---

### US-28 — View user list
**As a** Superadmin,
**I want to** view all dashboard users in a table,
**so that** I can manage access across the platform.

**Acceptance Criteria:**
- Table columns: Name, Username, Role, Game, Status, Created
- Role badges: Superadmin (green), Game Admin (indigo)
- Status badges: Active (green), Invited (blue)
- Game column shows "—" for Superadmin users
- Page is only accessible to Superadmin

---

### US-29 — Create a Game Admin user
**As a** Superadmin,
**I want to** create a new Game Admin user and assign them to a game,
**so that** a game studio team can access their game's dashboard.

**Acceptance Criteria:**
- "+ Create User" button opens a right slide-in drawer
- Required fields: Full name, Username, Password (with auto-generate button)
- Role selector: Game Admin / Superadmin (radio buttons)
- Game assignment field is shown and required when Game Admin is selected
- "Send invite email" checkbox (checked by default)
- "Create User" adds the user to the table with "Invited" status
- Status changes to "Active" on first login

---

### US-30 — Create a Superadmin user
**As a** Superadmin,
**I want to** create a new Superadmin user,
**so that** another internal team member can have full dashboard access.

**Acceptance Criteria:**
- Same Create User drawer as US-29
- When Superadmin role is selected, Game assignment field is hidden
- Created user has "—" in the Game column

---

## 7. Integration Workflow

---

### US-31 — Mark integration as complete (Superadmin)
**As a** Superadmin,
**I want to** mark a game's integration as complete,
**so that** the SDK config email is automatically sent to the studio.

**Acceptance Criteria:**
- "Mark as Integration Complete" button is shown when integration status is Pending
- Button is Superadmin only
- Clicking triggers the SDK config email to the game's technical contact
- Status updates to "Approved" with timestamp and approver name
- "Resend SDK Config Email" button is shown in Approved state

---

### US-32 — View integration status (Game Admin)
**As a** Game Admin,
**I want to** see the current status of my integration review,
**so that** I know when my SDK configuration will be ready.

**Acceptance Criteria:**
- Status shown as "● Approved" (green) or "○ Pending review" (amber)
- Pending state shows: "Your integration request is under review. You will receive an email with your SDK configuration once approved."
- Approved state shows: approval date and that SDK config has been sent
- Game Admin does not see internal notes or the "Mark as Integration Complete" button

---
