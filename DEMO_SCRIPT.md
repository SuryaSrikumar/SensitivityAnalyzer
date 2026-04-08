# Demo Script & Video Talking Points
## SentimentIQ — Stock Sentiment Analyzer
### Target length: 8–12 minutes

---

## Pre-Recording Checklist

- [ ] Run `npm run dev` and verify app loads at http://localhost:3000
- [ ] Open browser in full screen, hide bookmarks bar
- [ ] Close unrelated tabs
- [ ] Test "Load Demo" button to confirm it works without API key
- [ ] Test at least one live ticker if you have an API key (AAPL recommended)
- [ ] Have README.md open in a second tab/window for reference
- [ ] Note: demo data is randomized within windows — results will vary slightly each run

---

## Video Outline

### [0:00–0:45] Introduction — What Problem Are We Solving?

**Say:**
> "Hi, I'm [name], and this is my stock sentiment analyzer — a web app that automatically reads recent news articles and social text about stocks, scores the emotional tone of each one, and shows you how overall sentiment is trending over time."

> "The core insight this project explores is simple: before big investors move markets, the text of news articles and social posts often shifts in tone. Sentiment analysis is a way to detect that shift automatically."

> "Quick disclaimer upfront — this is a class project and demonstration tool. Nothing it outputs is financial advice. I'll show you the disclaimers built right into the app."

**Show on screen:** The app loaded at localhost:3000, dark themed, with the header visible.

---

### [0:45–2:00] Interface Walkthrough

**Say:**
> "Let me walk through the interface quickly. At the top, we have the ticker search bar — I can enter any stock symbol or a comma-separated list of up to five tickers."

> "Below that are the controls: time window — 7, 30, or 90 days — and source filter — News Only, Social Only, or Blended, which mixes both sources with adjustable weights."

> "Then there's the AI disclosure banner — let me open it."

**[Click the banner to expand it]**

> "This is always visible near the results. It explains that this uses automated sentiment analysis, may misread sarcasm or complex language, and is for educational purposes only."

**Show on screen:** Expanded disclosure banner.

---

### [2:00–4:00] Live Demo — Load Demo Tickers

**Say:**
> "Let me click Load Demo — this pre-loads AAPL, TSLA, and NVDA. This works even without an API key, which is important for demo reliability."

**[Click Load Demo button]**

> "While it loads, I'll explain what's happening on the server. The app sends a POST request to my Next.js API route. The route tries to fetch live news from GNews API — and if a key isn't present, it falls back to realistic seeded demo data. Either way, every article goes through the same sentiment engine."

**[Results appear]**

> "Now I can see three result cards — one per ticker. Let me focus on NVDA first. I can see the overall sentiment score — a number between minus one and plus one — the signal reads Bullish, and the trend shows Rising."

**Point to:**
- Score number
- Signal badge (note the "(educational only)" label)
- Trend direction card
- The dot on the score bar

---

### [4:00–6:00] Sentiment Chart and Time Window Demo

**Say:**
> "The chart here is the key visualization — it shows sentiment score averaged by day over the selected time window. The colored bars show counts of positive, neutral, and negative items. The purple line is the daily average score."

> "Now watch what happens when I change the time window."

**[Click 7 days]**

> "With 7 days, the chart is focused on very recent sentiment — fewer data points, but immediately relevant."

**[Click 90 days]**

> "With 90 days, we see a much longer arc. You might notice the trend delta changes — that number in the Trend Direction card tells you whether recent sentiment is higher or lower than earlier sentiment in the window."

> "This is important because a stock could have great 90-day average sentiment but sharply declining 7-day sentiment — that divergence might be worth investigating."

**Show on screen:** Chart changing shape as time window toggles.

---

### [6:00–7:30] Source Filter and Weighting Demo

**Say:**
> "Now let me demonstrate the source filter. Right now I'm in Blended mode. Let me switch to News Only."

**[Click News Only]**

> "The chart updates to show only news-scored items. The score may shift — social posts tend to be more extreme in either direction."

**[Click Social Only]**

> "Social only shows only the seeded social posts. I want to be transparent — these are demo posts, not real social media. Real Twitter and Reddit APIs require paid tiers or OAuth that would be fragile for a class project. The UI labels all demo data clearly with a badge."

**[Click Blended]**

> "Back in blended mode — and now I can use these sliders. If I drag news weight up to 80% and social down to 20, the overall score shifts toward what the news sources are saying. This lets you explore how much the signal depends on which source type you weight more heavily."

**Show on screen:** Sliders moving, overall score changing.

---

### [7:30–9:00] Individual Articles and Source Breakdown

**Say:**
> "Below the charts, there's the individual source list. Every article or post that contributed to the score is shown here — with the source name, publication date, title, and its individual sentiment score and label."

> "You can see the color bar on the left edge — green for positive, red for negative, amber for neutral. This gives a quick visual scan."

