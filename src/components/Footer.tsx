"use client";

import { AlertTriangle } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t mt-16"
      style={{ borderColor: "var(--border)", background: "var(--ink-soft)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Disclaimer box */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#f59e0b" }} />
            <div className="text-sm space-y-1" style={{ color: "#fcd34d" }}>
              <p className="font-semibold">Full AI & Educational Disclosure</p>
              <p>
                SentimentIQ is a <strong>class project</strong> demonstrating automated sentiment
                analysis on financial text. It is <strong>not</strong> a financial advisory tool.
              </p>
              <p>
                All Bullish / Neutral / Bearish signals are heuristic outputs based on text
                sentiment scores — not earnings quality, fundamentals, technical analysis, or any
                other investment-grade data.
              </p>
              <p>
                The sentiment engine uses the AFINN rule-based lexicon with financial domain
                boosters. It may misread sarcasm, irony, ambiguous headlines, or complex financial
                context. Social data is seeded demo data, not real social media.
              </p>
              <p>
                <strong>Do not use this app to make real investment decisions.</strong> Consult a
                licensed financial advisor.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          <div className="space-y-1">
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              SentimentIQ — Stock Sentiment Analyzer
            </p>
            <p>Class project · Educational use only · Not financial advice</p>
          </div>
          <div className="text-right space-y-1">
            <p>Sentiment: AFINN lexicon + financial boosters</p>
            <p>News: GNews / NewsAPI (live) · Social: Demo data</p>
            <p>Charts: Recharts · Framework: Next.js 14 + TypeScript</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
