'use client';

import { useState } from 'react';
import {
  Eye,
  Building2,
  Stethoscope,
  Shield,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronRight,
  Info,
  ClipboardList,
  Scale,
} from 'lucide-react';
import { trackExpand } from '@/lib/gtag';

/* ─── 型定義 ─── */
interface DisclosureItem {
  id: string;
  label: string;
  description: string;
  clinic: boolean;
  hospital: boolean;
  hospitalOnly?: boolean;
  appendixRef?: string;
  appendixStatus?: string;
}

/* ─── 開示要件データ（遵守） ─── */
const mandatoryDisclosureItems: DisclosureItem[] = [
  {
    id: 'D-M-01',
    label: '価格の公開',
    description:
      'ベンダーが自ら運営するWebサイト上に、電子カルテの価格（オプション機能に係る価格を含む。）を公開済であること。',
    clinic: true,
    hospital: true,
  },
  {
    id: 'D-M-02',
    label: '医療情報セキュリティ開示書（SDS）の開示',
    description:
      '医療機関等の要請があった場合、電子カルテに関して記入済の医療情報セキュリティ開示書（SDS Ver5.0）について開示すること。',
    clinic: true,
    hospital: true,
  },
  {
    id: 'D-M-03',
    label: 'サイバーセキュリティ対策チェックリストの開示',
    description:
      '医療機関等の要請があった場合、医療機関におけるサイバーセキュリティ対策チェックリスト（事業者確認用）について開示すること。',
    clinic: true,
    hospital: true,
  },
  {
    id: 'D-M-04',
    label: 'サービス仕様適合開示書・仕様書の開示',
    description:
      '医療機関等の要請があった場合、電子カルテを医療機関に提供する場合のサービス仕様適合開示書及びサービス仕様書について開示すること。',
    clinic: true,
    hospital: true,
  },
  {
    id: 'D-M-05',
    label: '電子カルテ提示対象機能一覧の開示',
    description:
      '医療機関等の要請があった場合、電子カルテが有する機能について、「別紙様式A 電子カルテ提示対象機能一覧」に必要事項を記入の上、開示すること。',
    clinic: false,
    hospital: true,
    hospitalOnly: true,
    appendixRef: '別紙様式A',
    appendixStatus: '検討中',
  },
  {
    id: 'D-M-06',
    label: '非機能要件に係る要開示項目一覧の開示',
    description:
      '医療機関等の要請があった場合、電子カルテに係る非機能要件について「別紙C IPA「非機能要求グレード」に基づく非機能要件に係る要開示項目一覧」に必要事項を記入の上、開示すること。',
    clinic: false,
    hospital: true,
    hospitalOnly: true,
    appendixRef: '別紙C',
    appendixStatus: '検討中',
  },
  {
    id: 'D-M-07',
    label: 'データ移行に必要な事項の開示',
    description:
      '医療機関等の要請があった場合、電子カルテ間のデータ移行に必要な事項（データ形式を含む。）について開示すること。',
    clinic: true,
    hospital: true,
  },
  {
    id: 'D-M-08',
    label: '部門システム間インターフェイスの開示',
    description:
      '医療機関等又は電子カルテとの接続を求める部門システムに係るベンダーの要請があった場合、電子カルテと部門システムとの間におけるインターフェイスの仕様について開示すること。',
    clinic: true,
    hospital: true,
  },
  {
    id: 'D-M-09',
    label: '問い合わせ一次回答時間の平均値の開示',
    description:
      '医療機関の要請があった場合、電子カルテについて、医療機関から問い合わせがあった際の一次回答時間に係る直近3か月の平均値について開示すること。',
    clinic: true,
    hospital: true,
  },
];

