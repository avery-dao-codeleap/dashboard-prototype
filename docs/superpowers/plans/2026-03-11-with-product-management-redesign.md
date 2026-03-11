# with-product-management Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `with-product-management/index.html` from a single combined Products page with surface-toggle into two fully independent tracks (SDK and Webstore), each with their own Catalog and Rules pages under a collapsible Products nav group.

**Architecture:** Single HTML file prototype — no build system, no framework. All changes are direct HTML/CSS/JS edits. The file is ~2,938 lines; tasks are scoped to specific sections. Each task produces a working, browsable intermediate state.

**Tech Stack:** Vanilla HTML, CSS, JavaScript. Open in browser to verify each task visually.

**Spec:** `docs/superpowers/specs/2026-03-11-with-product-management-redesign.md`

---

## Chunk 1: Navigation restructure

### Task 1: Replace Products + Segmentation nav items with collapsible Products group

**Files:**
- Modify: `with-product-management/index.html` (sidebar nav section, lines ~703–728)
- Modify: `with-product-management/index.html` (CSS, add collapsible nav styles, lines ~195–230)

The current sidebar has two separate buttons — `nav-products` and `nav-segmentation`. Replace both with a collapsible Products group containing four sub-items (SDK Catalog, SDK Rules, Webstore Catalog, Webstore Rules) under labeled sections.

**CSS to add** (inside the existing `<style>` block, after `.nav-item` rules):

```css
/* Products nav group */
.nav-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: var(--r-sm);
  user-select: none;
}
.nav-group-header:hover { background: var(--border-subtle); }
.nav-group-header .nav-icon { margin-right: 6px; }
.nav-group-arrow { font-size: 10px; color: var(--text-tertiary); transition: transform 0.15s; }
.nav-group.open .nav-group-arrow { transform: rotate(90deg); }
.nav-group-body { display: none; padding-bottom: 4px; }
.nav-group.open .nav-group-body { display: block; }
.nav-group-label {
  padding: 6px 10px 2px 28px;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-tertiary);
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.nav-sub-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 10px 6px 32px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}
.nav-sub-item:hover { background: var(--border-subtle); color: var(--text-primary); }
.nav-sub-item.active {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 600;
  box-shadow: inset 3px 0 0 var(--accent);
}
```

**HTML — replace** the two existing nav buttons with this group:

Find:
```html
        <button class="nav-item" onclick="navigate('products')" id="nav-products">
          <span class="nav-icon">⊞</span> Products
        </button>
        <button class="nav-item" onclick="navigate('segmentation')" id="nav-segmentation">
          <span class="nav-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          </span> Segmentation Rules
        </button>
```

Replace with:
```html
        <div class="nav-group" id="nav-group-products">
          <div class="nav-group-header" onclick="toggleProductsGroup()">
            <span><span class="nav-icon">⊞</span> Products</span>
            <span class="nav-group-arrow">▶</span>
          </div>
          <div class="nav-group-body">
            <div class="nav-group-label">SDK</div>
            <button class="nav-sub-item" onclick="navigate('sdk-catalog')" id="nav-sdk-catalog">Catalog</button>
            <button class="nav-sub-item" onclick="navigate('sdk-rules')" id="nav-sdk-rules">Rules</button>
            <div class="nav-group-label" style="margin-top:4px;">Webstore</div>
            <button class="nav-sub-item" onclick="navigate('webstore-catalog')" id="nav-webstore-catalog">Catalog</button>
            <button class="nav-sub-item" onclick="navigate('webstore-rules')" id="nav-webstore-rules">Rules</button>
          </div>
        </div>
```

**JS to add** (in the `<script>` block, near other nav functions):

```js
function toggleProductsGroup() {
  document.getElementById('nav-group-products').classList.toggle('open');
}
```

**Update `navigate()` function** — find the existing `navigate` function and add handling so any products sub-page auto-opens the group:

Find the line inside `navigate()` that sets the active nav item:
```js
    const navEl = document.getElementById('nav-' + page);
    if (navEl) navEl.classList.add('active');
```

Replace with:
```js
    const navEl = document.getElementById('nav-' + page);
    if (navEl) navEl.classList.add('active');
    // Auto-open Products group for product sub-pages
    const productPages = ['sdk-catalog', 'sdk-rules', 'webstore-catalog', 'webstore-rules'];
    if (productPages.includes(page)) {
      document.getElementById('nav-group-products').classList.add('open');
    }
```

