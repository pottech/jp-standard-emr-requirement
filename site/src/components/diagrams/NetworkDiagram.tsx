"use client";

import React from "react";

interface NetworkDiagramProps {
  pattern: "ip-vpn" | "ipsec-router" | "ipsec-client";
}

interface PatternData {
  title: string;
  description: string;
  protocol: string;
  characteristics: string[];
}

const PATTERN_DATA: Record<NetworkDiagramProps["pattern"], PatternData> = {
  "ip-vpn": {
    title: "IP-VPN接続方式",
    description: "閉域IP網を利用した接続方式",
    protocol: "IPv4（オンライン請求）+ IPv6（オンライン資格確認等）",
    characteristics: [
      "閉域IP網による安全な接続",
      "PPPoEセッション（IPv4）",
      "IPoEセッション（IPv6）",
    ],
  },
  "ipsec-router": {
    title: "IPsec+IKE接続方式（ルーター型）",
    description: "インターネット経由でIPsecトンネルにより安全な接続を確保",
    protocol: "IPv4",
    characteristics: [
      "インターネット経由",
      "IPsecトンネル暗号化",
      "専用ルータでIPsec構成",
    ],
  },
  "ipsec-client": {
    title: "IPsec+IKE接続方式（クライアント型）",
    description:
      "インターネット経由でクライアント端末側からIPsec接続",
    protocol: "IPv4",
    characteristics: [
      "インターネット経由",
      "クライアント側IPsec",
      "VPNパススルー設定",
    ],
  },
};

