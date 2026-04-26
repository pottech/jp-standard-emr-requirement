'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/* ─── 型定義 ─── */
interface RelatedGuidelines {
  medicalInfoSafetyGuideline?: string;
  vendorSafetyGuideline?: string;
}

interface IpaDisclosureItem {
  id: string;
  majorCategory: string;
  mediumCategory: string;
  minorCategory: string;
  description: string;
  metrics: string;
  approachExample: string;
  recordExample: string;
  relatedGuidelines?: RelatedGuidelines;
}

interface IpaDisclosureTableProps {
  items: IpaDisclosureItem[];
}

/* ─── カテゴリ色マッピング ─── */
const categoryColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  '可用性': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  '性能・拡張性': {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
  },
  '運用・保守性': {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
  },
  '移行性': {
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
  },
};

const defaultColors = {
  bg: 'bg-gray-50',
  text: 'text-gray-900',
  border: 'border-gray-200',
  badge: 'bg-gray-100 text-gray-800',
};

/* ─── ヘルパー ─── */
function groupByCategory(items: IpaDisclosureItem[]): Record<string, IpaDisclosureItem[]> {
  const grouped: Record<string, IpaDisclosureItem[]> = {};
  for (const item of items) {
    if (!grouped[item.majorCategory]) {
      grouped[item.majorCategory] = [];
    }
    grouped[item.majorCategory].push(item);
  }
  return grouped;
}

function MultilineText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => (
        <p key={i} className={line.trim() === '' ? 'h-2' : ''}>
          {line}
        </p>
      ))}
    </div>
  );
}

/* ─── 個別カードコンポーネント ─── */
function DisclosureItemCard({ item }: { item: IpaDisclosureItem }) {
  const [expanded, setExpanded] = useState(false);
  const colors = categoryColors[item.majorCategory] ?? defaultColors;

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
      >
        <span className="mt-0.5 shrink-0">
          {expanded ? (
            <ChevronDown size={16} className="text-gray-400" />
          ) : (
            <ChevronRight size={16} className="text-gray-400" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-gray-700">
              {item.id}
            </span>
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${colors.badge}`}>
              {item.mediumCategory}
            </span>
            <span className="text-xs text-gray-500">{item.minorCategory}</span>
          </div>
          <p className="text-sm font-medium text-gray-900">{item.metrics}</p>
        </div>
        {/* Related guideline badges */}
        <div className="hidden sm:flex shrink-0 items-center gap-1.5">
          {item.relatedGuidelines?.medicalInfoSafetyGuideline && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              安全管理GL
            </span>
          )}
          {item.relatedGuidelines?.vendorSafetyGuideline && (
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
              事業者GL
            </span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-4">
          {/* Description */}
          <div>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>

          {/* Related guideline badges (mobile) */}
          <div className="flex sm:hidden items-center gap-1.5">
            {item.relatedGuidelines?.medicalInfoSafetyGuideline && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                安全管理GL
              </span>
            )}
            {item.relatedGuidelines?.vendorSafetyGuideline && (
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                事業者GL
              </span>
            )}
          </div>

          {/* Approach example */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <h5 className="text-sm font-bold text-blue-900 mb-2">
              考え方の例
            </h5>
            <div className="text-sm text-blue-800 leading-relaxed">
              <MultilineText text={item.approachExample} />
            </div>
          </div>

          {/* Record example */}
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <h5 className="text-sm font-bold text-green-900 mb-2">
              記載例
            </h5>
            <div className="text-sm text-green-800 leading-relaxed">
              <MultilineText text={item.recordExample} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── メインコンポーネント ─── */
export function IpaDisclosureTable({ items }: IpaDisclosureTableProps) {
  const grouped = groupByCategory(items);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, categoryItems]) => {
        const colors = categoryColors[category] ?? defaultColors;

        return (
          <section key={category}>
            <div
              className={`rounded-t-lg ${colors.bg} ${colors.border} border px-5 py-3 mb-0`}
            >
              <h3 className={`text-lg font-bold ${colors.text}`}>
                {category}
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">
                {categoryItems.length}項目
              </p>
            </div>
            <div className="space-y-3 pt-3">
              {categoryItems.map((item) => (
                <DisclosureItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
