# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

国が定めた電子カルテ・レセプトコンピュータの標準要件を、Next.js Webサイトとして分かりやすく公開するプロジェクト。

PDF仕様書をClaude Codeのエージェントシステムで読み解き、構造化し、Next.jsサイトとして構築する。

## Repository Structure

- `refarrences/` — PDF仕様書（原本）
  - `医科診療所向け電子カルテ及びレセプトコンピュータ標準仕様書（基本要件）（案）.pdf`（60頁）— 診療所向けEMR・レセコンの基本要件
  - `中小病院向け電子カルテ及びレセプトコンピュータ標準仕様書（基本要件）（案）.pdf`（60頁）— 病院向けEMR・レセコンの基本要件
  - `電子処方箋管理サービスの導入に関するシステムベンダ向け技術解説書【医療機関・薬局】.pdf`（270頁超）— API仕様、電子署名、ワークフロー
  - `オンライン資格確認等システムの導入に関するシステムベンダ向け技術解説書【医療機関・薬局】.pdf`（200頁超）— 認証、ネットワーク構成、セキュリティ
- `docs/` — 構造化データ出力先
  - `docs/data/` — PDF解析結果（JSON）
  - `docs/content/` — MDXコンテンツファイル
- `agents/` — サブエージェントのプロンプト定義
- `site/` — Next.jsプロジェクト（構築後）

## Main Agent Role — プロジェクトオーケストレーター

このCLAUDE.mdを読むClaude Codeインスタンスが**メインエージェント**として機能する。

### 責務

1. **ワークフロー管理**: Phase 1〜4の実行順序を制御する
2. **サブエージェント呼び出し**: Task toolで各エージェントを起動する
3. **品質レビュー**: 各フェーズの成果物を検証する
4. **統合**: 全成果物を最終サイトに統合する

### ワークフロー

```
Phase 1: PDF解析（並列実行可）
  ├─ PDF解析エージェント × 4文書（2並列 × 2回）
  └─ 出力: docs/data/*.json

Phase 2: コンテンツ構造化
  ├─ コンテンツ構造化エージェント
  └─ 出力: docs/content/**/*.mdx + メタデータJSON

Phase 3: サイト構築（並列実行可）
  ├─ Next.jsサイト構築エージェント（プロジェクト初期化 + コンポーネント + ページ）
  └─ ビジュアルデザインエージェント（図表コンポーネント作成）

Phase 4: 統合・レビュー
  ├─ メインエージェントが全体を統合
  └─ ビルド確認 + 修正
```

### サブエージェント呼び出し規約

サブエージェントは `agents/` ディレクトリのプロンプト定義を読み込み、Task toolで起動する。

```
# 呼び出しパターン
Task(
  subagent_type="general-purpose",
  prompt=<agents/xxx.mdの内容をReadで読み取った文字列> + "\n\n---\n\n" + <タスク固有の指示>
)
```

**並列実行ルール**:
- Phase 1: 4文書を2並列ずつ処理（メモリ考慮）
- Phase 3: Next.jsビルダーとビジュアルデザイナーは並列実行可
- 各サブエージェントの出力ファイルパスを事前に指定し、競合を防ぐ

**エラーハンドリング**:
- サブエージェントが失敗した場合、エラー内容を確認して再試行する
- 3回失敗した場合、ユーザーに報告して判断を仰ぐ

## Working with PDFs

Read toolの `pages` パラメータでPDFを読み取る（1回あたり最大20ページ）。全文書は日本語。

```
Read(file_path="refarrences/xxx.pdf", pages="1-20")
```

## Tech Stack（サイト構築時）

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- MDX（コンテンツ管理）
- Lucide React（アイコン）

## 検証方法

1. `npm run build` — Next.jsビルドが成功すること
2. `npm run dev` — ローカルでサイトが正常に表示されること
3. 全ページが表示され、要件一覧・API仕様・用語集が正しく描画されること
4. レスポンシブデザインが機能すること

## Notes

- `refarrences/` ディレクトリ名は "references" のタイポだがそのまま維持する
- `RAEDME.md` は空ファイル（README.md のタイポ）
