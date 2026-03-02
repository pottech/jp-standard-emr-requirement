# コンテンツ構造化エージェント

## 役割

PDF解析エージェントが出力した構造化JSONデータ（`docs/data/*.json`）を、Webサイトのページ構成に変換し、MDXコンテンツファイルとして `docs/content/` に出力する。

## 前提条件

- `docs/data/` 配下にPDF解析結果のJSONファイルが存在すること
- 出力先は `docs/content/` ディレクトリ
- MDXはNext.jsのMDXプラグインで処理される想定

## サイト構成

以下のURL構造に対応するMDXファイルを生成する:

```
/                                    # トップページ（概要・背景）
/emr/                                # 電子カルテ標準仕様
  /emr/clinic/                       #   医科診療所向け
    /emr/clinic/functional           #     機能要件
    /emr/clinic/non-functional       #     非機能要件
    /emr/clinic/architecture         #     アーキテクチャ
    /emr/clinic/data-migration       #     データ移行
    /emr/clinic/integration          #     システム連携
    /emr/clinic/disclosure           #     情報提供・公開
  /emr/hospital/                     #   中小病院向け（同構成）
/rececom/                            # レセプトコンピュータ標準仕様
  /rececom/clinic/                   #   医科診療所向け
  /rececom/hospital/                 #   中小病院向け
/e-prescription/                     # 電子処方箋管理サービス
  /e-prescription/overview           #   概要・背景
  /e-prescription/api                #   API仕様一覧
  /e-prescription/workflow           #   ワークフロー
  /e-prescription/signature          #   電子署名
/qualification/                      # オンライン資格確認
  /qualification/overview            #   概要
  /qualification/authentication      #   認証方式
  /qualification/network             #   ネットワーク構成
  /qualification/security            #   セキュリティ
/glossary                            # 用語集
/comparison                          # 診療所 vs 病院 比較表
```

## 出力ファイル構成

```
docs/content/
├── index.mdx                        # トップページ
├── emr/
│   ├── index.mdx                    # EMR概要
│   ├── clinic/
│   │   ├── index.mdx                # 診療所向けEMR概要
│   │   ├── functional.mdx           # 機能要件
│   │   ├── non-functional.mdx       # 非機能要件
│   │   ├── architecture.mdx         # アーキテクチャ
│   │   ├── data-migration.mdx       # データ移行
│   │   ├── integration.mdx          # システム連携
│   │   └── disclosure.mdx           # 情報提供・公開
│   └── hospital/
│       ├── index.mdx
│       ├── functional.mdx
│       ├── non-functional.mdx
│       ├── architecture.mdx
│       ├── data-migration.mdx
│       ├── integration.mdx
│       └── disclosure.mdx
├── rececom/
│   ├── index.mdx
│   ├── clinic/
│   │   ├── index.mdx
│   │   ├── functional.mdx
│   │   ├── non-functional.mdx
│   │   ├── architecture.mdx
│   │   ├── data-migration.mdx
│   │   ├── integration.mdx
│   │   └── disclosure.mdx
│   └── hospital/
│       └── ...（同構成）
├── e-prescription/
│   ├── index.mdx                    # 概要
│   ├── overview.mdx                 # 背景・経緯
│   ├── api.mdx                      # API仕様一覧
│   ├── workflow.mdx                 # ワークフロー
│   └── signature.mdx                # 電子署名
├── qualification/
│   ├── index.mdx                    # 概要
│   ├── overview.mdx                 # 背景
│   ├── authentication.mdx           # 認証方式
│   ├── network.mdx                  # ネットワーク構成
│   └── security.mdx                 # セキュリティ
├── glossary.mdx                     # 用語集
└── comparison.mdx                   # 比較表
```

## MDXファイルフォーマット

### Frontmatter

各MDXファイルにはfrontmatterを付与する:

```mdx
---
title: "機能要件"
description: "医科診療所向け電子カルテの機能要件一覧"
section: "emr"
subsection: "clinic"
category: "functional"
order: 1
lastUpdated: "2025-12-01"
sourceDocument: "医科診療所向け電子カルテ及びレセプトコンピュータ標準仕様書"
---
```

### コンテンツ構成

MDXファイル内では以下のカスタムコンポーネントを使用する（Next.jsビルダーが実装する）:

```mdx
---
title: "機能要件"
description: "医科診療所向け電子カルテの機能要件一覧"
---

# 機能要件

電子カルテに求められる機能要件の一覧です。

## 概要

<RequirementSummary
  total={45}
  compliance={30}
  recommended={10}
  prohibited={3}
  reference={2}
/>

## 要件一覧

### 患者管理

<RequirementCard
  id="F-001"
  title="患者基本情報の管理"
  type="遵守"
  section="3.1.1"
>
  患者の基本情報（氏名、生年月日、性別等）を登録・管理できること。
</RequirementCard>

<RequirementCard
  id="F-002"
  title="保険情報の管理"
  type="推奨"
  section="3.1.2"
>
  複数の保険情報を管理し、適切に切り替えられること。
</RequirementCard>
```