export function NetworkDiagram({ pattern }: NetworkDiagramProps) {
  const data = PATTERN_DATA[pattern];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 800 500"
        className="w-full max-w-4xl mx-auto"
        role="img"
        aria-label={`${data.title}のネットワーク構成図`}
      >
        <defs>
          <marker
            id="arrow-net"
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
            id="arrow-net-gray"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#94A3B8" />
          </marker>
          <marker
            id="arrow-net-green"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#22C55E" />
          </marker>
        </defs>

        {/* Title bar */}
        <rect
          x="20"
          y="10"
          width="760"
          height="50"
          rx="10"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        <text
          x="400"
          y="32"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#1F2937"
        >
          {data.title}
        </text>
        <text
          x="400"
          y="50"
          textAnchor="middle"
          fontSize="11"
          fill="#6B7280"
        >
          {data.description} ／ プロトコル: {data.protocol}
        </text>

        {/* === 左側: 医療機関内 === */}
        <rect
          x="20"
          y="80"
          width="280"
          height="400"
          rx="14"
          fill="#EFF6FF"
          stroke="#93C5FD"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="106"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#1E40AF"
        >
          医療機関内ネットワーク
        </text>

        {/* 電子カルテ */}
        <rect
          x="45"
          y="125"
          width="230"
          height="50"
          rx="8"
          fill="#DBEAFE"
          stroke="#93C5FD"
          strokeWidth="1"
        />
        <text
          x="160"
          y="148"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#1E40AF"
        >
          電子カルテシステム
        </text>
        <text
          x="160"
          y="164"
          textAnchor="middle"
          fontSize="9"
          fill="#3B82F6"
        >
          診療記録・処方管理
        </text>

        {/* レセコン */}
        <rect
          x="45"
          y="195"
          width="230"
          height="50"
          rx="8"
          fill="#DBEAFE"
          stroke="#93C5FD"
          strokeWidth="1"
        />
        <text
          x="160"
          y="218"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#1E40AF"
        >
          レセプトコンピュータ
        </text>
        <text
          x="160"
          y="234"
          textAnchor="middle"
          fontSize="9"
          fill="#3B82F6"
        >
          診療報酬請求
        </text>

        {/* ルータA (施設内) */}
        <rect
          x="85"
          y="270"
          width="150"
          height="40"
          rx="8"
          fill="#F9FAFB"
          stroke="#D1D5DB"
          strokeWidth="1"
        />
        <text
          x="160"
          y="295"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#4B5563"
        >
          ルータA（施設内）
        </text>

        {/* Firewall indicator */}
        <rect
          x="85"
          y="326"
          width="150"
          height="32"
          rx="6"
          fill="#FEF3C7"
          stroke="#F59E0B"
          strokeWidth="1"
        />
        <text
          x="160"
          y="347"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="#92400E"
        >
          ステートフルインスペクション
        </text>

        {/* 資格確認端末 */}
        <rect
          x="45"
          y="378"
          width="230"
          height="50"
          rx="8"
          fill="#FFFBEB"
          stroke="#FCD34D"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="401"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#92400E"
        >
          資格確認端末
        </text>
        <text
          x="160"
          y="417"
          textAnchor="middle"
          fontSize="9"
          fill="#B45309"
        >
          連携ソフト・マイナカード処理ソフト
        </text>

        {/* 施設内接続線 */}
        <line
          x1="160"
          y1="175"
          x2="160"
          y2="195"
          stroke="#94A3B8"
          strokeWidth="1"
          markerEnd="url(#arrow-net-gray)"
        />
        <line
          x1="160"
          y1="245"
          x2="160"
          y2="270"
          stroke="#94A3B8"
          strokeWidth="1"
          markerEnd="url(#arrow-net-gray)"
        />
        <line
          x1="160"
          y1="310"
          x2="160"
          y2="326"
          stroke="#94A3B8"
          strokeWidth="1"
        />
        <line
          x1="160"
          y1="358"
          x2="160"
          y2="378"
          stroke="#94A3B8"
          strokeWidth="1"
          markerEnd="url(#arrow-net-gray)"
        />

        {/* セッション方向の注釈 */}
        <text
          x="285"
          y="355"
          fontSize="8"
          fill="#9CA3AF"
          textAnchor="start"
        >
          レセコン→端末のみ許可
        </text>
        <text
          x="285"
          y="367"
          fontSize="8"
          fill="#9CA3AF"
          textAnchor="start"
        >
          端末→レセコンは拒否
        </text>

        {/* === 中央: ネットワーク部分（パターン別） === */}
        {pattern === "ip-vpn" && (
          <g>
            {/* 閉域IP網 */}
            <rect
              x="330"
              y="160"
              width="140"
              height="260"
              rx="12"
              fill="#F0FDF4"
              stroke="#86EFAC"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
            <text
              x="400"
              y="185"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#166534"
            >
              閉域IP網
            </text>

            {/* IPv4 PPPoE */}
            <rect
              x="345"
              y="200"
              width="110"
              height="45"
              rx="6"
              fill="#DCFCE7"
              stroke="#86EFAC"
              strokeWidth="1"
            />
            <text
              x="400"
              y="218"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#166534"
            >
              IPv4 PPPoE
            </text>
            <text
              x="400"
              y="234"
              textAnchor="middle"
              fontSize="9"
              fill="#15803D"
            >
              オンライン請求
            </text>

            {/* IPv6 IPoE */}
            <rect
              x="345"
              y="260"
              width="110"
              height="45"
              rx="6"
              fill="#DCFCE7"
              stroke="#86EFAC"
              strokeWidth="1"
            />
            <text
              x="400"
              y="278"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#166534"
            >
              IPv6 IPoE
            </text>
            <text
              x="400"
              y="294"
              textAnchor="middle"
              fontSize="9"
              fill="#15803D"
            >
              オンライン資格確認
            </text>

            {/* ONU */}
            <rect
              x="360"
              y="330"
              width="80"
              height="32"
              rx="6"
              fill="#F9FAFB"
              stroke="#D1D5DB"
              strokeWidth="1"
            />
            <text
              x="400"
              y="350"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#4B5563"
            >
              ONU
            </text>

            <text
              x="400"
              y="395"
              textAnchor="middle"
              fontSize="9"
              fill="#6B7280"
            >
              光回線
            </text>

            {/* 接続線 */}
            <line
              x1="275"
              y1="403"
              x2="345"
              y2="346"
              stroke="#3B82F6"
              strokeWidth="1.5"
              markerEnd="url(#arrow-net)"
              markerStart="url(#arrow-net)"
            />
            <line
              x1="400"
              y1="305"
              x2="400"
              y2="330"
              stroke="#94A3B8"
              strokeWidth="1"
            />
          </g>
        )}

        {pattern === "ipsec-router" && (
          <g>
            {/* インターネット */}
            <rect
              x="330"
              y="160"
              width="140"
              height="260"
              rx="12"
              fill="#FEF2F2"
              stroke="#FCA5A5"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
            <text
              x="400"
              y="185"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#991B1B"
            >
              インターネット
            </text>

            {/* IPsecトンネル */}
            <rect
              x="345"
              y="210"
              width="110"
              height="70"
              rx="6"
              fill="#DCFCE7"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text
              x="400"
              y="235"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#166534"
            >
              IPsecトンネル
            </text>
            <text
              x="400"
              y="252"
              textAnchor="middle"
              fontSize="9"
              fill="#15803D"
            >
              暗号化通信
            </text>
            <text
              x="400"
              y="268"
              textAnchor="middle"
              fontSize="9"
              fill="#15803D"
            >
              IPv4
            </text>

            {/* ルータB（IPsec） */}
            <rect
              x="350"
              y="310"
              width="100"
              height="40"
              rx="6"
              fill="#FFFBEB"
              stroke="#FCD34D"
              strokeWidth="1.5"
            />
            <text
              x="400"
              y="330"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#92400E"
            >
              ルータB
            </text>
            <text
              x="400"
              y="344"
              textAnchor="middle"
              fontSize="8"
              fill="#B45309"
            >
              IPsec構成
            </text>

            <text
              x="400"
              y="390"
              textAnchor="middle"
              fontSize="9"
              fill="#6B7280"
            >
              回線帯域増強推奨
            </text>

            {/* 接続線 */}
            <line
              x1="275"
              y1="403"
              x2="350"
              y2="330"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              markerEnd="url(#arrow-net-green)"
              markerStart="url(#arrow-net-green)"
            />
            <line
              x1="400"
              y1="280"
              x2="400"
              y2="310"
              stroke="#94A3B8"
              strokeWidth="1"
            />
          </g>
        )}

        {pattern === "ipsec-client" && (
          <g>
            {/* インターネット */}
            <rect
              x="330"
              y="160"
              width="140"
              height="260"
              rx="12"
              fill="#FEF2F2"
              stroke="#FCA5A5"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
            <text
              x="400"
              y="185"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#991B1B"
            >
              インターネット
            </text>

            {/* IPsecトンネル（クライアント起点） */}
            <rect
              x="345"
              y="210"
              width="110"
              height="70"
              rx="6"
              fill="#DCFCE7"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text
              x="400"
              y="232"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#166534"
            >
              IPsecトンネル
            </text>
            <text
              x="400"
              y="249"
              textAnchor="middle"
              fontSize="9"
              fill="#15803D"
            >
              クライアント側で実行
            </text>
            <text
              x="400"
              y="268"
              textAnchor="middle"
              fontSize="9"
              fill="#15803D"
            >
              IPv4
            </text>

            {/* ルータB（VPNパススルー） */}
            <rect
              x="350"
              y="310"
              width="100"
              height="40"
              rx="6"
              fill="#FFFBEB"
              stroke="#FCD34D"
              strokeWidth="1.5"
            />
            <text
              x="400"
              y="330"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#92400E"
            >
              ルータB
            </text>
            <text
              x="400"
              y="344"
              textAnchor="middle"
              fontSize="8"
              fill="#B45309"
            >
              VPNパススルー
            </text>

            <text
              x="400"
              y="390"
              textAnchor="middle"
              fontSize="9"
              fill="#6B7280"
            >
              端末側でIPsec実行
            </text>

            {/* 接続線 */}
            <line
              x1="275"
              y1="403"
              x2="350"
              y2="330"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              markerEnd="url(#arrow-net-green)"
              markerStart="url(#arrow-net-green)"
            />
            <line
              x1="400"
              y1="280"
              x2="400"
              y2="310"
              stroke="#94A3B8"
              strokeWidth="1"
            />
          </g>
        )}

        {/* === 右側: 外部サービス === */}
        <rect
          x="500"
          y="80"
          width="280"
          height="400"
          rx="14"
          fill="#F0FDF4"
          stroke="#86EFAC"
          strokeWidth="1.5"
        />
        <text
          x="640"
          y="106"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#166534"
        >
          支払基金・国保中央会
        </text>

        {/* オンライン資格確認サーバ */}
        <rect
          x="525"
          y="125"
          width="230"
          height="50"
          rx="8"
          fill="#DCFCE7"
          stroke="#86EFAC"
          strokeWidth="1"
        />
        <text
          x="640"
          y="148"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#166534"
        >
          オンライン資格確認等システム
        </text>
        <text
          x="640"
          y="164"
          textAnchor="middle"
          fontSize="9"
          fill="#15803D"
        >
          資格情報DB・薬剤情報・特定健診情報
        </text>

        {/* 電子処方箋管理サーバ */}
        <rect
          x="525"
          y="195"
          width="230"
          height="50"
          rx="8"
          fill="#DCFCE7"
          stroke="#86EFAC"
          strokeWidth="1"
        />
        <text
          x="640"
          y="218"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#166534"
        >
          電子処方箋管理サービス
        </text>
        <text
          x="640"
          y="234"
          textAnchor="middle"
          fontSize="9"
          fill="#15803D"
        >
          処方箋登録・重複チェック
        </text>

        {/* オンライン請求サーバ */}
        <rect
          x="525"
          y="265"
          width="230"
          height="50"
          rx="8"
          fill="#DCFCE7"
          stroke="#86EFAC"
          strokeWidth="1"
        />
        <text
          x="640"
          y="288"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#166534"
        >
          オンライン請求システム
        </text>
        <text
          x="640"
          y="304"
          textAnchor="middle"
          fontSize="9"
          fill="#15803D"
        >
          レセプト受付・審査支払
        </text>

        {/* セキュリティ対策 */}
        <rect
          x="525"
          y="340"
          width="230"
          height="50"
          rx="8"
          fill="#FEF3C7"
          stroke="#F59E0B"
          strokeWidth="1"
        />
        <text
          x="640"
          y="363"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#92400E"
        >
          セキュリティ対策
        </text>
        <text
          x="640"
          y="379"
          textAnchor="middle"
          fontSize="9"
          fill="#B45309"
        >
          アクセス制限・暗号化・監視
        </text>

        {/* 外部→ネットワーク接続線 */}
        <line
          x1="470"
          y1="220"
          x2="525"
          y2="150"
          stroke="#3B82F6"
          strokeWidth="1.5"
          markerEnd="url(#arrow-net)"
          markerStart="url(#arrow-net)"
        />
        <line
          x1="470"
          y1="245"
          x2="525"
          y2="220"
          stroke="#3B82F6"
          strokeWidth="1.5"
          markerEnd="url(#arrow-net)"
          markerStart="url(#arrow-net)"
        />
        <line
          x1="470"
          y1="270"
          x2="525"
          y2="290"
          stroke="#3B82F6"
          strokeWidth="1.5"
          markerEnd="url(#arrow-net)"
          markerStart="url(#arrow-net)"
        />

        {/* 特性リスト */}
        <g transform="translate(525, 410)">
          <text
            x="0"
            y="0"
            fontSize="10"
            fontWeight="600"
            fill="#374151"
          >
            接続特性:
          </text>
          {data.characteristics.map((char, i) => (
            <text
              key={i}
              x="0"
              y={16 + i * 14}
              fontSize="9"
              fill="#6B7280"
            >
              ・{char}
            </text>
          ))}
        </g>

        {/* 凡例 */}
        <g transform="translate(20, 485)">
          <text
            x="0"
            y="0"
            fontSize="10"
            fontWeight="600"
            fill="#374151"
          >
            凡例:
          </text>
          <line
            x1="40"
            y1="-3"
            x2="65"
            y2="-3"
            stroke="#3B82F6"
            strokeWidth="1.5"
          />
          <text x="70" y="0" fontSize="9" fill="#4B5563">
            データフロー
          </text>
          <line
            x1="145"
            y1="-3"
            x2="170"
            y2="-3"
            stroke="#22C55E"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <text x="175" y="0" fontSize="9" fill="#4B5563">
            暗号化接続
          </text>
          <line
            x1="250"
            y1="-3"
            x2="275"
            y2="-3"
            stroke="#94A3B8"
            strokeWidth="1"
          />
          <text x="280" y="0" fontSize="9" fill="#4B5563">
            施設内接続
          </text>
          <rect
            x="355"
            y="-10"
            width="14"
            height="14"
            rx="3"
            fill="#FEF3C7"
            stroke="#F59E0B"
            strokeWidth="0.75"
          />
          <text x="375" y="0" fontSize="9" fill="#4B5563">
            セキュリティ制御
          </text>
        </g>
      </svg>
    </div>
  );
}
