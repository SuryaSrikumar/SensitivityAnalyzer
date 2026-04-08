// ─────────────────────────────────────────────────────────────────
// lib/news-fetcher.ts
//
// Fetches real news articles from GNews or NewsAPI.
// Falls back gracefully if no key is present or request fails.
// Returns SentimentItem[] (without sentiment scores — those are
// applied later by the sentiment engine).
// ─────────────────────────────────────────────────────────────────

import { scoreText, scoreToLabel } from "./sentiment-engine";
import type { SentimentItem, TimeWindow } from "@/types";

// ── GNews ─────────────────────────────────────────────────────
async function fetchGNews(
  ticker: string,
  timeWindow: TimeWindow
): Promise<SentimentItem[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return [];

  const from = new Date();
  from.setDate(from.getDate() - timeWindow);
  const fromStr = from.toISOString().slice(0, 10);

  const query = encodeURIComponent(`${ticker} stock`);
  const url = `https://gnews.io/api/v4/search?q=${query}&from=${fromStr}&lang=en&max=10&apikey=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`GNews error: ${res.status}`);
      return [];
    }
    const data = await res.json();
    const articles: GNewsArticle[] = data.articles ?? [];

    return articles.map((a, i) => {
      const text = `${a.title} ${a.description ?? ""}`;
      const score = scoreText(text);
      return {
        id: `gnews-${ticker}-${i}-${Date.now()}`,
        ticker: ticker.toUpperCase(),
        title: a.title,
        snippet: a.description ?? a.title,
        url: a.url,
        source: a.source?.name ?? "GNews",
        sourceType: "news" as const,
        publishedAt: a.publishedAt,
        sentimentScore: score,
        sentimentLabel: scoreToLabel(score),
        isDemo: false,
      };
    });
  } catch (err) {
    console.error("GNews fetch failed:", err);
    return [];
  }
}

// ── NewsAPI ────────────────────────────────────────────────────
async function fetchNewsAPI(
  ticker: string,
  timeWindow: TimeWindow
): Promise<SentimentItem[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];

  const from = new Date();
  from.setDate(from.getDate() - timeWindow);
  const fromStr = from.toISOString().slice(0, 10);

  const query = encodeURIComponent(`${ticker} stock`);
  const url = `https://newsapi.org/v2/everything?q=${query}&from=${fromStr}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`NewsAPI error: ${res.status}`);
      return [];
    }
    const data = await res.json();
    const articles: NewsAPIArticle[] = data.articles ?? [];

    return articles.map((a, i) => {
      const text = `${a.title} ${a.description ?? ""}`;
      const score = scoreText(text);
      return {
        id: `newsapi-${ticker}-${i}-${Date.now()}`,
        ticker: ticker.toUpperCase(),
        title: a.title,
        snippet: a.description ?? a.title,
        url: a.url,
        source: a.source?.name ?? "NewsAPI",
        sourceType: "news" as const,
        publishedAt: a.publishedAt,
        sentimentScore: score,
        sentimentLabel: scoreToLabel(score),
        isDemo: false,
      };
    });
  } catch (err) {
    console.error("NewsAPI fetch failed:", err);
    return [];
  }
}

// ── Public entry point ─────────────────────────────────────────
export async function fetchNewsItems(
  ticker: string,
  timeWindow: TimeWindow
): Promise<{ items: SentimentItem[]; isLive: boolean }> {
  // Try GNews first, then NewsAPI
  let items = await fetchGNews(ticker, timeWindow);

  if (items.length === 0) {
    items = await fetchNewsAPI(ticker, timeWindow);
  }

  return { items, isLive: items.length > 0 };
}

// ── GNews API types ────────────────────────────────────────────
interface GNewsArticle {
  title: string;
  description?: string;
  url: string;
  publishedAt: string;
  source?: { name: string };
}

interface NewsAPIArticle {
  title: string;
  description?: string;
  url: string;
  publishedAt: string;
  source?: { name: string };
}
