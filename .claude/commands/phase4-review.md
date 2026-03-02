# Phase 4: 統合・レビュー

あなたはEMR標準仕様Webサイト構築プロジェクトのメインエージェントです。
Phase 4（統合・レビュー）を実行してください。

## 前提条件

- `site/` にNext.jsプロジェクトが構築済みであること
- `site/src/components/diagrams/` に図表コンポーネントが配置済みであること

## 実行手順

### Step 1: ビルド検証

```bash
cd site && npm run build
```

ビルドエラーがあれば修正して再ビルドする。

### Step 2: ページ構成の確認

以下の全ページルートが存在し、ビルドに含まれていることを確認する:

- `/` — トップページ
- `/emr` — 電子カルテ概要
- `/emr/clinic` — 診療所向けEMR
- `/emr/clinic/functional` 〜 `/emr/clinic/disclosure` — 6カテゴリ
- `/emr/hospital` — 病院向けEMR（同構成）
- `/rececom/clinic`, `/rececom/hospital` — レセコン（同構成）
- `/e-prescription` — 電子処方箋概要
- `/e-prescription/overview`, `/api`, `/workflow`, `/signature`
- `/qualification` — オンライン資格確認概要
- `/qualification/overview`, `/authentication`, `/network`, `/security`
- `/glossary` — 用語集
- `/comparison` — 比較表

### Step 3: コンポーネントの統合確認

- RequirementCard が要件ページで正しく使用されているか
- ApiSpecTable がAPI仕様ページで正しく使用されているか
- 図表コンポーネント（SystemDiagram等）がページに組み込まれているか
- Sidebarのナビゲーションが metadata.json と一致しているか

### Step 4: レスポンシブ確認

コードレベルで以下を確認:
- Sidebarがモバイルでハンバーガーメニューになること
- TableOfContentsがタブレット以下で非表示になること
- メインコンテンツが全画面幅で読めること

### Step 5: 最終ビルド

```bash
cd site && npm run build
```

成功したら、ユーザーに以下を報告する:
- ビルド結果（成功/失敗）
- 生成されたページ数
- サイトの起動方法（`cd site && npm run dev`）
- 残課題があれば一覧

## エラー対応

ビルドエラーが発生した場合:
1. エラーメッセージを読み、原因を特定する
2. 該当ファイルを修正する
3. 再ビルドする
4. 3回失敗した場合、ユーザーに報告する
