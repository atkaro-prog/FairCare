# Deployment guide (Replit, no Replit AI agent)

The code is maintained at https://github.com/atkaro-prog/FairCare.

1. In Replit, choose **Import from GitHub**, enter the repository URL, and authorize access if needed. Do not choose AI Agent / generate app.
2. Use Node.js 22 or later.
3. In the shell run `npm install`, `npm test`, and `npm run build`.
4. Set the deployment build command to `npm run build` and run command to `npm start`. Replit supplies `PORT` at runtime; the Express server binds to `0.0.0.0`.
5. Test `/api/health`, then a live provider search by name and Long Island ZIP. Confirm the UI correctly labels all facility-fee status as unknown.
6. Do not publish publicly until healthcare wording, privacy notices, and data provenance are reviewed.

Local development: `npm run dev` launches Vite and the API. Vite proxies `/api` to port 3001.

**No Replit deployment has been performed by the assistant.** The connected Replit integration does not offer direct source upload or GitHub import actions.
