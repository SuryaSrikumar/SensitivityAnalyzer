// ─────────────────────────────────────────────────────────────────
// lib/demo-data.ts
//
// Seeded demo data used when:
//   (a) No API key is configured, OR
//   (b) sourceFilter === "social" or "blended" (social posts are
//       never available from real APIs in this project)
//
// Data is procedurally generated around the current date so that
// time-window switching still produces meaningful chart changes.
// ─────────────────────────────────────────────────────────────────

import { scoreText, scoreToLabel } from "./sentiment-engine";
import type { SentimentItem, TimeWindow } from "@/types";

// ── Seeded headline templates per ticker ──────────────────────
const TEMPLATES: Record<string, { news: string[]; social: string[] }> = {
  AAPL: {
    news: [
      "Apple reports record quarterly revenue driven by iPhone 15 sales",
      "Apple's AI features rollout faces EU regulatory scrutiny",
      "Apple Vision Pro sales disappoint analysts in Q2",
      "Apple expands manufacturing presence in India amid China concerns",
      "App Store fee changes create friction with developers worldwide",
      "Apple Watch health features lauded in new clinical study",
      "Apple shares climb after strong services segment growth",
      "iPhone market share slips in China as Huawei competition intensifies",
      "Apple raises dividend and expands buyback program",
      "Analysts debate Apple's AI roadmap vs Google and Microsoft",
    ],
    social: [
      "$AAPL Finally got my Vision Pro. Mind blown, totally worth it 🚀",
      "$AAPL iPhone sales in China down big. This is not good for the stock.",
      "Buying more $AAPL on every dip. Services revenue is a cash machine.",
      "$AAPL services margin expansion is the real story nobody talks about",
      "Honestly worried about $AAPL competition from Chinese phones lately",
      "$AAPL dividend increase = bullish signal. Loading up here.",
      "EU fines are a headache but $AAPL cash pile is enormous, not concerned",
      "$AAPL AI is way behind $MSFT and $GOOGL. Wake up people.",
    ],
  },
  TSLA: {
    news: [
      "Tesla misses delivery targets for third consecutive quarter",
      "Tesla announces new affordable Model Q starting under $30,000",
      "Elon Musk's political involvement affects Tesla brand perception survey",
      "Tesla energy storage business hits all-time record revenue",
      "Tesla faces increasing competition from BYD in global EV market",
      "Tesla full self-driving beta expansion boosts investor optimism",
      "Tesla cuts prices again in Europe to defend market share",
      "Tesla Gigafactory Berlin faces labor protests and slowdowns",
      "Tesla Cybertruck recall expanded to cover steering defect",
      "Tesla Semi gains traction with major logistics companies",
    ],
    social: [
      "$TSLA missed deliveries again. Sell this thing already.",
      "The Model Q announcement changes everything for $TSLA. BULLISH 🔥",
      "$TSLA Elon is toxic for the brand. Real data shows it hurting sales.",
      "Energy business alone makes $TSLA worth holding long term. Patient.",
      "$TSLA FSD progress is impressive. Robotaxi thesis still intact.",
      "Another price cut = margin compression. $TSLA is destroying itself.",
      "$TSLA Cybertruck recall is embarrassing. Quality control is a mess.",
      "Bought more $TSLA today. Innovation premium still worth it.",
    ],
  },
  NVDA: {
    news: [
      "Nvidia reports blowout earnings as data center demand surges",
      "Nvidia's Blackwell chip faces supply constraints through mid-year",
      "Nvidia stock enters correction territory after prolonged rally",
      "Nvidia announces new AI inference chip targeting edge deployment",
      "US export controls tighten Nvidia's China chip sales further",
      "Nvidia CEO Jensen Huang unveils next-generation GPU roadmap",
      "Nvidia gaming segment recovers as RTX 50 series launches",
      "Analysts raise Nvidia price target to $1,200 on AI demand",
      "Nvidia faces antitrust probe from EU over AI chip market dominance",
      "Nvidia partners with healthcare giants for AI diagnostics push",
    ],
    social: [
      "$NVDA blowout earnings. This thing is going to the moon. 🚀🚀🚀",
      "$NVDA supply constraints limiting growth. Cautious near term.",
      "Bought $NVDA at $400 and it's at $900 now. Never selling.",
      "$NVDA antitrust probe is a real risk. EU doesn't play around.",
      "$NVDA gaming + data center combo is unstoppable. Best in class.",
      "Export controls will eventually bite $NVDA hard. Be careful here.",
      "$NVDA Jensen is the best CEO in tech. Period.",
      "Took profits on $NVDA today after the run. Deserved a breather.",
    ],
  },
  MSFT: {
    news: [
      "Microsoft Azure revenue growth accelerates on AI cloud demand",
      "Microsoft Copilot monetization strategy shows early promise",
      "Microsoft faces pushback on Teams bundling in EU markets",
      "Microsoft acquires AI startup to bolster enterprise offerings",
      "Microsoft gaming division struggles post-Activision integration",
      "Microsoft raises quarterly dividend signaling financial strength",
      "Microsoft Office 365 subscriber base crosses 400 million milestone",
      "Microsoft under scrutiny for data handling in government contracts",
    ],
    social: [
      "$MSFT Azure growing fast. Best cloud play right now.",
      "$MSFT Copilot is genuinely useful. Real productivity gains.",
      "EU fines are a minor noise for $MSFT. Hold everything.",
      "$MSFT gaming division is a drag. Should have passed on Activision.",
      "$MSFT dividend raise. Reliable compounder. Not exciting but solid.",
      "Nobody talks about $MSFT enough. Quietly dominating AI.",
    ],
  },
  GOOGL: {
    news: [
      "Google search advertising revenue rebounds on economic recovery",
      "Google faces landmark antitrust verdict threatening business model",
      "Google Cloud momentum continues as AI tools drive adoption",
      "Google Gemini AI assistant criticized for accuracy issues",
      "Google parent Alphabet announces $70 billion buyback",
      "Google YouTube ad revenue rises as competitor TikTok faces uncertainty",
      "Google DeepMind achieves breakthrough in protein structure prediction",
      "DOJ recommends Google divest Chrome browser in antitrust remedy",
    ],
    social: [
      "$GOOGL antitrust ruling is a serious threat. Underpriced risk.",
      "$GOOGL search still prints money. Gemini improving fast.",
      "The buyback announcement is huge for $GOOGL. Undervalued.",
      "$GOOGL Cloud is the underdog story nobody covers. Strong buy.",
      "Gemini accuracy problems worry me for $GOOGL long-term vs OpenAI.",
      "$GOOGL DOJ remedy could be catastrophic. Watching this closely.",
    ],
  },
};

