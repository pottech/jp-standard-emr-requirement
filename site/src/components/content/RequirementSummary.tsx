import React from 'react';

interface RequirementSummaryProps {
  total: string | number;
  compliance: string | number;
  recommended: string | number;
  prohibited: string | number;
  reference: string | number;
}

export function RequirementSummary({
  total: rawTotal,
  compliance: rawCompliance,
  recommended: rawRecommended,
  prohibited: rawProhibited,
  reference: rawReference,
}: RequirementSummaryProps) {
  const total = Number(rawTotal) || 0;
  const compliance = Number(rawCompliance) || 0;
  const recommended = Number(rawRecommended) || 0;
  const prohibited = Number(rawProhibited) || 0;
  const reference = Number(rawReference) || 0;

  const items = [
    { label: '遵守', count: compliance, color: 'bg-blue-500', textColor: 'text-blue-700' },
    { label: '推奨', count: recommended, color: 'bg-green-500', textColor: 'text-green-700' },
    { label: '不可', count: prohibited, color: 'bg-red-500', textColor: 'text-red-700' },
    { label: '参考', count: reference, color: 'bg-gray-400', textColor: 'text-gray-600' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-900">要件サマリー</h4>
        <span className="text-sm text-gray-500">合計 {total} 件</span>
      </div>

      {/* バーチャート */}
      <div className="mb-4 flex h-4 w-full overflow-hidden rounded-full bg-gray-100">
        {items.map((item) =>
          item.count > 0 ? (
            <div
              key={item.label}
              className={`${item.color} transition-all`}
              style={{ width: `${(item.count / total) * 100}%` }}
              title={`${item.label}: ${item.count}件`}
            />
          ) : null
        )}
      </div>

      {/* 凡例 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className={`text-sm font-bold ${item.textColor}`}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
