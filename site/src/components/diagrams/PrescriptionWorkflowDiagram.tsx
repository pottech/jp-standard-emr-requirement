"use client";

import React from "react";

interface PrescriptionWorkflowDiagramProps {
  flow?: "issuance" | "dispensing" | "full";
}

interface StepData {
  id: number;
  label: string;
  sublabel: string;
  actor: "doctor" | "system" | "patient" | "pharmacy";
  phase: "issuance" | "dispensing";
}

const STEPS: StepData[] = [
  {
    id: 1,
    label: "処方箋作成",
    sublabel: "医師が電子カルテで処方内容を入力",
    actor: "doctor",
    phase: "issuance",
  },
  {
    id: 2,
    label: "電子署名付与",
    sublabel: "HPKI証明書による医師の電子署名",
    actor: "system",
    phase: "issuance",
  },
  {
    id: 3,
    label: "管理サービスに登録",
    sublabel: "電子処方箋管理サービスへXML送信",
    actor: "system",
    phase: "issuance",
  },
  {
    id: 4,
    label: "引換番号発行",
    sublabel: "処方内容（控え）を患者に交付",
    actor: "system",
    phase: "issuance",
  },
  {
    id: 5,
    label: "薬局で提示",
    sublabel: "患者がマイナカードまたは控えを提示",
    actor: "patient",
    phase: "dispensing",
  },
  {
    id: 6,
    label: "処方箋受取",
    sublabel: "薬局が管理サービスから処方箋取得",
    actor: "pharmacy",
    phase: "dispensing",
  },
  {
    id: 7,
    label: "重複投薬チェック",
    sublabel: "管理サービスで自動チェック実施",
    actor: "system",
    phase: "dispensing",
  },
  {
    id: 8,
    label: "調剤結果登録",
    sublabel: "調剤情報を管理サービスに登録",
    actor: "pharmacy",
    phase: "dispensing",
  },
];

const ACTOR_COLORS: Record<
  StepData["actor"],
  { fill: string; stroke: string; text: string; badge: string }
> = {
  doctor: {
    fill: "#EFF6FF",
    stroke: "#93C5FD",
    text: "#1E40AF",
    badge: "医師",
  },
  system: {
    fill: "#FFFBEB",
    stroke: "#FCD34D",
    text: "#92400E",
    badge: "システム",
  },
  patient: {
    fill: "#F5F3FF",
    stroke: "#C4B5FD",
    text: "#5B21B6",
    badge: "患者",
  },
  pharmacy: {
    fill: "#F0FDF4",
    stroke: "#86EFAC",
    text: "#166534",
    badge: "薬局",
  },
};

