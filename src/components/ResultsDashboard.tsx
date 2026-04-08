"use client";

import { Loader2, AlertCircle, BarChart2 } from "lucide-react";
import TickerResultCard from "./TickerResultCard";
import type { AnalyzeResponse, SourceFilter, TimeWindow } from "@/types";

interface Props {
  results: AnalyzeResponse | null;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  sourceFilter: SourceFilter;
  timeWindow: TimeWindow;
}

export default function ResultsDashboard({
  results,
  loading,
  error,
  hasSearched,
  sourceFilter,
  timeWindow,
}: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--ink-soft)", border: "1px solid var(--border)" }}
        >
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--accent)" }} />
        </div>
        <div className="text-center">
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Fetching &amp; Analyzing…
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Retrieving articles, scoring sentiment, computing trends
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl p-6 flex items-start gap-4"
        style={{
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.3)",
        }}
      >
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
        <div>
          <p className="font-semibold" style={{ color: "#fca5a5" }}>
            Analysis Error
          </p>
          <p className="text-sm mt-1" style={{ color: "#ef4444" }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--ink-soft)", border: "1px solid var(--border)" }}
        >
          <BarChart2 size={36} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text-primary)" }}
          >
            Enter tickers to begin
          </h2>
          <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>
            Type one or more stock symbols above — or hit{" "}
            <strong style={{ color: "#fbbf24" }}>Load Demo</strong> to see AAPL, TSLA, and NVDA
            analyzed instantly.
          </p>
        </div>
      </div>
    );
  }

  if (!results || results.results.length === 0) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "var(--text-secondary)" }}>No results found. Try different tickers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-up">
      {results.results.map((tickerResult) => (
        <TickerResultCard
          key={tickerResult.ticker}
          result={tickerResult}
          sourceFilter={sourceFilter}
          timeWindow={timeWindow}
        />
      ))}
      <p className="text-center text-xs" style={{ color: "var(--text-secondary)" }}>
        Generated {new Date(results.generatedAt).toLocaleString()} ·{" "}
        {results.timeWindow}-day window · {results.sourceFilter} mode
      </p>
    </div>
  );
}
