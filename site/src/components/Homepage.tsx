import Link from 'next/link';
import {
  FileText,
  Calculator,
  Pill,
  ShieldCheck,
  Mail,
  Accessibility,
  GitCompareArrows,
  BookOpen,
  CheckCircle2,
  ThumbsUp,
  Ban,
  Info,
  Landmark,
  TrendingUp,
  Cloud,
  ArrowRight,
  Target,
  Calendar,
} from 'lucide-react';
import fs from 'fs';
import path from 'path';
import type { MetadataJson } from '@/lib/types';

function loadMetadata(): MetadataJson {
  const raw = fs.readFileSync(
    path.join(process.cwd(), '..', 'docs', 'content', 'metadata.json'),
    'utf-8'
  );
  return JSON.parse(raw) as MetadataJson;
}

function countGlossaryTerms(): number {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), '..', 'docs', 'data', 'glossary.json'),
      'utf-8'
    );
    const data = JSON.parse(raw);
    return Array.isArray(data.terms) ? data.terms.length : 0;
  } catch {
    return 0;
  }
}

const sections = [
  {
    title: '電子カルテ',
    description: '診療所・病院向けの電子カルテに求められる基本要件をまとめています',
    href: '/emr',
    icon: FileText,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'レセプトコンピュータ',
    description: '診療報酬の計算・請求に使うレセコンの基本要件をまとめています',
    href: '/rececom',
    icon: Calculator,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: '電子処方箋管理サービス',
    description: '電子処方箋の発行・受付に関するAPI仕様やワークフローを解説しています',
    href: '/e-prescription',
    icon: Pill,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'オンライン資格確認',
    description: '保険資格のオンライン確認に必要な認証・ネットワーク構成を解説しています',
    href: '/qualification',
    icon: ShieldCheck,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: '主治医意見書電送',
    description: '介護保険の主治医意見書を電子送受信するサービスの技術仕様を解説しています',
    href: '/opinion-letter',
    icon: Mail,
    color: 'bg-rose-50 text-rose-600',
  },
  {
    title: 'ウェブアクセシビリティ',
    description: 'WCAG/JIS規格に基づくアクセシビリティ対応の指針とチェック項目を解説しています',
    href: '/accessibility',
    icon: Accessibility,
    color: 'bg-teal-50 text-teal-600',
  },
  {
    title: '比較表',
    description: '診療所向けと病院向けの要件の違いを一覧で比較できます',
    href: '/comparison',
    icon: GitCompareArrows,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: '用語集',
    description: '全文書に登場する専門用語を50音順に整理した用語集です',
    href: '/glossary',
    icon: BookOpen,
    color: 'bg-cyan-50 text-cyan-600',
  },
];

const requirementTypeCards = [
  {
    id: '遵守',
    label: '遵守',
    description: '適合が必須の要件。システムが必ず満たさなければならない項目です。',
    icon: CheckCircle2,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    badgeColor: 'bg-red-100 text-red-800',
  },
  {
    id: '推奨',
    label: '推奨',
    description: '適合が望ましい要件。対応することが推奨されている項目です。',
    icon: ThumbsUp,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: '不可',
    label: '不可',
    description: '行ってはならない事項。禁止されている実装や運用方法です。',
    icon: Ban,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    badgeColor: 'bg-gray-200 text-gray-800',
  },
  {
    id: '参考',
    label: '参考',
    description: '参考情報。必須ではありませんが、理解を深めるための補足情報です。',
    icon: Info,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    badgeColor: 'bg-green-100 text-green-800',
  },
];