- [ ] Make the CSS, HTML, and JS edits above
- [ ] Open `with-product-management/index.html` in browser
- [ ] Verify: Products group appears in sidebar, clicking header toggles open/closed, sub-items visible when open
- [ ] Commit:
```bash
git add with-product-management/index.html
git commit -m "nav: replace Products/Segmentation items with collapsible Products group"
```

---

### Task 2: Remove old page-products, page-product-detail, page-segmentation

**Files:**
- Modify: `with-product-management/index.html` (remove three page blocks and associated JS)

Remove the following page blocks entirely:
- `<div class="page" id="page-products">` and all its children
- `<div class="page" id="page-product-detail">` and all its children
- `<div id="page-segmentation" class="page">` and all its children

Also remove the Add Product drawer (`id="product-drawer"` and `id="product-drawer-overlay"`), as it will be replaced per-catalog in later tasks.

Remove the following JS functions that are no longer needed:
- `openProductDrawer()` / `closeProductDrawer()`
- `toggleSurface()` / `updateWebstoreFields()`
- `toggleDetailSurface()` / `toggleDetailFeatured()`
- `switchSegTab()` / `openAddRuleDrawer()`
- Variables: `selectedSurfaces`, `detailSurfaces`, `detailFeaturedOn`

Remove the CSS class `.webstore-field.hidden` (line ~591).

- [ ] Remove the three page HTML blocks
- [ ] Remove the product drawer HTML
- [ ] Remove the JS functions and variables listed above
- [ ] Remove `.webstore-field.hidden` CSS rule
- [ ] Open in browser — verify no console errors, sidebar still works for non-product pages
- [ ] Commit:
```bash
git add with-product-management/index.html
git commit -m "cleanup: remove old products, product-detail, and segmentation pages"
```

---

## Chunk 2: SDK pages

### Task 3: Add SDK Catalog page

**Files:**
- Modify: `with-product-management/index.html` — add `page-sdk-catalog` before `</main>`

Add this page block:

