"use client";

import { Calendar, Layers, SlidersHorizontal } from "lucide-react";
import type { TimeWindow, SourceFilter } from "@/types";

interface Props {
  timeWindow: TimeWindow;
  sourceFilter: SourceFilter;
  newsWeight: number;
  socialWeight: number;
  onTimeWindowChange: (v: TimeWindow) => void;
  onSourceFilterChange: (v: SourceFilter) => void;
  onNewsWeightChange: (v: number) => void;
  onSocialWeightChange: (v: number) => void;
  disabled: boolean;
}

const TIME_OPTIONS: { label: string; value: TimeWindow }[] = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

const SOURCE_OPTIONS: { label: string; value: SourceFilter; sub: string }[] = [
  { label: "News Only", value: "news", sub: "Live articles" },
  { label: "Social Only", value: "social", sub: "Demo posts" },
  { label: "Blended", value: "blended", sub: "Weighted mix" },
];

export default function Controls({
  timeWindow,
  sourceFilter,
  newsWeight,
  socialWeight,
  onTimeWindowChange,
  onSourceFilterChange,
  onNewsWeightChange,
  onSocialWeightChange,
  disabled,
}: Props) {
  return (
    <div
      className="rounded-xl p-5 space-y-5"
      style={{ background: "var(--ink-soft)", border: "1px solid var(--border)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Window */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            <Calendar size={13} />
            Time Window
          </label>
          <div className="flex gap-2">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => !disabled && onTimeWindowChange(opt.value)}
                disabled={disabled}
                className="flex-1 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                style={{
                  background:
                    timeWindow === opt.value
                      ? "var(--accent)"
                      : "var(--ink-muted)",
                  color:
                    timeWindow === opt.value ? "white" : "var(--text-secondary)",
                  border: `1px solid ${
                    timeWindow === opt.value
                      ? "transparent"
                      : "var(--border)"
                  }`,
                  boxShadow:
                    timeWindow === opt.value
                      ? "0 0 12px var(--accent-glow)"
                      : "none",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source Filter */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            <Layers size={13} />
            Source Filter
          </label>
          <div className="flex gap-2">
            {SOURCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => !disabled && onSourceFilterChange(opt.value)}
                disabled={disabled}
                className="flex-1 py-2 text-sm font-medium rounded-lg transition-all text-center disabled:opacity-50"
                style={{
                  background:
                    sourceFilter === opt.value
                      ? "var(--accent)"
                      : "var(--ink-muted)",
                  color:
                    sourceFilter === opt.value ? "white" : "var(--text-secondary)",
                  border: `1px solid ${
                    sourceFilter === opt.value
                      ? "transparent"
                      : "var(--border)"
                  }`,
                  boxShadow:
                    sourceFilter === opt.value
                      ? "0 0 12px var(--accent-glow)"
                      : "none",
                }}
              >
                <div className="leading-tight">
                  <div>{opt.label}</div>
                  <div
                    className="text-xs opacity-70"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {opt.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Blended Weights */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            <SlidersHorizontal size={13} />
            Source Weights{" "}
            {sourceFilter !== "blended" && (
              <span className="opacity-50 normal-case font-normal">
                (blended only)
              </span>
            )}
          </label>
          <div
            className="space-y-3 p-3 rounded-lg"
            style={{
              background: "var(--ink-muted)",
              opacity: sourceFilter !== "blended" ? 0.4 : 1,
              pointerEvents: sourceFilter !== "blended" ? "none" : "auto",
            }}
          >
            <div className="space-y-1">
              <div className="flex justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
                <span>📰 News</span>
                <span className="font-mono">{newsWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={newsWeight}
                onChange={(e) => onNewsWeightChange(Number(e.target.value))}
                disabled={disabled || sourceFilter !== "blended"}
                className="w-full h-1.5 rounded-full accent-indigo-500 cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
                <span>💬 Social</span>
                <span className="font-mono">{socialWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={socialWeight}
                onChange={(e) => onSocialWeightChange(Number(e.target.value))}
                disabled={disabled || sourceFilter !== "blended"}
                className="w-full h-1.5 rounded-full cursor-pointer"
                style={{ accentColor: "#f59e0b" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