export function Homepage() {
  const metadata = loadMetadata();
  const glossaryTermCount = countGlossaryTerms();
  const sectionCount = metadata.navigation.filter((n) => n.path !== '/').length;

  const stats = [
    { label: '基準文書', value: metadata.sourceDocuments.length, suffix: '件' },
    { label: 'セクション', value: sectionCount, suffix: '件' },
    { label: '用語数', value: glossaryTermCount, suffix: '語' },
    { label: 'コンテンツ', value: 30, suffix: 'ページ' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* このサイトについて 3カラムカード */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">このサイトについて</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">電子カルテとは</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              患者の診療記録（カルテ）を電子的に作成・管理するシステムです。
              紙のカルテに代わり、診療情報を安全かつ効率的に扱えるようにします。
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Calculator className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">レセコンとは</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              レセプトコンピュータの略称で、診療報酬を計算し、
              保険者へ請求するためのシステムです。医療機関の経営を支えます。
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">なぜ標準化？</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              医療DX推進のため、国が電子カルテやレセコンの基本要件を定めました。
              標準化により、システム間の連携やデータ移行がスムーズになります。
            </p>
          </div>
        </div>
      </section>

      {/* 医療DX政策の流れ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          医療DXの歩み ― なぜ今、電子カルテの標準化なのか
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          2020年以降、日本の医療DX政策は急速に進展しています。
          オンライン資格確認の義務化から電子処方箋の運用開始、そして2030年の電子カルテ普及率100%目標へ。
          その流れの中で「電子カルテ標準仕様書」が果たす役割を解説します。
        </p>

        {/* タイムライン */}
        <div className="space-y-0 relative ml-4 mb-8">
          <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-indigo-200" />

          {[
            {
              year: '2020',
              title: 'データヘルス改革の始動',
              description:
                '閣議決定により電子処方箋の全国運用が方針化。「新たな日常にも対応したデータヘルスの集中改革プラン」を策定し、オンライン資格確認等の既存インフラを活用した医療情報基盤の構築を開始。',
              color: 'bg-slate-400',
            },
            {
              year: '2021',
              title: 'オンライン資格確認 運用開始',
              description:
                'マイナンバーカードを使った保険資格のオンライン確認が本格稼働。同時に特定健診情報や薬剤情報の閲覧も開始し、医療機関と保険者をつなぐデジタル基盤が動き出す。',
              color: 'bg-blue-400',
            },
            {
              year: '2022',
              title: '医療DX推進本部 設立',
              description:
                '「経済財政運営と改革の基本方針2022」の閣議決定を受け、内閣総理大臣を本部長とする医療DX推進本部を設置。「全国医療情報プラットフォームの創設」「電子カルテ情報の標準化」「診療報酬改定DX」の3本柱を掲げる。',
              color: 'bg-indigo-500',
            },
            {
              year: '2023',
              title: '電子処方箋 運用開始 ／ オンライン資格確認 義務化',
              description:
                '1月に電子処方箋管理サービスが運用開始（まず院外処方箋から）。4月にはオンライン資格確認が保険医療機関・薬局に原則義務化。6月には「医療DXの推進に関する工程表」が決定され、2030年までの電子カルテ普及目標が明確化。',
              color: 'bg-violet-500',
            },
            {
              year: '2024',
              title: '電子処方箋の機能拡充 ／ 健康保険証の新規発行停止',
              description:
                '電子処方箋にリフィル処方箋対応や調剤済み処方箋の保存機能を追加。12月には健康保険証の新規発行が停止され、マイナ保険証への移行が加速。医療DX推進体制整備加算が新設され、電子カルテ導入のインセンティブが強化。',
              color: 'bg-purple-500',
            },
            {
              year: '2025',
              title: '標準仕様の策定方針決定 ／ 電子カルテ普及率100%を法定化',
              description:
                '7月、「医療DX令和ビジョン2030」推進チームが電子カルテの標準仕様策定方針を提示。12月、医療法等の一部改正法が公布され「2030年12月31日までに電子カルテ普及率約100%」が法的義務に。健康保険証も完全廃止。',
              color: 'bg-fuchsia-600',
            },
            {
              year: '2026',
              title: '電子カルテ標準仕様書（基本要件）発出',
              description:
                '診療所向け・中小病院向けの標準仕様書が策定。クラウドネイティブ・SaaS型・マルチテナントを基本とし、標準APIによる医療DXサービス群との連携、価格の公開、データ移行の互換性確保を要件化。本サイトはこの仕様書を解説しています。',
              color: 'bg-rose-600',
            },
          ].map((item) => (
            <div key={item.year} className="relative pl-8 pb-6 last:pb-0">
              <div
                className={`absolute left-0 top-1 h-4 w-4 rounded-full ${item.color} ring-4 ring-white`}
              />
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-sm font-bold text-indigo-600 tabular-nums">
                  {item.year}年
                </span>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 電子カルテ普及率100%への道 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          電子カルテ普及率100%への道
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 現状と課題 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">現状と課題</h3>
            </div>
            <div className="space-y-3 text-sm text-amber-900">
              <p>
                大病院（400床以上）では普及率90%超ですが、
                <strong>中小病院は約50%、診療所も約50%</strong>
                にとどまっています。
              </p>
              <p className="font-medium">普及が遅れている主な理由:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
                <li>オンプレミス型のカスタマイズによる高コスト</li>
                <li>ベンダーロックインで他社比較が困難</li>
                <li>価格の不透明さ</li>
                <li>システム間のデータ移行が困難</li>
              </ul>
            </div>
          </div>

          {/* 2030年の目標 */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-indigo-900">
                2030年目標（法定）
              </h3>
            </div>
            <div className="space-y-3 text-sm text-indigo-900">
              <p>
                2025年12月に公布された
                <strong>医療法等の一部改正法</strong>により、
                <strong>
                  2030年12月31日までに電子カルテ普及率が約100%
                </strong>
                になることが法的に義務づけられました。
              </p>
              <p className="font-medium">達成に向けた施策:</p>
              <ul className="list-disc list-inside space-y-1 text-indigo-800">
                <li>標準仕様書による最低品質水準の確立</li>
                <li>SaaS型クラウドによるコスト削減</li>
                <li>診療報酬上の導入インセンティブ（加算）</li>
                <li>IT導入補助金による財政支援</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 標準仕様書の役割 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          電子カルテ標準仕様書が果たす役割
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          本サイトで解説している標準仕様書は、電子カルテ普及率100%を達成するための中核的な仕組みです。
          従来のオンプレミス型からクラウドネイティブ型への転換を促し、医療IT市場全体の構造改革を目指しています。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Cloud className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              クラウドネイティブ化
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              マルチテナントのSaaS型を基本とし、カスタマイズを廃止。
              院内サーバーの管理負担をなくし、「所有」から「共同利用」へ転換します。
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <ArrowRight className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              標準APIによる連携
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              電子処方箋、オンライン資格確認、電子カルテ情報共有サービスなどの
              医療DXサービス群と標準APIで接続。HL7 FHIRベースの情報交換を実現します。
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Landmark className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              市場の透明性確保
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              価格の公開を義務化し、データ移行の互換性を確保。
              ベンダーロックインを解消し、医療機関が自由にシステムを選択・移行できるようにします。
            </p>
          </div>
        </div>

        {/* 従来との比較表 */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  項目
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  従来の電子カルテ
                </th>
                <th className="px-4 py-3 text-left font-semibold text-indigo-700">
                  標準型電子カルテ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                [
                  '提供形態',
                  'オンプレミス型が主流',
                  'クラウドネイティブ（SaaS）',
                ],
                [
                  'テナント構成',
                  'シングルテナント',
                  'マルチテナント（共通ソースコード）',
                ],
                [
                  'カスタマイズ',
                  '医療機関ごとに個別対応',
                  '原則不可（標準パッケージ提供）',
                ],
                [
                  'システム連携',
                  'ベンダー独自規格',
                  '標準API（HL7 FHIR等）',
                ],
                ['価格', '不透明（見積もりベース）', '公開義務あり'],
                [
                  'セキュリティ',
                  '医療機関側の負担大',
                  'ISMAP/ISMS認証必須',
                ],
                ['可用性', '保証なしの場合も', '稼働率99.9%以上を必須化'],
                [
                  'データ移行',
                  '困難（ベンダーロックイン）',
                  '互換性確保を要件化',
                ],
              ].map(([item, before, after]) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">
                    {item}
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{before}</td>
                  <td className="px-4 py-2.5 text-indigo-700 font-medium">
                    {after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 統計カード */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center"
            >
              <p className="text-2xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stat.label}（{stat.suffix}）
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* セクションナビゲーション */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">コンテンツ一覧</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-300 hover:bg-indigo-50/30"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${section.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">
                    {section.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 要件分類の説明 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">要件の分類</h2>
        <p className="text-sm text-gray-600 mb-6">
          標準仕様書の各要件は、以下の4種類に分類されています。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {requirementTypeCards.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                className={`rounded-xl border ${type.borderColor} ${type.bgColor} p-5`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-5 w-5 ${type.textColor}`} />
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${type.badgeColor}`}
                  >
                    {type.label}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${type.textColor}`}>
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 基準文書一覧 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">基準文書一覧</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">文書名</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">
                  発行元
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                  版
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metadata.sourceDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{doc.title}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {doc.publisher}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {doc.version ?? '―'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
