# エージェント定義一覧

EMR標準仕様 Webサイト構築プロジェクトで使用するサブエージェントの定義ファイル。

## エージェント一覧

| エージェント | ファイル | 役割 | Phase |
|---|---|---|---|
| PDF解析 | `pdf-analyzer.md` | PDF仕様書を読み取り、構造化JSONデータとして出力 | Phase 1 |
| コンテンツ構造化 | `content-structurer.md` | 抽出データをWebサイトのページ構成（MDX）に変換 | Phase 2 |
| Next.jsサイト構築 | `nextjs-builder.md` | Next.js App Routerベースのサイトを構築 | Phase 3 |
| ビジュアルデザイン | `visual-designer.md` | システム構成図・ワークフロー図をSVG/Reactコンポーネントとして作成 | Phase 3 |

## スラッシュコマンド

メインエージェントを起動するためのカスタムスラッシュコマンドが `.claude/commands/` に定義されている。

| コマンド | 説明 | 実行内容 |
|---|---|---|
| `/build-site` | **全体ビルド** | Phase 1〜4を順番に全て実行 |
| `/phase1-analyze` | **PDF解析のみ** | 4つのPDFを解析し `docs/data/*.json` を生成 |
| `/phase2-structure` | **コンテンツ構造化のみ** | JSONデータをMDXに変換 |
| `/phase3-build` | **サイト構築のみ** | Next.jsプロジェクト構築 + 図表コンポーネント作成 |
| `/phase4-review` | **統合・レビューのみ** | ビルド検証 + エラー修正 |

### 使い方

Claude Codeで以下のように実行する:

```
# 全体を一括実行
/build-site

# フェーズを個別に実行（デバッグ・再実行時に便利）
/phase1-analyze
/phase2-structure
/phase3-build
/phase4-review
```

## 呼び出し方法（詳細）

メインエージェント（CLAUDE.mdを読むClaude Codeインスタンス）がTask toolで各サブエージェントを起動する。

```
# 基本パターン
Task(
  subagent_type="general-purpose",
  prompt=<agents/xxx.mdの内容> + "\n\n---\n\n" + <タスク固有の指示>
)
```

### 実行例

```python
# Phase 1: PDF解析（2並列 × 2回）
# 1回目: 診療所仕様書 + 病院仕様書
Task(subagent_type="general-purpose", prompt=pdf_analyzer_prompt + clinic_task)
Task(subagent_type="general-purpose", prompt=pdf_analyzer_prompt + hospital_task)

# 2回目: 電子処方箋 + オンライン資格確認
Task(subagent_type="general-purpose", prompt=pdf_analyzer_prompt + eprescription_task)
Task(subagent_type="general-purpose", prompt=pdf_analyzer_prompt + qualification_task)

# Phase 2: コンテンツ構造化
Task(subagent_type="general-purpose", prompt=content_structurer_prompt + structuring_task)

# Phase 3: サイト構築（並列）
Task(subagent_type="general-purpose", prompt=nextjs_builder_prompt + build_task)
Task(subagent_type="general-purpose", prompt=visual_designer_prompt + diagram_task)
```

## ワークフロー

```
Phase 1: PDF解析
  入力: refarrences/*.pdf
  出力: docs/data/*.json
    ↓
Phase 2: コンテンツ構造化
  入力: docs/data/*.json
  出力: docs/content/**/*.mdx
    ↓
Phase 3: サイト構築（並列）
  ├─ Next.jsビルダー: site/ ディレクトリにNext.jsプロジェクトを構築
  └─ ビジュアルデザイナー: site/src/components/diagrams/ に図表コンポーネントを作成
    ↓
Phase 4: 統合・レビュー
  メインエージェントが統合し、npm run build で検証
```

## 出力ディレクトリ構成

```
docs/
├── data/                              # Phase 1 出力
│   ├── clinic-emr.json                # 診療所向けEMR要件
│   ├── clinic-rececom.json            # 診療所向けレセコン要件
│   ├── hospital-emr.json              # 病院向けEMR要件
│   ├── hospital-rececom.json          # 病院向けレセコン要件
│   ├── e-prescription.json            # 電子処方箋API・ワークフロー
│   ├── qualification.json             # オンライン資格確認
│   └── glossary.json                  # 共通用語集
└── content/                           # Phase 2 出力
    ├── emr/
    │   ├── clinic/
    │   └── hospital/
    ├── rececom/
    │   ├── clinic/
    │   └── hospital/
    ├── e-prescription/
    ├── qualification/
    ├── glossary.mdx
    └── comparison.mdx
```
