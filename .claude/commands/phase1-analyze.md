# Phase 1: PDF解析

あなたはEMR標準仕様Webサイト構築プロジェクトのメインエージェントです。
Phase 1（PDF解析）のみを実行してください。

## 実行手順

1. `agents/pdf-analyzer.md` をReadツールで読み込む
2. 以下の4文書を2並列 × 2回で解析する

### 1回目（並列実行）

**診療所向け標準仕様書:**
```
Task(
  subagent_type="general-purpose",
  description="PDF解析: 診療所向け仕様書",
  prompt=<pdf-analyzer.mdの内容> + "\n\n---\n\n## タスク指示\n\n以下のPDFを解析してください:\n\nファイル: refarrences/医科診療所向け電子カルテ及びレセプトコンピュータ標準仕様書（基本要件）（案）.pdf\n\n出力ファイル:\n- docs/data/clinic-emr.json（電子カルテ要件）\n- docs/data/clinic-rececom.json（レセコン要件）\n\n標準仕様書の解析方針に従い、要件を4類型×6カテゴリで整理してください。"
)
```

**病院向け標準仕様書:**
```
Task(
  subagent_type="general-purpose",
  description="PDF解析: 病院向け仕様書",
  prompt=<pdf-analyzer.mdの内容> + "\n\n---\n\n## タスク指示\n\n以下のPDFを解析してください:\n\nファイル: refarrences/中小病院向け電子カルテ及びレセプトコンピュータ標準仕様書（基本要件）（案）.pdf\n\n出力ファイル:\n- docs/data/hospital-emr.json（電子カルテ要件）\n- docs/data/hospital-rececom.json（レセコン要件）\n\n標準仕様書の解析方針に従い、要件を4類型×6カテゴリで整理してください。"
)
```

### 2回目（並列実行）

1回目の完了を待ってから実行する。

**電子処方箋技術解説書:**
```
Task(
  subagent_type="general-purpose",
  description="PDF解析: 電子処方箋",
  prompt=<pdf-analyzer.mdの内容> + "\n\n---\n\n## タスク指示\n\n以下のPDFを解析してください:\n\nファイル: refarrences/電子処方箋管理サービスの導入に関するシステムベンダ向け技術解説書【医療機関・薬局】.pdf\n\n出力ファイル:\n- docs/data/e-prescription.json\n\n電子処方箋技術解説書の解析方針に従い、API仕様（インターフェースID一覧）、電子署名方式、ワークフローを抽出してください。\n\n注意: 270頁超の大きな文書なので、20ページずつ読み取り、重要なセクション（目次、API一覧表、ワークフロー図の説明部分）を優先してください。"
)
```

**オンライン資格確認技術解説書:**
```
Task(
  subagent_type="general-purpose",
  description="PDF解析: オンライン資格確認",
  prompt=<pdf-analyzer.mdの内容> + "\n\n---\n\n## タスク指示\n\n以下のPDFを解析してください:\n\nファイル: refarrences/オンライン資格確認等システムの導入に関するシステムベンダ向け技術解説書【医療機関・薬局】.pdf\n\n出力ファイル:\n- docs/data/qualification.json\n\nオンライン資格確認技術解説書の解析方針に従い、認証方式、ネットワーク構成パターン、セキュリティ要件を抽出してください。\n\n注意: 200頁超の大きな文書なので、20ページずつ読み取り、重要なセクション（目次、認証方式の表、ネットワーク構成図の説明）を優先してください。"
)
```

### 用語集の統合

全4文書の解析完了後、各JSONの `terminology` セクションを統合して `docs/data/glossary.json` を生成する。重複を除去し、アルファベット順（日本語の読み仮名順）でソートする。

## 検証

- `docs/data/` に以下のファイルが存在すること:
  - `clinic-emr.json`, `clinic-rececom.json`
  - `hospital-emr.json`, `hospital-rececom.json`
  - `e-prescription.json`
  - `qualification.json`
  - `glossary.json`
- 各JSONファイルがpdf-analyzer.mdのスキーマに準拠していること
- 空の配列やnull値が過度にないこと
