# EMR標準仕様サイト 全体ビルド

あなたはEMR標準仕様Webサイト構築プロジェクトの**メインエージェント（オーケストレーター）**です。

CLAUDE.mdの指示に従い、Phase 1〜Phase 4を順番に実行してサイトを完成させてください。

## 実行手順

### Phase 1: PDF解析

`agents/pdf-analyzer.md` をReadツールで読み込み、その内容をプロンプトとしてTask toolでサブエージェントを起動してください。

4つのPDF文書を2並列で解析します:

**1回目（並列）:**
- Task(subagent_type="general-purpose", prompt=<pdf-analyzer.mdの内容> + タスク指示: 診療所向け標準仕様書を解析)
- Task(subagent_type="general-purpose", prompt=<pdf-analyzer.mdの内容> + タスク指示: 病院向け標準仕様書を解析)

**2回目（並列）:**
- Task(subagent_type="general-purpose", prompt=<pdf-analyzer.mdの内容> + タスク指示: 電子処方箋技術解説書を解析)
- Task(subagent_type="general-purpose", prompt=<pdf-analyzer.mdの内容> + タスク指示: オンライン資格確認技術解説書を解析)

各タスクの完了を確認し、`docs/data/` に出力されたJSONファイルを検証してください。

### Phase 2: コンテンツ構造化

`agents/content-structurer.md` をReadツールで読み込み、Task toolで起動してください。

- Task(subagent_type="general-purpose", prompt=<content-structurer.mdの内容> + タスク指示: docs/data/のJSONをMDXに変換)

`docs/content/` に出力されたMDXファイルとmetadata.jsonを検証してください。

### Phase 3: サイト構築（並列）

`agents/nextjs-builder.md` と `agents/visual-designer.md` をそれぞれReadツールで読み込み、並列でTask toolを起動してください。

- Task(subagent_type="general-purpose", prompt=<nextjs-builder.mdの内容> + タスク指示: site/ディレクトリにNext.jsプロジェクトを構築)
- Task(subagent_type="general-purpose", prompt=<visual-designer.mdの内容> + タスク指示: site/src/components/diagrams/に図表コンポーネントを作成)

### Phase 4: 統合・レビュー

1. `cd site && npm run build` でビルドが通ることを確認
2. エラーがあれば修正して再ビルド
3. 全ページが正しく構成されているか確認
4. 結果をユーザーに報告

## エラーハンドリング

- サブエージェントが失敗した場合、エラー内容を確認して再試行（最大3回）
- 3回失敗した場合、ユーザーに報告して判断を仰ぐ
- Phase間の依存関係を守り、前のPhaseが完了してから次のPhaseに進む
