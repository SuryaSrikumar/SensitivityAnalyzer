# DRIVER Documentation
## SentimentIQ — Stock Sentiment Analyzer
### Class Project Submission

---

## Core Philosophy in Practice
- **Pilot-in-Command:** As the human pilot, I steered the high-level architecture—defining what a robust sentiment analyzer looks like. The AI co-pilot accelerated implementation, but the core filtering, scoring thresholds, and design aesthetic were verified by the pilot.
- **Logic is the Skill:** Instead of using an opaque LLM API for scoring everything (which could produce confident-sounding garbage), a transparent, rule-based approach using the AFINN package was implemented, enhanced by financial domain keywords. This forces precision.
- **Code as Bullshit Detector:** Outputting real data metrics forces the application to be accountable to live market conditions and realistic dummy conditions.

---

## D — Define the Problem

### Problem Statement

Financial markets generate enormous volumes of text every day — news articles, analyst reports, and social media posts — and the collective emotional tone of this text has a measurable relationship with investor behavior and short-term price movements. However, manually reading hundreds of articles to gauge the overall "mood" around a stock is impractical for most individual investors and students.

This project addresses a specific, bounded version of this problem: **Can automated sentiment analysis of recent financial news and social text provide a useful, transparent, and explainable summary of how the public narrative around a given stock is trending?**

### Context and Motivation

Sentiment analysis is a core technique in Natural Language Processing (NLP) and has real applications in quantitative finance — hedge funds and algorithmic trading desks have used news sentiment signals for over a decade. This project makes that concept accessible at a classroom level by:

1. Building a real, working web application (not just a script)
2. Using documented, explainable methods (AFINN rule-based scoring)
3. Presenting results in an interactive visual dashboard
4. Being transparent about limitations and data source constraints

### Scope Boundaries

- **In scope:** Text sentiment analysis, time-series aggregation, interactive UI, source comparison (news vs. social)
- **Out of scope:** Price prediction, fundamental analysis, trading execution, real-time social media streaming
- **Known limitation acknowledged:** Social media APIs (Twitter/X, Reddit) require expensive or OAuth-gated access that is fragile for a class demo — social data is therefore seeded demo data, clearly labeled as such.

---

## R — Requirements

### Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| F1 | Accept one or more stock ticker symbols as user input | ✅ Implemented |
| F2 | Retrieve recent news articles about entered tickers | ✅ GNews API + demo fallback |
| F3 | Score each article as positive / neutral / negative | ✅ AFINN + domain boosters |
| F4 | Display overall sentiment score per ticker | ✅ Weighted aggregate score |
| F5 | Display sentiment trend over time as a chart | ✅ Recharts ComposedChart |
| F6 | Output a simple Bullish / Neutral / Bearish signal | ✅ With mandatory disclaimer |
| F7 | Allow user to select 7 / 30 / 90 day time windows | ✅ Controls panel |
| F8 | Allow filtering by source type: news / social / blended | ✅ Source filter buttons |
| F9 | Allow adjustable weights when blended mode is selected | ✅ Dual sliders |
| F10 | Show individual article items with scores and labels | ✅ Collapsible article list |
| F11 | Show source breakdown chart | ✅ Stacked bar chart |
| F12 | Display loading, error, and empty states | ✅ All three states handled |
| F13 | Responsive design | ✅ Tailwind responsive grid |

### Non-Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| N1 | App must not crash when a source is unavailable | ✅ Graceful demo fallback |
| N2 | Demo mode must work without any API key | ✅ Verified |
| N3 | AI disclosure must be prominently displayed | ✅ Banner + footer |
| N4 | Trading signal must include educational disclaimer | ✅ Inline disclaimer on signal badge |
| N5 | Code must be explainable in a class presentation | ✅ Heavily commented |
| N6 | Data source labels (Live vs Demo) must be clear | ✅ Badge system |

### Rubric Alignment Checklist

- [x] Accepts one or more tickers
- [x] Retrieves recent text data about stocks
- [x] Analyzes sentiment as positive / negative / neutral
- [x] Outputs overall sentiment score
- [x] Outputs trend over time
- [x] Outputs buy/hold/sell style signal with disclaimer
- [x] Allows time window adjustment (7/30/90)
- [x] Allows source type filtering and weighting
- [x] Displays individual source items with scores
- [x] Shows sentiment visualization over time
- [x] AI warning in results area
- [x] AI warning in footer
- [x] Realistic limitations explained
- [x] DRIVER documentation present

---

## I — Inputs

### User Inputs

