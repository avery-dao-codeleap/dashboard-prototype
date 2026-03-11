# with-product-management Redesign
**Date:** 2026-03-11
**Status:** Approved for implementation

---

## Context

The current `with-product-management/index.html` uses a single Products page with a surface-toggle (SDK / Webstore) to show one combined catalog. Based on client clarification, SDK and Webstore product management have separate backends, separate sync targets, and meaningfully different product fields. This design separates them into two independent tracks.

Key client decisions captured in `Clarifying Questions.md`:
- Products should be separated by use case, not one unified type
- SDK products and Webstore products will frequently differ — Webstore primarily sells custom products
- SDK catalog syncs to Xsolla and AppCharge (dashboard is source of truth, pushes outward)
- Webstore catalog also syncs to Xsolla; Stripe is payment gateway only (no product sync needed)
- Segmentation rules exist for both tracks but serve different purposes — each track owns its own rules

---

## Navigation

One collapsible **Products** group with SDK and Webstore as labeled sections:

```
Products ▾
  ── SDK ──────────────
  Catalog
  Rules
  ── Webstore ─────────
  Catalog
  Rules
```

Active sub-item keeps the Products group expanded. Section labels (SDK / Webstore) are non-clickable dividers, styled as small uppercase labels.

---

## Pages

### SDK Catalog (`page-sdk-catalog`)

- **Header:** "SDK Products" + `+ Add Product` button
- **Vitals row:** Total SKUs · Active · iOS SKUs · Android SKUs
- **Provider sync bar:** Xsolla (synced) · AppCharge (not configured)
- **Table columns:** SKU · Name · Price · Platform · Status · Sync · →
  - Sync: single column showing combined state (`✓ Synced` / `⟳ Pending` / `✕ Error`)
- **Filters:** Platform · Status · Search
- **Add/Edit drawer:** SKU, Name, Type (Consumable / Non-consumable), Price, Platform(s)
  - Clicking `→` on a row opens the drawer pre-filled for editing — no separate detail page

### SDK Rules (`page-sdk-rules`)

- **Header:** "SDK Rules" + `+ Add Rule` button
- **Tab bar:** Single underline tab — "Rules"
- **Table columns:** Rule Name · Condition · Effect · Priority · Edit / Delete
- **Example rule:** `price < $3.00` → Disable Rook (priority 1)
- **Add Rule drawer:** Name, Condition (field / operator / value), Effect, Priority

### Webstore Catalog (`page-webstore-catalog`)

- **Header:** "Webstore Products" + `+ Add Product` button
- **Vitals row:** Total Products · Active · Featured
- **Provider sync bar:** Xsolla (synced)
- **Table columns:** SKU · Name · Price · Category · Status · Sync · →
- **Filters:** Category · Status · Search
- **Add/Edit drawer:** SKU, Name, Price, Category, Description, Image URL, Featured toggle
  - Clicking `→` opens drawer pre-filled for editing

### Webstore Rules (`page-webstore-rules`)

- **Header:** "Webstore Rules" + `+ Add Rule` button
- **Tab bar:** Underline tabs — "Show Product Rules" | "MoR Routing Rules"
- **Show Product Rules table:** Rule Name · Condition · Products · Priority · Edit / Delete
  - Conditions reference user properties (e.g. `is_vip == true`)
- **MoR Routing Rules table:** Rule Name · Condition · Provider · Priority · Edit / Delete
  - Example: `country == US` → Xsolla (priority 1)

---

## Overview & Transactions (aggregated analytics)

Both SDK and Webstore transactions feed into the same analytics views.

### Overview page
- Vitals (Revenue, ARPU, Refunds, Net Revenue) aggregate across both backends
- Revenue chart: dual series — SDK line + Webstore line (same indigo/rose color scheme, differentiated by opacity or dash)
- Recent Transactions table: includes Source column (SDK / Webstore) — already in prototype

### Transactions page
- Source filter dropdown already exists — keep it (`All Sources` / `Webstore` / `In-app SDK`)
- Source column in table — already in prototype
- Aggregated pagination count covers both sources

---

## What Gets Removed

| Removed | Replaced by |
|---|---|
| `page-products` (surface-toggle combined catalog) | `page-sdk-catalog` + `page-webstore-catalog` |
| `page-product-detail` (shared detail page) | Inline edit drawer on each catalog |
| `page-segmentation` (top-level) | `page-sdk-rules` + `page-webstore-rules` under Products group |
| Purchase Condition page + JS | Already removed |
| Surface-toggle JS + `.webstore-field` CSS | Replaced by separate pages |

---

## Out of Scope (this iteration)

- Webstore user segmentation state machine (complex, deferred — see `Clarifying Questions.md`)
- AppCharge integration for Webstore
- Subscription products (removed from SDK catalog in no-PM track; not applicable to Webstore)
- Port / copy products between SDK and Webstore catalogs (QoL feature, future)
