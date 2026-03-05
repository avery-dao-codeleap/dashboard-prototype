# Game Admin Role View — Implementation Plan

**Date:** 2026-03-02
**Author:** Avery Dao
**Status:** Approved for implementation

---

## Context

The prototype (`index-revised.html`) currently only shows the superadmin experience (Avery/Nils). To present the full picture to Nils and game studio partners, the prototype needs to also demonstrate what a Game Admin (game studio team member) sees — a restricted, game-scoped view.

Per the MVP design doc, Game Admins have:
- No cross-game access (no game switcher)
- No user management
- Read-only API keys in Config
- No payment provider management
- Limited Config page (no Save on provider cards)

---

## File

`/Users/averydao/DashboardMockup/index-revised.html`

---

## Implementation Steps

### 1. Add role state variables (JS)
At top of `<script>`, add:
```js
let currentRole = 'superadmin';
let currentGameName = 'Royal Revolt 2';
```

### 2. Update `doLogin()` — role detection
Detect Game Admin by username pattern after the existing "nils" check:

| Username contains | Logged in as | Role |
|---|---|---|
| `nils` | Nils Freitag | Superadmin |
| `rr2`, `royalrevolt` | Royal Revolt 2 Team | Game Admin |
| `smurf` | Smurf Village Team | Game Admin |
| `emhq` | EMHQ Team | Game Admin |
| `warofnations`, `wow` | War of Nations Team | Game Admin |
| `kitchen` | Kitchen Scramble Team | Game Admin |
| anything else | Avery Dao | Superadmin |

Call `applyRoleUI()` at the end of login.

### 3. Add `applyRoleUI()` function
- Sets `data-role` on `#app-shell` (drives CSS visibility)
- For game admin: sets static game label text, makes API key inputs `readonly`
- For superadmin: removes `readonly` from API key inputs

### 4. Update `doLogout()` — reset role
Reset `currentRole = 'superadmin'` and call `applyRoleUI()`.

### 5. CSS additions
```css
#app-shell[data-role="gameadmin"] .sa-only { display: none !important; }
#app-shell[data-role="gameadmin"] #game-sw-btn { pointer-events: none; cursor: default; }
#app-shell[data-role="gameadmin"] #game-sw-btn .game-sw-chevron { display: none; }
#app-shell[data-role="gameadmin"] .api-key-toggle { display: none; }
#app-shell[data-role="gameadmin"] .api-key-input { background: var(--border-subtle); color: var(--text-tertiary); cursor: not-allowed; }
#game-label-static { display: none; font-size: 13px; font-weight: 600; }
#app-shell[data-role="gameadmin"] #game-label-static { display: flex; align-items: center; gap: 6px; }
```

### 6. HTML: Sidebar — mark SA-only items
Add `sa-only` class to:
- `nav-users` nav item
- Audit Log nav item
- Settings nav item
- Divider + All Games nav item in bottom section

### 7. HTML: Top bar
Add `<span id="game-label-static"></span>` adjacent to the game switcher button.

### 8. HTML: Config page — SA-only elements
Add `sa-only` class to:
- Save buttons on Xsolla iOS and Android platform cards
- AppCharge tab (provider management is SA-only)
- Show/hide toggles on API key fields → also add class `api-key-toggle`

Add class `api-key-input` to the API key `<input>` fields.

### 9. Login demo hint
Add subtle caption below login button:
> Demo: `avery` = Superadmin · `rr2team` = Game Admin

---

## Role Differences Summary

| Feature | Superadmin | Game Admin |
|---|---|---|
| Game switcher dropdown | ✅ | ❌ (static label) |
| Users page | ✅ | ❌ (hidden) |
| Audit Log | ✅ | ❌ (hidden) |
| Settings | ✅ | ❌ (hidden) |
| All Games nav | ✅ | ❌ (hidden) |
| Edit API keys | ✅ | ❌ (read-only masked) |
| Save provider config | ✅ | ❌ (button hidden) |
| AppCharge tab | ✅ | ❌ (hidden) |
| Edit endpoints | ✅ | ✅ |
| View transactions | ✅ | ✅ (own game) |
| Export CSV | ✅ | ✅ |
| Config progress tracker | ✅ | ✅ |

---

## Verification

1. Open `index-revised.html` in browser
2. Login as `avery` → full superadmin view (all sidebar items, game switcher, editable API keys)
3. Logout → login as `rr2team` → Game Admin view:
   - Sidebar: Users, Audit Log, Settings, All Games hidden
   - Top bar: "Royal Revolt 2" static label, no dropdown
   - Config: API key inputs gray/read-only, show/hide toggles gone, Save buttons on platform cards hidden
4. Environment toggle still works in both roles
5. Overview, Transactions, Transaction Detail still fully functional for game admin
6. Logout resets to superadmin defaults
