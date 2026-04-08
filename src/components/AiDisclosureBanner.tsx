"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

export default function AiDisclosureBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl mb-8 overflow-hidden"
      style={{
        background: "rgba(245,158,11,0.06)",
        border: "1px solid rgba(245,158,11,0.3)",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} className="flex-shrink-0" style={{ color: "#f59e0b" }} />
          <span className="text-sm font-semibold" style={{ color: "#fbbf24" }}>
            ⚠️ AI & Educational Disclosure — Not Financial Advice
          </span>
        </div>
        <div style={{ color: "#f59e0b" }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div
          className="px-5 pb-4 text-sm space-y-2"
          style={{ color: "#fcd34d" }}
        >
          <p>
            <strong>Automated Sentiment Analysis:</strong> This tool uses rule-based NLP (AFINN
            lexicon + financial domain boosters) to classify text sentiment. It may misread sarcasm,
            idiomatic expressions, context-dependent headlines, or domain-specific jargon.
          </p>
          <p>
            <strong>For Educational Purposes Only:</strong> All outputs — including Bullish /
            Neutral / Bearish signals — are classroom demonstrations of sentiment analysis
            techniques. They are <em>not</em> investment recommendations.
          </p>
          <p>
            <strong>Data Limitations:</strong> Social sentiment data is seeded demo data, not live
            social media. News data may be delayed or incomplete. Sentiment does not reflect
            fundamental financial analysis, earnings quality, macroeconomic conditions, or insider
            information.
          </p>
          <p>
            <strong>Before making real investment decisions,</strong> consult a licensed financial
            advisor and use fundamental analysis, technical analysis, and diversified information
            sources.
          </p>
          <p>
            <strong>Powered by DRIVER™ Methodology:</strong> This tool was architected under the <strong>DRIVER</strong> framework. Following the <strong>Pilot-in-Command</strong> philosophy, AI acts as a co-pilot while the human validates output. The logic here acts as a strict "bullshit detector"—utilizing deterministic rule-based models rather than opaque generative AI to ensure analytical rigor.
          </p>
        </div>
      )}
    </div>
  );
}