```html
      <!-- ─── SDK CATALOG ──────────────────────────────────── -->
      <div class="page" id="page-sdk-catalog">
        <div class="page-header">
          <div>
            <h1 class="page-title">SDK Products</h1>
            <p class="page-sub">Royal Revolt 2 · <span id="sdk-env-label">Sandbox</span></p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="openSdkProductDrawer()">+ Add Product</button>
          </div>
        </div>

        <!-- Vitals -->
        <div class="vitals" style="margin-bottom:16px;">
          <div class="vital-card">
            <div class="vital-label">Total SKUs</div>
            <div class="vital-value">6</div>
            <div class="vital-delta delta-neutral">2 platforms</div>
          </div>
          <div class="vital-card">
            <div class="vital-label">Active</div>
            <div class="vital-value">6</div>
            <div class="vital-delta delta-up">▲ 1 added last sync</div>
          </div>
          <div class="vital-card">
            <div class="vital-label">iOS SKUs</div>
            <div class="vital-value">6</div>
            <div class="vital-delta delta-neutral">No change</div>
          </div>
          <div class="vital-card">
            <div class="vital-label">Android SKUs</div>
            <div class="vital-value">5</div>
            <div class="vital-delta delta-neutral">No change</div>
          </div>
        </div>

        <!-- Provider sync status -->
        <div style="display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 14px;font-size:13px;">
            <span style="color:var(--success);font-size:10px;">●</span>
            <div>
              <div style="font-weight:600;color:var(--text-primary);">Xsolla</div>
              <div style="font-size:11px;color:var(--text-tertiary);">Last synced today · 09:14 UTC</div>
            </div>
          </div>
          <div class="sa-only" style="display:flex;align-items:center;gap:10px;background:var(--border-subtle);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 14px;font-size:13px;">
            <span style="color:var(--text-tertiary);font-size:10px;">○</span>
            <div>
              <div style="font-weight:600;color:var(--text-secondary);">AppCharge</div>
              <div style="font-size:11px;color:var(--text-tertiary);">Not configured · <span style="color:var(--accent);cursor:pointer;" onclick="navigate('config')">Set up in Config →</span></div>
            </div>
          </div>
        </div>

        <!-- Product table -->
        <div class="table-wrap">
          <div class="table-head" style="flex-wrap:wrap;gap:10px;">
            <span class="table-head-title">SDK Catalog</span>
            <div style="display:flex;gap:8px;align-items:center;margin-left:auto;">
              <select class="sel">
                <option>All platforms</option>
                <option>iOS</option>
                <option>Android</option>
              </select>
              <select class="sel">
                <option>All statuses</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div class="search-wrap">
                <span class="search-ico">🔍</span>
                <input class="search-in" type="text" placeholder="Search SKU or name…">
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>SKU</th><th>Name</th><th>Price</th><th>Platforms</th><th>Status</th><th>Sync</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr onclick="openSdkProductDrawer('gold_100')" style="cursor:pointer;">
                <td class="mono">gold_100</td>
                <td><strong>Gold Pack 100</strong></td>
                <td class="mono">$0.99</td>
                <td><span class="tag">iOS</span> <span class="tag">Android</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--success);font-size:12px;font-weight:600;">✓ Synced</span></td>
                <td class="arrow-icon">→</td>
              </tr>
              <tr onclick="openSdkProductDrawer('gold_500')" style="cursor:pointer;">
                <td class="mono">gold_500</td>
                <td><strong>Gold Pack 500</strong></td>
                <td class="mono">$4.99</td>
                <td><span class="tag">iOS</span> <span class="tag">Android</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--warning);font-size:12px;font-weight:600;">⟳ Pending</span></td>
                <td class="arrow-icon">→</td>
              </tr>
              <tr onclick="openSdkProductDrawer('gold_2000')" style="cursor:pointer;">
                <td class="mono">gold_2000</td>
                <td><strong>Gold Pack 2000</strong></td>
                <td class="mono">$19.99</td>
                <td><span class="tag">iOS</span> <span class="tag">Android</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--success);font-size:12px;font-weight:600;">✓ Synced</span></td>
                <td class="arrow-icon">→</td>
              </tr>
              <tr onclick="openSdkProductDrawer('starter_bundle')" style="cursor:pointer;">
                <td class="mono">starter_bundle</td>
                <td><strong>Starter Bundle</strong></td>
                <td class="mono">$9.99</td>
                <td><span class="tag">iOS</span> <span class="tag">Android</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--success);font-size:12px;font-weight:600;">✓ Synced</span></td>
                <td class="arrow-icon">→</td>
              </tr>
              <tr onclick="openSdkProductDrawer('royal_shield_7d')" style="cursor:pointer;">
                <td class="mono">royal_shield_7d</td>
                <td><strong>Royal Shield (7d)</strong></td>
                <td class="mono">$2.99</td>
                <td><span class="tag">iOS</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--danger);font-size:12px;font-weight:600;">✕ Error</span></td>
                <td class="arrow-icon">→</td>
              </tr>
              <tr onclick="openSdkProductDrawer('season_pass_2025')" style="cursor:pointer;">
                <td class="mono">season_pass_2025</td>
                <td><strong>Season Pass 2025</strong></td>
                <td class="mono">$24.99</td>
                <td><span class="tag">iOS</span> <span class="tag">Android</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--success);font-size:12px;font-weight:600;">✓ Synced</span></td>
                <td class="arrow-icon">→</td>
              </tr>
            </tbody>
          </table>
          <div class="pag">
            <span class="pag-meta">Showing 1–6 of 6 products</span>
            <div class="pag-controls">
              <button class="pag-btn" disabled>← Prev</button>
              <span class="pag-info">Page 1 of 1</span>
              <button class="pag-btn" disabled>Next →</button>
            </div>
          </div>
        </div>
      </div>
```

**Add SDK Product drawer** (after the closing `</div>` of the page block, before the existing Create User drawer):

