# RookPay Dashboard MVP — Consolidated Design

**Date:** 2026-03-09
**Author:** Avery Dao
**Status:** Approved for implementation
**Consolidates:** dashboard-mvp-design (2026-02-25) + game-admin-role-view (2026-03-02)

---

## Overview

A centralized internal dashboard to reduce manual operational overhead for the keySquare/Rook team and game partners. Replaces manual Excel management, Python parser scripts, and email-based SDK config distribution with a structured web interface.

**Primary users:**
- **Superadmin** — keySquare/Rook team (Nils, Avery, ops). Full cross-game visibility and control.
- **Game Admin** — per-game external studio teams. Scoped to their own game only. Strict isolation: Game A cannot see Game B.

---

## MVP Scope

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
- Product management (see `dashboard-with-product-management.md`)
- Auto-sync with Xsolla
- AppCharge integration
- Custom endpoint templating
- Advanced analytics / cohorts
- CS refund tooling

---

## Visual Design

- **Style:** Clean, light SaaS
- **Background:** `#f8fafc`
- **Accent:** `#4f46e5` (indigo)
- **Text:** `#1e293b`
- **Border:** `#e2e8f0`
- **Success:** `#16a34a` green | **Warning:** `#f59e0b` amber | **Danger:** `#dc2626` red
- **Radius:** `8px` on cards
- **Typography:** Bold numeric display for vitals, regular weight for tables

---

## Layout: Global Shell

Fixed left sidebar + top bar. Sidebar items are role-gated.

**Top bar (left to right):**
1. RookPay logo/wordmark
2. Game switcher dropdown (Superadmin only; Game Admin sees static game label)
3. Environment toggle: `[Sandbox | Production]` — drives all page data globally
4. User menu (name + avatar initials) → Profile, Sign Out

**Sandbox warning banner:** Amber banner below top bar when Sandbox is active.

---

## Role-Based Sidebar

### Superadmin sidebar
- Overview
- Transactions
- Config
- Products *(greyed, "Soon" badge)*
- — separator —
- Users
- Audit Log *(deprioritized, greyed)*
- Settings
- — separator —
- All Games

### Game Admin sidebar
- Overview
- Transactions
- Config
- Products *(greyed, "Soon" badge)*

**Active nav item:** Indigo `#4f46e5` left border, `#eef2ff` background tint, bold label.

---

## Role-Based Access Summary

| Feature | Superadmin | Game Admin |
|---|---|---|
| See all games | ✅ | ❌ (own game only) |
| Game switcher dropdown | ✅ | ❌ (static label) |
| Edit API keys | ✅ | ❌ (read-only masked) |
| Add payment providers | ✅ | ❌ |
| Mark integration complete | ✅ | ❌ |
| View integration status | ✅ | ✅ (limited view) |
| Edit endpoints | ✅ | ✅ |
| View transactions | ✅ (all games or scoped) | ✅ (own game only) |
| Export CSV | ✅ | ✅ |
| User management | ✅ | ❌ |
| Audit Log | ✅ (deprioritized) | ❌ |
| All Games view | ✅ | ❌ |
| AppCharge tab | ✅ | ❌ |
| Save provider config | ✅ | ❌ |

---

## Role Implementation (JS/CSS)

**Role detection on login:**

| Username contains | Logged in as | Role |
|---|---|---|
| `nils`, anything else | Nils Freitag / Avery Dao | Superadmin |
| `rr2`, `royalrevolt`, `rr2team` | Royal Revolt 2 Team | Game Admin |
| `smurf` | Smurf Village Team | Game Admin |
| `emhq` | EMHQ Team | Game Admin |
| `warofnations`, `wow` | War of Nations Team | Game Admin |
| `kitchen` | Kitchen Scramble Team | Game Admin |

**CSS implementation:**
```css
#app-shell[data-role="gameadmin"] .sa-only { display: none !important; }
#app-shell[data-role="gameadmin"] .api-key-toggle { display: none; }
#app-shell[data-role="gameadmin"] .api-key-input {
  background: var(--border-subtle); color: var(--text-tertiary); cursor: not-allowed;
}
#game-label-static { display: none; }
#app-shell[data-role="gameadmin"] #game-label-static { display: flex; align-items: center; gap: 6px; }
```

**Login demo hint:** `avery` = Superadmin · `rr2team` = Game Admin

---

## Screen: Login

- Full-page centered card
- Fields: Username, Password (masked, show/hide toggle)
- Single CTA: `[Sign In]`
- No self-serve registration — accounts created by Superadmin only
- "Forgot password?" → "Contact your admin" (no self-reset in MVP)

