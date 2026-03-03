'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ClipboardCheck,
  FileText,
  Calculator,
  Building2,
  Stethoscope,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Download,
  Printer,
  RotateCcw,
  Save,
  Filter,
  Share2,
  Link,
  Check,
} from 'lucide-react';
import { event as gaEvent } from '@/lib/gtag';

/* ─── 型定義 ─── */
type ComplianceStatus = '適合' | '一部適合' | '非適合' | '対象外' | '未確認';
type FacilityType = 'clinic' | 'hospital';
type SystemType = 'emr' | 'rececom';
type FilterType = 'all' | '遵守' | '推奨' | '参考';

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

interface CheckResult {
  status: ComplianceStatus;
  note: string;
}

interface SavedState {
  organizationName: string;
  checkerName: string;
  results: Record<string, CheckResult>;
  lastSaved: string;
}

export interface ComplianceCheckerProps {
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

const categoryOrder = [
  'functional',
  'non-functional',
  'architecture',
  'data-migration',
  'integration',
  'disclosure',
];

const statusConfig: Record<ComplianceStatus, { color: string; bg: string; ring: string; icon: typeof CheckCircle2 }> = {
  '適合': { color: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-300', icon: CheckCircle2 },
  '一部適合': { color: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-300', icon: AlertTriangle },
  '非適合': { color: 'text-red-700', bg: 'bg-red-50', ring: 'ring-red-300', icon: Shield },
  '対象外': { color: 'text-gray-500', bg: 'bg-gray-50', ring: 'ring-gray-300', icon: Info },
  '未確認': { color: 'text-gray-400', bg: 'bg-white', ring: 'ring-gray-200', icon: Info },
};

const facilityLabels: Record<FacilityType, string> = {
  clinic: '医科診療所向け',
  hospital: '中小病院向け',
};

const systemLabels: Record<SystemType, string> = {
  emr: '電子カルテ',
  rececom: 'レセコン',
};

/* ─── ストレージキー ─── */
function storageKey(facility: FacilityType, system: SystemType) {
  return `emr-compliance-${facility}-${system}`;
}

/* ─── フラット化ヘルパー ─── */
interface FlatRequirement extends Requirement {
  categoryKey: string;
  categoryLabel: string;
}

function flattenRequirements(spec: SpecData): FlatRequirement[] {
  const result: FlatRequirement[] = [];
  for (const catKey of categoryOrder) {
    const cat = spec.categories[catKey];
    if (!cat?.requirements) continue;
    for (const req of cat.requirements) {
      result.push({
        ...req,
        categoryKey: catKey,
        categoryLabel: categoryLabels[catKey] ?? catKey,
      });
    }
  }
  return result;
}

/* ─── エクスポート: Excel ─── */
async function exportToExcel(
  requirements: FlatRequirement[],
  results: Record<string, CheckResult>,
  meta: { organizationName: string; checkerName: string; documentTitle: string; checkDate: string }
) {
  const XLSX = await import('xlsx');

  const headerRows = [
    ['電子カルテ標準要件 適合性チェック結果'],
    [],
    ['施設名', meta.organizationName],
    ['確認者', meta.checkerName],
    ['確認日', meta.checkDate],
    ['対象文書', meta.documentTitle],
    [],
  ];

  // サマリー
  const statusCounts: Record<ComplianceStatus, number> = { '適合': 0, '一部適合': 0, '非適合': 0, '対象外': 0, '未確認': 0 };
  for (const req of requirements) {
    const status = results[req.id]?.status ?? '未確認';
    statusCounts[status]++;
  }
  const summaryRows = [
    ['■ サマリー'],
    ['総要件数', requirements.length],
    ['適合', statusCounts['適合']],
    ['一部適合', statusCounts['一部適合']],
    ['非適合', statusCounts['非適合']],
    ['対象外', statusCounts['対象外']],
    ['未確認', statusCounts['未確認']],
    [],
  ];

  // 要件一覧
  const tableHeader = ['カテゴリ', '要件ID', '要件名', '分類', '説明', '適合状況', '備考'];
  const tableRows = requirements.map((req) => {
    const r = results[req.id];
    return [
      req.categoryLabel,
      req.id,
      req.title,
      req.type,
      req.description,
      r?.status ?? '未確認',
      r?.note ?? '',
    ];
  });

  const data = [...headerRows, ...summaryRows, ['■ 要件一覧'], tableHeader, ...tableRows];
  const ws = XLSX.utils.aoa_to_sheet(data);

  // 列幅設定
  ws['!cols'] = [
    { wch: 18 }, // カテゴリ
    { wch: 10 }, // 要件ID
    { wch: 40 }, // 要件名
    { wch: 8 },  // 分類
    { wch: 60 }, // 説明
    { wch: 10 }, // 適合状況
    { wch: 30 }, // 備考
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '適合性チェック');

  const filename = `適合性チェック_${meta.organizationName || '未入力'}_${meta.checkDate}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/* ─── エクスポート: PDF（印刷） ─── */
function exportToPDF(
  requirements: FlatRequirement[],
  results: Record<string, CheckResult>,
  meta: { organizationName: string; checkerName: string; documentTitle: string; checkDate: string }
) {
  const statusCounts: Record<ComplianceStatus, number> = { '適合': 0, '一部適合': 0, '非適合': 0, '対象外': 0, '未確認': 0 };
  for (const req of requirements) {
    const status = results[req.id]?.status ?? '未確認';
    statusCounts[status]++;
  }
  const total = requirements.length;
  const checked = total - statusCounts['未確認'];

  // カテゴリ別にグループ化
  const grouped = new Map<string, FlatRequirement[]>();
  for (const req of requirements) {
    const key = req.categoryLabel;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(req);
  }

  const statusColor: Record<ComplianceStatus, string> = {
    '適合': '#059669',
    '一部適合': '#d97706',
    '非適合': '#dc2626',
    '対象外': '#6b7280',
    '未確認': '#9ca3af',
  };

  const statusBg: Record<ComplianceStatus, string> = {
    '適合': '#ecfdf5',
    '一部適合': '#fffbeb',
    '非適合': '#fef2f2',
    '対象外': '#f9fafb',
    '未確認': '#ffffff',
  };

  const typeColor: Record<string, string> = {
    '遵守': '#dc2626',
    '推奨': '#0284c7',
    '参考': '#059669',
    '不可': '#6b7280',
  };

  let tableRows = '';
  for (const [catLabel, reqs] of grouped) {
    tableRows += `<tr><td colspan="6" style="background:#f1f5f9;font-weight:700;padding:10px 12px;font-size:13px;border-top:2px solid #cbd5e1;">${catLabel}</td></tr>`;
    for (const req of reqs) {
      const r = results[req.id];
      const status = r?.status ?? '未確認';
      const note = r?.note ?? '';
      const tc = typeColor[req.type] ?? '#6b7280';
      const sc = statusColor[status];
      const sb = statusBg[status];
      tableRows += `
        <tr>
          <td style="padding:8px 10px;font-family:monospace;font-size:11px;color:#6b7280;white-space:nowrap;">${req.id}</td>
          <td style="padding:8px 10px;font-size:12px;">${req.title}</td>
          <td style="padding:8px 10px;text-align:center;"><span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;color:${tc};background:${tc}15;">${req.type}</span></td>
          <td style="padding:8px 10px;text-align:center;"><span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;color:${sc};background:${sb};">${status}</span></td>
          <td style="padding:8px 10px;font-size:11px;color:#4b5563;max-width:200px;word-break:break-all;">${note}</td>
        </tr>`;
    }
  }

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>適合性チェック結果 - ${meta.organizationName || ''}</title>
<style>
  @page { size: A4 landscape; margin: 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic','Meiryo',sans-serif; color: #1e293b; line-height: 1.5; }
  .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px solid #4f46e5; }
  .header h1 { font-size: 20px; color: #1e1b4b; }
  .header p { font-size: 12px; color: #64748b; margin-top: 4px; }
  .meta { display: flex; gap: 32px; margin-bottom: 20px; flex-wrap: wrap; }
  .meta-item { font-size: 13px; }
  .meta-item .label { font-weight: 700; color: #475569; }
  .summary { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
  .summary-card { padding: 12px 20px; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center; min-width: 100px; }
  .summary-card .num { font-size: 24px; font-weight: 800; }
  .summary-card .lbl { font-size: 11px; color: #64748b; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #334155; color: white; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; }
  td { border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  tr:hover { background: #f8fafc; }
  .footer { margin-top: 24px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="header">
  <h1>電子カルテ標準要件 適合性チェック結果</h1>
  <p>${meta.documentTitle}</p>
</div>
<div class="meta">
  <div class="meta-item"><span class="label">施設名: </span>${meta.organizationName || '（未入力）'}</div>
  <div class="meta-item"><span class="label">確認者: </span>${meta.checkerName || '（未入力）'}</div>
  <div class="meta-item"><span class="label">確認日: </span>${meta.checkDate}</div>
  <div class="meta-item"><span class="label">確認済: </span>${checked} / ${total}件</div>
</div>
<div class="summary">
  <div class="summary-card"><div class="num" style="color:#059669">${statusCounts['適合']}</div><div class="lbl">適合</div></div>
  <div class="summary-card"><div class="num" style="color:#d97706">${statusCounts['一部適合']}</div><div class="lbl">一部適合</div></div>
  <div class="summary-card"><div class="num" style="color:#dc2626">${statusCounts['非適合']}</div><div class="lbl">非適合</div></div>
  <div class="summary-card"><div class="num" style="color:#6b7280">${statusCounts['対象外']}</div><div class="lbl">対象外</div></div>
  <div class="summary-card"><div class="num" style="color:#9ca3af">${statusCounts['未確認']}</div><div class="lbl">未確認</div></div>
</div>
<table>
  <thead><tr>
    <th style="width:60px">ID</th>
    <th>要件名</th>
    <th style="width:60px;text-align:center">分類</th>
    <th style="width:80px;text-align:center">適合状況</th>
    <th style="width:200px">備考</th>
  </tr></thead>
  <tbody>${tableRows}</tbody>
</table>
<div class="footer">電子カルテ標準要件ガイド (https://emr-doc.example.com) より出力 — ${meta.checkDate}</div>
</body></html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('ポップアップがブロックされました。ブラウザの設定を確認してください。');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    setTimeout(() => printWindow.print(), 300);
  };
}

/* ─── サブコンポーネント ─── */

function StatusSelector({
  value,
  onChange,
}: {
  value: ComplianceStatus;
  onChange: (s: ComplianceStatus) => void;
}) {
  const statuses: ComplianceStatus[] = ['適合', '一部適合', '非適合', '対象外'];

  return (
    <div className="flex gap-1 flex-wrap">
      {statuses.map((s) => {
        const cfg = statusConfig[s];
        const Icon = cfg.icon;
        const isSelected = value === s;
        return (
          <button
            key={s}
            onClick={() => onChange(isSelected ? '未確認' : s)}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ring-1 ring-inset transition-all ${
              isSelected
                ? `${cfg.bg} ${cfg.color} ${cfg.ring} shadow-sm`
                : 'bg-white text-gray-400 ring-gray-200 hover:ring-gray-300 hover:text-gray-500'
            }`}
          >
            <Icon className="h-3 w-3" />
            {s}
          </button>
        );
      })}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    '遵守': 'bg-red-50 text-red-700 ring-red-200',
    '推奨': 'bg-sky-50 text-sky-700 ring-sky-200',
    '参考': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    '不可': 'bg-gray-100 text-gray-600 ring-gray-300',
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${styles[type] ?? 'bg-gray-50 text-gray-500 ring-gray-200'}`}>
      {type}
    </span>
  );
}

function RequirementRow({
  req,
  result,
  onStatusChange,
  onNoteChange,
}: {
  req: FlatRequirement;
  result: CheckResult;
  onStatusChange: (status: ComplianceStatus) => void;
  onNoteChange: (note: string) => void;
}) {
  const [showNote, setShowNote] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`border-b border-gray-100 transition-colors ${
      result.status === '非適合' ? 'bg-red-50/30' :
      result.status === '適合' ? 'bg-emerald-50/20' :
      result.status === '一部適合' ? 'bg-amber-50/20' : ''
    }`}>
      <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:gap-4">
        {/* ID + 分類 */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs text-gray-400 w-12">{req.id}</span>
          <TypeBadge type={req.type} />
        </div>

        {/* タイトル + 説明 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug">
            {req.title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
            {req.description}
          </p>
          {req.details && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] text-indigo-500 hover:text-indigo-700 mt-1 flex items-center gap-0.5"
            >
              {showDetails ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              詳細を{showDetails ? '閉じる' : '見る'}
            </button>
          )}
          {showDetails && req.details && (
            <div className="mt-2 rounded-md bg-gray-50 p-3 text-xs text-gray-600 leading-relaxed max-h-40 overflow-y-auto">
              {req.details}
            </div>
          )}
          {req.notes && (
            <div className="mt-1.5 rounded bg-amber-50 border border-amber-100 px-2.5 py-1.5 text-[11px] text-amber-800">
              <strong>注記:</strong> {req.notes}
            </div>
          )}
        </div>

        {/* ステータス選択 */}
        <div className="shrink-0 flex flex-col gap-1.5 items-end">
          <StatusSelector value={result.status} onChange={onStatusChange} />
          <button
            onClick={() => setShowNote(!showNote)}
            className={`text-[11px] flex items-center gap-0.5 ${result.note ? 'text-indigo-600 font-medium' : 'text-gray-400 hover:text-gray-500'}`}
          >
            <FileText className="h-3 w-3" />
            {result.note ? '備考あり' : '備考を追加'}
          </button>
        </div>
      </div>

      {/* 備考入力 */}
      {showNote && (
        <div className="px-4 pb-3">
          <textarea
            value={result.note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="備考を入力..."
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            rows={2}
          />
        </div>
      )}
    </div>
  );
}

function ProgressBar({
  requirements,
  results,
}: {
  requirements: FlatRequirement[];
  results: Record<string, CheckResult>;
}) {
  const total = requirements.length;
  const counts: Record<ComplianceStatus, number> = { '適合': 0, '一部適合': 0, '非適合': 0, '対象外': 0, '未確認': 0 };
  for (const req of requirements) {
    const status = results[req.id]?.status ?? '未確認';
    counts[status]++;
  }
  const checked = total - counts['未確認'];
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  // 遵守要件のみの集計
  const junshus = requirements.filter((r) => r.type === '遵守');
  const junshuTotal = junshus.length;
  const junshuCompliant = junshus.filter((r) => results[r.id]?.status === '適合').length;
  const junshuNonCompliant = junshus.filter((r) => results[r.id]?.status === '非適合').length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">チェック進捗</h3>
        <span className="text-2xl font-black text-gray-900 tabular-nums">
          {pct}<span className="text-sm font-medium text-gray-400">%</span>
        </span>
      </div>

      {/* プログレスバー */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100 mb-3">
        {counts['適合'] > 0 && (
          <div className="bg-emerald-400 transition-all duration-500" style={{ width: `${(counts['適合'] / total) * 100}%` }} />
        )}
        {counts['一部適合'] > 0 && (
          <div className="bg-amber-400 transition-all duration-500" style={{ width: `${(counts['一部適合'] / total) * 100}%` }} />
        )}
        {counts['非適合'] > 0 && (
          <div className="bg-red-400 transition-all duration-500" style={{ width: `${(counts['非適合'] / total) * 100}%` }} />
        )}
        {counts['対象外'] > 0 && (
          <div className="bg-gray-300 transition-all duration-500" style={{ width: `${(counts['対象外'] / total) * 100}%` }} />
        )}
      </div>

      {/* カウント */}
      <div className="flex flex-wrap gap-3 text-[11px]">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> 適合 {counts['適合']}</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> 一部適合 {counts['一部適合']}</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" /> 非適合 {counts['非適合']}</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-300" /> 対象外 {counts['対象外']}</span>
        <span className="flex items-center gap-1 text-gray-400">未確認 {counts['未確認']}</span>
      </div>

      {/* 遵守要件サマリー */}
      {junshuTotal > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-600">
              遵守要件（必須）: {junshuCompliant}/{junshuTotal} 適合
            </span>
            {junshuNonCompliant > 0 && (
              <span className="text-red-600 font-bold">{junshuNonCompliant}件 非適合</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SNSアイコン ─── */
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.365 9.864c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-1.538v.96h1.538c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-2.588c-.58 0-1.05-.47-1.05-1.05v-4.16c0-.58.47-1.05 1.05-1.05h2.588c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-1.538v.96zM12 0C5.373 0 0 4.925 0 10.996c0 5.442 4.834 10.003 11.363 10.873.44.095 1.04.29 1.193.666.136.34.09.872.044 1.214l-.192 1.156c-.059.346-.273 1.354 1.186.738 1.46-.617 7.876-4.639 10.746-7.94C22.768 15.93 24 13.587 24 10.996 24 4.925 18.627 0 12 0zm-3.063 13.02c0 .58-.47 1.05-1.05 1.05s-1.05-.47-1.05-1.05V8.86c0-.58.47-1.05 1.05-1.05s1.05.47 1.05 1.05zm3.065 0c0 .47-.31.87-.743 1.005a1.078 1.078 0 01-.3.045c-.35 0-.668-.18-.856-.47L8.533 11.15v1.87c0 .58-.47 1.05-1.05 1.05s-1.05-.47-1.05-1.05V8.86c0-.47.31-.87.743-1.005.098-.03.2-.045.307-.045.35 0 .668.18.856.47l1.57 2.45V8.86c0-.58.47-1.05 1.05-1.05s1.05.47 1.05 1.05zm4.79-2.06c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-1.538v.96h1.538c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-2.588c-.58 0-1.05-.47-1.05-1.05v-4.16c0-.58.47-1.05 1.05-1.05h2.588c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05h-1.538v.96z" />
    </svg>
  );
}

/* ─── SNSシェアセクション ─── */
const SHARE_TEXT = '電子カルテ標準要件の適合性チェックツール — 現在のシステムが新しい標準要件に適合しているか確認できます';

function ShareSection() {
  const [copied, setCopied] = useState(false);

  const getPageUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  };

  const handleShare = (platform: string) => {
    const url = getPageUrl();
    const text = encodeURIComponent(SHARE_TEXT);
    const encodedUrl = encodeURIComponent(url);

    let shareUrl = '';
    switch (platform) {
      case 'x':
        shareUrl = `https://x.com/intent/tweet?text=${text}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'line':
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${text}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
    }

    gaEvent({ action: 'share', category: 'compliance_checker', label: platform });
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getPageUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      gaEvent({ action: 'share', category: 'compliance_checker', label: 'copy_url' });
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = getPageUrl();
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-bold text-gray-900">このツールを共有</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        同僚や関係者にこのチェックツールを共有できます
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleShare('x')}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-900 hover:text-white hover:border-gray-900"
        >
          <XIcon className="h-4 w-4" />
          X
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
        >
          <FacebookIcon className="h-4 w-4" />
          Facebook
        </button>
        <button
          onClick={() => handleShare('line')}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#06C755] hover:text-white hover:border-[#06C755]"
        >
          <LineIcon className="h-4 w-4" />
          LINE
        </button>
        <button
          onClick={handleCopyUrl}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
            copied
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
          {copied ? 'コピーしました' : 'URLをコピー'}
        </button>
      </div>
    </div>
  );
}

