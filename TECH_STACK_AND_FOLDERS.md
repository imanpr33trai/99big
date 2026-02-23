# Project Map and Tech Stack

## High-Level Summary

- **Backend**: Node.js + Express (ESM), EJS templates, Socket.IO, MySQL
- **Frontend**: Mixed server-rendered EJS + **prebuilt** SPA assets (likely Vue + Vant) served from `src/public`
- **Database**: MySQL 8 (Docker Compose)
- **Tooling**: Babel runtime (`@babel/node`), nodemon

---

## Folder / File Map

### Root

- `package.json` — App metadata, scripts, dependencies
- `package-lock.json` / `yarn.lock` — Dependency lockfiles
- `docker-compose.yml` — MySQL 8 container for local dev
- `README.md` — Project notes (if any)
- `node_modules/` — Installed dependencies
- `winGoController.js` — Loose file (appears unrelated to `src/` layout)
- `addbank.ejs` — Loose EJS file (duplicate/extra copy)

### `src/`

- `src/server.js` — Express server entrypoint; routes, cron, socket.io
- `src/config/` — App config
  - `connectDB.js` — MySQL connection
  - `configEngine.js` — Express static/EJS view engine setup
  - `schema.sql` — Database schema
- `src/routes/` — Express route wiring
- `src/controllers/` — App logic/controllers (many backups/variants)
- `src/modal/` — DB setup scripts (`CreateDatabase.cjs`)
- `src/views/` — EJS templates (server‑rendered pages)
- `src/public/` — **Static assets (compiled/bundled frontend + libraries)**

### `src/views/` (EJS templates)

Server-rendered pages, split by feature:

- `views/home/` — Home page(s)
- `views/account/` — Login/register/forgot
- `views/bet/` — Game betting UI (k3, 5d, wingo)
- `views/member/` — User profile & help
- `views/wallet/` — Wallet, recharge, withdraw
- `views/promotion/` — Promotions/teams/bonus
- `views/manage/` — Admin dashboard pages
- `views/daily/` — Daily admin/reporting
- `views/partials/` — Shared components
- `views/404.ejs` — Not found
- `views/nav.ejs`, `views/keFuMenu.ejs` — Shared nav/menus

### `src/public/` (Static Assets / Compiled Frontend)

This directory looks **built/compiled** (hashed filenames, minified CSS/JS, `data-v-*` scoped styles):

- `public/index_files/` — Prebuilt SPA bundle assets (CSS/JS/images)
- `public/assets/` — Fonts & images (hashed names)
- `public/css/` — CSS for various pages (likely output of build)
- `public/js/` — Client JS for admin/game pages
- `public/plugins/` — Third‑party libs (Bootstrap, jQuery, DataTables, Font Awesome, etc.)
- `public/images/`, `public/audio/` — Static media

---

## Tech Stack (Detected)

### Backend

- **Node.js** (ESM) + **Express**
- **EJS** templates (server‑side rendering)
- **Socket.IO** (real‑time)
- **MySQL** (`mysql2`)
- **Cron** (`node-cron`)
- **Auth/Session**: `cookie-parser`, `jsonwebtoken`
- **HTTP**: `axios`, `request`
- **Utilities**: `dotenv`, `moment`, `md5`, `uuid`, `iconv-lite`, `qrcode`

### Tooling

- **Babel runtime** (`@babel/node`, `@babel/preset-env`)
- **nodemon** for dev

### Frontend (Prebuilt)

- **Vue (likely)** + **Vant UI** (based on `data-v-*` scoped CSS + `vant` assets)
- **Bootstrap**
- **jQuery**
- **DataTables** + plugins
- **Font Awesome**
- **OverlayScrollbars**

---

## Build vs Source

- **Backend**: Source code (not compiled)
- **Frontend**: Appears to be **compiled build output** only
  - No clear `src/` for Vue components is present
  - Hashed/minified assets suggest build artifacts

---

## Notes

- There are many backup/duplicate controller files in `src/controllers/` (`*_old.js`, `*2011.js`, `*.bak`).
- If you want the **original Vue source**, it’s likely missing from this repo.
