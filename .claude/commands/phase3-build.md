# Phase 3: サイト構築

あなたはEMR標準仕様Webサイト構築プロジェクトのメインエージェントです。
Phase 3（サイト構築）のみを実行してください。

## 前提条件

`docs/content/` にMDXコンテンツファイルと `metadata.json` が存在すること。
存在しない場合は、先に `/phase2-structure` を実行してください。

## 実行手順

1. `agents/nextjs-builder.md` と `agents/visual-designer.md` をReadツールで読み込む
2. 2つのサブエージェントを**並列**でTask toolで起動する

### Next.jsサイト構築エージェント

```
Task(
  subagent_type="general-purpose",
  description="Next.jsサイト構築",
  prompt=<nextjs-builder.mdの内容> + "\n\n---\n\n## タスク指示\n\nsite/ ディレクトリにNext.js 15プロジェクトを構築してください。\n\n1. npx create-next-app@latest でプロジェクトを初期化\n2. 必要なパッケージをインストール\n3. nextjs-builder.mdに定義された全コンポーネントを実装\n4. docs/content/ のMDXコンテンツを読み込むユーティリティを実装\n5. 全ページルートを作成\n6. レスポンシブレイアウト（Sidebar + Content + ToC）を実装\n\nビジュアルデザイナーが site/src/components/diagrams/ にコンポーネントを配置するので、diagramsディレクトリとindex.tsのプレースホルダーを作成しておいてください。"
)
```

### ビジュアルデザインエージェント

```
Task(
  subagent_type="general-purpose",
  description="ビジュアルデザイン",
  prompt=<visual-designer.mdの内容> + "\n\n---\n\n## タスク指示\n\nsite/src/components/diagrams/ に以下の図表コンポーネントを作成してください:\n\n1. SystemDiagram.tsx — 電子カルテとDXサービス群の接続構成図\n2. PrescriptionWorkflowDiagram.tsx — 電子処方箋の発行〜調剤フロー\n3. AuthFlowDiagram.tsx — オンライン資格確認の認証フロー\n4. NetworkDiagram.tsx — ネットワーク構成パターン図\n5. RequirementTypeBadge.tsx — 要件類型のビジュアルガイド\n6. index.ts — 全コンポーネントのエクスポート\n\ndocs/data/ のJSONデータを参照して、図の内容を正確にしてください。\n\n注意: Next.jsビルダーがsite/ディレクトリを初期化しているので、site/src/components/diagrams/ が存在しない場合はディレクトリを作成してください。"
)
```

## 検証

- `site/` にNext.jsプロジェクトが存在すること
- `site/src/components/` に全コンポーネントが存在すること
- `site/src/components/diagrams/` に5つの図表コンポーネントが存在すること
- `cd site && npm run build` が成功すること
