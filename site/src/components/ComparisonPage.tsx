'use client';

import { useState } from 'react';
import {
  FileText,
  Calculator,
  ChevronDown,
  ChevronRight,
  Building2,
  Stethoscope,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  LayoutGrid,
  List,
} from 'lucide-react';
import { trackTabSwitch, trackViewMode, trackExpand } from '@/lib/gtag';

/* ─── 型定義 ─── */
interface Requirement {
  id: string;
  title: string;
  type: string;
  description: string;
  details?: string;
  notes?: string | null;
  section?: string;
}

interface Category {
  label?: string;
  requirements: Requirement[];
}

interface SpecData {
  documentTitle: string;
  targetFacilityType: string;
  systemType: string;
  categories: Record<string, Category>;
  summary: {
    totalRequirements: number;
    byType: Record<string, number>;
  };
}

export interface ComparisonPageProps {
  clinicEmr: SpecData;
  hospitalEmr: SpecData;
  clinicRececom: SpecData;
  hospitalRececom: SpecData;
}

/* ─── 定数 ─── */
const categoryLabels: Record<string, string> = {
  functional: '機能要件',
  'non-functional': '非機能要件',
  architecture: 'アーキテクチャ',
  'data-migration': 'データ移行',
  integration: 'システム連携',
  disclosure: '情報提供・公開',
};

const categoryDescriptions: Record<string, string> = {
  functional: '医療DXサービス群との接続機能、電子処方箋、電子カルテ情報共有サービス等',
  'non-functional': '可用性、セキュリティ、データ保管、バックアップ、ガイドライン準拠等',
  architecture: 'クラウドネイティブ、SaaS型、マルチテナント、モダナイゼーション等',
  'data-migration': 'システム間のデータ移行に関する要件',
  integration: '外部インターフェイス仕様、共通算定モジュール、介護情報基盤連携等',
  disclosure: '価格公開、セキュリティ開示書、トライアル提供、テスト環境整備等',
};

const categoryOrder = [
  'functional',
  'non-functional',
  'architecture',
  'data-migration',
  'integration',
  'disclosure',
];

type TabKey = 'emr' | 'rececom';
type ViewMode = 'grid' | 'table';

/* ─── ユーティリティ ─── */
function countByType(spec: SpecData, type: string): number {
  return Object.values(spec.categories).reduce(
    (sum, cat) => sum + (cat.requirements?.filter((r) => r.type === type).length ?? 0),
    0
  );
}

function totalReqs(spec: SpecData): number {
  return Object.values(spec.categories).reduce(
    (sum, cat) => sum + (cat.requirements?.length ?? 0),
    0
  );
}

function buildMergedRows(
  clinicCat: Category | undefined,
  hospitalCat: Category | undefined
) {
  const clinicReqs = clinicCat?.requirements ?? [];
  const hospitalReqs = hospitalCat?.requirements ?? [];

  const allIds = new Map<
    string,
    { clinic: Requirement | null; hospital: Requirement | null }
  >();

  for (const r of clinicReqs) {
    allIds.set(r.id, { clinic: r, hospital: null });
  }
  for (const r of hospitalReqs) {
    const existing = allIds.get(r.id);
    if (existing) {
      existing.hospital = r;
    } else {
      allIds.set(r.id, { clinic: null, hospital: r });
    }
  }

  return Array.from(allIds.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, { clinic, hospital }]) => ({
      id,
      title: clinic?.title ?? hospital?.title ?? id,
      clinicType: clinic?.type ?? null,
      hospitalType: hospital?.type ?? null,
      clinicDesc: clinic?.description ?? null,
      hospitalDesc: hospital?.description ?? null,
      clinicDetails: clinic?.details ?? null,
      hospitalDetails: hospital?.details ?? null,
      clinicNotes: clinic?.notes ?? null,
      hospitalNotes: hospital?.notes ?? null,
      clinicOnly: clinic !== null && hospital === null,
      hospitalOnly: clinic === null && hospital !== null,
      same:
        clinic?.type === hospital?.type &&
        clinic !== null &&
        hospital !== null,
    }));
}

