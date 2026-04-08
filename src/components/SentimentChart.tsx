"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DailyAggregate } from "@/types";

interface Props {
  data: DailyAggregate[];
}

const COLORS = {
  positive: "#22c55e",
  negative: "#ef4444",
  neutral: "#f59e0b",
  line: "#6366f1",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-xs space-y-1"
      style={{
        background: "#1a1a24",
        border: "1px solid #2e2e42",
        color: "#e8e8f0",
      }}
    >
      <p className="font-semibold mb-1">{formatDate(label)}</p>
      {payload.map(
        (p: { name: string; value: number; color: string }, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: "#8888aa" }}>{p.name}:</span>
            <span className="font-mono font-medium">
              {typeof p.value === "number" && p.name === "Avg Score"
                ? (p.value > 0 ? "+" : "") + p.value.toFixed(3)
                : p.value}
            </span>
          </div>
        )
      )}
    </div>
  );
}

export default function SentimentChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div
        className="h-48 flex items-center justify-center rounded-lg"
        style={{ background: "var(--ink-muted)", border: "1px dashed var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Not enough data for time-series chart
        </p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: d.date,
    "Avg Score": d.avgScore,
    Positive: d.positive,
    Neutral: d.neutral,
    Negative: d.negative,
    Count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fill: "#8888aa", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="score"
          domain={[-1, 1]}
          tick={{ fill: "#8888aa", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="count"
          orientation="right"
          tick={{ fill: "#8888aa", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "11px", color: "#8888aa", paddingTop: "8px" }}
        />
        <ReferenceLine
          yAxisId="score"
          y={0}
          stroke="#2e2e42"
          strokeDasharray="4 4"
        />
        <ReferenceLine
          yAxisId="score"
          y={0.08}
          stroke="rgba(34,197,94,0.2)"
          strokeDasharray="2 4"
        />
        <ReferenceLine
          yAxisId="score"
          y={-0.08}
          stroke="rgba(239,68,68,0.2)"
          strokeDasharray="2 4"
        />
        <Bar
          yAxisId="count"
          dataKey="Positive"
          fill={COLORS.positive}
          opacity={0.2}
          radius={[2, 2, 0, 0]}
          stackId="count"
        />
        <Bar
          yAxisId="count"
          dataKey="Neutral"
          fill={COLORS.neutral}
          opacity={0.2}
          radius={[0, 0, 0, 0]}
          stackId="count"
        />
        <Bar
          yAxisId="count"
          dataKey="Negative"
          fill={COLORS.negative}
          opacity={0.2}
          radius={[0, 0, 2, 2]}
          stackId="count"
        />
        <Line
          yAxisId="score"
          type="monotone"
          dataKey="Avg Score"
          stroke={COLORS.line}
          strokeWidth={2.5}
          dot={{ fill: COLORS.line, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: COLORS.line, strokeWidth: 0 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
