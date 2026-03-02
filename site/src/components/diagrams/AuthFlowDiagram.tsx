"use client";

import React from "react";

interface AuthFlowDiagramProps {
  method: "pinless" | "pin" | "android" | "iphone" | "document";
}

interface FlowStep {
  label: string;
  detail: string;
  color: "blue" | "yellow" | "green" | "purple";
}

interface AuthMethodData {
  title: string;
  description: string;
  icon: string;
  steps: FlowStep[];
}

const COLOR_MAP = {
  blue: { fill: "#EFF6FF", stroke: "#93C5FD", text: "#1E40AF" },
  yellow: { fill: "#FFFBEB", stroke: "#FCD34D", text: "#92400E" },
  green: { fill: "#F0FDF4", stroke: "#86EFAC", text: "#166534" },
  purple: { fill: "#F5F3FF", stroke: "#C4B5FD", text: "#5B21B6" },
};

const AUTH_METHODS: Record<AuthFlowDiagramProps["method"], AuthMethodData> = {
  pinless: {
    title: "顔認証（PIN無し認証）",
    description:
      "顔認証付きカードリーダーで患者の顔とマイナンバーカードのICチップ内の顔画像を照合",
    icon: "👤",
    steps: [
      {
        label: "マイナカード読取",
        detail: "顔認証付きカードリーダーにカードをかざす",
        color: "blue",
      },
      {
        label: "顔認証",
        detail: "カメラで撮影した顔とICチップ内の顔画像を照合",
        color: "yellow",
      },
      {
        label: "電子証明書確認",
        detail: "利用者証明用電子証明書の有効性を確認",
        color: "yellow",
      },
      {
        label: "資格情報照会",
        detail: "オンライン資格確認等システムに照会",
        color: "green",
      },
      {
        label: "資格情報返却",
        detail: "資格情報をレセコン等に連携",
        color: "green",
      },
    ],
  },
  pin: {
    title: "暗証番号認証（PIN認証）",
    description:
      "患者が4桁の暗証番号を入力し、利用者証明用電子証明書で本人確認",
    icon: "🔢",
    steps: [
      {
        label: "マイナカード読取",
        detail: "カードリーダーにカードをかざす",
        color: "blue",
      },
      {
        label: "暗証番号入力",
        detail: "患者が4桁PINを入力",
        color: "purple",
      },
      {
        label: "電子証明書確認",
        detail: "利用者証明用電子証明書の有効性を確認",
        color: "yellow",
      },
      {
        label: "資格情報照会",
        detail: "シリアル番号と紐づく資格情報を取得",
        color: "green",
      },
      {
        label: "資格情報返却",
        detail: "連携フォルダにファイルで出力",
        color: "green",
      },
    ],
  },
  android: {
    title: "Androidスマホ認証",
    description:
      "Androidスマホ用電子証明書のPIN認証により資格確認を実施",
    icon: "📱",
    steps: [
      {
        label: "スマホ読取",
        detail: "Androidスマホをカードリーダーにかざす",
        color: "blue",
      },
      {
        label: "暗証番号入力",
        detail: "利用者証明用暗証番号（4桁）を入力",
        color: "purple",
      },
      {
        label: "PIN認証処理",
        detail: "マイナンバーカード処理ソフトで認証",
        color: "yellow",
      },
      {
        label: "電子証明書確認",
        detail: "利用者証明用電子証明書の有効性確認",
        color: "yellow",
      },
      {
        label: "資格情報返却",
        detail: "資格情報のステータスと情報を返却",
        color: "green",
      },
    ],
  },
  iphone: {
    title: "iPhone認証",
    description:
      "iPhoneの生体認証（Face ID/Touch ID）により電子証明書を取り出し資格確認",
    icon: "📲",
    steps: [
      {
        label: "iPhone読取",
        detail: "iPhoneをカードリーダーにかざす",
        color: "blue",
      },
      {
        label: "生体認証",
        detail: "Face ID/Touch IDで本人確認",
        color: "purple",
      },
      {
        label: "認証処理",
        detail: "本人認証用カードリーダーソフトが処理",
        color: "yellow",
      },
      {
        label: "電子証明書確認",
        detail: "利用者証明用電子証明書の有効性確認",
        color: "yellow",
      },
      {
        label: "資格情報返却",
        detail: "資格情報のステータスと情報を返却",
        color: "green",
      },
    ],
  },
  document: {
    title: "資格確認書による確認",
    description:
      "資格確認書の記号番号等をレセコンに入力し、オンラインで資格情報を照会",
    icon: "📄",
    steps: [
      {
        label: "情報入力",
        detail: "保険者番号・記号番号・生年月日を入力",
        color: "blue",
      },
      {
        label: "照会送信",
        detail: "レセコンからオンライン資格確認等システムに照会",
        color: "yellow",
      },
      {
        label: "資格確認",
        detail: "入力情報と登録資格情報を照合",
        color: "green",
      },
      {
        label: "情報格納",
        detail: "照会した資格情報を資格確認端末に一時格納",
        color: "green",
      },
      {
        label: "情報取得",
        detail: "レセコンから資格確認端末へリクエストし取得",
        color: "green",
      },
    ],
  },
};