/* ─── コンポーネント ─── */

function TypeBadge({ type, size = 'sm' }: { type: string; size?: 'sm' | 'lg' }) {
  const styles: Record<string, { bg: string; text: string; ring: string; icon: typeof Shield }> = {
    遵守: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200', icon: Shield },
    推奨: { bg: 'bg-sky-50', text: 'text-sky-700', ring: 'ring-sky-200', icon: CheckCircle2 },
    参考: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', icon: Info },
    不可: { bg: 'bg-gray-100', text: 'text-gray-600', ring: 'ring-gray-300', icon: AlertTriangle },
  };
  const s = styles[type] ?? { bg: 'bg-gray-50', text: 'text-gray-600', ring: 'ring-gray-200', icon: Info };
  const Icon = s.icon;
  const sizeClass = size === 'lg' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-semibold ring-1 ring-inset ${s.bg} ${s.text} ${s.ring} ${sizeClass}`}
    >
      <Icon className={size === 'lg' ? 'h-3.5 w-3.5' : 'h-3 w-3'} />
      {type}
    </span>
  );
}

function DistributionBar({ spec, label }: { spec: SpecData; label: string }) {
  const total = totalReqs(spec);
  const junshu = countByType(spec, '遵守');
  const suisho = countByType(spec, '推奨');
  const sanko = countByType(spec, '参考');

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs text-gray-400">{total}件</span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
        {junshu > 0 && (
          <div
            className="bg-red-400 transition-all duration-500"
            style={{ width: `${(junshu / total) * 100}%` }}
            title={`遵守: ${junshu}件`}
          />
        )}
        {suisho > 0 && (
          <div
            className="bg-sky-400 transition-all duration-500"
            style={{ width: `${(suisho / total) * 100}%` }}
            title={`推奨: ${suisho}件`}
          />
        )}
        {sanko > 0 && (
          <div
            className="bg-emerald-400 transition-all duration-500"
            style={{ width: `${(sanko / total) * 100}%` }}
            title={`参考: ${sanko}件`}
          />
        )}
      </div>
      <div className="flex gap-3 mt-1.5">
        <span className="text-[10px] text-red-600 font-medium">遵守 {junshu}</span>
        <span className="text-[10px] text-sky-600 font-medium">推奨 {suisho}</span>
        <span className="text-[10px] text-emerald-600 font-medium">参考 {sanko}</span>
      </div>
    </div>
  );
}

function ExpandableRequirement({
  row,
}: {
  row: ReturnType<typeof buildMergedRows>[0];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasDiff = !row.same;
  const hasDetails = row.clinicDetails || row.hospitalDetails;

  return (
    <div
      className={`border rounded-lg transition-all ${
        hasDiff
          ? 'border-amber-200 bg-amber-50/20'
          : 'border-gray-150 bg-white'
      } ${isOpen ? 'shadow-sm' : ''}`}
    >
      {/* ヘッダー行 */}
      <button
        onClick={() => {
          if (!hasDetails) return;
          const next = !isOpen;
          setIsOpen(next);
          if (next) trackExpand(row.title, '比較表');
        }}
        className={`w-full text-left px-4 py-3 flex items-start gap-3 ${
          hasDetails ? 'cursor-pointer hover:bg-gray-50/50' : 'cursor-default'
        }`}
      >
        {/* 展開アイコン */}
        <div className="mt-0.5 shrink-0">
          {hasDetails ? (
            isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </div>

        {/* ID */}
        <span className="font-mono text-xs text-gray-400 mt-0.5 w-14 shrink-0">
          {row.id}
        </span>

        {/* タイトル＋バッジ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-800 leading-snug">
              {row.title}
            </span>
            {hasDiff && (
              <span className="inline-flex items-center rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200 shrink-0">
                差異あり
              </span>
            )}
            {row.clinicOnly && (
              <span className="inline-flex items-center rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 ring-1 ring-inset ring-violet-200 shrink-0">
                診療所のみ
              </span>
            )}
            {row.hospitalOnly && (
              <span className="inline-flex items-center rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 ring-1 ring-inset ring-teal-200 shrink-0">
                病院のみ
              </span>
            )}
          </div>
          {/* 説明文 */}
          {row.clinicDesc && !isOpen && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1 leading-relaxed">
              {row.clinicDesc ?? row.hospitalDesc}
            </p>
          )}
        </div>

        {/* 分類バッジ（右端） */}
        <div className="flex gap-2 shrink-0 items-center">
          <div className="text-center">
            <div className="text-[9px] text-gray-400 mb-0.5 font-medium">診療所</div>
            {row.clinicType ? (
              <TypeBadge type={row.clinicType} />
            ) : (
              <span className="text-[11px] text-gray-300">--</span>
            )}
          </div>
          <div className="text-center">
            <div className="text-[9px] text-gray-400 mb-0.5 font-medium">病院</div>
            {row.hospitalType ? (
              <TypeBadge type={row.hospitalType} />
            ) : (
              <span className="text-[11px] text-gray-300">--</span>
            )}
          </div>
        </div>
      </button>

      {/* 展開コンテンツ */}
      {isOpen && hasDetails && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {/* 診療所側 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-700">診療所向け</span>
                {row.clinicType && <TypeBadge type={row.clinicType} />}
              </div>
              {row.clinicDesc && (
                <p className="text-xs text-gray-600 leading-relaxed">{row.clinicDesc}</p>
              )}
              {row.clinicDetails && (
                <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-600 leading-relaxed max-h-48 overflow-y-auto">
                  {row.clinicDetails}
                </div>
              )}
              {row.clinicNotes && (
                <div className="rounded-md bg-amber-50 border border-amber-100 p-2.5 text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold">注記:</span> {row.clinicNotes}
                </div>
              )}
              {!row.clinicType && (
                <p className="text-xs text-gray-400 italic">該当なし（病院向けのみに存在する要件）</p>
              )}
            </div>

            {/* 病院側 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-teal-500" />
                <span className="text-xs font-bold text-teal-700">病院向け</span>
                {row.hospitalType && <TypeBadge type={row.hospitalType} />}
              </div>
              {row.hospitalDesc && (
                <p className="text-xs text-gray-600 leading-relaxed">{row.hospitalDesc}</p>
              )}
              {row.hospitalDetails && (
                <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-600 leading-relaxed max-h-48 overflow-y-auto">
                  {row.hospitalDetails}
                </div>
              )}
              {row.hospitalNotes && (
                <div className="rounded-md bg-amber-50 border border-amber-100 p-2.5 text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold">注記:</span> {row.hospitalNotes}
                </div>
              )}
              {!row.hospitalType && (
                <p className="text-xs text-gray-400 italic">該当なし（診療所向けのみに存在する要件）</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({
  catKey,
  clinic,
  hospital,
  viewMode,
}: {
  catKey: string;
  clinic: SpecData;
  hospital: SpecData;
  viewMode: ViewMode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const clinicCat = clinic.categories[catKey];
  const hospitalCat = hospital.categories[catKey];
  if (!clinicCat && !hospitalCat) return null;

  const rows = buildMergedRows(clinicCat, hospitalCat);
  if (rows.length === 0) return null;

  const diffCount = rows.filter((r) => !r.same).length;
  const clinicOnlyCount = rows.filter((r) => r.clinicOnly).length;
  const hospitalOnlyCount = rows.filter((r) => r.hospitalOnly).length;

  return (
    <div className="mb-8">
      {/* カテゴリヘッダー */}
      <button
        onClick={() => {
          const next = !isExpanded;
          setIsExpanded(next);
          if (next) trackExpand(categoryLabels[catKey] ?? catKey, '比較表カテゴリ');
        }}
        className="w-full text-left flex items-center justify-between py-3 px-1 group"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          )}
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {categoryLabels[catKey] ?? catKey}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {categoryDescriptions[catKey]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-xs shrink-0">
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 font-medium">
            {rows.length}件
          </span>
          {diffCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-700 font-bold">
              差異 {diffCount}件
            </span>
          )}
          {clinicOnlyCount > 0 && (
            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-violet-700 font-medium">
              診療所のみ {clinicOnlyCount}
            </span>
          )}
          {hospitalOnlyCount > 0 && (
            <span className="rounded-full bg-teal-100 px-2.5 py-1 text-teal-700 font-medium">
              病院のみ {hospitalOnlyCount}
            </span>
          )}
        </div>
      </button>

      {/* 要件一覧 */}
      {isExpanded && (
        <>
          {viewMode === 'grid' ? (
            <div className="space-y-2 mt-2">
              {rows.map((row) => (
                <ExpandableRequirement key={row.id} row={row} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto mt-2 rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
                    <th className="px-3 py-2.5 text-left font-medium w-16">ID</th>
                    <th className="px-3 py-2.5 text-left font-medium">要件名</th>
                    <th className="px-3 py-2.5 text-center font-medium w-20">診療所</th>
                    <th className="px-3 py-2.5 text-center font-medium w-20">病院</th>
                    <th className="px-3 py-2.5 text-center font-medium w-16">比較</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`${
                        !row.same
                          ? 'bg-amber-50/40'
                          : 'hover:bg-gray-50/50'
                      }`}
                    >
                      <td className="px-3 py-2.5 font-mono text-xs text-gray-400">
                        {row.id}
                      </td>
                      <td className="px-3 py-2.5 text-gray-800">
                        <span className="font-medium text-sm">{row.title}</span>
                        {row.clinicDesc && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {row.clinicDesc ?? row.hospitalDesc}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {row.clinicType ? (
                          <TypeBadge type={row.clinicType} />
                        ) : (
                          <span className="text-gray-300 text-xs">--</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {row.hospitalType ? (
                          <TypeBadge type={row.hospitalType} />
                        ) : (
                          <span className="text-gray-300 text-xs">--</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {row.same ? (
                          <span className="text-xs text-gray-400">共通</span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
                            差異
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── 主な相違点データ ─── */
const emrDifferences = [
  {
    title: '機能情報開示の義務化',
    detail: '病院向けでは別紙様式Aへの記入・開示が遵守要件として追加。診療所向けには該当する独立要件なし。',
    severity: 'high' as const,
  },
  {
    title: '機能要件の構成',
    detail: '診療所向けでは電子処方箋追加機能(F-002)、電子カルテ情報共有(F-003)、主治医意見書(F-004)、医療DX関連(F-005)が独立した推奨要件。病院向けではF-002にまとめられ、代わりにF-003として機能情報開示が遵守要件に。',
    severity: 'medium' as const,
  },
  {
    title: '情報提供・公開の範囲',
    detail: '病院向けでは機能一覧の開示（別紙様式A）と非機能要件の開示（別紙C）が追加で遵守要件化。',
    severity: 'high' as const,
  },
];

const rececomDifferences = [
  {
    title: 'セキュリティ認証基準',
    detail: '診療所向けはISMAP登録を直接要求。病院向けも同様にISMAP登録を直接要求（電子カルテの「ISMAP又はISMS+CSクラウド認証の選択制」とは異なる）。',
    severity: 'medium' as const,
  },
  {
    title: 'クラウドアーキテクチャの義務レベル',
    detail: '電子カルテではSaaS型・マルチテナントが遵守(必須)だが、レセコンでは推奨に留まる。',
    severity: 'high' as const,
  },
  {
    title: 'ガバメントクラウド稼働',
    detail: 'レセコンにはA-004としてガバメントクラウドでの稼働が参考要件として追加（電子カルテには同等の独立項目なし）。',
    severity: 'low' as const,
  },
  {
    title: '機能要件の構成',
    detail: '診療所向けでは電子処方箋追加(F-002)、電子カルテ情報共有(F-003)、医療DX関連(F-004)が独立した推奨要件。病院向けではF-002にまとめられる。',
    severity: 'medium' as const,
  },
];

const crossComparisonPoints = [
  {
    dimension: 'SaaS型・マルチテナント',
    emr: '遵守（必須）',
    rececom: '推奨',
    emrBadge: '遵守',
    rececomBadge: '推奨',
    note: '電子カルテはより厳格',
  },
  {
    dimension: 'セキュリティ認証',
    emr: 'ISMAP又はISMS+CS認証',
    rececom: 'ISMAP直接登録',
    emrBadge: '遵守',
    rececomBadge: '遵守',
    note: 'レセコンはISMAPに限定',
  },
  {
    dimension: '共通算定モジュール連携',
    emr: '推奨（レセコン側で対応の場合は不要）',
    rececom: '遵守（必須）',
    emrBadge: '推奨',
    rececomBadge: '遵守',
    note: 'レセコン側が主責任',
  },
  {
    dimension: 'ガバメントクラウド稼働',
    emr: '明記なし（アーキテクチャ要件で間接的に要求）',
    rececom: '参考（留意事項）',
    emrBadge: null,
    rececomBadge: '参考',
    note: 'レセコンのみ独立項目あり',
  },
  {
    dimension: '機能情報開示（別紙様式A）',
    emr: '病院のみ遵守',
    rececom: 'なし',
    emrBadge: '遵守',
    rececomBadge: null,
    note: '電子カルテ（病院）のみ',
  },
];

/* ─── メインコンポーネント ─── */
export function ComparisonPage({ clinicEmr, hospitalEmr, clinicRececom, hospitalRececom }: ComparisonPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('emr');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const specs: Record<TabKey, { label: string; icon: typeof FileText; clinic: SpecData; hospital: SpecData; color: string }> = {
    emr: {
      label: '電子カルテ標準要件',
      icon: FileText,
      clinic: clinicEmr,
      hospital: hospitalEmr,
      color: 'indigo',
    },
    rececom: {
      label: 'レセコン標準要件',
      icon: Calculator,
      clinic: clinicRececom,
      hospital: hospitalRececom,
      color: 'teal',
    },
  };

  const current = specs[activeTab];
  const differences = activeTab === 'emr' ? emrDifferences : rececomDifferences;

  return (
    <div className="max-w-6xl mx-auto">
      {/* ─── ページヘッダー ─── */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          標準要件 比較表
        </h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-3xl">
          医科診療所向けと中小病院向けの標準仕様を並べて比較します。
          要件の有無や分類（遵守・推奨・参考）の違い、さらに電子カルテとレセコン間の要求水準の差異がわかります。
          各要件をクリックすると詳細な要件内容を確認できます。
        </p>
      </div>

      {/* ─── 凡例 ─── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3">
        <span className="text-xs font-bold text-gray-500">凡例</span>
        <div className="flex items-center gap-1.5">
          <TypeBadge type="遵守" />
          <span className="text-xs text-gray-500">適合が必須</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TypeBadge type="推奨" />
          <span className="text-xs text-gray-500">適合が望ましい</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TypeBadge type="参考" />
          <span className="text-xs text-gray-500">参考情報</span>
        </div>
        <div className="h-4 border-l border-gray-300" />
        <span className="inline-flex items-center rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
          差異あり
        </span>
        <span className="text-xs text-gray-500">診療所と病院で異なる項目</span>
      </div>

      {/* ─── タブ切り替え ─── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex rounded-xl bg-gray-100 p-1">
          {(Object.entries(specs) as [TabKey, typeof current][]).map(([key, spec]) => {
            const Icon = spec.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  trackTabSwitch(spec.label, '比較表');
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-500' : ''}`} />
                {spec.label}
              </button>
            );
          })}
        </div>
        <div className="flex rounded-lg bg-gray-100 p-0.5">
          <button
            onClick={() => {
              setViewMode('grid');
              trackViewMode('カード表示', '比較表');
            }}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="カード表示"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setViewMode('table');
              trackViewMode('テーブル表示', '比較表');
            }}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="テーブル表示"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ─── 概況サマリー ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* 診療所 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50">
              <Stethoscope className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">診療所向け</p>
              <p className="text-[10px] text-gray-400">医科診療所</p>
            </div>
            <span className="ml-auto text-2xl font-black text-gray-900 tabular-nums">
              {totalReqs(current.clinic)}
              <span className="text-xs font-medium text-gray-400 ml-0.5">件</span>
            </span>
          </div>
          <DistributionBar spec={current.clinic} label="要件分布" />
        </div>

        {/* 病院 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-teal-50">
              <Building2 className="h-4 w-4 text-teal-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">病院向け</p>
              <p className="text-[10px] text-gray-400">中小病院</p>
            </div>
            <span className="ml-auto text-2xl font-black text-gray-900 tabular-nums">
              {totalReqs(current.hospital)}
              <span className="text-xs font-medium text-gray-400 ml-0.5">件</span>
            </span>
          </div>
          <DistributionBar spec={current.hospital} label="要件分布" />
        </div>
      </div>

      {/* ─── 主な相違点 ─── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
          <h2 className="text-base font-bold text-gray-900">
            主な相違点
          </h2>
          <span className="text-xs text-gray-400">
            — {current.label}における診療所 vs 病院
          </span>
        </div>
        <div className="space-y-3">
          {differences.map((d, i) => (
            <div
              key={i}
              className={`rounded-lg border p-4 ${
                d.severity === 'high'
                  ? 'border-red-200 bg-red-50/30'
                  : d.severity === 'medium'
                    ? 'border-amber-200 bg-amber-50/30'
                    : 'border-gray-200 bg-gray-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                  d.severity === 'high'
                    ? 'bg-red-400'
                    : d.severity === 'medium'
                      ? 'bg-amber-400'
                      : 'bg-gray-400'
                }`} />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{d.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{d.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── カテゴリ別詳細比較 ─── */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          カテゴリ別 要件比較
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-normal text-gray-500">{current.label}</span>
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          各要件をクリックすると、診療所向け・病院向けそれぞれの詳細な要件内容を比較できます
        </p>

        {categoryOrder.map((catKey) => (
          <CategorySection
            key={catKey}
            catKey={catKey}
            clinic={current.clinic}
            hospital={current.hospital}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* ─── 電子カルテ vs レセコン 横断比較 ─── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          電子カルテ vs レセコン 横断比較
        </h2>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          同じカテゴリの要件でも、電子カルテとレセコンでは要求水準が異なる場合があります。以下は主要な差異のまとめです。
        </p>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">
                  比較項目
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 w-56">
                  <div className="flex items-center justify-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    電子カルテ
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 w-56">
                  <div className="flex items-center justify-center gap-1.5">
                    <Calculator className="h-3.5 w-3.5 text-teal-500" />
                    レセコン
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 w-48">
                  備考
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {crossComparisonPoints.map((point, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-sm text-gray-800">
                    {point.dimension}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      {point.emrBadge && <TypeBadge type={point.emrBadge} size="lg" />}
                      <p className="text-[11px] text-gray-500 leading-snug">{point.emr}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      {point.rececomBadge ? (
                        <TypeBadge type={point.rececomBadge} size="lg" />
                      ) : (
                        <span className="text-xs text-gray-300">--</span>
                      )}
                      <p className="text-[11px] text-gray-500 leading-snug">{point.rececom}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {point.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 共通要件サマリー ─── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          診療所・病院 共通の主要要件
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              共通の遵守要件（必須）
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-700">
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                <span>
                  クラウドネイティブ（パブリッククラウド環境での稼働）
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                <span>
                  オンライン資格確認、電子処方箋、電子カルテ情報共有サービスとの接続
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                <span>
                  価格・セキュリティ情報・サービス仕様の公開
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                <span>
                  データの日本国内保持、バックアップ環境整備
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                <span>
                  医療情報安全管理ガイドライン・非機能要求グレードへの適合
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-emerald-500" />
              共通の推奨・参考要件
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-700">
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>
                  <TypeBadge type="推奨" /> アクセシビリティ（ウェブアクセシビリティ導入ガイドブック準拠）
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>
                  <TypeBadge type="推奨" /> デモ・トライアル提供、テスト環境の整備
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>
                  <TypeBadge type="推奨" /> 介護情報基盤・医療DX関連サービスとの連携
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  <TypeBadge type="参考" /> データ移行（ポータビリティ）— 次版以降において設定予定
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  <TypeBadge type="参考" /> 部門システム・業務効率化ツールとのAPI仕様 — 次版以降において設定予定
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
