Youtube Link- https://youtu.be/mnJJiGt9V-A
Substack Link- https://open.substack.com/pub/suryasrikumar/p/sensitivity-analyzer?r=2htl3i&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true
# SentimentIQ — Stock Sentiment Analyzer

> **Class Project · Educational Use Only · Not Financial Advice**

## 📚 Key Project Documentation
- **[👉 View Full DRIVER Documentation (Methodology & Details)](./DRIVER_documentation.md)**
- **[👉 View AI & Educational Disclosure](./AI_Disclosure.md)**

A full-stack stock sentiment analysis web app built with Next.js 14, TypeScript, Recharts, and a rule-based NLP sentiment engine. It retrieves recent news articles about user-specified stock tickers, scores the sentiment of each item, displays trends over selectable time windows, and outputs a simple Bullish / Neutral / Bearish signal — always with a prominent educational disclaimer.

---

## Live Demo Flow

1. Click **"Load Demo (AAPL, TSLA, NVDA)"** — no API key required.
2. Toggle between **7 / 30 / 90 day** time windows to see chart changes.
3. Switch between **News Only / Social Only / Blended** modes.
4. Adjust the **News / Social weight sliders** in Blended mode.
5. Scroll down to see the **sentiment-over-time chart**, source breakdown, and individual articles with scores.

---

## Quick Start

