# FairCare Long Island

Free, privacy-conscious pre-appointment facility-fee question generator for Nassau and Suffolk County residents.

## Current capabilities
- Mobile-responsive React interface
- Local-only appointment form (no backend or protected health information collection)
- Conservative fee-risk guidance based on **user-reported** billing status
- Copyable billing-department call script and checklist
- Links to official CMS hospital price transparency and NPPES resources

## Important limitations
This MVP **does not yet query provider databases**, establish hospital ownership, identify verified facility fees, retrieve insurer-negotiated prices, or calculate out-of-pocket costs. It never presents example data as verified. ZIP validation is a coarse prefix check, not proof of geographic eligibility.

## Run
`npm install && npm run dev`

## Build
`npm run build`

## Next milestones
1. NPPES API-backed provider search with address disambiguation and provenance.
2. Hospital transparency machine-readable file index and refresh timestamps.
3. Documented facility billing classification verification; never infer from NPI alone.
4. Transparent price provenance, separating cash, negotiated, and patient costs.
5. Privacy and security review before adding any medical or billing document uploads.

Do not publish as a verified price-comparison service until the integrations are validated.
