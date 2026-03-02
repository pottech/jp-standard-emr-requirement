# ビジュアルデザインエージェント

## 役割

システム構成図・ワークフロー図・認証フロー図をSVG/Reactコンポーネントとして作成し、`site/src/components/diagrams/` に配置する。

## 前提条件

- Next.js 15 + TypeScript + Tailwind CSS v4 環境
- コンポーネントは `site/src/components/diagrams/` に配置
- Lucide Reactアイコンを使用可能
- SVGはReactコンポーネントとしてインラインで記述（外部SVGファイルは使用しない）
- レスポンシブ対応（viewBoxを使用し、幅は親要素に追従）

## 作成する図表コンポーネント一覧

### 1. SystemDiagram — システム連携構成図

**ファイル**: `site/src/components/diagrams/SystemDiagram.tsx`

**内容**: 電子カルテと医療DXサービス群の接続構成を示す図。

**表示要素**:
- 医療機関内システム:
  - 電子カルテ（EMR）
  - レセプトコンピュータ
  - 資格確認端末
- 接続先サービス:
  - オンライン資格確認等システム
  - 電子処方箋管理サービス
  - オンライン請求ネットワーク
- ネットワーク:
  - オンライン請求ネットワーク（閉域網）
  - 院内LAN

**レイアウト**: 左側に医療機関内システム群、右側に外部サービス群、中央にネットワーク接続線。

```tsx
interface SystemDiagramProps {
  variant?: "full" | "simplified";  // フル版 or 簡易版
  highlight?: string[];              // ハイライトするノード
}
```

### 2. PrescriptionWorkflowDiagram — 電子処方箋フロー図

**ファイル**: `site/src/components/diagrams/PrescriptionWorkflowDiagram.tsx`

**内容**: 電子処方箋の発行から調剤までの一連のフロー。

**フロー**:
1. 医師が処方箋を作成（電子カルテ）
2. 電子署名を付与（HPKI/カードレス）
3. 電子処方箋管理サービスに登録
4. 患者に引換番号を発行
5. 患者が薬局で引換番号を提示
6. 薬局が処方箋を受け取り
7. 重複投薬チェック
8. 調剤結果を登録

**レイアウト**: 上から下への縦フロー、またはスイムレーン形式（医師・患者・薬局・サービスの4レーン）。

```tsx
interface PrescriptionWorkflowDiagramProps {
  flow?: "issuance" | "dispensing" | "full";
}
```

### 3. AuthFlowDiagram — 認証フロー図

**ファイル**: `site/src/components/diagrams/AuthFlowDiagram.tsx`

**内容**: オンライン資格確認の認証フロー。

**表示パターン**:
- **マイナンバーカード（PIN無し認証）**: 顔認証付きカードリーダー → 顔照合 → 資格確認
- **マイナンバーカード（PIN認証）**: カードリーダー → 4桁PIN入力 → 資格確認
- **スマートフォン（Android）**: PIN入力 → 電子証明書検証
- **スマートフォン（iPhone）**: 生体認証 → 電子証明書検証
- **資格確認書**: 記号番号入力 → 資格確認

```tsx
interface AuthFlowDiagramProps {
  method: "pinless" | "pin" | "android" | "iphone" | "document";
}
```

### 4. NetworkDiagram — ネットワーク構成図

**ファイル**: `site/src/components/diagrams/NetworkDiagram.tsx`

**内容**: 接続方式別のネットワーク構成パターン。

**表示パターン**:
- **IP-VPN方式**: IPv4（請求）+ IPv6（資格確認）のデュアルスタック
- **IPsec+IKE ルータ型**: IPv4のみ、専用ルータ経由
- **IPsec+IKE クライアント型**: VPNクライアントソフト使用

**表示要素**:
- 医療機関内ネットワーク（LAN）
- 資格確認端末
- VPNルータ / VPNクライアント
- オンライン請求ネットワーク
- 各種サーバー

```tsx
interface NetworkDiagramProps {
  pattern: "ip-vpn" | "ipsec-router" | "ipsec-client";
}
```

### 5. RequirementTypeBadge — 要件類型ビジュアルガイド

**ファイル**: `site/src/components/diagrams/RequirementTypeBadge.tsx`

**内容**: 要件の4類型（遵守/推奨/不可/参考）の意味と視覚的な使い分けを説明するインフォグラフィック。

```tsx
interface RequirementTypeBadgeProps {
  showAll?: boolean;    // 全類型を表示
  type?: "遵守" | "推奨" | "不可" | "参考";  // 特定の類型のみ表示
}
```

## デザインガイドライン

### 色使い

```
// ノード（ボックス）の色
医療機関内システム: bg-blue-50, border-blue-300, text-blue-800
外部サービス: bg-green-50, border-green-300, text-green-800
ネットワーク: bg-gray-50, border-gray-300, text-gray-600
セキュリティ: bg-amber-50, border-amber-300, text-amber-800
ハイライト: bg-indigo-100, border-indigo-500

// 接続線の色
通常: stroke-gray-400
データフロー: stroke-blue-500
セキュア接続: stroke-green-500 (破線)
```

### SVG実装パターン

```tsx
"use client";

import React from 'react';

export function ExampleDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 800 500"
        className="w-full max-w-4xl mx-auto"
        role="img"
        aria-label="システム構成図"
      >
        {/* 背景 */}
        <rect x="0" y="0" width="800" height="500" fill="white" />

        {/* ノード */}
        <g transform="translate(50, 100)">
          <rect
            width="180"
            height="60"
            rx="8"
            fill="#EFF6FF"
            stroke="#93C5FD"
            strokeWidth="2"
          />
          <text
            x="90"
            y="35"
            textAnchor="middle"
            className="text-sm font-medium"
            fill="#1E40AF"
          >
            電子カルテ
          </text>
        </g>

        {/* 接続線 */}
        <line
          x1="230"
          y1="130"
          x2="400"
          y2="130"
          stroke="#94A3B8"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />

        {/* 矢印マーカー定義 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
```

### レスポンシブ対応

- `viewBox` で固定座標系を使用し、`width="100%"` でコンテナに追従
- 小画面では横スクロール可能にする（`overflow-x-auto`）
- テキストサイズはSVG内でpx指定（viewBoxスケーリングで自動縮小）

### アクセシビリティ

- `<svg>` に `role="img"` と `aria-label` を設定
- 重要なノードに `<title>` 要素を付与
- 色だけでなくテキストラベルで情報を伝達する

## コンポーネントのエクスポート

```tsx
// site/src/components/diagrams/index.ts
export { SystemDiagram } from './SystemDiagram';
export { PrescriptionWorkflowDiagram } from './PrescriptionWorkflowDiagram';
export { AuthFlowDiagram } from './AuthFlowDiagram';
export { NetworkDiagram } from './NetworkDiagram';
export { RequirementTypeBadge } from './RequirementTypeBadge';
```

## 注意事項

- 全コンポーネントは `"use client"` を指定する（インタラクティブなハイライト等のため）
- SVGの座標は手動で計算し、viewBox内に収まるようにする
- 日本語テキストを使用する。フォントはシステムフォントに依存する
- 複雑な図は段階的に描画し、ユーザーの理解を助ける（アニメーションは初期実装では不要）
- 各コンポーネントにはPropsのJSDocコメントを付与する
