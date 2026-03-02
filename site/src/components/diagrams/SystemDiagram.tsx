"use client";

import React from "react";

interface SystemDiagramProps {
  variant?: "full" | "simplified";
  highlight?: string[];
}

export function SystemDiagram({
  variant = "full",
  highlight = [],
}: SystemDiagramProps) {
  const isHighlighted = (id: string) =>
    highlight.length === 0 || highlight.includes(id);

  const hlFill = (id: string, defaultFill: string) =>
    isHighlighted(id) ? "#EEF2FF" : defaultFill;
  const hlStroke = (id: string, defaultStroke: string) =>
    isHighlighted(id) ? "#6366F1" : defaultStroke;
  const hlStrokeWidth = (id: string) => (isHighlighted(id) ? 2.5 : 1.5);

  if (variant === "simplified") {
    return (
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 700 260"
          className="w-full max-w-3xl mx-auto"
          role="img"
          aria-label="医療情報システム連携構成図（簡易版）"
        >
          <defs>
            <marker
              id="arrow-simple"
              viewBox="0 0 10 7"
              refX="10"
              refY="3.5"
              markerWidth="8"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#94A3B8" />
            </marker>
          </defs>

          {/* 医療機関 */}
          <rect
            x="30"
            y="40"
            width="220"
            height="180"
            rx="12"
            fill={hlFill("facility", "#EFF6FF")}
            stroke={hlStroke("facility", "#93C5FD")}
            strokeWidth={hlStrokeWidth("facility")}
          />
          <text
            x="140"
            y="68"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#1E40AF"
          >
            医療機関
          </text>

          <rect
            x="55"
            y="85"
            width="170"
            height="40"
            rx="8"
            fill="#DBEAFE"
            stroke="#93C5FD"
            strokeWidth="1"
          />
          <text
            x="140"
            y="110"
            textAnchor="middle"
            fontSize="12"
            fill="#1E40AF"
          >
            電子カルテ / レセコン
          </text>

          <rect
            x="55"
            y="140"
            width="170"
            height="40"
            rx="8"
            fill="#DBEAFE"
            stroke="#93C5FD"
            strokeWidth="1"
          />
          <text
            x="140"
            y="165"
            textAnchor="middle"
            fontSize="12"
            fill="#1E40AF"
          >
            資格確認端末
          </text>

          {/* 外部サービス */}
          <rect
            x="450"
            y="40"
            width="220"
            height="180"
            rx="12"
            fill={hlFill("external", "#F0FDF4")}
            stroke={hlStroke("external", "#86EFAC")}
            strokeWidth={hlStrokeWidth("external")}
          />
          <text
            x="560"
            y="68"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#166534"
          >
            外部サービス
          </text>

          <rect
            x="475"
            y="85"
            width="170"
            height="40"
            rx="8"
            fill="#DCFCE7"
            stroke="#86EFAC"
            strokeWidth="1"
          />
          <text
            x="560"
            y="110"
            textAnchor="middle"
            fontSize="12"
            fill="#166534"
          >
            オンライン資格確認
          </text>

          <rect
            x="475"
            y="140"
            width="170"
            height="40"
            rx="8"
            fill="#DCFCE7"
            stroke="#86EFAC"
            strokeWidth="1"
          />
          <text
            x="560"
            y="165"
            textAnchor="middle"
            fontSize="12"
            fill="#166534"
          >
            電子処方箋管理
          </text>

          {/* 接続線 */}
          <line
            x1="250"
            y1="130"
            x2="450"
            y2="130"
            stroke="#3B82F6"
            strokeWidth="2"
            markerEnd="url(#arrow-simple)"
            markerStart="url(#arrow-simple)"
          />
          <text
            x="350"
            y="122"
            textAnchor="middle"
            fontSize="10"
            fill="#4B5563"
          >
            オンライン請求
          </text>
          <text
            x="350"
            y="136"
            textAnchor="middle"
            fontSize="10"
            fill="#4B5563"
          >
            ネットワーク
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 960 520"
        className="w-full max-w-4xl mx-auto"
        role="img"
        aria-label="医療情報システム連携構成図"
      >
        <defs>
          <marker
            id="arrow-data"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#3B82F6" />
          </marker>
          <marker
            id="arrow-secure"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#22C55E" />
          </marker>
          <marker
            id="arrow-normal"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#94A3B8" />
          </marker>
        </defs>

        {/* === 左側：医療機関内システム === */}
        <rect
          x="20"
          y="20"
          width="360"
          height="480"
          rx="16"
          fill={hlFill("facility", "#EFF6FF")}
          stroke={hlStroke("facility", "#93C5FD")}
          strokeWidth={hlStrokeWidth("facility")}
        />
        <text
          x="200"
          y="52"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#1E40AF"
        >
          医療機関内システム
        </text>

        {/* 電子カルテ */}
        <rect
          x="50"
          y="75"
          width="300"
          height="80"
          rx="10"
          fill={hlFill("emr", "#DBEAFE")}
          stroke={hlStroke("emr", "#93C5FD")}
          strokeWidth={hlStrokeWidth("emr")}
        />
        <text
          x="200"
          y="105"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#1E40AF"
        >
          電子カルテシステム
        </text>
        <text
          x="200"
          y="125"
          textAnchor="middle"
          fontSize="11"
          fill="#3B82F6"
        >
          診療記録・処方・病名管理
        </text>

        {/* レセコン */}
        <rect
          x="50"
          y="175"
          width="300"
          height="80"
          rx="10"
          fill={hlFill("rececom", "#DBEAFE")}
          stroke={hlStroke("rececom", "#93C5FD")}
          strokeWidth={hlStrokeWidth("rececom")}
        />
        <text
          x="200"
          y="205"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#1E40AF"
        >
          レセプトコンピュータ
        </text>
        <text
          x="200"
          y="225"
          textAnchor="middle"
          fontSize="11"
          fill="#3B82F6"
        >
          診療報酬請求・保険請求
        </text>

        {/* 資格確認端末 */}
        <rect
          x="50"
          y="280"
          width="300"
          height="80"
          rx="10"
          fill={hlFill("terminal", "#FFFBEB")}
          stroke={hlStroke("terminal", "#FCD34D")}
          strokeWidth={hlStrokeWidth("terminal")}
        />
        <text
          x="200"
          y="310"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#92400E"
        >
          資格確認端末
        </text>
        <text
          x="200"
          y="330"
          textAnchor="middle"
          fontSize="11"
          fill="#B45309"
        >
          連携ソフト・マイナカード処理
        </text>

        {/* カードリーダー */}
        <rect
          x="50"
          y="385"
          width="300"
          height="80"
          rx="10"
          fill={hlFill("reader", "#FFFBEB")}
          stroke={hlStroke("reader", "#FCD34D")}
          strokeWidth={hlStrokeWidth("reader")}
        />
        <text
          x="200"
          y="415"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#92400E"
        >
          顔認証付きカードリーダー
        </text>
        <text
          x="200"
          y="435"
          textAnchor="middle"
          fontSize="11"
          fill="#B45309"
        >
          マイナンバーカード読取・顔認証
        </text>

        {/* 施設内接続線 */}
        <line
          x1="200"
          y1="155"
          x2="200"
          y2="175"
          stroke="#94A3B8"
          strokeWidth="1.5"
          markerEnd="url(#arrow-normal)"
        />
        <line
          x1="200"
          y1="255"
          x2="200"
          y2="280"
          stroke="#94A3B8"
          strokeWidth="1.5"
          markerEnd="url(#arrow-normal)"
          markerStart="url(#arrow-normal)"
        />
        <line
          x1="200"
          y1="360"
          x2="200"
          y2="385"
          stroke="#94A3B8"
          strokeWidth="1.5"
          markerEnd="url(#arrow-normal)"
        />

        {/* === 中央：ネットワーク === */}
        <rect
          x="415"
          y="160"
          width="130"
          height="200"
          rx="12"
          fill="#F9FAFB"
          stroke="#D1D5DB"
          strokeWidth="1.5"
          strokeDasharray="6 3"
        />
        <text
          x="480"
          y="190"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#4B5563"
        >
          オンライン請求
        </text>
        <text
          x="480"
          y="207"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#4B5563"
        >
          ネットワーク
        </text>

        {/* ネットワーク特性 */}
        <text
          x="480"
          y="240"
          textAnchor="middle"
          fontSize="10"
          fill="#6B7280"
        >
          閉域IP網
        </text>
        <text
          x="480"
          y="258"
          textAnchor="middle"
          fontSize="10"
          fill="#6B7280"
        >
          IPv4 + IPv6
        </text>
        <text
          x="480"
          y="276"
          textAnchor="middle"
          fontSize="10"
          fill="#6B7280"
        >
          VPN暗号化
        </text>

        {/* セキュリティアイコン（鍵マーク） */}
        <circle cx="480" cy="310" r="16" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
        <text
          x="480"
          y="315"
          textAnchor="middle"
          fontSize="14"
          fill="#D97706"
        >
          🔒
        </text>
        <text
          x="480"
          y="345"
          textAnchor="middle"
          fontSize="9"
          fill="#6B7280"
        >
          TLS/IPsec
        </text>

        {/* 施設→ネットワーク接続 */}
        <line
          x1="350"
          y1="320"
          x2="415"
          y2="260"
          stroke="#22C55E"
          strokeWidth="2"
          strokeDasharray="6 3"
          markerEnd="url(#arrow-secure)"
        />

        {/* === 右側：外部サービス === */}
        <rect
          x="580"
          y="20"
          width="360"
          height="480"
          rx="16"
          fill={hlFill("external", "#F0FDF4")}
          stroke={hlStroke("external", "#86EFAC")}
          strokeWidth={hlStrokeWidth("external")}
        />
        <text
          x="760"
          y="52"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#166534"
        >
          外部サービス（支払基金等）
        </text>

        {/* オンライン資格確認 */}
        <rect
          x="610"
          y="75"
          width="300"
          height="80"
          rx="10"
          fill={hlFill("oqc", "#DCFCE7")}
          stroke={hlStroke("oqc", "#86EFAC")}
          strokeWidth={hlStrokeWidth("oqc")}
        />
        <text
          x="760"
          y="105"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#166534"
        >
          オンライン資格確認等システム
        </text>
        <text
          x="760"
          y="125"
          textAnchor="middle"
          fontSize="11"
          fill="#15803D"
        >
          資格情報照会・薬剤情報・特定健診情報
        </text>

        {/* 電子処方箋管理サービス */}
        <rect
          x="610"
          y="175"
          width="300"
          height="80"
          rx="10"
          fill={hlFill("eprescription", "#DCFCE7")}
          stroke={hlStroke("eprescription", "#86EFAC")}
          strokeWidth={hlStrokeWidth("eprescription")}
        />
        <text
          x="760"
          y="205"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#166534"
        >
          電子処方箋管理サービス
        </text>
        <text
          x="760"
          y="225"
          textAnchor="middle"
          fontSize="11"
          fill="#15803D"
        >
          処方箋登録・重複投薬チェック
        </text>

        {/* オンライン請求 */}
        <rect
          x="610"
          y="280"
          width="300"
          height="80"
          rx="10"
          fill={hlFill("billing", "#DCFCE7")}
          stroke={hlStroke("billing", "#86EFAC")}
          strokeWidth={hlStrokeWidth("billing")}
        />
        <text
          x="760"
          y="310"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#166534"
        >
          オンライン請求システム
        </text>
        <text
          x="760"
          y="330"
          textAnchor="middle"
          fontSize="11"
          fill="#15803D"
        >
          レセプト電子請求・審査支払
        </text>

        {/* 鍵管理サービス */}
        <rect
          x="610"
          y="385"
          width="300"
          height="80"
          rx="10"
          fill={hlFill("keyservice", "#DCFCE7")}
          stroke={hlStroke("keyservice", "#86EFAC")}
          strokeWidth={hlStrokeWidth("keyservice")}
        />
        <text
          x="760"
          y="415"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#166534"
        >
          鍵管理サービス
        </text>
        <text
          x="760"
          y="435"
          textAnchor="middle"
          fontSize="11"
          fill="#15803D"
        >
          カードレス署名・電子証明書
        </text>

        {/* ネットワーク→外部サービス接続線 */}
        <line
          x1="545"
          y1="230"
          x2="610"
          y2="115"
          stroke="#3B82F6"
          strokeWidth="2"
          markerEnd="url(#arrow-data)"
        />
        <line
          x1="545"
          y1="260"
          x2="610"
          y2="215"
          stroke="#3B82F6"
          strokeWidth="2"
          markerEnd="url(#arrow-data)"
        />
        <line
          x1="545"
          y1="270"
          x2="610"
          y2="320"
          stroke="#3B82F6"
          strokeWidth="2"
          markerEnd="url(#arrow-data)"
        />
        <line
          x1="545"
          y1="280"
          x2="610"
          y2="425"
          stroke="#22C55E"
          strokeWidth="2"
          strokeDasharray="6 3"
          markerEnd="url(#arrow-secure)"
        />

        {/* 凡例 */}
        <g transform="translate(420, 420)">
          <text
            x="0"
            y="0"
            fontSize="11"
            fontWeight="600"
            fill="#374151"
          >
            凡例
          </text>
          <line
            x1="0"
            y1="15"
            x2="30"
            y2="15"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          <text x="36" y="19" fontSize="10" fill="#4B5563">
            データフロー
          </text>
          <line
            x1="0"
            y1="33"
            x2="30"
            y2="33"
            stroke="#22C55E"
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          <text x="36" y="37" fontSize="10" fill="#4B5563">
            セキュア接続
          </text>
          <line
            x1="0"
            y1="51"
            x2="30"
            y2="51"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          <text x="36" y="55" fontSize="10" fill="#4B5563">
            施設内接続
          </text>
        </g>
      </svg>
    </div>
  );
}
