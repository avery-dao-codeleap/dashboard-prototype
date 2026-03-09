# Webstore Present State → Future State

**Date:** 2026-03-03
**Source:** Meeting notes — Nils presented

---

## Short Summary

Nils presented the legacy webstore prototype (WordPress + WooCommerce + Xsolla integration) and explained current flows: user accounts, product pages, checkout via Xsolla, and product synchronization. The team discussed authentication complexities (per-game vs global accounts), product visibility rules using user properties (rudimentary state machine), staging and Figma access, and next steps toward defining an MVP and staging/testing setup.

---

## Key Decisions

- **Maintain per-game webstore accounts for now.** The legacy stores use one account per game rather than a global account; the team will keep this approach for the initial rebuild but agreed to revisit global-account feasibility later.
- **MVP must match current store feature depth.** The first version of the new webstore must be at least equal in feature depth to the current legacy stores (users, products, purchases, order handling, basic segmentation) so operations teams will accept migration.
- **Rook to own webstore linking and integration.** Rook will take ownership of how games link to the webstore (handling SDK links and URL params) and own the information passed between game and webstore.

---

## Discussion

### Overview of current legacy webstores and prototype

- Nils demoed a prototype webstore (Wolf Nations and Royal Revolt examples).
- Simplified e-commerce flow: user registration, product pages (image/title/price/static text), cart, checkout via Xsolla (external flow), and postback on completion.
- Prototype is running but fragile and contains credentials in code; not production-grade — must be rebuilt for scalability and security.

---

### Authentication and user identity

- Two account creation flows:
  1. User registers directly on the webstore (hard to link to game account)
  2. Game links with a user ID parameter to prefill/sync and skip manual steps
- Current implementation creates separate web accounts per store; the webstore stores the game user ID as a property and calls verification endpoints to fetch/update game user data.
- **Global vs per-game accounts:** Initially decided per-game due to low payoff and lack of consistent global user IDs across games. Nils recommended revisiting this when building the foundation to allow future consolidation if useful.

---

### User/product synchronization and segmentation (state machine)

- Prototype implements a rudimentary state-machine/condition system: user properties (pulled from game via validation endpoint) can be added as keys and used in product visibility/purchase conditions (`if` statements).
  - Example: show product only if `is_vip == true`
- Validation also occurs at checkout to prevent unauthorized purchases.
- Current implementation is manual and brittle; Nils highlighted the value of a robust, flexible state machine for future product/user logic.

---

### Game-specific complexities (War of Nations example)

- War of Nations uses constructed, platform-prefixed user IDs (iOS/Android) and per-world/player IDs — this created complexity in identity mapping and product visibility per world/server.
- Need for flexible mechanisms to accept varied ID formats and custom parameters per game.

---

### Integration with payment providers and merchant independence

- Legacy stores are tightly coupled to Xsolla; product sync uses SKU as identifier to create/update products via Xsolla API.
- **Planned USP:** The new webstore should be independent of a single merchant of record and support multiple payment providers (Xsolla, AppCharge, Stripe, etc.), enabling choice by studio and potential fee competition.

---

### Technical stack, security, and staging

- Current prototype: WordPress + WooCommerce with a Phoenix/Xsolla plugin; code contains credentials — needs a secure, maintainable rewrite.
- Staging sites available; team agreed they need independent staging environments to test flows and SDK linking.
- Need for a properly provisioned staging project with separate Xsolla credentials for sandbox/live switching.

---

### Design and UI resources

- Extensive but outdated Figma designs exist for the legacy stores (all screens mobile + desktop). Nils offered access but warned designs are old references, not final constraints.
- UI/UX topics to resolve: single vs per-game design, references/inspirations for visual direction, and page-level requirements.

---

### Scope and roadmap considerations

- Nils expects ~90% of the MVP scope to be features already present in the legacy stores (users, products, purchase flow, basic segmentation).
- Performance (page speed, responsiveness) and look & feel are key selling points.
- Longer-term possibilities: deeper economy integrations (auctions, bidding) and advanced commerce experiences beyond direct purchases.

---

## Action Items

| Owner | Action | Due |
|---|---|---|
| Nils | Provide staging URLs; upgrade test users to admin after account creation | Immediate |
| Nils | Share Figma links and invite team to design boards | ASAP |
| Stefan (ops) | Set up dedicated staging environment; summarize config in Slack | ASAP |
| Ty / Team | Explore staging site, create test accounts, compile draft MVP feature list | Before next meeting |
| Avery / Ty / Linh | Collect external webstore references and explain relevance (technical + UI targets) | Before next planning session |
| Nils / Rook team | Reassess global vs per-game account decision during foundation design | Architecture planning phase |

---

## Next Steps

- Team to gain access to staging environments and Figma (Nils to provide; Stefan to confirm staging setup)
- Nils will upgrade test users to admin once accounts are created
- Team will explore staging, create test accounts, and document feature candidates for MVP list
- Follow-up meeting to: review staging findings, prioritize MVP features, break down technical tasks
- **Dependencies:** staging URLs, valid test user IDs from game teams, clarified UI/UX references