```html
<!-- ═══════════════════════════════════════════════════════ -->
<!--  SDK PRODUCT DRAWER                                      -->
<!-- ═══════════════════════════════════════════════════════ -->
<div class="overlay" id="sdk-product-overlay" onclick="closeSdkProductDrawer()"></div>
<div class="drawer" id="sdk-product-drawer">
  <div class="drawer-head">
    <span class="drawer-title" id="sdk-drawer-title">Add SDK Product</span>
    <button class="drawer-close" onclick="closeSdkProductDrawer()">✕</button>
  </div>
  <div class="drawer-body">
    <div class="dfield">
      <label class="dfield-label">SKU</label>
      <input class="dfield-input" type="text" id="sdk-sku" placeholder="e.g. gold_100">
    </div>
    <div class="dfield">
      <label class="dfield-label">Name</label>
      <input class="dfield-input" type="text" id="sdk-name" placeholder="e.g. Gold Pack 100">
    </div>
    <div class="dfield">
      <label class="dfield-label">Type</label>
      <select class="sel" id="sdk-type" style="width:100%;height:38px;font-size:13px;padding:0 28px 0 12px;">
        <option value="consumable">Consumable</option>
        <option value="non-consumable">Non-consumable</option>
      </select>
    </div>
    <div class="dfield">
      <label class="dfield-label">Price (USD)</label>
      <input class="dfield-input" type="text" id="sdk-price" placeholder="e.g. 0.99">
    </div>
    <div class="dfield">
      <label class="dfield-label">Platforms</label>
      <div style="display:flex;gap:10px;margin-top:4px;">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
          <input type="checkbox" id="sdk-plat-ios" checked> iOS
        </label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
          <input type="checkbox" id="sdk-plat-android" checked> Android
        </label>
      </div>
    </div>
  </div>
  <div class="drawer-foot">
    <button class="btn btn-ghost" onclick="closeSdkProductDrawer()">Cancel</button>
    <button class="btn btn-primary" id="sdk-drawer-cta">Add Product</button>
  </div>
</div>
```

**JS to add:**

```js
// ── SDK PRODUCT DRAWER ────────────────────────────────────
function openSdkProductDrawer(sku) {
  const isEdit = !!sku;
  document.getElementById('sdk-drawer-title').textContent = isEdit ? 'Edit SDK Product' : 'Add SDK Product';
  document.getElementById('sdk-drawer-cta').textContent = isEdit ? 'Save Changes' : 'Add Product';
  document.getElementById('sdk-product-overlay').classList.add('open');
  document.getElementById('sdk-product-drawer').classList.add('open');
}
function closeSdkProductDrawer() {
  document.getElementById('sdk-product-overlay').classList.remove('open');
  document.getElementById('sdk-product-drawer').classList.remove('open');
}
```

- [ ] Add the page HTML block above `</main>`
- [ ] Add the drawer HTML after the page block
- [ ] Add the JS functions
- [ ] Navigate to SDK Catalog in browser — verify table loads, `+ Add Product` opens drawer, row click opens edit drawer with correct title
- [ ] Commit:
```bash
git add with-product-management/index.html
git commit -m "feat: add SDK Catalog page with product table and add/edit drawer"
```

---

### Task 4: Add SDK Rules page

**Files:**
- Modify: `with-product-management/index.html` — add `page-sdk-rules` after `page-sdk-catalog`

```html
      <!-- ─── SDK RULES ────────────────────────────────────── -->
      <div class="page" id="page-sdk-rules">
        <div class="page-header">
          <div>
            <h1 class="page-title">SDK Rules</h1>
            <p class="page-sub">Segmentation rules applied to SDK products</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="openSdkRuleDrawer()">+ Add Rule</button>
          </div>
        </div>

        <!-- Underline tab bar (single tab) -->
        <div style="display:flex;border-bottom:1px solid var(--border);margin-bottom:0;">
          <div style="padding:8px 16px 10px;font-size:13px;font-weight:600;color:var(--accent);border-bottom:2px solid var(--accent);margin-bottom:-1px;cursor:default;">Rules</div>
        </div>

        <div class="table-wrap" style="border-top:none;border-radius:0 0 var(--r) var(--r);">
          <table>
            <thead>
              <tr>
                <th>Rule Name</th><th>Condition</th><th>Effect</th><th>Priority</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Low value guard</strong></td>
                <td><code style="background:var(--bg);border:1px solid var(--border);padding:2px 7px;border-radius:4px;font-size:12px;font-family:var(--mono);">price &lt; $3.00</code></td>
                <td><span class="badge" style="background:#fee2e2;color:var(--danger);border:1px solid #fecaca;">Disable Rook</span></td>
                <td style="color:var(--text-tertiary);">1</td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary" style="height:28px;font-size:12px;">Edit</button>
                    <button class="btn btn-secondary" style="height:28px;font-size:12px;color:var(--danger);">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
```

**JS to add:**

```js
// ── SDK RULE DRAWER (stub) ────────────────────────────────
function openSdkRuleDrawer() {
  // stub — out of scope per spec
}
```

