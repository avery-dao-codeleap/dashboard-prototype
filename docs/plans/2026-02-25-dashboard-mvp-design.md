# RookPay Dashboard MVP — Design Document

**Date:** 2026-02-25
**Author:** Avery Dao
**Status:** Approved for implementation

---

## Overview

A centralized internal dashboard to reduce manual operational overhead for the keySquare/Rook team and game partners. Replaces manual Excel management, Python parser scripts, and email-based SDK config distribution with a structured web interface.

**Primary users:**
- **Superadmin** — keySquare/Rook team (Nils, Avery, ops). Full cross-game visibility and control.
- **Game Admin** — per-game external studio teams. Scoped to their own game only. Strict isolation: Game A cannot see Game B.

---

## Scope (MVP)

### Included
- Simple authentication (username/password, manually created)
- User management with role assignment
- Integration configuration (per game, per environment, per provider, per platform)
- Integration workflow (Pending → Approved, SDK config email)
- Transaction list, detail view, CSV export
- Overview / home with vitals and chart
- Role-based access control
- Multi-tenant isolation

### Explicitly Out of Scope (Post-MVP)
- Audit Log (designed, deprioritized)
- Product management
- Auto-sync with Xsolla
- AppCharge integration
- Custom endpoint templating
- Advanced analytics / cohorts
- CS refund tooling

---

## Visual Design Direction

- **Style:** Clean, light SaaS
- **Background:** `#f8fafc`
- **Accent:** `#4f46e5` (indigo)
- **Text:** `#1e293b`
- **Border:** `#e2e8f0`
- **Success:** `#16a34a` green
- **Warning:** `#f59e0b` amber
- **Danger:** `#dc2626` red / `#f43f5e` rose
- **Radius:** `8px` on cards
- **Typography:** Bold numeric display for vitals, regular weight for tables

---

## Layout: Global Shell

### Navigation Structure

Fixed left sidebar + top bar. Sidebar items are role-gated.

**Top bar (left to right):**
1. RookPay logo/wordmark
2. Game switcher dropdown (Superadmin sees all games; Game Admin sees only their game — no dropdown)
3. Environment toggle: `[Sandbox | Production]` — pill toggle, drives all page data globally
4. User menu (name + avatar initials) → Profile, Sign Out

**Sandbox warning banner:** Amber banner below top bar when Sandbox is active:
`⚠ You are viewing Sandbox data — not real transactions`

**Superadmin sidebar:**
- Overview
- Transactions
- Config
- Products *(greyed, "Soon" badge)*
- — separator —
- Users
- Audit Log *(deprioritized, greyed for now)*
- Settings
- — separator —
- All Games

**Game Admin sidebar:**
- Overview
- Transactions
- Config
- Products *(greyed, "Soon" badge)*

**Active nav item:** Indigo `#4f46e5` left border, `#eef2ff` background tint, bold label.

---

## Screen: Login

- Full-page centered card on `#f8fafc` background
- Fields: Username, Password (masked, with show/hide toggle)
- Single CTA: `[Sign In]`
- No self-serve registration — accounts created by Superadmin only
- "Forgot password?" → static text: "Contact your admin" — no self-reset in MVP

---

## Screen: User Management (Superadmin only)

**List view:**

| Name | Role | Game | Status |
|---|---|---|---|
| Nils Freitag | Superadmin | — | Active |
| Studio A Team | Game Admin | Pixel Odyssey | Active |
| Studio B Team | Game Admin | Dungeon Rush | Invited |

- `[+ Create User]` button top-right
- Status: `Active` (logged in at least once), `Invited` (credentials sent, not yet logged in)

**Create User drawer (right slide-in):**
- Name
- Email
- Username
- Temporary Password (with auto-generate checkbox)
- Role: `( ) Game Admin` / `( ) Superadmin`
- Assign to Game (required if Game Admin, hidden if Superadmin)
- `[Send credentials via email]` checkbox — checked by default
- Actions: `[Cancel]` / `[Create User]`

**Behaviors:**
- Role = Superadmin → hide "Assign to Game"
- Role = Game Admin → "Assign to Game" is required
- On create: user appears in table with `Invited` status
- Status → `Active` on first login

---

## Screen: Overview / Home

**Date range control:** `[This month ▾]` — options: Today, 7 days, This month, Last month, Custom range
**`[Export]`** button top-right (exports summary — not transaction CSV)

### Vitals Row (4 cards)

| Metric | Format | Delta |
|---|---|---|
| Revenue | `$284,120` | `▲ +12% MoM` green / `▼` red |
| ARPU | `$4.20` | MoM delta |
| Refunds | `$1,204` | MoM delta |
| Net Revenue | `$271,340` | MoM delta |

Card design: white bg, `1px #e2e8f0` border, `8px` radius, subtle shadow.
Positive delta: `#16a34a` + `▲`. Negative: `#dc2626` + `▼`. Neutral: `#64748b`.

### Charts Row (2/3 + 1/3 split)

**Left — Revenue over time (line chart):**
- Dual series: Revenue (indigo) + Refunds (rose)
- X-axis: dates in selected range
- Legend below chart

**Right — Quick stats panel:**
- Transactions (count)
- Unique buyers (count)
- Avg order value
- Refund rate (%)
- — separator —
- Fees estimate

### Recent Transactions table

Last 5 transactions. Columns: User ID, Product, Amount, Status, Date + `[View]` link.
Footer: `[View all transactions →]` links to Transactions section.

**Role differences:**
- Superadmin (no game selected): aggregate across all games; Game column appears
- Superadmin (game selected): scoped to that game
- Game Admin: always scoped to their game; no game column