export function PrescriptionWorkflowDiagram({
  flow = "full",
}: PrescriptionWorkflowDiagramProps) {
  const filteredSteps = STEPS.filter((step) => {
    if (flow === "full") return true;
    return step.phase === flow;
  });

  const stepCount = filteredSteps.length;
  const stepWidth = 100;
  const stepGap = 16;
  const totalWidth = stepCount * stepWidth + (stepCount - 1) * stepGap + 60;
  const viewWidth = Math.max(totalWidth, 400);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${viewWidth} 280`}
        className="w-full max-w-4xl mx-auto"
        role="img"
        aria-label={`電子処方箋ワークフロー図${
          flow === "issuance"
            ? "（発行フロー）"
            : flow === "dispensing"
            ? "（調剤フロー）"
            : ""
        }`}
      >
        <defs>
          <marker
            id="arrow-flow"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth="7"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#94A3B8" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x={viewWidth / 2}
          y="24"
          textAnchor="middle"
          fontSize="15"
          fontWeight="bold"
          fill="#1F2937"
        >
          {flow === "issuance"
            ? "処方箋発行フロー"
            : flow === "dispensing"
            ? "調剤フロー"
            : "電子処方箋ワークフロー"}
        </text>

        {/* Phase separators for full view */}
        {flow === "full" && (
          <>
            <rect
              x="25"
              y="36"
              width={4 * stepWidth + 3 * stepGap + 10}
              height="238"
              rx="8"
              fill="#EFF6FF"
              fillOpacity="0.3"
              stroke="#BFDBFE"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text
              x={30 + (4 * stepWidth + 3 * stepGap + 10) / 2}
              y="54"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#3B82F6"
            >
              処方箋発行
            </text>

            <rect
              x={30 + 4 * stepWidth + 3 * stepGap + 15}
              y="36"
              width={4 * stepWidth + 3 * stepGap + 10}
              height="238"
              rx="8"
              fill="#F0FDF4"
              fillOpacity="0.3"
              stroke="#BBF7D0"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text
              x={
                35 +
                4 * stepWidth +
                3 * stepGap +
                (4 * stepWidth + 3 * stepGap + 10) / 2
              }
              y="54"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#16A34A"
            >
              調剤
            </text>
          </>
        )}

        {/* Steps */}
        {filteredSteps.map((step, index) => {
          const x = 30 + index * (stepWidth + stepGap);
          const y = 65;
          const colors = ACTOR_COLORS[step.actor];

          return (
            <g key={step.id}>
              {/* Step number circle */}
              <circle
                cx={x + stepWidth / 2}
                cy={y + 10}
                r="14"
                fill={colors.stroke}
                fillOpacity="0.3"
                stroke={colors.stroke}
                strokeWidth="1.5"
              />
              <text
                x={x + stepWidth / 2}
                y={y + 15}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill={colors.text}
              >
                {step.id}
              </text>

              {/* Step box */}
              <rect
                x={x}
                y={y + 32}
                width={stepWidth}
                height="80"
                rx="8"
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="1.5"
              />

              {/* Step label */}
              <text
                x={x + stepWidth / 2}
                y={y + 58}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={colors.text}
              >
                {step.label}
              </text>

              {/* Sub label (word-wrap manually) */}
              {step.sublabel.length <= 10 ? (
                <text
                  x={x + stepWidth / 2}
                  y={y + 78}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill={colors.text}
                  fillOpacity="0.8"
                >
                  {step.sublabel}
                </text>
              ) : (
                <>
                  <text
                    x={x + stepWidth / 2}
                    y={y + 75}
                    textAnchor="middle"
                    fontSize="8.5"
                    fill={colors.text}
                    fillOpacity="0.8"
                  >
                    {step.sublabel.slice(0, Math.ceil(step.sublabel.length / 2))}
                  </text>
                  <text
                    x={x + stepWidth / 2}
                    y={y + 87}
                    textAnchor="middle"
                    fontSize="8.5"
                    fill={colors.text}
                    fillOpacity="0.8"
                  >
                    {step.sublabel.slice(Math.ceil(step.sublabel.length / 2))}
                  </text>
                </>
              )}

              {/* Actor badge */}
              <rect
                x={x + stepWidth / 2 - 20}
                y={y + 120}
                width="40"
                height="18"
                rx="9"
                fill={colors.stroke}
                fillOpacity="0.25"
                stroke={colors.stroke}
                strokeWidth="0.75"
              />
              <text
                x={x + stepWidth / 2}
                y={y + 133}
                textAnchor="middle"
                fontSize="9"
                fontWeight="500"
                fill={colors.text}
              >
                {colors.badge}
              </text>

              {/* Arrow to next step */}
              {index < filteredSteps.length - 1 && (
                <line
                  x1={x + stepWidth + 2}
                  y1={y + 72}
                  x2={x + stepWidth + stepGap - 2}
                  y2={y + 72}
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  markerEnd="url(#arrow-flow)"
                />
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(30, 250)`}>
          {Object.entries(ACTOR_COLORS).map(([key, colors], i) => (
            <g key={key} transform={`translate(${i * 100}, 0)`}>
              <rect
                x="0"
                y="-8"
                width="10"
                height="10"
                rx="2"
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="1"
              />
              <text x="14" y="0" fontSize="10" fill="#4B5563">
                {colors.badge}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