/* ─── メインコンポーネント ─── */
export function ComplianceChecker({ clinicEmr, hospitalEmr, clinicRececom, hospitalRececom }: ComplianceCheckerProps) {
  const [facilityType, setFacilityType] = useState<FacilityType>('clinic');
  const [systemType, setSystemType] = useState<SystemType>('emr');
  const [organizationName, setOrganizationName] = useState('');
  const [checkerName, setCheckerName] = useState('');
  const [results, setResults] = useState<Record<string, CheckResult>>({});
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categoryOrder));
  const [loaded, setLoaded] = useState(false);

  const specs: Record<string, SpecData> = {
    'clinic-emr': clinicEmr,
    'hospital-emr': hospitalEmr,
    'clinic-rececom': clinicRececom,
    'hospital-rececom': hospitalRececom,
  };

  const currentSpec = specs[`${facilityType}-${systemType}`];
  const allRequirements = useMemo(() => flattenRequirements(currentSpec), [currentSpec]);
  const filteredRequirements = useMemo(
    () => filterType === 'all' ? allRequirements : allRequirements.filter((r) => r.type === filterType),
    [allRequirements, filterType]
  );

  // localStorage から復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(facilityType, systemType));
      if (saved) {
        const parsed: SavedState = JSON.parse(saved);
        setResults(parsed.results ?? {});
        setOrganizationName(parsed.organizationName ?? '');
        setCheckerName(parsed.checkerName ?? '');
      } else {
        setResults({});
      }
    } catch {
      setResults({});
    }
    setLoaded(true);
  }, [facilityType, systemType]);

  // localStorage へ保存（デバウンス）
  const saveToStorage = useCallback(() => {
    const state: SavedState = {
      organizationName,
      checkerName,
      results,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(storageKey(facilityType, systemType), JSON.stringify(state));
  }, [facilityType, systemType, organizationName, checkerName, results]);

  useEffect(() => {
    if (!loaded) return;
    const timeout = setTimeout(saveToStorage, 500);
    return () => clearTimeout(timeout);
  }, [saveToStorage, loaded]);

  const handleStatusChange = (reqId: string, status: ComplianceStatus) => {
    setResults((prev) => ({
      ...prev,
      [reqId]: { status, note: prev[reqId]?.note ?? '' },
    }));
  };

  const handleNoteChange = (reqId: string, note: string) => {
    setResults((prev) => ({
      ...prev,
      [reqId]: { status: prev[reqId]?.status ?? '未確認', note },
    }));
  };

  const handleReset = () => {
    if (!window.confirm('チェック結果をすべてリセットしますか？この操作は取り消せません。')) return;
    setResults({});
    setOrganizationName('');
    setCheckerName('');
    localStorage.removeItem(storageKey(facilityType, systemType));
    gaEvent({ action: 'compliance_reset', category: 'compliance_checker' });
  };

  const handleExportExcel = () => {
    const today = new Date().toISOString().slice(0, 10);
    exportToExcel(allRequirements, results, {
      organizationName,
      checkerName,
      documentTitle: currentSpec.documentTitle,
      checkDate: today,
    });
    gaEvent({ action: 'compliance_export', category: 'compliance_checker', label: 'excel' });
  };

  const handleExportPDF = () => {
    const today = new Date().toISOString().slice(0, 10);
    exportToPDF(allRequirements, results, {
      organizationName,
      checkerName,
      documentTitle: currentSpec.documentTitle,
      checkDate: today,
    });
    gaEvent({ action: 'compliance_export', category: 'compliance_checker', label: 'pdf' });
  };

  const toggleCategory = (catKey: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catKey)) next.delete(catKey);
      else next.add(catKey);
      return next;
    });
  };

  // カテゴリ別にグループ化
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, FlatRequirement[]>();
    for (const req of filteredRequirements) {
      if (!map.has(req.categoryKey)) map.set(req.categoryKey, []);
      map.get(req.categoryKey)!.push(req);
    }
    return map;
  }, [filteredRequirements]);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-5xl">
      {/* ─── ヒーロー ─── */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-8 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <ClipboardCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              適合性チェック
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-teal-100">
              現在お使いの電子カルテ・レセコンが、新しい標準要件に適合しているかを項目ごとにチェックできます。
              結果はブラウザに自動保存され、ExcelやPDFとしてダウンロードも可能です。
            </p>
          </div>
        </div>
      </div>

      {/* ─── 設定セクション ─── */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-4">チェック対象の設定</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 施設種別 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">施設種別</label>
            <div className="flex rounded-lg bg-gray-100 p-0.5">
              <button
                onClick={() => setFacilityType('clinic')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                  facilityType === 'clinic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5" />
                診療所
              </button>
              <button
                onClick={() => setFacilityType('hospital')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                  facilityType === 'hospital' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                病院
              </button>
            </div>
          </div>

          {/* システム種別 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">システム種別</label>
            <div className="flex rounded-lg bg-gray-100 p-0.5">
              <button
                onClick={() => setSystemType('emr')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                  systemType === 'emr' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                電子カルテ
              </button>
              <button
                onClick={() => setSystemType('rececom')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                  systemType === 'rececom' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calculator className="h-3.5 w-3.5" />
                レセコン
              </button>
            </div>
          </div>

          {/* 施設名 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">施設名（任意）</label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="例: ○○クリニック"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            />
          </div>

          {/* 確認者名 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">確認者名（任意）</label>
            <input
              type="text"
              value={checkerName}
              onChange={(e) => setCheckerName(e.target.value)}
              placeholder="例: 山田太郎"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
          <strong>対象文書:</strong> {currentSpec.documentTitle}
        </div>
      </div>

      {/* ─── 進捗 + エクスポート ─── */}
      <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressBar requirements={allRequirements} results={results} />
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:border-emerald-300"
          >
            <Download className="h-4 w-4" />
            Excelダウンロード
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 hover:border-indigo-300"
          >
            <Printer className="h-4 w-4" />
            PDF出力（印刷）
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            リセット
          </button>
        </div>
      </div>

      {/* ─── フィルター ─── */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">表示:</span>
        {(['all', '遵守', '推奨', '参考'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              filterType === f
                ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'すべて' : f}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">
          {filteredRequirements.length}件
        </span>
      </div>

      {/* ─── 要件チェックリスト ─── */}
      <div className="space-y-4 mb-8">
        {categoryOrder.map((catKey) => {
          const reqs = groupedByCategory.get(catKey);
          if (!reqs || reqs.length === 0) return null;
          const isExpanded = expandedCategories.has(catKey);
          const catChecked = reqs.filter((r) => (results[r.id]?.status ?? '未確認') !== '未確認').length;

          return (
            <div key={catKey} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                onClick={() => toggleCategory(catKey)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  <h3 className="text-sm font-bold text-gray-900">
                    {categoryLabels[catKey] ?? catKey}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">{catChecked}/{reqs.length} 確認済</span>
                  <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                      style={{ width: `${reqs.length > 0 ? (catChecked / reqs.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {reqs.map((req) => (
                    <RequirementRow
                      key={req.id}
                      req={req}
                      result={results[req.id] ?? { status: '未確認', note: '' }}
                      onStatusChange={(s) => handleStatusChange(req.id, s)}
                      onNoteChange={(n) => handleNoteChange(req.id, n)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── SNSシェア ─── */}
      <ShareSection />

      {/* ─── 自動保存インジケーター ─── */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-8">
        <Save className="h-3.5 w-3.5" />
        チェック結果はブラウザに自動保存されています
      </div>
    </div>
  );
}
