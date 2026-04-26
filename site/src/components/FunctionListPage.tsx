import fs from 'fs';
import path from 'path';
import { FunctionListTable } from './content/FunctionListTable';

interface EmrFunction {
  itemNo: number;
  category: string;
  functionName: string;
  branchNo: number;
  requirement: string;
}

interface FunctionData {
  documentTitle: string;
  description: string;
  source: string;
  categories: { name: string; count: number }[];
  functions: EmrFunction[];
}

function loadFunctionData(): FunctionData {
  const filePath = path.join(process.cwd(), '..', 'docs', 'data', 'emr-functions.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function FunctionListPage() {
  const data = loadFunctionData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          電子カルテ提示対象機能一覧
        </h1>
        <p className="mt-2 text-gray-600">{data.description}</p>
        <p className="mt-1 text-sm text-gray-500">出典: {data.source}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {data.functions.length}
          </div>
          <div className="text-sm text-gray-500">機能項目数</div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {data.categories.length}
          </div>
          <div className="text-sm text-gray-500">分類数</div>
        </div>
      </div>

      {/* Implementation status legend */}
      <div className="rounded-lg border bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-900">
          実装状況の判定基準
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-bold">●</span> 実装あり —
            不足なく実装されている
          </div>
          <div>
            <span className="font-bold">○</span> 他機能で代替 —
            専用機能は未実装だが代替可能
          </div>
          <div>
            <span className="font-bold">△</span> 一部実装 —
            一部が実装されている
          </div>
          <div>
            <span className="font-bold">×</span> 実装なし —
            実装されておらず代替不可
          </div>
        </div>
      </div>

      {/* Category overview with chips */}
      <div>
        <h2 className="mb-3 text-xl font-bold text-gray-900">分類一覧</h2>
        <div className="flex flex-wrap gap-2">
          {data.categories.map((cat) => (
            <a
              key={cat.name}
              href={`#${cat.name}`}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm transition-colors hover:bg-indigo-100"
            >
              <span>{cat.name}</span>
              <span className="text-xs text-gray-500">({cat.count})</span>
            </a>
          ))}
        </div>
      </div>

      {/* Client-side filterable table */}
      <FunctionListTable
        functions={data.functions}
        categories={data.categories}
      />
    </div>
  );
}
