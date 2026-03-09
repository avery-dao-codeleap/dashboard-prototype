# RookPay Dashboard — With Product Management

**Date:** 2026-03-09
**Author:** Avery Dao
**Status:** Design approved — implementation planning next
**Extends:** no-product-management/docs/plans/2026-03-09-dashboard-mvp-consolidated.md
**Prototype:** `with-product-management/index.html`

---

## Overview

This document extends the Dashboard MVP design to include product management — the unified product catalog that serves both the Rook SDK (in-app purchases) and Webstore 2.0 (browser storefront). Product management was Post-MVP in the original design; this document promotes it to a tracked design track.

**New additions vs MVP:**
- Product catalog with surface flags (SDK / Webstore / Both)
- Webstore-specific product configuration (linked record)
- Xsolla sync status per product
- Segmentation Rules — two types: Show Product + MoR Routing
- Source filter on transactions (Webstore vs In-app SDK)
- All Games view fleshed out as a proper page
- Unified order/transaction ledger across both purchase surfaces

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   DASHBOARD (internal)               │
│  - Product catalog (core + webstore config)         │
│  - Segmentation Rules (webstore-only)               │
│  - Orders/Analytics (webstore + SDK unified)        │
│  - Game & MoR config, Integration workflow          │
└───────────┬────────────────────────┬────────────────┘
            │ push on save           │ push on save
            ▼                        ▼
     ┌─────────────┐        ┌──────────────────┐
     │   Xsolla    │        │  Rook Webserver  │
     │  (MoR/API)  │        │ (already built)  │
     └──────┬──────┘        └────────┬─────────┘
            │                        │
            ▼                        ▼
     ┌─────────────┐        ┌──────────────────┐
     │  Webstore   │        │   Rook SDK       │
     │ (customer-  │        │ (iOS/Android/    │
     │  facing)    │        │  Unity in-app)   │
     └──────┬──────┘        └────────┬─────────┘
            │ orders                 │ transactions
            └────────────┬───────────┘
                         ▼
              Unified Order/Transaction DB
              (source: "webstore" | "sdk")
```

---

## Updated Sidebar

### Superadmin
- Overview
- Transactions *(+ source filter)*
- Config
- Products *(active)*
- Segmentation Rules *(new)*
- — separator —
- Users / Audit Log / Settings
- — separator —
- All Games

### Game Admin
- Overview / Transactions / Config / Products / Segmentation Rules

---

## Product Catalog Design

### Core Product (shared — SDK + Webstore)
```
Product {
  id
  gameId              ← tenant scope
  name
  itemId              ← MoR/Xsolla item reference
  price               ← in cents, dashboard is source of truth
  surfaces[]          ← ["sdk"] | ["webstore"] | ["sdk", "webstore"]
  status              ← "active" | "inactive" | "draft"
  createdAt / updatedAt
}
```

### WebstoreProductConfig (only when surfaces includes "webstore")
```
WebstoreProductConfig {
  id / productId (FK)
  slug / description / images[]
  category            ← Currency / Bundles / Passes / Boosts
  isFeatured / salePrice / salePeriodStart / salePeriodEnd
  maxPerOrder / relatedProductIds[]
  segmentationRules[] ← webstore-only
  purchaseRestrictions[]
}
```

### Product Sync — One-Way Push to Xsolla
Dashboard is source of truth. On save → push to Xsolla API → update sync status (Synced / Pending / Error).

---

## Products Table Columns

SKU | Name | Type | Surface | Category | Price | Platforms | Sync | Status | [→]

**Surface badges** shown independently:
- `Webstore` — purple | `SDK` — green | Products on both show both badges

**Surface filter:** All / Webstore / SDK (Webstore filter shows webstore + both)

---

## Segmentation Rules — Two Types

### Show Product Rules
User property conditions (key/value from game backend) that control product visibility.

| Rule Name | Condition | Products Attached |
|---|---|---|
| VIP Only | `is_vip = true` | 3 products |
| Server 1 Only | `server = EU1` | 2 products |
| Returning Player | `purchase_count > 0` | 5 products |

### MoR Routing Rules
Controls which payment provider is shown at checkout based on user conditions.

| Rule Name | Condition | Provider | Priority |
|---|---|---|---|
| EU Stripe | `country IN [DE, FR, IT, ES, NL]` | Stripe | 1 |
| US Xsolla | `country = US` | Xsolla | 2 |
| Default | `*` catch-all | Xsolla | 99 |

Rules evaluated in priority order — first match wins.

---

## Unified Order Data Model

```
Order/Transaction {
  id / gameId / source ("webstore" | "sdk")
  invoiceId / userId / productId
  paymentProvider     ← "xsolla" | "stripe" | "appcharge"
  amount / currency / status / isSandbox
  customParameters (jsonb)
  paidAt / refundedAt / canceledAt / createdAt / updatedAt
}
```

---

## Open Questions (Pending Dev)

| Question | Impact |
|---|---|
| Rook Webserver vs Webstore backend — same service or separate? | Dashboard API contracts |
| Xsolla coupon support — native or pre-calculated? | Checkout flow design |