// ── Helper: generate a deterministic-ish date within the window ─
function randomDateInWindow(daysAgo: number): string {
  const d = new Date();
  const offset = Math.floor(Math.random() * daysAgo);
  d.setDate(d.getDate() - offset);
  return d.toISOString();
}

// ── Generate demo items for a ticker ─────────────────────────
export function generateDemoItems(
  ticker: string,
  timeWindow: TimeWindow,
  includeNews: boolean,
  includeSocial: boolean
): SentimentItem[] {
  const tickerKey = ticker.toUpperCase();
  const templates = TEMPLATES[tickerKey] ?? TEMPLATES["AAPL"];
  const items: SentimentItem[] = [];

  if (includeNews) {
    templates.news.forEach((headline, i) => {
      const score = scoreText(headline);
      items.push({
        id: `demo-news-${tickerKey}-${i}`,
        ticker: tickerKey,
        title: headline,
        snippet: `[Demo] This is a sample news article about ${tickerKey}. In live mode this would show the real article excerpt from a financial news source.`,
        url: "#",
        source: ["Reuters", "Bloomberg", "CNBC", "WSJ", "MarketWatch"][i % 5],
        sourceType: "news",
        publishedAt: randomDateInWindow(timeWindow),
        sentimentScore: score,
        sentimentLabel: scoreToLabel(score),
        isDemo: true,
      });
    });
  }

  if (includeSocial) {
    templates.social.forEach((post, i) => {
      const score = scoreText(post);
      items.push({
        id: `demo-social-${tickerKey}-${i}`,
        ticker: tickerKey,
        title: post,
        snippet: post,
        url: "#",
        source: ["StockTwits", "Reddit r/stocks", "Reddit r/investing"][i % 3],
        sourceType: "social",
        publishedAt: randomDateInWindow(timeWindow),
        sentimentScore: score,
        sentimentLabel: scoreToLabel(score),
        isDemo: true,
      });
    });
  }

  // Filter to the actual time window
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - timeWindow);
  return items.filter((item) => new Date(item.publishedAt) >= cutoff);
}


