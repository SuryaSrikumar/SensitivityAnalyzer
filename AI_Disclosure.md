# AI & Educational Disclosure
## SentimentIQ — Stock Sentiment Analyzer

---

## What This Tool Does

SentimentIQ is a **classroom demonstration project** that applies Natural Language Processing (NLP) sentiment analysis to recent financial news and sample social media text. It is designed to illustrate how sentiment analysis works as a concept — not to serve as a financial advisory or trading system.

---

## How AI / Automation Is Used

### Sentiment Classification
This tool uses the **AFINN rule-based lexicon**, a curated list of approximately 2,477 English words each assigned a sentiment score from –5 to +5. The `sentiment` npm package computes a per-word average score for each piece of text, which is then normalized and adjusted with financial domain boosters.

**This is not a neural network or large language model.** It is a deterministic rule-based system — the same input will always produce the same output, and every decision can be traced.

### Data Retrieval
- **News data:** Retrieved from GNews API or NewsAPI.org using HTTP requests. These are real articles from real publications.
- **Social data:** Pre-written sample posts, clearly labeled "Demo" in the interface. They are scored by the same real sentiment engine but are **not** from real social media accounts.

---

## Known Limitations and Potential Inaccuracies

### The system may misread or incorrectly classify:

1. **Sarcasm and irony** — "Oh great, another recall" may score as positive because "great" has a positive weight.

2. **Negation** — "Stock is not performing well" may not correctly invert the positive word "well."

3. **Hedged language** — Financial writing uses phrases like "may," "could," "analysts suggest" that soften sentiment but are not reflected in word-level scoring.

4. **Context-dependent headlines** — "Apple's iPhone sales fall" is negative, but if it falls less than expected, it's a market beat. The engine cannot understand this context.

5. **Acronyms and ticker symbols** — "$AAPL" scores as 0 (unknown word). This is correct but means the ticker mention itself carries no signal.

6. **Industry jargon** — Words like "dilution," "covenant," "haircut" have specific financial meanings that differ from their everyday sentiment.

7. **Compound headlines** — "Earnings beat but guidance cut" contains both positive and negative signals; the result will be somewhere in between but may not correctly weight the more significant factor.

8. **Headline vs. article tone** — Headlines are often written to attract clicks and may be more dramatic than the article content.

---

## What the Outputs Mean (and Don't Mean)

| Output | What it means | What it does NOT mean |
|---|---|---|
| Sentiment Score (e.g., +0.24) | The average normalized text sentiment of recent articles/posts about this ticker | That the stock will go up, or that the company is fundamentally strong |
| Label (Positive / Neutral / Negative) | Whether the score exceeds the ±0.08 threshold | A recommendation to act |
| Signal (Bullish / Neutral / Bearish) | A heuristic classification of the aggregate score into three buckets | A buy, hold, or sell recommendation |
| Trend (Rising / Stable / Falling) | Whether the recent sentiment average is higher or lower than the earlier sentiment average in the window | That price will follow this trend |
| Source Breakdown | The distribution of sentiment across news vs. social text types | Anything about real social media activity (social is demo data) |

---

## This Is Not Financial Advice

**SentimentIQ outputs are for educational and demonstration purposes only.**

- They are **not** investment recommendations.
- They are **not** financial advice.
- They are **not** a substitute for fundamental analysis, technical analysis, macroeconomic research, or professional financial guidance.
- They are **not** sufficient basis for any real financial decision.

**Before making any investment decision,** consult a licensed financial advisor and conduct your own due diligence using multiple information sources.

---

## Data Source Transparency

| Source | Type | Status | Bias |
|---|---|---|---|
| GNews API | Live news | Real articles, free tier (100 req/day) | Professional media, measured tone, may lag social sentiment |
| NewsAPI.org | Live news (fallback) | Real articles, free developer tier | Same as GNews; developer tier has delayed data |
| Seeded social posts | Demo | Pre-written templates, clearly labeled | Designed to be representative, not statistically sampled |

---

## Ethical Commitments

1. **Transparency:** The sentiment algorithm is fully documented in README.md and DRIVER_documentation.md. Every scoring decision is traceable.

2. **Honest labeling:** Live data is labeled "Live News." Demo data is labeled "Demo." The distinction is always visible.

3. **Prominent disclaimer:** The Bullish/Neutral/Bearish signal is displayed with "(educational only)" directly on the badge, in a collapsible disclosure banner above results, and in the footer on every page.

4. **No false confidence:** The app does not claim accuracy metrics it cannot support. It presents scores as estimates, not ground truth.

5. **User autonomy:** The app never tells users what to do. It provides information and leaves all decisions to the user.

---

## Academic Integrity Note

This project was built as an independent class assignment. The following tools and resources were used:

- **Next.js, React, TypeScript** — open-source frameworks
- **Recharts** — open-source charting library
- **`sentiment` npm package** — open-source AFINN implementation
- **GNews API / NewsAPI** — documented public APIs
- **Tailwind CSS** — open-source utility CSS framework
- **AI assistance** — used for code generation and documentation drafting; all logic, design decisions, and written analysis reflect the student's understanding of the material

---

*Last updated: See project submission date*
*SentimentIQ — Educational Stock Sentiment Analyzer*
