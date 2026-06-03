# Computational Finance — Oral Exam Study Guide

A premium, fast, **static** study website for a university oral exam in Computational Finance
(based on A. Dupuis, *Introduction to Computational Finance* v1.1, University of Geneva).

No build step — just open `index.html` in a browser.

## What it is

14 lectures, one page per topic, each concept taught in a fixed 7-part structure designed
for an oral exam where follow-up questions go deep:

1. **What it is** — one plain sentence
2. **Why it matters** — the problem it solves
3. **How it works** — the maths, derived step by step
4. **Analogy** — intuition in everyday terms
5. **Worked example** — small, clean numbers
6. **Examiner might ask** — likely questions + model answers + tricky follow-ups
7. **Common mistakes** — what *not* to say

## Topics

**Foundations:** Returns & Time Value of Money · Time Series & AR models
**Markets & microstructure:** Markets & EMH · Moving Averages & Intrinsic Time · Limit Order Book · Algorithmic Execution · Agent-Based Models
**Portfolio:** Portfolio Construction (MPT)
**Derivatives:** Options Basics · The Greeks · Futures & Forwards
**Fixed income:** Bonds Basics · Duration & Convexity
**Modern:** ESG / Sustainable Investing · Alternative Data

## Features

- Interactive **Plotly** charts (option payoffs, Black–Scholes price, Delta/Gamma, hedging
  P&L, MPT efficient frontier, bond price–yield, AR(1) paths, and more)
- **MathJax** formulas with full derivations in collapsible sections
- **Dark mode**, instant **search/filter**, sticky sidebar, scrollspy, back-to-top
- **Progress tracking** (mark topics as revised — stored in your browser)
- Fully responsive (study on a phone)

## How to use

Open `index.html` by double-clicking it, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Internet is only needed for the CDN scripts (MathJax, Plotly, Google Fonts); everything else is local.

## Tech

Plain HTML/CSS/JS. Shared `assets/style.css` (design system) and `assets/app.js`
(navigation, theme, search, progress — all generated from a single topic list).

## Hosting (GitHub Pages)

This repo's root is the site, so GitHub Pages works directly: **Settings → Pages → Deploy from branch → `main` / `root`**.
