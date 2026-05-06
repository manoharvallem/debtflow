# DebtFlow

DebtFlow is a personal money tracker for people who owe you money. Add a person, log what they borrowed, log payments, and see outstanding balances from one dashboard.

## Storage Options

DebtFlow always keeps a local browser copy using `localStorage`.

For access across devices, connect the app to Google Sheets:

```text
React UI -> Apps Script web app -> Google Sheet
```

This keeps the app deployable as a free static site while using a Google Sheet as the data store.

## Google Sheets Setup

1. Create a new Google Sheet.
2. In the Sheet, open `Extensions > Apps Script`.
3. Replace the default script with `apps-script/Code.gs` from this repo.
4. Optional: in Apps Script, open `Project Settings > Script properties` and add:

```text
DEBTFLOW_API_TOKEN=choose-any-random-string
```

5. Deploy the script:
   - Click `Deploy > New deployment`.
   - Type: `Web app`.
   - Execute as: `Me`.
   - Who has access: `Anyone`.
   - Copy the Web app `/exec` URL.

6. Create `.env.local` in this repo:

```bash
VITE_SHEETS_WEB_APP_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
VITE_SHEETS_API_TOKEN="same-random-string-if-you-set-one"
```

7. Restart the dev server:

```bash
npm run dev
```

The app will create two tabs in the Sheet automatically:

- `People`
- `Transactions`

## Run Locally

Prerequisite: Node.js.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:3000`.

## Deploy For Free

### Deploying to Vercel (Recommended)

1. **Push your code** to a GitHub repository.
2. **Log in to [Vercel](https://vercel.com)** and click "Add New" > "Project".
3. **Import** your repository.
4. **Environment Variables**: This is the critical step. In the "Environment Variables" section of the Vercel setup, add the following:
   - `VITE_SHEETS_WEB_APP_URL`: Your Google Apps Script URL.
   - `VITE_SHEETS_API_TOKEN`: Your random token string.
5. **Deploy**: Click the Deploy button. Vercel will automatically detect Vite and run `npm run build`.

### Other Platforms

Build the static files using `npm run build`, then deploy the `dist` folder to Netlify or Cloudflare Pages. 

**Note**: Ensure you set the same environment variables in your hosting provider's dashboard:

```bash
VITE_SHEETS_WEB_APP_URL
VITE_SHEETS_API_TOKEN
```

## Notes

- The token is only a basic gate. Because this is a frontend-only app, it is visible in the browser bundle.
- For personal use, this is acceptable. For multi-user or sensitive financial records, use proper authentication and a real backend.
- Export/import backup remains available in Settings.
