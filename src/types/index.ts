// ─────────────────────────────────────────────────────────────────
// types/index.ts  — Shared TypeScript types for the entire app
// ─────────────────────────────────────────────────────────────────

export type SentimentLabel = "positive" | "neutral" | "negative";
export type Signal = "Bullish" | "Neutral" | "Bearish";
export type SourceType = "news" | "social";
export type TimeWindow = 7 | 30 | 90;
export type SourceFilter = "news" | "social" | "blended";

/** A single article / post with its computed sentiment */
export interface SentimentItem {
  id: string;
  ticker: string;
  title: string;
  snippet: string;
  url: string;
  source: string;
  sourceType: SourceType;
  publishedAt: string; // ISO date string
  sentimentScore: number; // –1.0 … +1.0
  sentimentLabel: SentimentLabel;
  isDemo: boolean; // true = seeded demo data
}

/** One data point for the time-series chart */
export interface DailyAggregate {
  date: string; // "YYYY-MM-DD"
  avgScore: number;
  positive: number;
  neutral: number;
  negative: number;
  count: number;
}

/** Per-ticker summary returned by the API route */
export interface TickerResult {
  ticker: string;
  overallScore: number; // weighted average –1 … +1
  signal: Signal;
  positive: number;
  neutral: number;
  negative: number;
  totalItems: number;
  trend: "rising" | "falling" | "stable";
  trendDelta: number; // score difference from first half → second half
  dailyAggregates: DailyAggregate[];
  items: SentimentItem[];
  hasLiveData: boolean;
  hasDemoData: boolean;
}

/** Shape of the /api/analyze response */
export interface AnalyzeResponse {
  tickers: string[];
  results: TickerResult[];
  timeWindow: TimeWindow;
  sourceFilter: SourceFilter;
  newsWeight: number;
  socialWeight: number;
  generatedAt: string;
  error?: string;
}

/** Shape of the /api/analyze request body */
export interface AnalyzeRequest {
  tickers: string[];
  timeWindow: TimeWindow;
  sourceFilter: SourceFilter;
  newsWeight: number;
  socialWeight: number;
}
