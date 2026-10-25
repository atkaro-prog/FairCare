# FairCare Long Island

Free, privacy-conscious pre-appointment facility-fee question generator for Nassau and Suffolk County residents.

## Current capabilities
- Mobile-responsive React interface
- Appointment form that collects no protected health information
- Live NPPES NPI Registry lookup by name and Long Island ZIP, via the FairCare server (rate-limited, cached 30 minutes, source and retrieval time shown)
- Conservative fee-risk guidance based on **user-reported** billing status; every provider's facility-fee status is shown as unknown
- Hospital price transparency file finder: reads each Long Island health system's CMS-required `cms-hpt.txt` and links to its machine-readable standard-charge files, with file type, size, last-updated date and check time (no prices are parsed or shown)
- "Get your actual number" guide: asks how the user will pay and points to the tool that gives a personal cost (insurer cost estimator, Medicare Procedure Price Lookup, Medicare Advantage or Medicaid plan, or a No Surprises Act Good Faith Estimate for self-pay). Rules and wording live in `guidance.js`.
- Copyable billing-department call script and checklist
- Links to official CMS hospital price transparency and NPPES resources

## Important limitations
NPPES records identify registered providers only. This MVP **does not** establish hospital ownership, identify verified facility fees, retrieve insurer-negotiated prices, or calculate out-of-pocket costs. It never presents example data as verified. ZIP validation is a coarse prefix check, not proof of geographic eligibility.

## Run
`npm install && npm run dev` (Vite on 5173, API on 3001)

No install needed for a quick look: open `demo.html` in a browser.

## Test
`npm test`

## Build and serve
`npm run build && npm start` serves the built app and API from one port (`PORT`, default 3001). See `docs/DEPLOY.md`.

## Next milestones
1. ~~NPPES API-backed provider search with provenance~~ (done; address disambiguation still basic).
2. ~~Hospital transparency machine-readable file index and refresh timestamps~~ (done; hospital domains in `server/transparency.js` need confirming on first live run).
3. Documented facility billing classification verification; never infer from NPI alone.
4. Transparent price provenance, separating cash, negotiated, and patient costs.
5. Privacy and security review before adding any medical or billing document uploads.

Do not publish as a verified price-comparison service until the integrations are validated.