> "And there's a source breakdown chart on the right — this shows news versus social as stacked bars, so you can immediately see whether negative sentiment is coming from professional media or from the social sphere."

**Point to:**
- Article list items
- Individual score values
- Sentiment label badges
- Demo badges
- Source breakdown chart
- Avg score lines below the chart

---

### [9:00–10:00] Explanation of the Sentiment Engine

**Say:**
> "Let me explain how the scoring actually works — because this is something I can explain completely, which is a strength of this approach."

> "Each article's title and description are combined into one string. The AFINN lexicon looks up every word — 'profit' gets plus 3, 'loss' gets minus 3, 'great' gets plus 3, 'terrible' gets minus 3. It averages these across all words to get a comparative score."

> "I then normalize that to minus one to plus one, and apply financial domain boosters — phrases like 'beat earnings' add 0.12, 'miss earnings' subtracts 0.12. The final score is clamped to that range."

> "The threshold for positive is above 0.08, negative below minus 0.08, and everything in the middle is neutral. The Bullish signal requires above 0.15."

> "The honest limitation is that AFINN can't detect sarcasm. 'Oh great, another recall' would score as positive because 'great' is in the dictionary with a positive weight. I built that transparency into the disclosure."

---

### [10:00–11:00] How Would You Actually Use This?

**Say:**
> "So how would you use this tool in practice — if it were a real product?"

> "The realistic use case is as a news flow monitor. Before researching a stock, you'd run it through the sentiment analyzer to quickly gauge whether recent media coverage is positive or negative — and whether that mood has been rising or falling."

> "What you absolutely would not do is trade based on a Bullish signal alone. Sentiment says nothing about earnings quality, debt levels, valuation, or macroeconomic conditions. It's one input — maybe step one of a much longer research process."

> "And for this project specifically, everything you've seen is demo or educational data. The signal badges say so, the banner says so, and the footer says so."

---

### [11:00–12:00] Closing / Reflection

**Say:**
> "To summarize — this project successfully implements all the rubric requirements: multi-ticker input, live news retrieval with graceful demo fallback, AFINN-based sentiment scoring with financial boosters, 7/30/90 day time windows, source filtering and weighting, a time-series chart, individual article scores, and a clear Bullish/Neutral/Bearish signal with mandatory disclaimers."

> "The most important design decision was choosing a transparent, explainable sentiment engine over a black-box model. In a classroom context, being able to say 'here's exactly why NVDA scores plus 0.24' is more valuable than a slightly more accurate opaque result."

> "If I were to extend this, I'd replace AFINN with the Loughran-McDonald financial lexicon, add negation handling, and source real social data through a paid API. But for a class project demonstrating the concept end-to-end — I think it delivers."

> "Thank you for watching."

---

## Screen Recording Tips

### What to Show at Each Stage

| Segment | Primary Screen Focus |
|---|---|
| Intro | Full app, header visible, no results yet |
| Interface walkthrough | Controls panel, disclosure banner expanded |
| Demo load | Loading spinner, then results for all 3 tickers |
| Chart demo | NVDA chart, toggle 7/30/90 — chart must visually change |
| Source filter | Active filter buttons; chart updating |
| Weight sliders | Slider moving; overall score changing |
| Article list | Scroll through items, point to score values and badges |
| Source breakdown | Right-side chart for one ticker |
| Limitations | Point to demo badges, disclosure banner |

### Rubric Coverage Map

| Rubric Item | Where to show it |
|---|---|
| Accept multiple tickers | Type 2+ tickers manually |
| Retrieve text data | Mention GNews / demo fallback during loading |
| Positive/neutral/negative | Article list labels, summary card counts |
| Overall score | Summary card, score bar |
| Trend over time | Chart + Trend Direction card |
| Buy/hold/sell signal | Signal badge, point out "(educational only)" |
| 7/30/90 day windows | Toggle all three, show chart changing |
| Source filter + weights | Toggle filters, move sliders |
| Individual items with scores | Article list scroll |
| Sentiment visualization | Chart close-up |
| AI disclosure | Banner + footer |

---

## Anticipated Q&A

**Q: Why not use a real LLM for sentiment?**
A: Rule-based is more transparent and explainable. I can trace exactly why a score is what it is. For a class demo, deterministic results also make the tool easier to reason about.

**Q: Why is social data fake?**
A: Twitter/X API access costs $100+/month. Reddit pushshift was shut down. Building fragile OAuth integrations that might break during recording is not worth it for a demo. The architecture supports real social data — the demo mode is a pragmatic workaround.

**Q: Does this predict stock prices?**
A: No, and the disclaimer says so explicitly. Sentiment is one of many inputs in investment research. Price prediction requires fundamental analysis, technical analysis, and much more.

**Q: What would make this production-ready?**
A: Loughran-McDonald lexicon, real social data, much larger article volumes, backtesting against price data, and a professionally qualified disclaimer reviewed by a financial compliance team.