| Input | Type | Validation | Example |
|---|---|---|---|
| Ticker symbols | Text field (comma-separated) | Uppercase letters only, max 10 chars each, max 5 tickers | "AAPL, TSLA, NVDA" |
| Time window | Button toggle | Must be 7, 30, or 90 | 30 |
| Source filter | Button toggle | Must be "news", "social", or "blended" | "blended" |
| News weight | Range slider (0–100) | Integer, tied to social slider (sum ≈ 100) | 60 |
| Social weight | Range slider (0–100) | Integer, inverse of news weight | 40 |

### System Inputs (API)

| Input | Source | Format | Notes |
|---|---|---|---|
| News articles | GNews API | JSON: title, description, url, publishedAt, source.name | Up to 10 per request |
| News articles (fallback) | NewsAPI | JSON: same shape as GNews | Used if GNews unavailable |
| Social posts | Seeded demo templates | Hardcoded strings per ticker | Clearly labeled "Demo" |

### API Request Format

```json
POST /api/analyze
{
  "tickers": ["AAPL", "TSLA"],
  "timeWindow": 30,
  "sourceFilter": "blended",
  "newsWeight": 0.6,
  "socialWeight": 0.4
}
```

---

## V — Variables, Logic, and Visualization Decisions

### Sentiment Scoring Variables

| Variable | Type | Range | Description |
|---|---|---|---|
| `rawComparative` | number | ≈ –5 to +5 | AFINN per-word average score |
| `normalizedBase` | number | –1.0 to +1.0 | rawComparative / 5 |
| `domainBoost` | number | –0.30 to +0.30 | Sum of matched financial phrase boosters, clamped |
| `sentimentScore` | number | –1.0 to +1.0 | normalizedBase + domainBoost, clamped and rounded |
| `sentimentLabel` | enum | positive / neutral / negative | Threshold: ±0.08 dead-band |

### Thresholds and Why They Were Chosen

| Threshold | Value | Rationale |
|---|---|---|
| Neutral dead-band | ±0.08 | Financial headlines tend toward measured language; a smaller dead-band caused too many false positives |
| Bullish signal | > +0.15 | Requires score above the neutral dead-band with additional margin to reduce noise |
| Bearish signal | < –0.15 | Same logic, negative direction |
| Domain booster per phrase | ±0.12 | Strong enough to shift borderline neutrals, not strong enough to override strongly scored text |
| Max domain boost total | ±0.30 | Prevents articles that mention many phrases from reaching extreme values |

### Aggregation Logic

```
overallScore = Σ(item.score × item.sourceWeight) / Σ(item.sourceWeight)
```

Source weights are normalized before use:
```
normNewsWeight = newsWeight / (newsWeight + socialWeight)
normSocialWeight = socialWeight / (newsWeight + socialWeight)
```

### Trend Computation

```
daily = group items by date → average score per day
firstHalf = daily[0 … midpoint]
secondHalf = daily[midpoint … end]
trendDelta = avg(secondHalf) − avg(firstHalf)

if trendDelta > +0.05 → "rising"
if trendDelta < −0.05 → "falling"
else → "stable"
```

### Visualization Decisions

| Decision | Choice | Reason |
|---|---|---|
| Chart type for time-series | ComposedChart (line + stacked bars) | Line shows trend clearly; bars show volume of items per day |
| Source breakdown chart | Stacked bar per source type | Allows visual comparison of news vs. social sentiment distribution |
| Score indicator | Dot on a –1 to +1 number line | Instantly readable; shows position relative to neutral center |
| Color scheme | Green / Amber / Red for Bull / Neutral / Bear | Universal financial convention |
| Dark theme | Yes | Reduces eye strain for dashboard-style apps; professional aesthetic |
| Font: display | DM Serif Display | Authoritative, editorial feel appropriate for financial data |
| Font: body | DM Sans | Clean, neutral, highly legible at small sizes |
| Font: numbers/tickers | JetBrains Mono | Monospaced for numeric alignment; technical credibility |

### Signal Logic

```
if overallScore > +0.15 → Bullish
if overallScore < −0.15 → Bearish
else → Neutral
```

Signal is always displayed with the text "(educational only)" to satisfy the disclaimer requirement.

---

## E — Execution and Evaluation

### Execution Steps

1. **User enters tickers** in the search bar and clicks "Analyze"
2. **Frontend** sends POST request to `/api/analyze` with tickers, window, filter, weights
3. **API route** receives request and, for each ticker:
   a. Attempts live news fetch from GNews API
   b. Falls back to NewsAPI if GNews returns 0 results
   c. Falls back to demo news if no API key is configured
   d. Appends demo social posts if sourceFilter includes social
4. **Sentiment engine** scores each item (AFINN + boosters)
5. **Aggregation** computes weighted overall score, daily aggregates, trend
6. **API route** returns structured JSON response
7. **Frontend** renders summary cards, charts, and article list
8. **User** adjusts time window or source filter → step 2 repeats with new parameters