---

## Screen: Overview / Home

**Date range:** `[This month ▾]` — Today / 7 days / This month / Last month / Custom range

### Vitals Row (4 cards)
| Metric | Format | Delta |
|---|---|---|
| Revenue | `$284,120` | `▲ +12% MoM` |
| ARPU | `$4.20` | MoM delta |
| Refunds | `$1,204` | MoM delta |
| Net Revenue | `$271,340` | MoM delta |

### Charts Row (2/3 + 1/3)
- **Left:** Revenue over time — dual series: Revenue (indigo) + Refunds (rose)
- **Right:** Quick stats — Transactions, Unique buyers, Avg order, Refund rate, Fees estimate, Fees saved

### Recent Transactions
Last 5 rows. Footer: `[View all transactions →]`

**Role differences:**
- Superadmin (no game selected): aggregate across all games, Game column shown
- Superadmin (game selected): scoped to that game
- Game Admin: always scoped to their game, no game column

---

## Screen: Transactions

**Filters:** Date range / Status (All/Paid/Refunded/Cancelled) / Platform (All/iOS/Android) / Search user ID

**Table columns (game-scoped):**
Invoice ID | User ID | Product | Platform | Amount | Status | Date | [→]

**Additional column for Superadmin with no game selected:** Game (after Invoice ID)

**Status badges:** Paid (green) · Refunded (rose) · Cancelled (gray) · Pending (amber)

**Pagination:** 25 per page. Showing X–Y of N. Prev / Next.

### CSV Export Modal
- Date range, apply current filters toggle, fixed CSV format
- `[Cancel]` / `[Download CSV]`

### Transaction Detail
Full page. Header: `[← Back]` + Invoice ID + Status badge.

**Two-column:**
- Left: Invoice ID, User ID, Provider, Payment method, Currency, Amount, Paid at
- Right: SKU, Name, Quantity, Platform, Environment

**Custom Parameters panel** — key/value from `jsonb custom_parameters`

**Timeline panel** — Created → Webhook sent (✓ 200 OK or ✗ error) → Paid/Refunded/Cancelled

**Refund Details panel** — shown only for Refunded transactions

---

## Screen: Integration Configuration

Context: scoped to selected game + environment.

### Provider Tabs
`[Xsolla]  [AppCharge]  [+ Add Provider]` — AppCharge and + Add Provider are Superadmin only.

### Platform Cards (iOS / Android)

| Field | Superadmin | Game Admin |
|---|---|---|
| Xsolla Project ID | Editable | Read-only |
| Login Project ID | Editable | Read-only |
| API Key | Masked, show/hide toggle | Hidden |
| Merchant | Editable | Read-only |
| Webhook URL | Read-only, copy icon | Hidden |
| Save changes button | Shown | Hidden |

### Endpoints Section

| Field | Editable By |
|---|---|
| User Validation Endpoint + `[Test]` | Both |
| Purchase Callback Endpoint | Both |
| Refund Callback Endpoint | Both |
| Test User ID | Both |

`[Test]` shows inline: `✓ 200 OK` (green) or `✗ 404` (red)

### Integration Status (Superadmin only)

**Approved state:**
```
● Approved    Jun 10, 2025    Approved by Nils Freitag
SDK Config sent to: studio@game.com   Jun 10, 2025
[Resend SDK Config Email]
```

**Pending state (Superadmin):**
```
○ Pending review    Submitted Jun 8, 2025
Submitted by game team: validation URL, fulfillment URL, test user ID, products.json
Internal notes: [text area]
[Mark as Integration Complete]  ← triggers SDK config email
```

**Pending state (Game Admin):**
```
○ Pending review
Your integration request is under review. You will receive an email once approved.
```

### Config Progress Tracker
7-item checklist: Validation Rule, User Validation cURL, Purchase Callback, Refund Callback, Test User ID, iOS credentials, Android credentials. Real-time progress bar.

### RookConfig.json Export (Superadmin only)
Exports 4 files: iOS-Sandbox, iOS-Production, Android-Sandbox, Android-Production.

---

## Screen: User Management (Superadmin only)

**Table columns:** Name | Username | Role | Game | Status | Created

**Status:** `Active` (logged in once) · `Invited` (credentials sent, not logged in)

**Create User drawer:**
- Full name, Username, Password (auto-generate button)
- Role: Game Admin / Superadmin (radio)
- Assign to Game (required for Game Admin, hidden for Superadmin)
- `[Send invite email]` checkbox (default: checked)
- `[Create User]` → user appears with Invited status

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
