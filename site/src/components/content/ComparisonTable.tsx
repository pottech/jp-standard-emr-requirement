import React from 'react';

interface ComparisonTableProps {
  title: string;
  headers: string[];
  rows: string[][];
}

export function ComparisonTable({ title, headers = [], rows = [] }: ComparisonTableProps) {
  if (!headers.length || !rows.length) {
    return null;
  }
  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-gray-700">
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCell(value: string) {
  if (value === '遵守') {
    return <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">遵守</span>;
  }
  if (value === '推奨') {
    return <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">推奨</span>;
  }
  if (value === '不可') {
    return <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">不可</span>;
  }
  if (value === '参考') {
    return <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-800">参考</span>;
  }
  if (value === '-') {
    return <span className="text-gray-300">--</span>;
  }
  return value;
}
