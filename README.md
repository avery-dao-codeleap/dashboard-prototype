# Dashboard Prototype

HTML prototypes for the Rook dashboard — the developer-facing portal for managing in-app purchases, transactions, users, and product catalog across iOS and Android.

## Structure

```
├── with-product-management/
│   └── index.html          # Full dashboard — includes product management
├── no-product-management/
│   └── index.html          # Read-only variant — SDK-side product catalog only
├── index-final.html        # Legacy prototype (superseded by above)
└── docs/
    └── plans/              # Meeting notes and planning docs
```

## Variants

### `with-product-management`
The full dashboard for super admins and game admins with write access. Includes:

- **Overview** — transaction vitals with source tracking (Webstore / In-app SDK)
- **Transactions** — filterable by date, status, platform, and source channel
- **Products** — full product catalog with surface (Webstore/SDK), sync status, and product detail view
- **Segmentation Rules** — product visibility and MoR routing rules per game
- **Purchase Condition** — data model importer and condition builder (field / operator / value)
- **Configuration** — app credentials, validation rules, provider setup (Xsolla, AppCharge)
- **Users** — team access management with role assignment
- **All Games Overview** — super admin multi-game view

### `no-product-management`
Read-only variant for SDK-side use. Product catalog shows consumable and non-consumable SKUs only — no subscriptions, no type column, no add/edit actions.

- Same Overview, Transactions, Config, and Users pages
- Products page is read-only (no Add Product, no Type column, no subscription SKUs)

## Roles

| Role | Access |
|---|---|
| Super Admin | All pages including Users and All Games |
| Game Admin | Overview, Transactions, Products, Config |

Role-gated UI uses the `.sa-only` CSS class to show/hide super admin sections.