export function AuthFlowDiagram({ method }: AuthFlowDiagramProps) {
  const data = AUTH_METHODS[method];
  const stepCount = data.steps.length;
  const stepHeight = 64;
  const stepGap = 28;
  const viewHeight = 120 + stepCount * (stepHeight + stepGap);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 600 ${viewHeight}`}
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label={`${data.title}の認証フロー図`}
      >
        <defs>
          <marker
            id="arrow-auth-down"
            viewBox="0 0 10 7"
            refX="5"
            refY="7"
            markerWidth="8"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 5 7 L 10 0 z" fill="#94A3B8" />
          </marker>
        </defs>

        {/* Header */}
        <rect
          x="30"
          y="10"
          width="540"
          height="70"
          rx="12"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />

        <text
          x="300"
          y="36"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#1F2937"
        >
          {data.icon} {data.title}
        </text>
        <text
          x="300"
          y="58"
          textAnchor="middle"
          fontSize="11"
          fill="#6B7280"
        >
          {data.description}
        </text>

        {/* Steps */}
        {data.steps.map((step, index) => {
          const y = 100 + index * (stepHeight + stepGap);
          const colors = COLOR_MAP[step.color];

          return (
            <g key={index}>
              {/* Arrow from previous step */}
              {index > 0 && (
                <line
                  x1="300"
                  y1={y - stepGap + 2}
                  x2="300"
                  y2={y - 2}
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  markerEnd="url(#arrow-auth-down)"
                />
              )}

              {/* Step number */}
              <circle
                cx="82"
                cy={y + stepHeight / 2}
                r="16"
                fill={colors.stroke}
                fillOpacity="0.3"
                stroke={colors.stroke}
                strokeWidth="1.5"
              />
              <text
                x="82"
                y={y + stepHeight / 2 + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill={colors.text}
              >
                {index + 1}
              </text>

              {/* Step box */}
              <rect
                x="115"
                y={y}
                width="370"
                height={stepHeight}
                rx="10"
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="1.5"
              />

              {/* Step label */}
              <text
                x="300"
                y={y + 26}
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                fill={colors.text}
              >
                {step.label}
              </text>

              {/* Step detail */}
              <text
                x="300"
                y={y + 46}
                textAnchor="middle"
                fontSize="11"
                fill={colors.text}
                fillOpacity="0.8"
              >
                {step.detail}
              </text>
            </g>
          );
        })}

        {/* Side labels indicating system layers */}
        <g>
          {/* Patient side */}
          <rect
            x="510"
            y="100"
            width="70"
            height={stepHeight}
            rx="6"
            fill="#F5F3FF"
            fillOpacity="0.5"
            stroke="#C4B5FD"
            strokeWidth="0.75"
          />
          <text
            x="545"
            y={100 + stepHeight / 2 + 4}
            textAnchor="middle"
            fontSize="10"
            fill="#5B21B6"
          >
            患者操作
          </text>

          {/* System processing */}
          {stepCount > 2 && (
            <>
              <rect
                x="510"
                y={100 + stepHeight + stepGap}
                width="70"
                height={(stepCount - 2) * (stepHeight + stepGap) - stepGap}
                rx="6"
                fill="#FFFBEB"
                fillOpacity="0.5"
                stroke="#FCD34D"
                strokeWidth="0.75"
              />
              <text
                x="545"
                y={
                  100 +
                  stepHeight +
                  stepGap +
                  ((stepCount - 2) * (stepHeight + stepGap) - stepGap) / 2 +
                  4
                }
                textAnchor="middle"
                fontSize="10"
                fill="#92400E"
              >
                システム
              </text>
            </>
          )}

          {/* Result */}
          <rect
            x="510"
            y={100 + (stepCount - 1) * (stepHeight + stepGap)}
            width="70"
            height={stepHeight}
            rx="6"
            fill="#F0FDF4"
            fillOpacity="0.5"
            stroke="#86EFAC"
            strokeWidth="0.75"
          />
          <text
            x="545"
            y={
              100 +
              (stepCount - 1) * (stepHeight + stepGap) +
              stepHeight / 2 +
              4
            }
            textAnchor="middle"
            fontSize="10"
            fill="#166534"
          >
            結果
          </text>
        </g>
      </svg>
    </div>
  );
}
