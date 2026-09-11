# Soralyx TMS — Angular demo

A branded Angular 17 demo of the Soralyx rate-quote workspace, with a gated login.

## Run

```bash
npm install
npm start          # ng serve → http://localhost:4200
```

## Login

- **Username:** `admin`
- **Password:** `12345`

Auth is a demo only (`src/app/core/auth.service.ts`) — the credential check is
client-side and the session is kept in `sessionStorage`. Replace it with a real
auth API for anything beyond a demo. A route guard (`auth.guard.ts`) protects
`/quotes` and redirects to `/login`.

## Structure

- `src/app/login/` — split-screen login (brand panel + form).
- `src/app/quotes/` — the rate-quote workspace (rate history, carrier quotes,
  editable shipment details, pricing, dispatcher notes) plus the carrier detail
  window (`carrier-modal.component`).
- `src/app/shared/logo.component.ts` — Soralyx wordmark + sprout mark
  (recreated from the brand guide; swap in the official SVG asset when available).
- `src/styles.scss` — brand tokens (purple `#6E6FFD`, blue `#3396CD`, Roboto),
  shared button/card/chip styles.

## Branding

Follows the Soralyx Brand Guidelines: primary purple **#6E6FFD**, secondary blue
**#3396CD**, white, the purple→blue gradient for the logo/hero, and **Roboto**
(loaded from Google Fonts in `index.html`). Red is used only for negative/alert
states (cancellations, failure metrics, errors), not as a brand color.

All figures (lane, carriers, rates, deliveries) are sample data.
