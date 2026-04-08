"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SentimentItem } from "@/types";

interface Props {
  items: SentimentItem[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{ background: "#1a1a24", border: "1px solid #2e2e42", color: "#e8e8f0" }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }, i: number) => (
        <div key={i} className="flex gap-2">
          <span style={{ color: "#8888aa" }}>{p.name}:</span>
          <span>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

const COLORS: Record<string, string> = {
  Positive: "#22c55e",
  Neutral: "#f59e0b",
  Negative: "#ef4444",
};

export default function SourceBreakdownChart({ items }: Props) {
  // Group by source type × sentiment
  const newsItems = items.filter((i) => i.sourceType === "news");
  const socialItems = items.filter((i) => i.sourceType === "social");

  function countSentiment(arr: SentimentItem[]) {
    return {
      Positive: arr.filter((i) => i.sentimentLabel === "positive").length,
      Neutral: arr.filter((i) => i.sentimentLabel === "neutral").length,
      Negative: arr.filter((i) => i.sentimentLabel === "negative").length,
    };
  }

  const data = [
    { name: "📰 News", ...countSentiment(newsItems) },
    { name: "💬 Social", ...countSentiment(socialItems) },
  ].filter((d) => d.Positive + d.Neutral + d.Negative > 0);

  if (data.length === 0) {
    return (
      <div
        className="h-48 flex items-center justify-center rounded-lg"
        style={{ background: "var(--ink-muted)", border: "1px dashed var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No data
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#8888aa", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#8888aa", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {(["Positive", "Neutral", "Negative"] as const).map((key) => (
            <Bar key={key} dataKey={key} stackId="a" radius={key === "Positive" ? [3, 3, 0, 0] : [0, 0, 0, 0]}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[key]} fillOpacity={0.75} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Legend + avg scores */}
      <div className="space-y-2 text-xs">
        {[
          { label: "📰 News", items: newsItems },
          { label: "💬 Social", items: socialItems },
        ].map(({ label, items: src }) => {
          if (src.length === 0) return null;
          const avg =
            src.reduce((s, i) => s + i.sentimentScore, 0) / src.length;
          return (
            <div
              key={label}
              className="flex justify-between px-3 py-2 rounded-lg"
              style={{ background: "var(--ink-muted)", border: "1px solid var(--border)" }}
            >
              <span style={{ color: "var(--text-secondary)" }}>{label}</span>
              <span
                className="font-mono font-semibold"
                style={{
                  color:
                    avg > 0.08
                      ? "var(--bull)"
                      : avg < -0.08
                      ? "var(--bear)"
                      : "var(--neutral-signal)",
                }}
              >
                avg {avg > 0 ? "+" : ""}
                {avg.toFixed(3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