---

## Screen: Integration Configuration

**Context:** Scoped to selected game + selected environment (from top bar).

### Provider Tabs

`[Xsolla]  [AppCharge]  [+ Add Provider]`

- `[+ Add Provider]` — Superadmin only, hidden from Game Admin

### Platform Cards (side by side)

One card per platform (iOS, Android). Each card contains:

| Field | Notes |
|---|---|
| Xsolla Project ID | Editable text input |
| API Key | Masked by default; `[show]` toggle. Superadmin edits; Game Admin sees read-only masked |
| Webhook URL | **Read-only.** Gray background `#f1f5f9`, no edit cursor. Copy icon only. |
| `[Save changes]` | Per-card save |

### Endpoints Section (shared per environment, below platform cards)

| Field | Controls |
|---|---|
| User Validation Endpoint | Text input + `[Test]` + `[Save]` |
| Purchase / Refund Callback Endpoint | Text input + `[Test]` + `[Save]` |
| Test User ID | Text input + `[Save]` |

**`[Test]` button behavior:** Sends ping, shows inline result — `✓ 200 OK` (green) or `✗ 404` (red).

### Integration Status Section

**Superadmin only.** Shown below endpoints.

**Approved state:**
```
● Approved    Jun 10, 2025    Approved by Nils Freitag
[ SDK Config sent to: studio@game.com   Jun 10, 2025  [↗] ]
[Resend SDK Config Email]
```

**Pending state (Superadmin view):**
```
○ Pending review    Submitted Jun 8, 2025

Submitted by game team:
  Validation:   https://...
  Fulfillment:  https://...
  Test User ID: user_sandbox_001
  Products:     products.json  [Download]

Internal notes (Superadmin only): [text area]

[Mark as Integration Complete]  ← triggers SDK config email automatically
```

**Pending state (Game Admin view):**
```
○ Pending review
Your integration request has been submitted and is under review.
You will receive an email with your SDK configuration once approved.
Submitted Jun 8, 2025
```

**Status badges:** `● Approved` = green pill; `○ Pending` = amber pill.

---

## Screen: Transactions

### List View

**Controls:**
- `[Export CSV]` — top right
- Filters: `[This month ▾]` / `[All statuses ▾]` / `[All platforms ▾]` / `[Search user ID... 🔍]`

**Table columns (Game Admin / scoped Superadmin):**

| Invoice ID | User ID | Product | Platform | Amount | Status | Date | |
|---|---|---|---|---|---|---|---|
| INV-00821 | user_9821 | Gold Pack 500 | iOS | $4.99 | ● Paid | Jun 14 | [→] |

**Additional column for Superadmin with no game selected:**
- Game column inserted after Invoice ID

**Status badges:**
- `● Paid` — indigo
- `● Refunded` — rose `#f43f5e`
- `● Cancelled` — gray `#94a3b8`

**Pagination:** Showing 1–25 of N. `[← Prev]` / `[Next →]`. Disable Prev on page 1.

**Row behavior:** Hover → `#f8fafc` tint, `[→]` arrow visible.

### CSV Export Modal

Small modal (not full page):
- Date range: `[start date] → [end date]`
- Apply current filters: `[✓] Yes`
- Format: CSV (fixed)
- Actions: `[Cancel]` / `[Download CSV]`

### Transaction Detail View

Full page (not drawer — field density warrants full page).
Header: `[← Back to Transactions]` + Invoice ID + Status badge.

**Two-column layout:**

Left card — Transaction Details:
- Invoice ID, User ID, Payment provider, Payment method, Currency, Amount, Paid at

Right card — Product:
- SKU, Name, Quantity, Platform, Environment

**Custom Parameters panel** (full width):
- Key/value table from `jsonb custom_parameters`
- Collapsed if >3 keys, `[show all]` expands

**Timeline panel** (full width):
- Chronological events: Created, Webhook sent (with HTTP status), Paid / Refunded / Cancelled
- Webhook status: `✓ 200 OK` green or `✗ 5xx` red

**Refund Details panel** (only shown for Refunded transactions):
- Refunded at, Reason

---

## Role-Based Access Summary

| Feature | Superadmin | Game Admin |
|---|---|---|
| See all games | ✅ | ❌ (own game only) |
| Game switcher dropdown | ✅ | ❌ |
| Edit API keys | ✅ | ❌ (read-only masked) |
| Add payment providers | ✅ | ❌ |
| Mark integration complete | ✅ | ❌ |
| View integration status | ✅ | ✅ (limited view) |
| Edit endpoints | ✅ | ✅ |
| View transactions | ✅ (all games or scoped) | ✅ (own game only) |
| Export CSV | ✅ | ✅ |
| User management | ✅ | ❌ |
| Audit Log | ✅ (deprioritized) | ❌ |

---

## Data Model Reference

```sql
orders {
  id PK
  app_id FK
  invoice_id
  payment_provider
  user_id
  product_sku
  product_quantity
  currency_code
  total_amount_net
  payment_method
  is_sandbox
  latest_status
  jsonb custom_parameters
  paid_at
  refunded_at
  canceled_at
  refund_reason
  created_at
  updated_at
}
```

---

## Post-MVP Notes

- Audit Log: designed (see session notes), deprioritized — add in next iteration
- Product management: designed in spec doc, not in MVP wireframes
- Custom endpoint templating: `{{userId}}`, `{{customParam.X}}`, `{{platform}}` — requires backend support
- AppCharge provider: `[+ Add Provider]` placeholder already in Config UI
- Auto-sync with Xsolla: manual sync only in MVP
