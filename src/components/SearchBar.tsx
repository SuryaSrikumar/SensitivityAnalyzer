"use client";

import { useState, KeyboardEvent } from "react";
import { Search, X, Zap, Loader2 } from "lucide-react";

interface Props {
  onSearch: (tickers: string[]) => void;
  onDemoClick: () => void;
  loading: boolean;
  initialTickers: string[];
}

const QUICK_EXAMPLES = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL"];

export default function SearchBar({ onSearch, onDemoClick, loading, initialTickers }: Props) {
  const [input, setInput] = useState(initialTickers.join(", "));
  const [focused, setFocused] = useState(false);

  function parseTickers(raw: string): string[] {
    return raw
      .toUpperCase()
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && t.length <= 10 && /^[A-Z.]+$/.test(t))
      .slice(0, 5);
  }

  function handleSearch() {
    const tickers = parseTickers(input);
    if (tickers.length === 0) return;
    onSearch(tickers);
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  function addQuick(ticker: string) {
    const current = parseTickers(input);
    if (!current.includes(ticker) && current.length < 5) {
      const next = [...current, ticker];
      setInput(next.join(", "));
    }
  }

  function clearTicker(ticker: string) {
    const current = parseTickers(input).filter((t) => t !== ticker);
    setInput(current.join(", "));
  }

  const currentTickers = parseTickers(input);

  return (
    <div className="space-y-4">
      {/* Main input row */}
      <div className="flex gap-3">
        <div
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{
            background: "var(--ink-soft)",
            border: `1px solid ${focused ? "var(--accent)" : "var(--border)"}`,
            boxShadow: focused ? "0 0 0 3px var(--accent-glow)" : "none",
          }}
        >
          <Search size={18} style={{ color: "var(--text-secondary)" }} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            placeholder="Enter tickers: AAPL, TSLA, NVDA  (up to 5)"
            className="flex-1 bg-transparent outline-none text-base"
            style={{
              color: "var(--text-primary)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
          {input && (
            <button onClick={() => setInput("")}>
              <X size={16} style={{ color: "var(--text-secondary)" }} />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || currentTickers.length === 0}
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: loading ? "var(--ink-muted)" : "var(--accent)",
            color: "white",
            boxShadow: loading ? "none" : "0 0 20px var(--accent-glow)",
          }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          <span className="hidden sm:inline">{loading ? "Analyzing…" : "Analyze"}</span>
        </button>
      </div>

      {/* Current ticker pills */}
      {currentTickers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentTickers.map((t) => (
            <span
              key={t}
              className="ticker-badge flex items-center gap-1.5"
            >
              {t}
              <button onClick={() => clearTicker(t)}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Quick examples + demo button */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Quick add:
        </span>
        {QUICK_EXAMPLES.map((t) => (
          <button
            key={t}
            onClick={() => addQuick(t)}
            className="text-xs px-2.5 py-1 rounded-md transition-colors"
            style={{
              background: "var(--ink-muted)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-primary)";
              (e.target as HTMLElement).style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-secondary)";
              (e.target as HTMLElement).style.borderColor = "var(--border)";
            }}
          >
            {t}
          </button>
        ))}

        <span style={{ color: "var(--border)" }}>·</span>

        <button
          onClick={onDemoClick}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all disabled:opacity-50"
          style={{
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.35)",
            color: "#fbbf24",
          }}
        >
          <Zap size={12} />
          Load Demo (AAPL, TSLA, NVDA)
        </button>
      </div>
    </div>
  );
}