- [ ] Add the page HTML block after `page-sdk-catalog`
- [ ] Add the JS stub
- [ ] Navigate to SDK → Rules in browser — verify tab bar and table render correctly, `+ Add Rule` button is visible
- [ ] Commit:
```bash
git add with-product-management/index.html
git commit -m "feat: add SDK Rules page with underline tab and example rule row"
```

---

## Chunk 3: Webstore pages

### Task 5: Add Webstore Catalog page

**Files:**
- Modify: `with-product-management/index.html` — add `page-webstore-catalog` after `page-sdk-rules`

```html
      <!-- ─── WEBSTORE CATALOG ─────────────────────────────── -->
      <div class="page" id="page-webstore-catalog">
        <div class="page-header">
          <div>
            <h1 class="page-title">Webstore Products</h1>
            <p class="page-sub">Royal Revolt 2 · <span id="ws-env-label">Sandbox</span></p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="openWsProductDrawer()">+ Add Product</button>
          </div>
        </div>

        <!-- Vitals -->
        <div class="vitals" style="margin-bottom:16px;">
          <div class="vital-card">
            <div class="vital-label">Total Products</div>
            <div class="vital-value">4</div>
            <div class="vital-delta delta-neutral">No change</div>
          </div>
          <div class="vital-card">
            <div class="vital-label">Active</div>
            <div class="vital-value">4</div>
            <div class="vital-delta delta-up">▲ 1 added this week</div>
          </div>
          <div class="vital-card">
            <div class="vital-label">Featured</div>
            <div class="vital-value">2</div>
            <div class="vital-delta delta-neutral">Homepage slots</div>
          </div>
        </div>

        <!-- Provider sync status -->
        <div style="display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 14px;font-size:13px;">
            <span style="color:var(--success);font-size:10px;">●</span>
            <div>
              <div style="font-weight:600;color:var(--text-primary);">Xsolla</div>
              <div style="font-size:11px;color:var(--text-tertiary);">Last synced today · 09:14 UTC</div>
            </div>
          </div>
        </div>

        <!-- Product table -->
        <div class="table-wrap">
          <div class="table-head" style="flex-wrap:wrap;gap:10px;">
            <span class="table-head-title">Webstore Catalog</span>
            <div style="display:flex;gap:8px;align-items:center;margin-left:auto;">
              <select class="sel">
                <option>All categories</option>
                <option>Pearls</option>
                <option>Boosts</option>
                <option>Dungeons</option>
                <option>Bundles</option>
              </select>
              <select class="sel">
                <option>All statuses</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div class="search-wrap">
                <span class="search-ico">🔍</span>
                <input class="search-in" type="text" placeholder="Search SKU or name…">
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>SKU</th><th>Name</th><th>Price</th><th>Category</th><th>Status</th><th>Sync</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr onclick="openWsProductDrawer('ws_pearl_500')" style="cursor:pointer;">
                <td class="mono">ws_pearl_500</td>
                <td><strong>Pearl Pack 500</strong></td>
                <td class="mono">$4.99</td>
                <td><span class="tag">Pearls</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--success);font-size:12px;font-weight:600;">✓ Synced</span></td>
                <td class="arrow-icon">→</td>
              </tr>
              <tr onclick="openWsProductDrawer('ws_vip_bundle')" style="cursor:pointer;">
                <td class="mono">ws_vip_bundle</td>
                <td><strong>VIP Bundle ⭐</strong></td>
                <td class="mono">$14.99</td>
                <td><span class="tag">Bundles</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--success);font-size:12px;font-weight:600;">✓ Synced</span></td>
                <td class="arrow-icon">→</td>
              </tr>
              <tr onclick="openWsProductDrawer('ws_boost_7d')" style="cursor:pointer;">
                <td class="mono">ws_boost_7d</td>
                <td><strong>7-Day Boost</strong></td>
                <td class="mono">$2.99</td>
                <td><span class="tag">Boosts</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--warning);font-size:12px;font-weight:600;">⟳ Pending</span></td>
                <td class="arrow-icon">→</td>
              </tr>
              <tr onclick="openWsProductDrawer('ws_dungeon_key')" style="cursor:pointer;">
                <td class="mono">ws_dungeon_key</td>
                <td><strong>Dungeon Key Pack ⭐</strong></td>
                <td class="mono">$7.99</td>
                <td><span class="tag">Dungeons</span></td>
                <td><span class="badge badge-active">Active</span></td>
                <td><span style="color:var(--success);font-size:12px;font-weight:600;">✓ Synced</span></td>
                <td class="arrow-icon">→</td>
              </tr>
            </tbody>
          </table>
          <div class="pag">
            <span class="pag-meta">Showing 1–4 of 4 products</span>
            <div class="pag-controls">
              <button class="pag-btn" disabled>← Prev</button>
              <span class="pag-info">Page 1 of 1</span>
              <button class="pag-btn" disabled>Next →</button>
            </div>
          </div>
        </div>
      </div>
```

