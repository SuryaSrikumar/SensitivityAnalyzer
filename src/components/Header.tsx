"use client";

import { TrendingUp } from "lucide-react";

export default function Header() {
  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--border)", backgroundColor: "rgba(15,15,20,0.9)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)", boxShadow: "0 0 16px var(--accent-glow)" }}
          >
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "'DM Serif Display', serif", color: "var(--text-primary)" }}
            >
              SentimentIQ
            </span>
            <span
              className="ml-2 text-xs px-2 py-0.5 rounded"
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#a5b4fc",
                fontFamily: "monospace",
              }}
            >
              EDUCATIONAL
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="hidden sm:block text-sm" style={{ color: "var(--text-secondary)" }}>
          Stock Sentiment Analysis · Class Project
        </p>
      </div>
    </header>
  );
}
