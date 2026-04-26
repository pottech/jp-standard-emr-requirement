'use client';

import React, { useState, useMemo } from 'react';

interface EmrFunction {
  itemNo: number;
  category: string;
  functionName: string;
  branchNo: number;
  requirement: string;
}

interface Props {
  functions: EmrFunction[];
  categories: { name: string; count: number }[];
}

export function FunctionListTable({ functions, categories }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filtered = useMemo(() => {
    return functions.filter((fn) => {
      const matchesSearch =
        !search ||
        fn.requirement.includes(search) ||
        fn.functionName.includes(search) ||
        fn.category.includes(search);
      const matchesCategory =
        !selectedCategory || fn.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [functions, search, selectedCategory]);

  // Group filtered results by category
  const grouped = useMemo(() => {
    const g: Record<string, EmrFunction[]> = {};
    filtered.forEach((fn) => {
      if (!g[fn.category]) g[fn.category] = [];
      g[fn.category].push(fn);
    });
    return g;
  }, [filtered]);

  return (
    <div>
      {/* Search and filter controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="機能名・要件を検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">全分類</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}（{cat.count}）
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-gray-500">{filtered.length} 件表示</p>

      {/* Grouped tables */}
      {Object.entries(grouped).map(([category, fns]) => (
        <div key={category} id={category} className="mb-8">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
              {fns.length}
            </span>
            {category}
          </h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="w-16 px-3 py-2 text-left text-xs font-semibold text-gray-500">
                    項番
                  </th>
                  <th className="w-32 px-3 py-2 text-left text-xs font-semibold text-gray-500">
                    機能名
                  </th>
                  <th className="w-12 px-3 py-2 text-left text-xs font-semibold text-gray-500">
                    枝番
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                    機能要件
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fns.map((fn) => (
                  <tr
                    key={`${fn.itemNo}-${fn.branchNo}`}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-gray-500">
                      {fn.itemNo}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {fn.functionName}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-500">
                      {fn.branchNo}
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      {fn.requirement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