**Add Webstore Product drawer** (after the SDK Product drawer block):

```html
<!-- ═══════════════════════════════════════════════════════ -->
<!--  WEBSTORE PRODUCT DRAWER                                 -->
<!-- ═══════════════════════════════════════════════════════ -->
<div class="overlay" id="ws-product-overlay" onclick="closeWsProductDrawer()"></div>
<div class="drawer" id="ws-product-drawer">
  <div class="drawer-head">
    <span class="drawer-title" id="ws-drawer-title">Add Webstore Product</span>
    <button class="drawer-close" onclick="closeWsProductDrawer()">✕</button>
  </div>
  <div class="drawer-body">
    <div class="dfield">
      <label class="dfield-label">SKU</label>
      <input class="dfield-input" type="text" id="ws-sku" placeholder="e.g. ws_pearl_500">
    </div>
    <div class="dfield">
      <label class="dfield-label">Name</label>
      <input class="dfield-input" type="text" id="ws-name" placeholder="e.g. Pearl Pack 500">
    </div>
    <div class="dfield">
      <label class="dfield-label">Price (USD)</label>
      <input class="dfield-input" type="text" id="ws-price" placeholder="e.g. 4.99">
    </div>
    <div class="dfield">
      <label class="dfield-label">Category</label>
      <select class="sel" id="ws-category" style="width:100%;height:38px;font-size:13px;padding:0 28px 0 12px;">
        <option value="">Select category…</option>
        <option>Pearls</option>
        <option>Boosts</option>
        <option>Dungeons</option>
        <option>Bundles</option>
      </select>
    </div>
    <div class="dfield">
      <label class="dfield-label">Description</label>
      <textarea class="notes-area" id="ws-description" placeholder="Short description shown on the webstore…"></textarea>
    </div>
    <div class="dfield">
      <label class="dfield-label">Product Image URL</label>
      <input class="dfield-input" type="text" id="ws-image" placeholder="https://…">
    </div>
    <div class="check-row">
      <div class="checkmark" id="ws-featured-check" onclick="toggleWsFeatured()" style="background:transparent;border-color:var(--border);">&#8203;</div>
      <span class="check-lbl">Feature on webstore homepage</span>
    </div>
  </div>
  <div class="drawer-foot">
    <button class="btn btn-ghost" onclick="closeWsProductDrawer()">Cancel</button>
    <button class="btn btn-primary" id="ws-drawer-cta">Add Product</button>
  </div>
</div>
```

**JS to add:**

```js
// ── WEBSTORE PRODUCT DRAWER ───────────────────────────────
let wsFeaturedOn = false;
function openWsProductDrawer(sku) {
  const isEdit = !!sku;
  document.getElementById('ws-drawer-title').textContent = isEdit ? 'Edit Webstore Product' : 'Add Webstore Product';
  document.getElementById('ws-drawer-cta').textContent = isEdit ? 'Save Changes' : 'Add Product';
  document.getElementById('ws-product-overlay').classList.add('open');
  document.getElementById('ws-product-drawer').classList.add('open');
}
function closeWsProductDrawer() {
  document.getElementById('ws-product-overlay').classList.remove('open');
  document.getElementById('ws-product-drawer').classList.remove('open');
}
function toggleWsFeatured() {
  wsFeaturedOn = !wsFeaturedOn;
  const el = document.getElementById('ws-featured-check');
  el.style.background = wsFeaturedOn ? 'var(--accent)' : 'transparent';
  el.style.borderColor = wsFeaturedOn ? 'var(--accent)' : 'var(--border)';
  el.textContent = wsFeaturedOn ? '✓' : '\u200b';
}
```

