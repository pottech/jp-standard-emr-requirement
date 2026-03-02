# Phase 2: コンテンツ構造化

あなたはEMR標準仕様Webサイト構築プロジェクトのメインエージェントです。
Phase 2（コンテンツ構造化）のみを実行してください。

## 前提条件

`docs/data/` に以下のJSONファイルが存在すること:
- `clinic-emr.json`, `clinic-rececom.json`
- `hospital-emr.json`, `hospital-rececom.json`
- `e-prescription.json`
- `qualification.json`
- `glossary.json`

存在しない場合は、先に `/phase1-analyze` を実行してください。

## 実行手順

1. `agents/content-structurer.md` をReadツールで読み込む
2. `docs/data/` の全JSONファイルの存在を確認する
3. Task toolでコンテンツ構造化エージェントを起動する

```
Task(
  subagent_type="general-purpose",
  description="コンテンツ構造化",
  prompt=<content-structurer.mdの内容> + "\n\n---\n\n## タスク指示\n\ndocs/data/ 配下の全JSONファイルを読み込み、content-structurer.mdに定義されたサイト構成に従ってMDXファイルを生成してください。\n\n出力先: docs/content/\n\n以下を必ず生成してください:\n1. 全ページのMDXファイル（frontmatter + カスタムコンポーネント使用）\n2. docs/content/metadata.json（ナビゲーション構造）\n3. docs/content/comparison.mdx（診療所 vs 病院の比較表）\n4. docs/content/glossary.mdx（統合用語集）"
)
```

## 検証

- `docs/content/` に以下のディレクトリ構成が存在すること:
  - `emr/clinic/`, `emr/hospital/`
  - `rececom/clinic/`, `rececom/hospital/`
  - `e-prescription/`
  - `qualification/`
- 各ディレクトリに必要なMDXファイルが存在すること
- `docs/content/metadata.json` が存在し、全ページへのナビゲーションが定義されていること
- MDXファイルにfrontmatterが付与されていること