/* ─── 開示要件データ（推奨） ─── */
const recommendedDisclosureItems: DisclosureItem[] = [
  {
    id: 'D-R-01',
    label: 'デモンストレーションによる機能開示',
    description:
      '医療機関等の要請があった場合、契約締結前であっても、システムのデモンストレーション等を実施することにより、電子カルテが有する詳細な機能について開示すること。',
    clinic: true,
    hospital: true,
  },
  {
    id: 'D-R-02',
    label: 'トライアルの提供',
    description:
      '医療機関等の要請に応じ、契約締結前であっても、電子カルテのトライアルが可能であること。また、トライアルの実施期間中又はその前後の期間において、適切な支援が可能であること。',
    clinic: true,
    hospital: true,
  },
  {
    id: 'D-R-03',
    label: '外部システム接続テスト環境の公開',
    description:
      '電子カルテとの接続を求める外部システム等のベンダーが、当該接続について円滑に検討できるよう、適切なテスト環境を整備し、その利用法等について公開すること。',
    clinic: true,
    hospital: true,
  },
];

/* ─── 別紙一覧 ─── */
const appendices = [
  {
    id: 'ch1-a',
    chapter: '第1章（電子カルテ）',
    name: '別紙A',
    title: '政府情報システムにおける脆弱性診断導入ガイドラインに係る遵守事項一覧',
    clinic: true,
    hospital: true,
  },
  {
    id: 'ch1-b',
    chapter: '第1章（電子カルテ）',
    name: '別紙B',
    title: 'IPA「非機能要求グレード」に基づく非機能要件に係る遵守事項一覧',
    clinic: true,
    hospital: true,
  },
  {
    id: 'ch1-c',
    chapter: '第1章（電子カルテ）',
    name: '別紙C',
    title: 'IPA「非機能要求グレード」に基づく非機能要件に係る要開示項目一覧',
    clinic: false,
    hospital: true,
  },
  {
    id: 'ch1-formA',
    chapter: '第1章（電子カルテ）',
    name: '別紙様式A',
    title: '電子カルテ提示対象機能一覧',
    clinic: false,
    hospital: true,
  },
  {
    id: 'ch2-a',
    chapter: '第2章（レセコン）',
    name: '別紙A',
    title: '政府情報システムにおける脆弱性診断導入ガイドラインに係る遵守事項一覧',
    clinic: true,
    hospital: true,
  },
  {
    id: 'ch2-b',
    chapter: '第2章（レセコン）',
    name: '別紙B',
    title: 'IPA「非機能要求グレード」に基づく非機能要件に係る遵守事項一覧',
    clinic: true,
    hospital: true,
  },
];

/* ─── コンポーネント ─── */

function StatusBadge({ available }: { available: boolean }) {
  return available ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      <CheckCircle2 size={12} />
      あり
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200">
      &mdash;
    </span>
  );
}

function HospitalOnlyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
      <Building2 size={12} />
      病院のみ
    </span>
  );
}

function UnderReviewBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
      <AlertTriangle size={12} />
      様式検討中
    </span>
  );
}