### API仕様ページ用フォーマット

```mdx
---
title: "API仕様一覧"
description: "電子処方箋管理サービスのAPI仕様"
---

# API仕様一覧

## 医療機関（外来処方）

<ApiSpecTable
  category="medicalInstitution"
  subcategory="outpatient"
  specs={[
    {
      interfaceId: "EPS-IF-201",
      name: "処方箋登録（要求）",
      function: "処方箋登録",
      direction: "request",
      description: "処方箋情報を電子処方箋管理サービスに登録する"
    }
  ]}
/>
```

### ワークフローページ用フォーマット

```mdx
---
title: "ワークフロー"
description: "電子処方箋の発行から調剤までのフロー"
---

# ワークフロー

## 処方箋発行フロー

<WorkflowDiagram id="prescription-issuance" />

### フロー詳細

<WorkflowStep order={1} actor="医師" action="処方箋を作成">
  電子カルテシステムで処方内容を入力し、電子処方箋ファイルを作成する。
</WorkflowStep>
```

### 用語集ページ用フォーマット

```mdx
---
title: "用語集"
description: "EMR標準仕様で使用される用語の定義"
---

# 用語集

<GlossarySearch />

<GlossaryEntry
  term="電子処方箋"
  reading="でんししょほうせん"
  english="Electronic Prescription"
>
  医師が処方した薬の情報を電子的に管理するための処方箋。
  電子処方箋管理サービスに登録され、薬局で受け取ることができる。
</GlossaryEntry>
```

### 比較表ページ用フォーマット

```mdx
---
title: "診療所 vs 病院 比較表"
description: "医科診療所向けと中小病院向けの標準仕様の比較"
---

# 診療所 vs 病院 比較表

<ComparisonTable
  categories={["functional", "non-functional", "architecture"]}
  clinicData={clinicRequirements}
  hospitalData={hospitalRequirements}
/>
```

## メタデータJSON

サイトナビゲーション用のメタデータを `docs/content/metadata.json` として出力する:

```json
{
  "navigation": [
    {
      "title": "電子カルテ標準仕様",
      "path": "/emr",
      "children": [
        {
          "title": "医科診療所向け",
          "path": "/emr/clinic",
          "children": [
            { "title": "機能要件", "path": "/emr/clinic/functional" },
            { "title": "非機能要件", "path": "/emr/clinic/non-functional" },
            { "title": "アーキテクチャ", "path": "/emr/clinic/architecture" },
            { "title": "データ移行", "path": "/emr/clinic/data-migration" },
            { "title": "システム連携", "path": "/emr/clinic/integration" },
            { "title": "情報提供・公開", "path": "/emr/clinic/disclosure" }
          ]
        },
        {
          "title": "中小病院向け",
          "path": "/emr/hospital",
          "children": [ ... ]
        }
      ]
    },
    {
      "title": "レセプトコンピュータ標準仕様",
      "path": "/rececom",
      "children": [ ... ]
    },
    {
      "title": "電子処方箋管理サービス",
      "path": "/e-prescription",
      "children": [
        { "title": "概要・背景", "path": "/e-prescription/overview" },
        { "title": "API仕様一覧", "path": "/e-prescription/api" },
        { "title": "ワークフロー", "path": "/e-prescription/workflow" },
        { "title": "電子署名", "path": "/e-prescription/signature" }
      ]
    },
    {
      "title": "オンライン資格確認",
      "path": "/qualification",
      "children": [
        { "title": "概要", "path": "/qualification/overview" },
        { "title": "認証方式", "path": "/qualification/authentication" },
        { "title": "ネットワーク構成", "path": "/qualification/network" },
        { "title": "セキュリティ", "path": "/qualification/security" }
      ]
    },
    { "title": "用語集", "path": "/glossary" },
    { "title": "比較表", "path": "/comparison" }
  ]
}
```

## 変換手順

1. **JSONファイルの読み込み**: `docs/data/` 配下の全JSONファイルをReadツールで読み込む
2. **ディレクトリ構造の作成**: 上記のファイル構成に従ってディレクトリを作成する
3. **MDXファイルの生成**: 各JSONデータをMDXフォーマットに変換して書き出す
4. **メタデータの生成**: ナビゲーション用のmetadata.jsonを生成する
5. **比較データの生成**: 診療所と病院のデータを突合して比較表データを生成する

## 注意事項

- MDX内のカスタムコンポーネント（`<RequirementCard>`, `<ApiSpecTable>` 等）はNext.jsビルダーが実装する。ここではコンポーネントの使用箇所と渡すpropsを定義する
- frontmatterの `order` フィールドでサイドバーでの表示順を制御する
- 原文のセクション番号を保持し、原文への参照を可能にする
- 用語集は全文書の用語を統合し、重複を除去する
- 比較表は診療所と病院で共通する要件カテゴリについて差分を明示する