- [ ] Add the page HTML block after `page-sdk-rules`
- [ ] Add the drawer HTML after the SDK product drawer
- [ ] Add the JS functions
- [ ] Navigate to Webstore → Catalog in browser — verify table, drawer opens for add and edit, all webstore fields present
- [ ] Commit:
```bash
git add with-product-management/index.html
git commit -m "feat: add Webstore Catalog page with product table and add/edit drawer"
```

---

### Task 6: Add Webstore Rules page

**Files:**
- Modify: `with-product-management/index.html` — add `page-webstore-rules` after `page-webstore-catalog`

```html
      <!-- ─── WEBSTORE RULES ────────────────────────────────── -->
      <div class="page" id="page-webstore-rules">
        <div class="page-header">
          <div>
            <h1 class="page-title">Webstore Rules</h1>
            <p class="page-sub">Product visibility and payment routing rules</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="openWsRuleDrawer()">+ Add Rule</button>
          </div>
        </div>

        <!-- Underline tab bar -->
        <div style="display:flex;border-bottom:1px solid var(--border);margin-bottom:0;">
          <div id="ws-tab-show" onclick="switchWsTab('show')"
            style="padding:8px 16px 10px;font-size:13px;font-weight:600;color:var(--accent);border-bottom:2px solid var(--accent);margin-bottom:-1px;cursor:pointer;">
            Show Product Rules
          </div>
          <div id="ws-tab-mor" onclick="switchWsTab('mor')"
            style="padding:8px 16px 10px;font-size:13px;color:var(--text-tertiary);cursor:pointer;">
            MoR Routing Rules
          </div>
        </div>

        <!-- Show Product Rules table -->
        <div class="table-wrap" id="ws-rules-show" style="border-top:none;border-radius:0 0 var(--r) var(--r);">
          <table>
            <thead>
              <tr><th>Rule Name</th><th>Condition</th><th>Products</th><th>Priority</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>VIP only bundle</strong></td>
                <td><code style="background:var(--bg);border:1px solid var(--border);padding:2px 7px;border-radius:4px;font-size:12px;font-family:var(--mono);">is_vip == true</code></td>
                <td><span class="tag">ws_vip_bundle</span></td>
                <td style="color:var(--text-tertiary);">1</td>
                <td><div style="display:flex;gap:6px;">
                  <button class="btn btn-secondary" style="height:28px;font-size:12px;">Edit</button>
                  <button class="btn btn-secondary" style="height:28px;font-size:12px;color:var(--danger);">Delete</button>
                </div></td>
              </tr>
              <tr>
                <td><strong>High spender unlock</strong></td>
                <td><code style="background:var(--bg);border:1px solid var(--border);padding:2px 7px;border-radius:4px;font-size:12px;font-family:var(--mono);">lifetime_spend &gt;= 50</code></td>
                <td><span class="tag">ws_dungeon_key</span> <span class="tag">ws_boost_7d</span></td>
                <td style="color:var(--text-tertiary);">2</td>
                <td><div style="display:flex;gap:6px;">
                  <button class="btn btn-secondary" style="height:28px;font-size:12px;">Edit</button>
                  <button class="btn btn-secondary" style="height:28px;font-size:12px;color:var(--danger);">Delete</button>
                </div></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MoR Routing Rules table (hidden by default) -->
        <div class="table-wrap" id="ws-rules-mor" style="display:none;border-top:none;border-radius:0 0 var(--r) var(--r);">
          <table>
            <thead>
              <tr><th>Rule Name</th><th>Condition</th><th>Provider</th><th>Priority</th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>US Xsolla</strong></td>
                <td><code style="background:var(--bg);border:1px solid var(--border);padding:2px 7px;border-radius:4px;font-size:12px;font-family:var(--mono);">country == US</code></td>
                <td><span class="badge" style="background:#eef2ff;color:var(--accent);border:1px solid #c7d2fe;">Xsolla</span></td>
                <td style="color:var(--text-tertiary);">2</td>
                <td><div style="display:flex;gap:6px;">
                  <button class="btn btn-secondary" style="height:28px;font-size:12px;">Edit</button>
                  <button class="btn btn-secondary" style="height:28px;font-size:12px;color:var(--danger);">Delete</button>
                </div></td>
              </tr>
              <tr>
                <td><strong>Default</strong></td>
                <td><code style="background:var(--bg);border:1px solid var(--border);padding:2px 7px;border-radius:4px;font-size:12px;font-family:var(--mono);">* (catch-all)</code></td>
                <td><span class="badge" style="background:#eef2ff;color:var(--accent);border:1px solid #c7d2fe;">Xsolla</span></td>
                <td style="color:var(--text-tertiary);">99</td>
                <td><div style="display:flex;gap:6px;">
                  <button class="btn btn-secondary" style="height:28px;font-size:12px;">Edit</button>
                  <button class="btn btn-secondary" style="height:28px;font-size:12px;color:var(--danger);">Delete</button>
                </div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
```

