// ─────────────────────────────────────────────────────────────────
// app/api/analyze/route.ts
//
// POST /api/analyze
// Accepts { tickers, timeWindow, sourceFilter, newsWeight, socialWeight }
// Returns AnalyzeResponse with full per-ticker results.
// ─────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { fetchNewsItems } from "@/lib/news-fetcher";
import { generateDemoItems } from "@/lib/demo-data";
import { aggregateItems } from "@/lib/sentiment-engine";
import type { AnalyzeRequest, AnalyzeResponse, SentimentItem } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const {
      tickers,
      timeWindow = 30,
      sourceFilter = "blended",
      newsWeight = 0.6,
      socialWeight = 0.4,
    } = body;

    if (!tickers || tickers.length === 0) {
      return NextResponse.json({ error: "No tickers provided" }, { status: 400 });
    }

    // Limit to 5 tickers to avoid rate-limiting
    const limitedTickers = tickers.slice(0, 5).map((t) => t.toUpperCase().trim());

    const results = await Promise.all(
      limitedTickers.map(async (ticker) => {
        let allItems: SentimentItem[] = [];
        let hasLiveData = false;
        let hasDemoData = false;

        // ── Fetch news (live or demo) ──────────────────────────
        const wantsNews = sourceFilter === "news" || sourceFilter === "blended";
        if (wantsNews) {
          const { items: liveItems, isLive } = await fetchNewsItems(ticker, timeWindow);
          if (isLive && liveItems.length > 0) {
            allItems = [...allItems, ...liveItems];
            hasLiveData = true;
          } else {
            // Fall back to demo news
            const demoNews = generateDemoItems(ticker, timeWindow, true, false);
            allItems = [...allItems, ...demoNews];
            hasDemoData = true;
          }
        }

        // ── Social data (always demo — real social APIs require ──
        // ── OAuth / paid access / rate-limited scraping)         ──
        const wantsSocial = sourceFilter === "social" || sourceFilter === "blended";
        if (wantsSocial) {
          const demoSocial = generateDemoItems(ticker, timeWindow, false, true);
          allItems = [...allItems, ...demoSocial];
          hasDemoData = true;
        }

        if (allItems.length === 0) {
          // Absolute fallback: generate both news and social demo data
          allItems = generateDemoItems(ticker, timeWindow, true, true);
          hasDemoData = true;
        }

        // Compute actual weights (normalize so they sum to 1)
        const totalW = newsWeight + socialWeight;
        const normNewsWeight = totalW === 0 ? 0.5 : newsWeight / totalW;
        const normSocialWeight = totalW === 0 ? 0.5 : socialWeight / totalW;

        return aggregateItems(
          ticker,
          allItems,
          normNewsWeight,
          normSocialWeight,
          hasLiveData,
          hasDemoData
        );
      })
    );

    const response: AnalyzeResponse = {
      tickers: limitedTickers,
      results,
      timeWindow,
      sourceFilter,
      newsWeight,
      socialWeight,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
