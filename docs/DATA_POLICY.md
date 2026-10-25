# FairCare data and evidence policy

## Source of truth
- NPPES NPI Registry: provider identity and registration address only; never facility fee, network, ownership, or price proof.
- CMS hospital price transparency: hospital-published standard charges, potentially cash and payer-negotiated rates, not a guaranteed patient out-of-pocket cost.
- Hospital `cms-hpt.txt` files: the hospital's own pointer to its machine-readable standard-charge file(s). FairCare indexes the pointers, retrieval time, and file Last-Modified/size headers only. It does not parse, summarize or display prices from these files yet.
- Patient written billing confirmation: record only after explicit consent and appropriate privacy review. Do not accept identifiable medical documents in this MVP.

## Classification rules
- **Verified**: documented, dated, facility-specific written statement or primary-source record supporting the precise claim, with source URL or internal audit evidence and review date. Never use this label for NPPES alone.
- **Potential**: credible but incomplete indication of hospital outpatient billing. Explain the missing evidence.
- **Unknown**: no adequate source. This is the default.
- **Disputed/expired**: conflicting or outdated sources; show no definitive conclusion.

## Price rules
Never convert a chargemaster rate into a personalized cost. Include payer, plan, code, setting, service date, source, and timestamp with any published rate. Separately disclose professional, anesthesia, radiology interpretation and other fees when available. Never promise that absence of a published facility fee means none will be charged.

## Consumer guidance
`guidance.js` describes federal and New York rights and tools. Each statement must match a current rule, and links must point to stable official pages (or a named nonprofit source labeled as an area estimate). Re-check it whenever CMS, Medicare or New York rules change, and before public launch.

## Privacy
The initial lookup sends only facility name and ZIP to the FairCare server, which queries NPPES. The hospital price file check sends no user input; the server refreshes one shared index of hospital websites at most every 12 hours, and filtering by name happens in the browser. Avoid patient names, insurance member IDs, diagnoses, appointment dates, and uploaded bills. Review data retention, logs, hosting and regulatory requirements before accepting sensitive information.

## Launch criteria
1. Production build and automated tests pass.
2. End-to-end NPPES requests tested against real federal API responses, and each hospital system's `cms-hpt.txt` confirmed to load (domains in `server/transparency.js`).
3. Rate limits, error handling and security headers tested.
4. Human review of healthcare wording and limitations.
5. Any provider-specific fee claims independently sourced and dated.
6. Privacy policy and terms approved before public release.
