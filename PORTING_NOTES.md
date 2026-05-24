# Core UI Upgrades Completed

## Cleaned Recruitment Visuals
- Removed the redundant **Recruitment Pipeline** list widget from `DebtSplitRadial`, keeping the Momentum Ledger (Monthly payment inflows) full-width.

## Added Contact Details (Mobile + Email)
Integrated `mobile` and `email` across:
- Database model: `src/types.ts`
- Google Sheets sync schema + serialization: `apps-script/Code.gs`
- Create/edit flows: `src/components/directory/AddDebtorModal.tsx`, `src/components/directory/EditDebtorModal.tsx`
- Directory + profile views: `src/components/directory/DirectoryView.tsx`, `src/components/details/PersonDetailView.tsx`

## Notes for Google Sheets
If you already have a deployed Apps Script + existing sheet:
- Ensure the **People** sheet header row includes `mobile` and `email` (new columns at the end).
- After updating `apps-script/Code.gs`, re-deploy the Web App so your deployed endpoint serves the new schema.

# FAQ

## 1) Where the deployed app data is stored
DebtFlow stores data in two ways:
- **Local browser storage**: when Sheets sync is not configured, entries are cached locally in the browser (via local keys + state hydration).
- **Connected Google Sheet**: when `VITE_SHEETS_WEB_APP_URL` is configured, write operations are sent to your Apps Script Web App which updates spreadsheet tabs (e.g. **People**, **Transactions**, **Workflow**).

## 2) How to import existing code into Google AI Studio
- **Drag-and-drop**: drop files/folders into the file explorer in AI Studio.
- **Git integration**: connect the repo and sync changes.
- **Environment properties**: set `VITE_SHEETS_WEB_APP_URL` and `VITE_SHEETS_API_TOKEN` in AI Studio Secrets/Environment Variables so previews can connect to your live sheet.

## 3) Dashboard indicator ideas (optional)
- Candidate Stage Velocity (Days-in-Stage)
- Weekly Intake Sparkline
- Offer Acceptance Ratio Gauge

## 4) About `InteractiveInfographics.tsx`
If you want this component added, share either:
- the full file contents you want, or
- the exact existing component it should replace/augment,
because the snippet you pasted includes placeholders (`...`) and can’t be implemented as-is.

