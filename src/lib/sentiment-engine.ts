// ─────────────────────────────────────────────────────────────────
// lib/sentiment-engine.ts
//
// Rule-based sentiment scoring using the `sentiment` npm package
// (a JavaScript port of the VADER / AFINN approach).
//
// Why rule-based?
//   • Fully transparent — every step is inspectable
//   • No API cost or latency
//   • Easy to explain in class / presentations
//   • Works offline / without extra keys
//   • Deterministic — same input always produces same output
//
// Pipeline:
//   1. Receive raw text (headline + snippet)
//   2. Score with AFINN lexicon (returns comparative –5 … +5)
//   3. Normalize to –1.0 … +1.0
//   4. Apply financial domain boosters (+/- 0.1) for key phrases
//   5. Clamp to [–1, 1]
//   6. Threshold → positive / neutral / negative label
//   7. Aggregate items → per-ticker overall score
//   8. Compute trend (first-half vs second-half average)
//   9. Derive signal: Bullish / Neutral / Bearish
// ─────────────────────────────────────────────────────────────────

import Sentiment from "sentiment";
import type { SentimentLabel, Signal, SentimentItem, DailyAggregate, TickerResult } from "@/types";

const analyzer = new Sentiment();

// ── Financial domain boosters ──────────────────────────────────
// These phrases carry strong financial signal but may be missed by
// a general-purpose lexicon.
const POSITIVE_PHRASES = [
  "beat earnings", "record revenue", "all-time high", "strong guidance",
  "raised outlook", "exceeded expectations", "profit surge", "buyback",
  "dividend increase", "upgrade", "outperform", "bull", "rally",
  "breakthrough", "partnership", "acquisition approved",
];

const NEGATIVE_PHRASES = [
  "miss earnings", "revenue miss", "layoffs", "job cuts", "recall",
  "lawsuit", "investigation", "fine", "penalty", "downgrade",
  "underperform", "bear", "sell-off", "bankruptcy", "fraud",
  "data breach", "regulatory action", "guidance cut", "disappointing",
];

// ── Thresholds ─────────────────────────────────────────────────
const POSITIVE_THRESHOLD = 0.08;  // score > this → positive
const NEGATIVE_THRESHOLD = -0.08; // score < this → negative

// ── Score a single piece of text ──────────────────────────────
export function scoreText(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  const lower = text.toLowerCase();

  // 1. Base AFINN score (comparative is per-word normalized)
  const result = analyzer.analyze(text);
  let score = result.comparative; // range roughly –5 … +5

  // 2. Normalize to –1 … +1 (divide by 5, generous cap)
  score = Math.max(-1, Math.min(1, score / 5));

  // 3. Apply domain boosters
  let boost = 0;
  for (const phrase of POSITIVE_PHRASES) {
    if (lower.includes(phrase)) boost += 0.12;
  }
  for (const phrase of NEGATIVE_PHRASES) {
    if (lower.includes(phrase)) boost -= 0.12;
  }

  // Cap boost contribution to ±0.3 so it can't overwhelm the base score
  boost = Math.max(-0.3, Math.min(0.3, boost));
  score = Math.max(-1, Math.min(1, score + boost));

  return Math.round(score * 1000) / 1000; // 3 decimal places
}

// ── Map score → label ─────────────────────────────────────────
export function scoreToLabel(score: number): SentimentLabel {
  if (score > POSITIVE_THRESHOLD) return "positive";
  if (score < NEGATIVE_THRESHOLD) return "negative";
  return "neutral";
}

// ── Map aggregate score → trading signal ──────────────────────
// !! DISCLAIMER embedded in logic — see also UI disclaimer !!
export function scoreToSignal(score: number): Signal {
  if (score > 0.15) return "Bullish";
  if (score < -0.15) return "Bearish";
  return "Neutral";
}

// ── Group items into daily buckets ────────────────────────────
export function buildDailyAggregates(items: SentimentItem[]): DailyAggregate[] {
  const buckets: Record<string, { scores: number[]; pos: number; neu: number; neg: number }> = {};

  for (const item of items) {
    const date = item.publishedAt.slice(0, 10); // "YYYY-MM-DD"
    if (!buckets[date]) buckets[date] = { scores: [], pos: 0, neu: 0, neg: 0 };
    buckets[date].scores.push(item.sentimentScore);
    if (item.sentimentLabel === "positive") buckets[date].pos++;
    else if (item.sentimentLabel === "negative") buckets[date].neg++;
    else buckets[date].neu++;
  }

  return Object.entries(buckets)
    .map(([date, b]) => ({
      date,
      avgScore: Math.round((b.scores.reduce((a, c) => a + c, 0) / b.scores.length) * 1000) / 1000,
      positive: b.pos,
      neutral: b.neu,
      negative: b.neg,
      count: b.scores.length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ── Compute trend: compare first half avg vs second half avg ──
export function computeTrend(
  dailyAggregates: DailyAggregate[]
): { trend: TickerResult["trend"]; trendDelta: number } {
  if (dailyAggregates.length < 2) return { trend: "stable", trendDelta: 0 };

  const mid = Math.floor(dailyAggregates.length / 2);
  const firstHalf = dailyAggregates.slice(0, mid);
  const secondHalf = dailyAggregates.slice(mid);

  const avg = (arr: DailyAggregate[]) =>
    arr.reduce((s, d) => s + d.avgScore, 0) / arr.length;

  const delta = avg(secondHalf) - avg(firstHalf);
  const trendDelta = Math.round(delta * 1000) / 1000;

  const TREND_THRESHOLD = 0.05;
  const trend: TickerResult["trend"] =
    delta > TREND_THRESHOLD ? "rising" : delta < -TREND_THRESHOLD ? "falling" : "stable";

  return { trend, trendDelta };
}

// ── Aggregate all items into a TickerResult ────────────────────
export function aggregateItems(
  ticker: string,
  allItems: SentimentItem[],
  newsWeight: number,
  socialWeight: number,
  hasLiveData: boolean,
  hasDemoData: boolean
): TickerResult {
  // Compute weighted score per item
  const weightedScores: number[] = allItems.map((item) => {
    const w = item.sourceType === "news" ? newsWeight : socialWeight;
    return item.sentimentScore * w;
  });

  const totalWeight = allItems.reduce((s, item) => {
    return s + (item.sourceType === "news" ? newsWeight : socialWeight);
  }, 0);

  const overallScore =
    totalWeight === 0
      ? 0
      : Math.round((weightedScores.reduce((a, c) => a + c, 0) / totalWeight) * 1000) / 1000;

  const positive = allItems.filter((i) => i.sentimentLabel === "positive").length;
  const neutral = allItems.filter((i) => i.sentimentLabel === "neutral").length;
  const negative = allItems.filter((i) => i.sentimentLabel === "negative").length;

  const daily = buildDailyAggregates(allItems);
  const { trend, trendDelta } = computeTrend(daily);

  return {
    ticker,
    overallScore,
    signal: scoreToSignal(overallScore),
    positive,
    neutral,
    negative,
    totalItems: allItems.length,
    trend,
    trendDelta,
    dailyAggregates: daily,
    items: allItems.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    hasLiveData,
    hasDemoData,
  };
}