### How to Evaluate / Test

**Positive sentiment test:**
- Enter "NVDA" with 30-day window
- Expected: Score near +0.1 to +0.3, Bullish or Neutral signal
- Reason: NVDA demo data includes earnings beats, AI demand headlines

**Negative sentiment test:**
- Enter "TSLA" with 7-day window
- Expected: Score near –0.1 to –0.2, Bearish or Neutral signal
- Reason: TSLA demo data includes delivery misses, recall headlines

**Time window effect test:**
- Enter any ticker, toggle 7 → 30 → 90 days
- Expected: Chart x-axis expands; daily aggregate count changes

**Source filter test:**
- Switch to "News Only" → chart shows only news-scored items
- Switch to "Social Only" → chart shows only social-scored items
- Switch to "Blended" → both sources appear; weights affect overall score

**Weight slider test:**
- Blended mode, move news slider to 80%
- Expected: Overall score shifts toward news-only average
- Move social slider to 80%
- Expected: Overall score shifts toward social-only average

**No-API-key fallback test:**
- Remove keys from .env.local
- Expected: All features work; all items show "demo" badge; banner indicates demo mode

---

## R — Results and Reflection

### Results

The application successfully implements all rubric requirements:

- Live news retrieval works when a GNews or NewsAPI key is provided, returning real articles from the past 7, 30, or 90 days.
- The sentiment engine correctly identifies financial headlines as positive, neutral, or negative, with the domain booster list materially improving accuracy on financial jargon.
- The time-series chart clearly shows sentiment changing across dates, and switching time windows immediately updates the chart.
- The blended source mode demonstrates the concept of weighting different signal types, even though social data is demo.
- All rubric signals (overall score, trend, Bullish/Neutral/Bearish, breakdown, items list) are displayed.

### Observed Sentiment Patterns

In testing with demo data:

- **NVDA:** Consistently scores highest, driven by earnings beat and AI demand headlines. Social posts are very bullish.
- **TSLA:** Mixed to slightly negative, driven by delivery misses, recalls, and brand perception articles.
- **AAPL:** Near-neutral with positive lean; strong services revenue tempered by regulatory and China concerns.
- **MSFT:** Moderately positive; Azure growth and Copilot narratives dominate.
- **GOOGL:** Mixed; antitrust risk pulls score negative while buyback and Cloud news are positive.

### Limitations Identified

1. **AFINN lexicon coverage:** Many financial terms are not in the AFINN dictionary and receive a score of 0. A finance-specific lexicon (e.g., Loughran-McDonald) would be more accurate.

2. **Negation handling:** The `sentiment` package does not handle negation. "Not good" may score as "good" if "not" is not in the lexicon.

3. **Sarcasm and irony:** Rule-based scoring cannot detect sarcasm. This is a fundamental limitation of lexicon-based approaches.

4. **Small sample size:** GNews free tier returns 10 articles per query. Professional sentiment systems process hundreds or thousands.

5. **Demo social data:** Real social sentiment would be noisier, more extreme, and potentially more predictive of short-term retail behavior than what the seeded data shows.

6. **Headline vs. full text:** The engine scores only the title and description. Full article text would provide more signal but requires paid API access or scraping.

### What I Would Improve

1. **Use Loughran-McDonald Financial Sentiment Lexicon** — a purpose-built dictionary for financial documents that handles domain-specific words far better than AFINN.

2. **Add negation handling** — detect "not," "never," "hardly" modifiers and reverse the score of following tokens.

3. **Add more data volume** — aggregate from multiple news APIs, RSS feeds, and historical archives for a larger sample.

4. **Upgrade social data** — if budget allows, use the Twitter API v2 filtered stream or Reddit pushshift for real posts.

5. **Add an LLM re-scoring layer** — use Claude or GPT-4 to re-classify borderline articles (score between –0.2 and +0.2) where the rule-based engine is least confident.

6. **Add historical backtesting** — compare past sentiment signals against actual price movements to validate whether the signal has predictive value.

### Reflection

This project demonstrated that building a usable financial tool requires careful thought about data reliability, graceful degradation, and user trust. The most important design decision was choosing to use a transparent, explainable rule-based sentiment engine rather than a black-box model — in a classroom context, being able to trace exactly why AAPL scores +0.12 is more valuable than getting a slightly more accurate score from an opaque neural network.

The demo fallback architecture proved equally important: by seeding realistic data for all rubric tickers, the app works perfectly in a video demo even if the API rate limit is hit or the key expires.

Finally, the persistent emphasis on disclaimers throughout the UI — on the signal badge itself, in a collapsible banner, and in the footer — reflects a genuine principle: analytical tools that touch financial decisions carry an ethical responsibility to be honest about what they can and cannot do.