**JS to add:**

```js
// ── WEBSTORE RULES TABS ───────────────────────────────────
function switchWsTab(tab) {
  const isShow = tab === 'show';
  document.getElementById('ws-rules-show').style.display = isShow ? 'block' : 'none';
  document.getElementById('ws-rules-mor').style.display = isShow ? 'none' : 'block';
  const showEl = document.getElementById('ws-tab-show');
  const morEl = document.getElementById('ws-tab-mor');
  showEl.style.color = isShow ? 'var(--accent)' : 'var(--text-tertiary)';
  showEl.style.borderBottom = isShow ? '2px solid var(--accent)' : 'none';
  showEl.style.fontWeight = isShow ? '600' : 'normal';
  morEl.style.color = isShow ? 'var(--text-tertiary)' : 'var(--accent)';
  morEl.style.borderBottom = isShow ? 'none' : '2px solid var(--accent)';
  morEl.style.fontWeight = isShow ? 'normal' : '600';
}
function openWsRuleDrawer() {
  // stub — out of scope per spec
}
```

- [ ] Add the page HTML block after `page-webstore-catalog`
- [ ] Add the JS functions
- [ ] Navigate to Webstore → Rules in browser — verify both tabs switch correctly, tables render with example rows
- [ ] Commit:
```bash
git add with-product-management/index.html
git commit -m "feat: add Webstore Rules page with Show Product and MoR Routing tabs"
```

---

## Chunk 4: Analytics aggregation + env label sync

### Task 7: Update Overview chart legend and Transactions source filter

**Files:**
- Modify: `with-product-management/index.html` — Overview chart legend labels, Transactions source filter options

The Source filter and Source column already exist in the prototype. Two small label updates to align with the new track names.

> Note: By this point the file has been substantially restructured — use element IDs to locate sections, not line numbers.

1. Search for `id="txn-source-filter"` — confirm option labels are "All Sources", "Webstore", "In-app SDK". Update if they differ.

2. Search for `id="page-overview"` — find the recent transactions table header row and confirm a "Source" `<th>` column exists. If missing, add it after "Platform".

3. The Overview revenue chart currently shows one data series. Adding a true dual SDK/Webstore series requires real data — this is deferred. No chart changes needed in this task.

- [ ] Search for `txn-source-filter` and confirm/update option labels
- [ ] Search for the Overview transactions table and confirm the Source column header is present
- [ ] Open in browser — navigate to Overview and Transactions, verify Source column and filter render correctly
- [ ] Commit:
```bash
git add with-product-management/index.html
git commit -m "analytics: confirm source labels and column align with SDK and Webstore tracks"
```

---

### Task 8: Sync env label across new pages + push to remote

**Files:**
- Modify: `with-product-management/index.html` — env label sync in navigate() and environment toggle handler

The existing prototype syncs `#prod-env-label` when the environment toggle changes. The new pages have `#sdk-env-label` and `#ws-env-label`. Update the env sync logic to also update these.

Find the existing env toggle handler (look for `prod-env-label` references) and add:

```js
const sdkLabel = document.getElementById('sdk-env-label');
if (sdkLabel) sdkLabel.textContent = label;
const wsLabel = document.getElementById('ws-env-label');
if (wsLabel) wsLabel.textContent = label;
```

- [ ] Find the env toggle handler and add the two label updates above
- [ ] Toggle environment in browser — verify SDK Products and Webstore Products page subtitles update to "Production" / "Sandbox" correctly
- [ ] Final browser check: navigate through all pages, no console errors, all nav sub-items highlight correctly
- [ ] Commit:
```bash
git add with-product-management/index.html
git commit -m "chore: sync env labels to SDK and Webstore page subtitles"
```
- [ ] Push to remote:
```bash
git push
```
