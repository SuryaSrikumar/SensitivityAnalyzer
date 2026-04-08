"use client";

import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Controls from "@/components/Controls";
import ResultsDashboard from "@/components/ResultsDashboard";
import AiDisclosureBanner from "@/components/AiDisclosureBanner";
import Footer from "@/components/Footer";
import type {
  AnalyzeResponse,
  TimeWindow,
  SourceFilter,
} from "@/types";

const DEFAULT_TICKERS = ["AAPL", "TSLA", "NVDA"];

export default function HomePage() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(30);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("blended");
  const [newsWeight, setNewsWeight] = useState(60);
  const [socialWeight, setSocialWeight] = useState(40);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalyzeResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function runAnalysis(tickersToAnalyze?: string[]) {
    const finalTickers = tickersToAnalyze ?? tickers;
    if (finalTickers.length === 0) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickers: finalTickers,
          timeWindow,
          sourceFilter,
          newsWeight: newsWeight / 100,
          socialWeight: socialWeight / 100,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: AnalyzeResponse = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDemoClick() {
    setTickers(DEFAULT_TICKERS);
    runAnalysis(DEFAULT_TICKERS);
  }

  function handleSearch(t: string[]) {
    setTickers(t);
    runAnalysis(t);
  }

  // Re-run analysis when controls change (if we have results)
  async function handleControlChange<T>(setter: (v: T) => void, value: T) {
    setter(value);
    if (hasSearched && tickers.length > 0) {
      // slight delay to let state update
      setTimeout(() => runAnalysis(), 50);
    }
  }

  return (
    <div className="min-h-screen bg-grid" style={{ backgroundColor: "var(--ink)" }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search */}
        <div className="pt-8 pb-6">
          <SearchBar
            onSearch={handleSearch}
            onDemoClick={handleDemoClick}
            loading={loading}
            initialTickers={tickers}
          />
        </div>

        {/* Controls */}
        <div className="mb-8">
          <Controls
            timeWindow={timeWindow}
            sourceFilter={sourceFilter}
            newsWeight={newsWeight}
            socialWeight={socialWeight}
            onTimeWindowChange={(v) => handleControlChange(setTimeWindow, v)}
            onSourceFilterChange={(v) => handleControlChange(setSourceFilter, v)}
            onNewsWeightChange={(v) => {
              setNewsWeight(v);
              setSocialWeight(100 - v);
            }}
            onSocialWeightChange={(v) => {
              setSocialWeight(v);
              setNewsWeight(100 - v);
            }}
            disabled={loading}
          />
        </div>

        {/* AI Disclosure Banner */}
        <AiDisclosureBanner />

        {/* Results */}
        <ResultsDashboard
          results={results}
          loading={loading}
          error={error}
          hasSearched={hasSearched}
          sourceFilter={sourceFilter}
          timeWindow={timeWindow}
        />
      </main>

      <Footer />
    </div>
  );
}