function ExpandableRow({
  item,
  index,
}: {
  item: DisclosureItem;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border-b border-gray-100 ${item.hospitalOnly ? 'bg-amber-50/30' : ''}`}
    >
      <button
        onClick={() => {
          const next = !expanded;
          setExpanded(next);
          if (next) trackExpand(item.label, '機能情報公開');
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-medium text-gray-900">
          {item.label}
        </span>
        <span className="flex items-center gap-2">
          {item.hospitalOnly && <HospitalOnlyBadge />}
          {item.appendixStatus && <UnderReviewBadge />}
        </span>
        <span className="hidden gap-3 sm:flex">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Stethoscope size={12} />
            <StatusBadge available={item.clinic} />
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Building2 size={12} />
            <StatusBadge available={item.hospital} />
          </span>
        </span>
        {expanded ? (
          <ChevronDown size={16} className="text-gray-400" />
        ) : (
          <ChevronRight size={16} className="text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
          <p className="text-sm leading-relaxed text-gray-700">
            {item.description}
          </p>
          {item.appendixRef && (
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-blue-50 p-3">
              <FileText size={16} className="mt-0.5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  参照別紙: {item.appendixRef}
                </p>
                <p className="mt-0.5 text-xs text-blue-700">
                  ※ 本書（案）の段階では様式が検討中のため、具体的なフォーマットは今後公表予定です。
                </p>
              </div>
            </div>
          )}
          <div className="mt-2 flex gap-4 sm:hidden">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Stethoscope size={12} /> 診療所:{' '}
              <StatusBadge available={item.clinic} />
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Building2 size={12} /> 病院:{' '}
              <StatusBadge available={item.hospital} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function DisclosurePage() {
  const [showAppendices, setShowAppendices] = useState(false);

  const clinicMandatoryCount = mandatoryDisclosureItems.filter(
    (i) => i.clinic
  ).length;
  const hospitalMandatoryCount = mandatoryDisclosureItems.filter(
    (i) => i.hospital
  ).length;
  const hospitalOnlyCount = mandatoryDisclosureItems.filter(
    (i) => i.hospitalOnly
  ).length;

  return (
    <div className="mx-auto max-w-5xl">
      {/* ヒーロー */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Eye size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              機能情報公開要件
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-indigo-100">
              電子カルテベンダーが医療機関に対して開示すべき情報の一覧です。
              標準仕様書では、医療機関の選択可能性向上とサービス水準の確保を目的として、
              情報提供・公開に関する要件を定めています。
            </p>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Stethoscope size={20} className="text-emerald-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {clinicMandatoryCount}
              </p>
              <p className="text-xs text-gray-500">診療所 遵守開示項目</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <Building2 size={20} className="text-indigo-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {hospitalMandatoryCount}
              </p>
              <p className="text-xs text-gray-500">病院 遵守開示項目</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Scale size={20} className="text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                +{hospitalOnlyCount}
              </p>
              <p className="text-xs text-gray-500">病院のみの追加項目</p>
            </div>
          </div>
        </div>
      </div>

      {/* 診療所 vs 病院 サマリー */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <ClipboardList size={20} className="text-indigo-600" />
            診療所 vs 病院の違い
          </h2>
        </div>
        <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <Stethoscope size={18} className="text-emerald-600" />
              <h3 className="font-bold text-gray-900">
                医科診療所向け
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                遵守開示項目: {clinicMandatoryCount}項目
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                推奨開示項目: {recommendedDisclosureItems.length}項目
              </li>
              <li className="flex items-start gap-2">
                <Info
                  size={14}
                  className="mt-0.5 shrink-0 text-gray-400"
                />
                別紙: 別紙A（脆弱性診断）, 別紙B（非機能要求グレード）
              </li>
              <li className="flex items-start gap-2">
                <Info
                  size={14}
                  className="mt-0.5 shrink-0 text-gray-400"
                />
                機能情報公開様式: なし
              </li>
            </ul>
          </div>
          <div className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <Building2 size={18} className="text-indigo-600" />
              <h3 className="font-bold text-gray-900">
                中小病院向け
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0 text-indigo-500"
                />
                遵守開示項目: {hospitalMandatoryCount}項目
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0 text-indigo-500"
                />
                推奨開示項目: {recommendedDisclosureItems.length}項目
              </li>
              <li className="flex items-start gap-2">
                <Info
                  size={14}
                  className="mt-0.5 shrink-0 text-gray-400"
                />
                別紙: 別紙A（脆弱性診断）, 別紙B（非機能要求グレード）, 別紙C（要開示項目）
              </li>
              <li className="flex items-start gap-2 font-medium text-amber-700">
                <AlertTriangle
                  size={14}
                  className="mt-0.5 shrink-0 text-amber-500"
                />
                機能情報公開様式: 別紙様式A（検討中）
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 別紙様式A 解説 */}
      <div className="mb-8 rounded-xl border-2 border-amber-200 bg-amber-50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-200">
            <FileText size={24} className="text-amber-800" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-900">
              別紙様式A「電子カルテ提示対象機能一覧」について
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-800">
              中小病院向け標準仕様書では、電子カルテベンダーに対し、医療機関から要請があった場合に
              「電子カルテ提示対象機能一覧」に必要事項を記入して開示することを<strong>遵守</strong>要件として定めています。
            </p>
            <div className="mt-3 space-y-2 text-sm text-amber-800">
              <p>
                <strong>対象:</strong> 中小病院向け電子カルテのみ（診療所向けには該当なし）
              </p>
              <p>
                <strong>根拠:</strong> 標準仕様書 第1章 2.3「情報提供・公開」(2)①表中(5)
              </p>
              <p>
                <strong>別紙の状態:</strong>{' '}
                本書は案の段階であり、別紙様式Aの具体的なフォーマットは現在検討中です。
                発出時に追記される予定です。
              </p>
            </div>
            <div className="mt-3 rounded-lg bg-amber-100 p-3">
              <p className="text-xs leading-relaxed text-amber-900">
                <strong>注:</strong>{' '}
                本文中又は別紙中「【※検討中】」と表記する箇所は、今回の意見募集段階では検討中のためお示ししないが、
                発出の際に追記予定である。なお、当該部分にも別紙を設定する可能性があるため、意見募集段階においては、
                別紙番号を仮としてアルファベットで表記する。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 遵守要件一覧 */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-red-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-red-600" />
            <h2 className="text-lg font-bold text-gray-900">
              遵守開示項目（必須）
            </h2>
          </div>
          <p className="mt-1 text-xs text-gray-600">
            クリックして詳細を展開できます。黄色の行は病院のみの要件です。
          </p>
          <div className="mt-2 hidden items-center gap-6 text-xs text-gray-500 sm:flex">
            <span className="flex items-center gap-1">
              <Stethoscope size={12} /> 診療所
            </span>
            <span className="flex items-center gap-1">
              <Building2 size={12} /> 病院
            </span>
          </div>
        </div>
        <div>
          {mandatoryDisclosureItems.map((item, i) => (
            <ExpandableRow key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* 推奨要件一覧 */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-blue-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">
              推奨開示項目
            </h2>
          </div>
          <p className="mt-1 text-xs text-gray-600">
            適合が望ましいとされる情報公開要件（診療所・病院共通）
          </p>
        </div>
        <div>
          {recommendedDisclosureItems.map((item, i) => (
            <ExpandableRow key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* 別紙一覧 */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => {
            const next = !showAppendices;
            setShowAppendices(next);
            if (next) trackExpand('別紙一覧', '機能情報公開');
          }}
          className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-4 text-left transition hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">
              別紙一覧（参考）
            </h2>
          </div>
          {showAppendices ? (
            <ChevronDown size={20} className="text-gray-400" />
          ) : (
            <ChevronRight size={20} className="text-gray-400" />
          )}
        </button>
        {showAppendices && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    章
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    別紙名
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    内容
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">
                    <span className="flex items-center justify-center gap-1">
                      <Stethoscope size={12} /> 診療所
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">
                    <span className="flex items-center justify-center gap-1">
                      <Building2 size={12} /> 病院
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {appendices.map((a) => (
                  <tr
                    key={a.id}
                    className={`border-b border-gray-100 ${!a.clinic ? 'bg-amber-50/30' : ''}`}
                  >
                    <td className="px-4 py-3 text-gray-600">{a.chapter}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {a.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{a.title}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge available={a.clinic} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge available={a.hospital} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 補足情報 */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h3 className="flex items-center gap-2 font-bold text-gray-900">
          <Info size={18} className="text-gray-600" />
          補足情報
        </h3>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
          <p>
            <strong>情報提供・公開の目的:</strong>{' '}
            電子カルテが医療機関に導入される段階における選択可能性を向上させ、
            また、導入後の段階におけるサポート等のサービス水準を担保するため、
            標準的な電子カルテとして求められる情報提供又は公開に係る考え方について定めています。
          </p>
          <p>
            <strong>「医療機関等」の定義:</strong>{' '}
            医療機関及び医療機関から委託を受けた者を指します。
          </p>
          <p>
            <strong>病院向けの追加要件の背景:</strong>{' '}
            中小病院は診療所と比較してシステムの規模が大きく、機能要件も多岐にわたるため、
            電子カルテが有する機能の一覧（別紙様式A）と非機能要件の開示項目一覧（別紙C）の
            提出が追加で義務付けられています。
          </p>
          <p>
            <strong>出典:</strong>{' '}
            医科診療所向け電子カルテ及びレセプトコンピュータ標準仕様書（基本要件）（案）第1章 2.3 /
            中小病院向け電子カルテ及びレセプトコンピュータ標準仕様書（基本要件）（案）第1章 2.3
          </p>
        </div>
      </div>
    </div>
  );
}
