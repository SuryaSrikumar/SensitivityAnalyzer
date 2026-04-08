"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
} from "lucide-react";
import SentimentChart from "./SentimentChart";
import SourceBreakdownChart from "./SourceBreakdownChart";
import type { TickerResult, SourceFilter, TimeWindow } from "@/types";

interface Props {
  result: TickerResult;
  sourceFilter: SourceFilter;
  timeWindow: TimeWindow;
}

export default function TickerResultCard({ result, sourceFilter, timeWindow }: Props) {
  const [articlesExpanded, setArticlesExpanded] = useState(true);

  const scoreColor =
    result.overallScore > 0.08
      ? "var(--bull)"
      : result.overallScore < -0.08
      ? "var(--bear)"
      : "var(--neutral-signal)";

  const signalClass =
    result.signal === "Bullish"
      ? "bg-signal-bull"
      : result.signal === "Bearish"
      ? "bg-signal-bear"
      : "bg-signal-neutral";

  const TrendIcon =
    result.trend === "rising"
      ? TrendingUp
      : result.trend === "falling"
      ? TrendingDown
      : Minus;

  const trendColor =
    result.trend === "rising"
      ? "var(--bull)"
      : result.trend === "falling"
      ? "var(--bear)"
      : "var(--neutral-signal)";

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--ink-soft)", border: "1px solid var(--border)" }}
    >
      {/* Ticker header bar */}
      <div
        className="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)" }}
          >
            {result.ticker}
          </span>

          {/* Live / Demo badges */}
          <div className="flex gap-1.5">
            {result.hasLiveData && <span className="live-badge">● Live News</span>}
            {result.hasDemoData && <span className="demo-badge">Demo Data</span>}
          </div>
        </div>

        {/* Signal badge */}
        <div
          className={`px-4 py-1.5 rounded-lg text-sm font-bold border ${signalClass}`}
          style={{ letterSpacing: "0.05em" }}
        >
          {result.signal === "Bullish" ? "▲" : result.signal === "Bearish" ? "▼" : "●"}{" "}
          {result.signal.toUpperCase()}
          <span
            className="ml-2 text-xs font-normal opacity-70"
            style={{ fontWeight: 400 }}
          >
            (educational only)
          </span>
        </div>
      </div>

      {/* Summary cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: "var(--border)" }}>
        {/* Overall Score */}
        <SummaryCard label="Overall Score">
          <span
            className="text-3xl font-bold"
            style={{ fontFamily: "monospace", color: scoreColor }}
          >
            {result.overallScore > 0 ? "+" : ""}
            {result.overallScore.toFixed(3)}
          </span>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            range –1.0 to +1.0
          </span>
        </SummaryCard>

        {/* Positive / Neutral / Negative */}
        <SummaryCard label="Sentiment Breakdown">
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: "var(--bull)" }}>
                {result.positive}
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Pos
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: "var(--neutral-signal)" }}>
                {result.neutral}
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Neu
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: "var(--bear)" }}>
                {result.negative}
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Neg
              </div>
            </div>
          </div>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {result.totalItems} items total
          </span>
        </SummaryCard>

        {/* Trend */}
        <SummaryCard label="Trend Direction">
          <div className="flex items-center gap-2">
            <TrendIcon size={22} style={{ color: trendColor }} />
            <span className="text-lg font-semibold capitalize" style={{ color: trendColor }}>
              {result.trend}
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Δ {result.trendDelta > 0 ? "+" : ""}
            {result.trendDelta.toFixed(3)} recent vs. early
          </span>
        </SummaryCard>

        {/* Sources */}
        <SummaryCard label="Data Sources">
          <div className="flex flex-col gap-1">
            {result.hasLiveData && (
              <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--bull)" }}>
                <Wifi size={13} /> Live News
              </div>
            )}
            {result.hasDemoData && (
              <div
                className="flex items-center gap-1.5 text-sm"
                style={{ color: "var(--neutral-signal)" }}
              >
                <WifiOff size={13} /> Demo Social
              </div>
            )}
          </div>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {timeWindow}-day window
          </span>
        </SummaryCard>
      </div>

      {/* Charts row */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-px"
        style={{ background: "var(--border)" }}
      >
        <div className="lg:col-span-2 p-5" style={{ background: "var(--ink-soft)" }}>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            Sentiment Over Time ({timeWindow} days)
          </p>
          <SentimentChart data={result.dailyAggregates} />
        </div>
        <div className="p-5" style={{ background: "var(--ink-soft)" }}>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            Source Breakdown
          </p>
          <SourceBreakdownChart items={result.items} />
        </div>
      </div>

      {/* Score bar visualization */}
      <div className="px-6 py-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs w-16 text-right" style={{ color: "var(--bear)" }}>
            Bear –1.0
          </span>
          <div className="flex-1 h-2 rounded-full relative" style={{ background: "var(--ink-muted)" }}>
            {/* center line */}
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{ left: "50%", background: "var(--border)" }}
            />
            {/* score dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-ink-soft transition-all"
              style={{
                left: `${((result.overallScore + 1) / 2) * 100}%`,
                transform: "translate(-50%, -50%)",
                background: scoreColor,
                boxShadow: `0 0 8px ${scoreColor}`,
              }}
            />
          </div>
          <span className="text-xs w-16" style={{ color: "var(--bull)" }}>
            Bull +1.0
          </span>
        </div>
      </div>

      {/* Articles list */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => setArticlesExpanded(!articlesExpanded)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>
            Individual Sources ({result.items.length} items)
          </span>
          {articlesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {articlesExpanded && (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {result.items.slice(0, 20).map((item) => (
              <div key={item.id} className="px-6 py-4 flex gap-4">
                {/* Sentiment indicator */}
                <div
                  className="flex-shrink-0 w-1 rounded-full self-stretch"
                  style={{
                    background:
                      item.sentimentLabel === "positive"
                        ? "var(--bull)"
                        : item.sentimentLabel === "negative"
                        ? "var(--bear)"
                        : "var(--neutral-signal)",
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: "var(--ink-muted)",
                          border: "1px solid var(--border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.source}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background:
                            item.sourceType === "news"
                              ? "rgba(99,102,241,0.12)"
                              : "rgba(168,85,247,0.12)",
                          border: `1px solid ${
                            item.sourceType === "news"
                              ? "rgba(99,102,241,0.3)"
                              : "rgba(168,85,247,0.3)"
                          }`,
                          color: item.sourceType === "news" ? "#a5b4fc" : "#c4b5fd",
                        }}
                      >
                        {item.sourceType === "news" ? "📰 news" : "💬 social"}
                      </span>
                      {item.isDemo && <span className="demo-badge">demo</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-mono font-semibold"
                        style={{
                          color:
                            item.sentimentLabel === "positive"
                              ? "var(--bull)"
                              : item.sentimentLabel === "negative"
                              ? "var(--bear)"
                              : "var(--neutral-signal)",
                        }}
                      >
                        {item.sentimentScore > 0 ? "+" : ""}
                        {item.sentimentScore.toFixed(3)}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded capitalize"
                        style={{
                          background:
                            item.sentimentLabel === "positive"
                              ? "rgba(34,197,94,0.12)"
                              : item.sentimentLabel === "negative"
                              ? "rgba(239,68,68,0.12)"
                              : "rgba(245,158,11,0.12)",
                          color:
                            item.sentimentLabel === "positive"
                              ? "var(--bull)"
                              : item.sentimentLabel === "negative"
                              ? "var(--bear)"
                              : "var(--neutral-signal)",
                        }}
                      >
                        {item.sentimentLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <p
                    className="text-sm font-medium leading-snug mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.url !== "#" ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        {item.title}
                        <ExternalLink size={11} className="flex-shrink-0" />
                      </a>
                    ) : (
                      item.title
                    )}
                  </p>

                  {/* Snippet + date */}
                  {item.snippet !== item.title && (
                    <p className="text-xs line-clamp-2 mb-1" style={{ color: "var(--text-secondary)" }}>
                      {item.snippet}
                    </p>
                  )}
                  <p className="text-xs" style={{ color: "var(--text-secondary)", opacity: 0.6 }}>
                    {new Date(item.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {result.items.length > 20 && (
              <p className="px-6 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                Showing top 20 of {result.items.length} items.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small helper ──────────────────────────────────────────────
function SummaryCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 flex flex-col gap-1.5" style={{ background: "var(--ink-soft)" }}>
      <p
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
