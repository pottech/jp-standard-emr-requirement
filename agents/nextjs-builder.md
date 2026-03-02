# Next.jsサイト構築エージェント

## 役割

Next.js App Routerベースのサイトを `site/` ディレクトリに構築する。`docs/content/` のMDXコンテンツを表示するための完全なWebアプリケーションを実装する。

## 技術スタック

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **MDX** (`@next/mdx` または `next-mdx-remote`）
- **Lucide React**（アイコン）

## プロジェクト構成

```
site/
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx              # ルートレイアウト（Sidebar含む）
│   │   ├── page.tsx                # トップページ
│   │   ├── emr/
│   │   │   ├── page.tsx            # EMR概要
│   │   │   ├── clinic/
│   │   │   │   ├── page.tsx        # 診療所EMR概要
│   │   │   │   ├── functional/page.tsx
│   │   │   │   ├── non-functional/page.tsx
│   │   │   │   ├── architecture/page.tsx
│   │   │   │   ├── data-migration/page.tsx
│   │   │   │   ├── integration/page.tsx
│   │   │   │   └── disclosure/page.tsx
│   │   │   └── hospital/
│   │   │       └── ...（同構成）
│   │   ├── rececom/
│   │   │   └── ...（EMRと同構成）
│   │   ├── e-prescription/
│   │   │   ├── page.tsx
│   │   │   ├── overview/page.tsx
│   │   │   ├── api/page.tsx
│   │   │   ├── workflow/page.tsx
│   │   │   └── signature/page.tsx
│   │   ├── qualification/
│   │   │   ├── page.tsx
│   │   │   ├── overview/page.tsx
│   │   │   ├── authentication/page.tsx
│   │   │   ├── network/page.tsx
│   │   │   └── security/page.tsx
│   │   ├── glossary/page.tsx
│   │   └── comparison/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # サイドバーナビゲーション
│   │   │   ├── Header.tsx           # ヘッダー
│   │   │   ├── Footer.tsx           # フッター
│   │   │   ├── TableOfContents.tsx  # ページ内目次
│   │   │   └── Breadcrumb.tsx       # パンくずリスト
│   │   ├── content/
│   │   │   ├── RequirementCard.tsx   # 要件カード
│   │   │   ├── RequirementSummary.tsx # 要件サマリー
│   │   │   ├── ComparisonTable.tsx   # 比較表
│   │   │   ├── ApiSpecTable.tsx      # API仕様テーブル
│   │   │   ├── WorkflowStep.tsx      # ワークフローステップ
│   │   │   ├── GlossaryEntry.tsx     # 用語解説カード
│   │   │   └── GlossarySearch.tsx    # 用語検索
│   │   └── diagrams/                 # ビジュアルデザイナーが作成
│   │       ├── SystemDiagram.tsx
│   │       ├── WorkflowDiagram.tsx
│   │       ├── NetworkDiagram.tsx
│   │       └── AuthFlowDiagram.tsx
│   ├── lib/
│   │   ├── content.ts               # MDXコンテンツ読み込みユーティリティ
│   │   ├── navigation.ts            # ナビゲーションデータ
│   │   └── types.ts                 # 型定義
│   └── styles/
│       └── globals.css              # グローバルスタイル
```

## コンポーネント仕様

### RequirementCard

要件項目を表示するカード。類型（遵守/推奨/不可/参考）をバッジ色で視覚的に区別する。

```tsx
interface RequirementCardProps {
  id: string;           // "F-001"
  title: string;        // 要件名
  type: "遵守" | "推奨" | "不可" | "参考";
  section?: string;     // 原文の章番号
  children: React.ReactNode; // 要件の詳細説明
}

// バッジ色
// 遵守: blue (bg-blue-100 text-blue-800)
// 推奨: green (bg-green-100 text-green-800)
// 不可: red (bg-red-100 text-red-800)
// 参考: gray (bg-gray-100 text-gray-800)
```

### RequirementSummary

要件の集計サマリーを表示する。

```tsx
interface RequirementSummaryProps {
  total: number;
  compliance: number;   // 遵守
  recommended: number;  // 推奨
  prohibited: number;   // 不可
  reference: number;    // 参考
}
```

### ComparisonTable

診療所と病院の要件を並べて比較する表。

```tsx
interface ComparisonTableProps {
  categories: string[];
  items: Array<{
    category: string;
    requirement: string;
    clinic: { type: string; details: string };
    hospital: { type: string; details: string };
    difference: string;
  }>;
}
```

### ApiSpecTable

API仕様一覧テーブル。インターフェースIDでソート可能。

```tsx
interface ApiSpecTableProps {
  specs: Array<{
    interfaceId: string;
    name: string;
    function: string;
    direction: "request" | "response";
    description: string;
  }>;
}
```

### WorkflowStep

ワークフローの各ステップを表示する。

```tsx
interface WorkflowStepProps {
  order: number;
  actor: string;
  action: string;
  children: React.ReactNode;
}
```

### GlossaryEntry

用語解説カード。

```tsx
interface GlossaryEntryProps {
  term: string;
  reading?: string;
  english?: string;
  children: React.ReactNode;
}
```

### GlossarySearch

用語をクライアントサイドで検索するコンポーネント。

```tsx
// クライアントコンポーネント（"use client"）
// input フィールドでフィルタリング
```

### Sidebar

左側のサイドバーナビゲーション。`docs/content/metadata.json` のナビゲーション構造に従い、折りたたみ可能なツリーを表示する。

```tsx
// モバイル時はハンバーガーメニューで開閉
// 現在のページをハイライト
// セクション単位で折りたたみ可能
```

### TableOfContents

ページ右側に表示される目次。MDXコンテンツのh2/h3見出しを自動的にリスト化する。

```tsx
// デスクトップのみ表示（lg:block）
// スクロール追従でアクティブ見出しをハイライト
```

## レイアウト設計

```
┌──────────────────────────────────────────────┐
│  Header（サイトタイトル、検索）                    │
├────────┬───────────────────────────┬──────────┤
│        │                           │          │
│ Side-  │   Main Content            │  Table   │
│ bar    │   (MDX rendered)          │  of      │
│ (240px)│                           │  Contents│
│        │                           │  (200px) │
│        │                           │          │
├────────┴───────────────────────────┴──────────┤
│  Footer                                       │
└──────────────────────────────────────────────┘
```

- **デスクトップ** (≥1024px): Sidebar + Content + ToC の3カラム
- **タブレット** (768-1023px): Sidebar + Content の2カラム（ToC非表示）
- **モバイル** (<768px): Content のみ（Sidebarはハンバーガーメニュー）

## ページ実装方針

各ページは以下のパターンで実装する:

```tsx
// src/app/emr/clinic/functional/page.tsx
import { getContent } from '@/lib/content';
import { RequirementCard } from '@/components/content/RequirementCard';

export default async function FunctionalPage() {
  const content = await getContent('emr/clinic/functional');

  return (
    <article className="prose prose-lg max-w-none">
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      {/* MDXコンテンツまたはJSONデータからレンダリング */}
    </article>
  );
}
```

## スタイリング方針

- **Tailwind CSS v4** を使用
- **カラーパレット**:
  - Primary: blue系（政府系サイトに適した信頼感のある色）
  - 遵守: blue-600
  - 推奨: green-600
  - 不可: red-600
  - 参考: gray-500
- **タイポグラフィ**: `@tailwindcss/typography` の `prose` クラスでMDXコンテンツを整形
- **ダークモード**: 初期実装では対応しない（将来対応を考慮した構成にする）

## セットアップ手順

1. `npx create-next-app@latest site --typescript --tailwind --app --src-dir`
2. 必要なパッケージのインストール:
   ```bash
   cd site
   npm install lucide-react @next/mdx @mdx-js/loader @mdx-js/react
   npm install -D @tailwindcss/typography @types/mdx
   ```
3. `next.config.ts` にMDX設定を追加
4. コンポーネントの実装
5. ページの実装
6. `docs/content/` からコンテンツを読み込むユーティリティの実装

## ビルド検証

```bash
cd site
npm run build    # ビルドが成功すること
npm run dev      # ローカルでサイトが表示されること
```

## 注意事項

- MDXコンテンツは `docs/content/` に配置されるため、`site/` からの相対パスで参照する
- ビジュアルデザイナーが `src/components/diagrams/` にコンポーネントを配置する。ビルダーは空のプレースホルダーを作成しておく
- Lucide Reactアイコンは必要に応じてインポートする（バンドルサイズに注意）
- Server Componentsをデフォルトとし、クライアント操作が必要なコンポーネントのみ `"use client"` を付与する
- `metadata` エクスポートを各ページに設定し、SEOを考慮する
