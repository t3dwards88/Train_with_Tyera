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

Every page loads the same `toolkit.css`, so updating a color, font, or
button style in one place updates the whole toolkit.

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
