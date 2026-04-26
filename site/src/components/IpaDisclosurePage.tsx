import fs from 'fs';
import path from 'path';
import { IpaDisclosureTable } from './content/IpaDisclosureTable';

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

interface IpaDisclosureData {
  documentTitle: string;
  description: string;
  source: string;
  version: string;
  lastUpdated: string;
  items: IpaDisclosureItem[];
}

/* ─── データ読み込み ─── */
function loadData(): IpaDisclosureData {
  const filePath = path.join(process.cwd(), '..', 'docs', 'data', 'ipa-disclosure.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

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

/* ─── メインコンポーネント ─── */

export function IpaDisclosurePage() {
  const data = loadData();
  const grouped = groupByCategory(data.items);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          非機能要件 要開示項目一覧
        </h1>
        <p className="mt-2 text-gray-600">{data.description}</p>
        <p className="mt-1 text-sm text-gray-500">出典: {data.source}</p>
      </div>

      {/* Overview */}
      <div className="rounded-lg border bg-indigo-50 p-5">
        <h2 className="font-bold text-indigo-900 mb-2">考え方</h2>
        <p className="text-sm text-indigo-800">
          非機能要件における標準としてIPAが示している「非機能要求グレード」を基に、
          医療機関等の要請があった場合に開示する項目を選定したもの。
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(grouped).map(([cat, items]) => (
          <div
            key={cat}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className="text-2xl font-bold text-indigo-600">
              {items.length}
            </div>
            <div className="text-sm text-gray-600">{cat}</div>
          </div>
        ))}
      </div>

      {/* Items by category */}
      <IpaDisclosureTable items={data.items} />
    </div>
  );
}
