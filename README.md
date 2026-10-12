# Reset Toolkit

Two client-facing tools sharing one visual identity, one navigation header,
and one design system, so they feel like a single product instead of two
separate demos. No build step, no dependencies, no backend.

## Pages

- `index.html` — landing page, links into both tools
- `assessment.html` + `assessment.js` — the intake form that generates a
  7-day Whole30-style meal plan, shopping list, and workout plan
- `calculator.html` + `calculator.js` — bodyweight-based protein target
  calculator with meals-per-day and intermittent-fasting window options
- `toolkit.css` — shared colors, type, header/nav, and component styles used
  by every page
- `config.js` — the one file you edit to set the beta passcode and connect
  a Google Sheet (see below)
- `gate.js` — the passcode lock screen shown on every page
- `google-apps-script.gs` — code to paste into Google Sheets so it can
  receive submissions (see below)

Every page loads the same `toolkit.css`, so updating a color, font, or
button style in one place updates the whole toolkit.

## The passcode lock

Every page is covered by a simple lock screen until the right code is
entered. To set or change the code, open `config.js` and edit the
`PASSCODE` value, then push the change.

**Be clear-eyed about what this is and isn't.** It stops someone from
clicking a forwarded link and wandering in, which covers the beta-testing
case. It is not real security: the code lives in a plain text file anyone
can open (`config.js`), so someone who knows to check a page's source code
can find it. For an invite-only beta that's normally enough. If you ever
need actual access control (restricted to specific people, not just
anyone with the code), that requires moving off plain GitHub Pages to a
host like Netlify or Cloudflare Pages that can gate access by email
invite — a bigger step, and not needed for beta testing.

Once someone enters the correct code, their browser remembers it (so they
won't be asked again on that device), the same device/browser repeating
visits.

## Run it locally

```bash
npx serve .
```

or

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Push it to GitHub

```bash
cd reset-toolkit
git init
git add .
git commit -m "Initial version of the Reset Toolkit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/reset-toolkit.git
git push -u origin main
```

Create the empty `reset-toolkit` repo on GitHub first, or use
`gh repo create` if you have the GitHub CLI installed.

## Put it online for beta testers

**Option A — GitHub Pages (free, simplest)**

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to "Deploy from a branch."
3. Set **Branch** to `main`, folder `/ (root)`, then save.
4. Live at `https://YOUR-USERNAME.github.io/reset-toolkit/` within a minute
   or two.

**Option B — Vercel or Netlify**

1. Connect your GitHub account at vercel.com or netlify.com.
2. Import the `reset-toolkit` repo.
3. No build command or output directory needed — it's static. Accept the
   defaults and deploy.
4. Both auto-redeploy on every push to `main`.

## Track submissions in a Google Sheet

By default, nothing is saved. Both tools can log every submission to a
Google Sheet instead, so you can open it anytime and see what clients
entered and what they got.

**Set it up once:**

1. Create a new Google Sheet. Name it whatever you want, e.g. "Reset
   Toolkit Submissions."
2. In that Sheet, go to **Extensions → Apps Script**.
3. Delete whatever's in the editor, and paste in the entire contents of
   `google-apps-script.gs` from this repo.
4. Click **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Set **Execute as** to "Me," and **Who has access** to "Anyone." (This
   sounds looser than it is — it only allows this one script to receive
   data, not to expose your Sheet itself. Your Sheet stays private.)
7. Click **Deploy**, authorize it when Google asks, and copy the URL it
   gives you (it ends in `/exec`).
8. Open `config.js` in your site files and paste that URL into
   `SHEET_WEB_APP_URL`, replacing the placeholder text.
9. Push the updated `config.js` to GitHub.

That's it. The Sheet will automatically grow two tabs, "Assessment" and
"Calculator," the first time each tool is used, with column headers
already filled in.

If you skip this setup, both tools still work exactly as before. They
just silently do nothing extra; nothing breaks.

## Making changes

```bash
git add .
git commit -m "Describe what changed"
git push
```

## Notes on what's real vs. a demo

- The meal and workout libraries in `assessment.js` are a small demo set.
  A production version needs a bigger rotation so repeat clients don't see
  the same week twice.
- The allergy/dislike filter in `assessment.js` works off keyword matching.
  Good first pass, not a substitute for a real allergy check.
- The protein multipliers in `calculator.js` (0.7 / 0.9 / 1.0 g per lb) are
  general fitness guidance, not clinical numbers. The on-screen disclaimer
  should stay in place.
- Nothing is saved anywhere yet. Every visit starts fresh on both tools.

## Ideas for a next version

- Feed the calculator's daily protein target into the assessment results,
  so a client's plan shows their personal protein number next to the meals
  that hit it
- Add a weight field to the intake form so the assessment tool can do this
  automatically without a second form
- Save progress in `localStorage` so a returning client doesn't start over
- Expand the meal/workout libraries