```bash
# 1. Clone / unzip the project
cd sentiment-analyzer

# 2. Install dependencies
npm install

# 3. (Optional) Add API keys for live news
cp .env.example .env.local
# Edit .env.local and add GNEWS_API_KEY or NEWSAPI_KEY

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

The app works **without any API key** — it falls back to realistic seeded demo data that demonstrates all rubric features.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GNEWS_API_KEY` | Optional | [gnews.io](https://gnews.io) — free tier, 100 req/day |
| `NEWSAPI_KEY` | Optional | [newsapi.org](https://newsapi.org) — free developer tier |

If neither key is set, the app displays `DEMO DATA` badges and uses seeded articles. All rubric features still work.

---

## Instructor Questions — Detailed Answers

### 1. What data source did you use and why?

**Primary (Live): GNews API**

GNews provides a clean REST API returning recent news articles in JSON. The free tier allows 100 requests/day and returns up to 10 articles per query — enough for a classroom demonstration.

- **Why chosen:** Simple one-key authentication, reliable uptime, returns publication date, title, description, and source name — exactly what the sentiment pipeline needs. No OAuth or complex setup.
- **Fallback:** NewsAPI.org (similar structure, also free for developers).
- **Demo fallback:** If neither key is present, the app serves pre-written seeded articles that are scored by the real sentiment engine, so all features still work.

**Secondary (Demo): Seeded social posts**

Real social media APIs (Twitter/X, Reddit) require OAuth, paid API tiers, and rate limiting that would make a classroom demo fragile. Instead, the app includes seeded post templates per ticker (e.g., `$AAPL services revenue is a cash machine`) that are scored by the same real sentiment engine. The UI clearly labels these as `DEMO` data.

**Biases and limitations of news data:**
- News is professionally edited — it tends toward factual reporting, meaning sentiment scores cluster near neutral more than raw social media would.
- Financial headlines use hedged language ("may," "could," "analysts suggest") that confuses simple lexicon-based tools.
- GNews free tier returns a maximum of 10 articles per query, limiting breadth.
- Articles about a ticker may discuss the sector or competitors rather than the company itself.
- Publication time zones can affect which articles fall within a time window.

**Why news may differ from social sentiment:**
Social sentiment is often more extreme — retail investors use hyperbolic language ("to the moon 🚀" vs. "is a cash machine"). News is more measured. The blended mode lets you compare these directly, though social data here is a demo.

---

### 2. How does the sentiment analysis work?

The pipeline has 6 steps:

**Step 1 — Text Input**
Each article's `title + description` are concatenated into a single string. This gives the engine both the headline signal and the contextual snippet.

**Step 2 — Base Scoring (AFINN Lexicon)**
The `sentiment` npm package (a JavaScript AFINN implementation) assigns a pre-trained integer weight to every known word in the text:
- "profit" → +3, "loss" → −3, "great" → +3, "terrible" → −3, etc.
- It returns a `comparative` score = (sum of word scores) / (total words)
- This normalizes for article length.

**Step 3 — Normalization**
The comparative score is divided by 5 to map it approximately to [–1, +1].

**Step 4 — Financial Domain Boosters**
A curated list of financial phrases is checked against the lowercased text:

*Positive boosters (+0.12 each):* "beat earnings", "record revenue", "all-time high", "raised outlook", "buyback", "dividend increase", "upgrade", "rally", "breakthrough", "partnership"

*Negative boosters (–0.12 each):* "miss earnings", "layoffs", "recall", "lawsuit", "investigation", "fine", "downgrade", "sell-off", "bankruptcy", "fraud", "data breach", "guidance cut"

Boosters are capped at ±0.30 total contribution to prevent them from overwhelming the base score.

**Step 5 — Clamping**
Final score is clamped to [–1.0, +1.0] and rounded to 3 decimal places.

**Step 6 — Label Assignment**
```
score > +0.08  →  positive
score < –0.08  →  negative
otherwise      →  neutral
```
The ±0.08 dead-band prevents borderline cases from flipping between labels on tiny noise.

**Signal derivation:**
```
overallScore > +0.15  →  Bullish
overallScore < –0.15  →  Bearish
otherwise             →  Neutral
```

**Aggregation:**
When Blended mode is selected, each item's score is multiplied by its source weight (news weight or social weight). The weighted average becomes the overall ticker score.

**Why AFINN over an LLM?**
- Fully deterministic — same input always produces same output, which is crucial for a class demo.
- No API cost, no latency, no additional key required.
- Every scoring decision is explainable — you can trace exactly why a score is what it is.
- Fast enough to score 20+ articles in milliseconds.
- Easy to explain in a presentation.

---

### 3. How does sentiment change across time windows?

The app groups items by publication date and computes a daily average score for each day in the selected window. This produces the time-series chart.

**7-day window:** Shows only the most recent articles. Chart is sparse but immediately relevant. Good for detecting short-term sentiment shifts around earnings or news events.

**30-day window:** A balanced view. Provides enough data points for a smooth trend line while still being recent enough to reflect current market sentiment.

**90-day window:** Reveals longer-term sentiment cycles. Can show how initial excitement around a product launch fades, or how sentiment recovered after a bad earnings quarter.

**Why this matters:**
A company might have very positive 90-day average sentiment but sharply negative 7-day sentiment — a potential early warning signal that recent news is souring. Conversely, a company with a rough quarter might show improving recent sentiment ahead of a recovery.

**Trend computation:**
The app splits the daily aggregates into a first half and second half:
- `trendDelta = avg(secondHalf scores) − avg(firstHalf scores)`
- `> +0.05` → "rising"
- `< –0.05` → "falling"
- Otherwise → "stable"

This is shown explicitly in the Trend Direction summary card.

---

### 4. How would you use this in real investment decisions?

**Realistic use (as a supplementary signal only):**
- Use the 7-day sentiment trend as a news flow monitor to quickly gauge whether recent media coverage is positive or negative before reading individual articles.
- Compare sentiment across competitors (e.g., AAPL vs. MSFT vs. GOOGL) to see relative public perception.
- Use the Blended social/news comparison to check whether retail sentiment is aligned with professional coverage or diverging.
- Flag sharp negative sentiment days to investigate the underlying articles.

**Critical limitations — why sentiment alone is never sufficient:**

1. **No fundamental data** — sentiment says nothing about P/E ratios, earnings quality, debt levels, or cash flow.
2. **Lagging or coincident** — news reacts to events; by the time sentiment is negative, the price move may already have happened.
3. **Misses context** — "Apple's iPhone sales declined" might be negative sentiment but positive for margins if ASP rose.
4. **Sarcasm and irony** — AFINN cannot detect sarcasm. "Oh great, another recall" scores as positive.
5. **Headline bias** — financial journalists use negative framing for neutral events ("stock falls" vs "minor pullback").
6. **Demo social data** — the social posts in this app are seeded templates, not real market participants' views.
7. **Small sample** — 10–15 articles per ticker is a tiny sample. Professional sentiment systems process thousands of data points.

**Proper investment process:**
Sentiment analysis → Fundamental analysis (10-K, earnings) → Technical analysis (price/volume) → Macroeconomic context → Risk management → Position sizing → Execute.

Sentiment is one optional input in step one. It is not a complete system.

---

## Project Architecture

```
sentiment-analyzer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts        ← POST /api/analyze
│   │   ├── globals.css             ← Global styles + CSS vars
│   │   ├── layout.tsx
│   │   └── page.tsx                ← Main page (client)
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx           ← Ticker input + quick examples
│   │   ├── Controls.tsx            ← Time window, source filter, weights
│   │   ├── AiDisclosureBanner.tsx  ← Collapsible AI warning
│   │   ├── ResultsDashboard.tsx    ← Loading / error / results router
│   │   ├── TickerResultCard.tsx    ← Per-ticker full result
│   │   ├── SentimentChart.tsx      ← Recharts time-series
│   │   ├── SourceBreakdownChart.tsx ← Recharts stacked bar
│   │   └── Footer.tsx              ← Full disclosure + credits
│   ├── lib/
│   │   ├── sentiment-engine.ts     ← Scoring, aggregation, trend, signal
│   │   ├── news-fetcher.ts         ← GNews / NewsAPI integration
│   │   └── demo-data.ts            ← Seeded demo articles + social posts
│   └── types/
│       └── index.ts                ← Shared TypeScript types
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Sentiment Score Reference

| Score Range | Label | Signal |
|---|---|---|
| > +0.15 | Positive | **Bullish** |
| +0.08 to +0.15 | Positive | Neutral |
| –0.08 to +0.08 | Neutral | Neutral |
| –0.15 to –0.08 | Negative | Neutral |
| < –0.15 | Negative | **Bearish** |

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack in one project, easy API routes |
| Language | TypeScript | Type safety, better IDE support |
| Styling | Tailwind CSS + CSS Variables | Fast iteration, consistent theming |
| Charts | Recharts | React-native, ComposedChart supports line+bar |
| Sentiment | `sentiment` npm (AFINN) | Transparent, deterministic, no API needed |
| News | GNews API → NewsAPI fallback | Free tiers, simple REST, JSON output |
| Social | Seeded demo data | Twitter/Reddit APIs too fragile for demo |
| Deployment | Vercel-ready | `next build` + env vars = done |

---

## AI Disclosure Summary

- Sentiment classification is automated and may be inaccurate.
- Sarcasm, irony, and complex financial language may be misclassified.
- Social data is seeded demo data — not real social media.
- All signals are for educational demonstration only.
- Not financial advice. Not investment advice.
- Do not make real financial decisions based on this tool.
