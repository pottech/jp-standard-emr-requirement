'use client';

import React, { useState, useMemo } from 'react';

interface ApiSpec {
  interfaceId: string;
  name: string;
  function: string;
  direction: string;
  description: string;
}

interface ApiSpecTableProps {
  category: string;
  subcategory: string;
  specs: ApiSpec[];
}

type SortKey = 'interfaceId' | 'name' | 'function';
type SortDirection = 'asc' | 'desc';

export function ApiSpecTable({ category, subcategory, specs = [] }: ApiSpecTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('interfaceId');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const specsList = Array.isArray(specs) ? specs : [];

  const sorted = useMemo(() => {
    return [...specsList].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = aVal.localeCompare(bVal, 'ja');
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [specsList, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? ' \u2191' : ' \u2193';
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
        <span className="text-xs font-medium text-gray-500">{category} / {subcategory}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th
                className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                onClick={() => handleSort('interfaceId')}
              >
                IF-ID{sortIndicator('interfaceId')}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                onClick={() => handleSort('name')}
              >
                機能名{sortIndicator('name')}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                onClick={() => handleSort('function')}
              >
                機能{sortIndicator('function')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                方向
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                説明
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((spec, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-600">
                  {spec.interfaceId}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {spec.name}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {spec.function}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  <span className="inline-flex items-center rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    {spec.direction}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {spec.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
