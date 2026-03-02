"use client";

import React from "react";

interface RequirementTypeBadgeProps {
  showAll?: boolean;
  type?: "遵守" | "推奨" | "不可" | "参考";
}

interface TypeData {
  type: string;
  label: string;
  description: string;
  color: string;
  fill: string;
  stroke: string;
  textColor: string;
  icon: string;
}

const TYPE_DATA: TypeData[] = [
  {
    type: "遵守",
    label: "遵守",
    description:
      "標準仕様として必ず実装すべき要件。法令や通知に基づく必須事項であり、全てのシステムにおいて対応が求められる。",
    color: "#DC2626",
    fill: "#FEF2F2",
    stroke: "#FCA5A5",
    textColor: "#991B1B",
    icon: "M5 13l4 4L19 7",
  },
  {
    type: "推奨",
    label: "推奨",
    description:
      "実装が推奨される要件。対応することが望ましいが、合理的な理由がある場合は代替手段も許容される。",
    color: "#2563EB",
    fill: "#EFF6FF",
    stroke: "#93C5FD",
    textColor: "#1E40AF",
    icon: "M9 12l2 2 4-4",
  },
  {
    type: "不可",
    label: "不可",
    description:
      "実装してはならない事項。セキュリティや運用上の理由により禁止されている要件。",
    color: "#DC2626",
    fill: "#FEF2F2",
    stroke: "#FCA5A5",
    textColor: "#991B1B",
    icon: "M6 18L18 6M6 6l12 12",
  },
  {
    type: "参考",
    label: "参考",
    description:
      "参考情報として提供される事項。実装の判断はベンダーに委ねられるが、理解しておくことが望ましい。",
    color: "#6B7280",
    fill: "#F9FAFB",
    stroke: "#D1D5DB",
    textColor: "#374151",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

function SingleBadge({ data }: { data: TypeData }) {
  return (
    <svg
      viewBox="0 0 280 50"
      className="w-full max-w-xs"
      role="img"
      aria-label={`${data.label}要件バッジ`}
    >
      <rect
        x="2"
        y="2"
        width="276"
        height="46"
        rx="10"
        fill={data.fill}
        stroke={data.stroke}
        strokeWidth="1.5"
      />
      {/* Icon circle */}
      <circle
        cx="30"
        cy="25"
        r="14"
        fill={data.color}
        fillOpacity="0.15"
        stroke={data.color}
        strokeWidth="1.5"
      />
      {/* Simple icon representation */}
      <text
        x="30"
        y="30"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill={data.color}
      >
        {data.type === "遵守"
          ? "\u2713"
          : data.type === "推奨"
          ? "\u25cb"
          : data.type === "不可"
          ? "\u00d7"
          : "i"}
      </text>
      {/* Label */}
      <text
        x="54"
        y="22"
        fontSize="14"
        fontWeight="bold"
        fill={data.textColor}
      >
        {data.label}
      </text>
      {/* Short description */}
      <text
        x="54"
        y="38"
        fontSize="9"
        fill={data.textColor}
        fillOpacity="0.7"
      >
        {data.type === "遵守"
          ? "必ず実装すべき必須要件"
          : data.type === "推奨"
          ? "対応が望ましい推奨要件"
          : data.type === "不可"
          ? "実装してはならない禁止事項"
          : "理解しておくべき参考情報"}
      </text>
    </svg>
  );
}

export function RequirementTypeBadge({
  showAll = false,
  type,
}: RequirementTypeBadgeProps) {
  if (!showAll && type) {
    const data = TYPE_DATA.find((t) => t.type === type);
    if (!data) return null;
    return <SingleBadge data={data} />;
  }

  if (showAll || !type) {
    return (
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 720 400"
          className="w-full max-w-4xl mx-auto"
          role="img"
          aria-label="要件類型ビジュアルガイド"
        >
          {/* Title */}
          <text
            x="360"
            y="30"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#1F2937"
          >
            要件類型ビジュアルガイド
          </text>
          <text
            x="360"
            y="50"
            textAnchor="middle"
            fontSize="12"
            fill="#6B7280"
          >
            標準仕様書で使用される4つの要件類型とその意味
          </text>

          {/* Cards - 2x2 grid */}
          {TYPE_DATA.map((data, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = 20 + col * 350;
            const y = 70 + row * 165;

            return (
              <g key={data.type}>
                {/* Card background */}
                <rect
                  x={x}
                  y={y}
                  width="340"
                  height="150"
                  rx="12"
                  fill={data.fill}
                  stroke={data.stroke}
                  strokeWidth="1.5"
                />

                {/* Badge */}
                <rect
                  x={x + 15}
                  y={y + 15}
                  width="70"
                  height="30"
                  rx="15"
                  fill={data.color}
                  fillOpacity="0.15"
                  stroke={data.color}
                  strokeWidth="1.5"
                />
                <text
                  x={x + 50}
                  y={y + 35}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={data.color}
                >
                  {data.label}
                </text>

                {/* Icon */}
                <circle
                  cx={x + 115}
                  cy={y + 30}
                  r="16"
                  fill={data.color}
                  fillOpacity="0.1"
                  stroke={data.color}
                  strokeWidth="1"
                />
                <text
                  x={x + 115}
                  y={y + 35}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill={data.color}
                >
                  {data.type === "遵守"
                    ? "\u2713"
                    : data.type === "推奨"
                    ? "\u25cb"
                    : data.type === "不可"
                    ? "\u00d7"
                    : "i"}
                </text>

                {/* Severity indicator */}
                <text
                  x={x + 145}
                  y={y + 25}
                  fontSize="10"
                  fontWeight="600"
                  fill={data.textColor}
                >
                  {data.type === "遵守"
                    ? "重要度: \u2605\u2605\u2605"
                    : data.type === "推奨"
                    ? "重要度: \u2605\u2605\u2606"
                    : data.type === "不可"
                    ? "重要度: \u2605\u2605\u2605"
                    : "重要度: \u2605\u2606\u2606"}
                </text>
                <text
                  x={x + 145}
                  y={y + 40}
                  fontSize="9"
                  fill={data.textColor}
                  fillOpacity="0.7"
                >
                  {data.type === "遵守"
                    ? "必須（MUST）"
                    : data.type === "推奨"
                    ? "推奨（SHOULD）"
                    : data.type === "不可"
                    ? "禁止（MUST NOT）"
                    : "参考（MAY）"}
                </text>

                {/* Description */}
                {(() => {
                  const desc = data.description;
                  const lineLen = 32;
                  const lines: string[] = [];
                  for (let i = 0; i < desc.length; i += lineLen) {
                    lines.push(desc.slice(i, i + lineLen));
                  }
                  return lines.map((line, li) => (
                    <text
                      key={li}
                      x={x + 20}
                      y={y + 68 + li * 16}
                      fontSize="11"
                      fill={data.textColor}
                    >
                      {line}
                    </text>
                  ));
                })()}

                {/* Bottom accent line */}
                <rect
                  x={x + 15}
                  y={y + 135}
                  width={310}
                  height="3"
                  rx="1.5"
                  fill={data.color}
                  fillOpacity="0.3"
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  return null;
}
