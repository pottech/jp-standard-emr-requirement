import fs from 'fs';
import path from 'path';

/* ─── 型定義 ─── */
interface SpecItem {
  no: number;
  item: string;
  spec: string;
  details: string;
}

interface BinaryDataSpec {
  label: string;
  storageMethod: string;
  folderStructure: string;
  linkKey: string;
}

interface Field {
  no: number;
  logicalName: string;
  physicalName: string;
  type: string;
  size: number | null;
  description: string;
}

interface ProfileCode {
  code: string;
  name: string;
  fields: string[];
}

interface Section {
  name: string;
  fields?: Field[];
  profileCodes?: ProfileCode[];
}

interface ExportSpec {
  id: string;
  label: string;
  description: string;
  sections?: Section[];
}

interface DataMigration {
  documentTitle: string;
  description: string;
  source: string;
  version: string;
  lastUpdated: string;
  commonExportSpec: {
    label: string;
    masterDataSpec: {
      label: string;
      items: SpecItem[];
    };
    binaryDataSpec: BinaryDataSpec;
  };
  individualExportSpecs: ExportSpec[];
}

/* ─── データ読み込み ─── */
function loadData(): DataMigration {
  const filePath = path.join(process.cwd(), '..', 'docs', 'data', 'data-migration.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/* ─── サブコンポーネント ─── */

function SpecTable({ items }: { items: SpecItem[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-12">No.</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-48">項目</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-56">仕様</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">備考</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.no} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500 font-mono">{item.no}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{item.item}</td>
              <td className="px-4 py-3">
                <code className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {item.spec}
                </code>
              </td>
              <td className="px-4 py-3 text-gray-600">{item.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BinarySection({ spec }: { spec: BinaryDataSpec }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{spec.label}</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">
            格納方式
          </span>
          <span className="text-sm text-gray-700">{spec.storageMethod}</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">
            フォルダ構造
          </span>
          <span className="text-sm text-gray-700">{spec.folderStructure}</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">
            リンク方法
          </span>
          <span className="text-sm text-gray-700">{spec.linkKey}</span>
        </div>

        {/* Folder structure diagram */}
        <div className="mt-4 rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-700">
          <div>Root/</div>
          <div className="ml-4">
            <div className="flex items-center gap-2">
              <span className="text-indigo-600">Data/</span>
              <span className="text-xs text-gray-400">--- CSV files</span>
            </div>
            <div className="ml-4 text-gray-500">
              PatientBasic_20250101_000001.csv
            </div>
            <div className="ml-4 text-gray-500">
              Disease_20250101_000001.csv
            </div>
          </div>
          <div className="ml-4 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-indigo-600">Attachments/</span>
              <span className="text-xs text-gray-400">--- Binary files</span>
            </div>
            <div className="ml-4 text-gray-500">
              img_001.jpg
            </div>
            <div className="ml-4 text-gray-500">
              doc_002.pdf
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldTable({ fields }: { fields: Field[] }) {
  const dataFields = fields.filter((f) => f.physicalName);
  if (dataFields.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-12">No.</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">論理名</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">物理名</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-20">型</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-16">桁数</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">説明</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {dataFields.map((field) => (
            <tr key={field.no} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-500 font-mono">{field.no}</td>
              <td className="px-3 py-2 font-medium text-gray-900">{field.logicalName}</td>
              <td className="px-3 py-2">
                <code className="text-xs text-indigo-700">{field.physicalName}</code>
              </td>
              <td className="px-3 py-2 text-gray-600">{field.type}</td>
              <td className="px-3 py-2 text-gray-600">{field.size ?? '-'}</td>
              <td className="px-3 py-2 text-gray-600">{field.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProfileCodeList({ codes }: { codes: ProfileCode[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {codes.map((profile) => (
        <div
          key={profile.code}
          className="rounded-lg border bg-white p-4 shadow-sm hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-mono font-bold text-indigo-700">
              {profile.code}
            </span>
            <span className="text-sm font-bold text-gray-900">{profile.name}</span>
          </div>
          {profile.fields.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {profile.fields.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {f}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400">詳細未定義</span>
          )}
        </div>
      ))}
    </div>
  );
}

function ExportSpecCard({ spec, defaultOpen }: { spec: ExportSpec; defaultOpen?: boolean }) {
  const hasDetails = spec.sections && spec.sections.length > 0;

  return (
    <details
      className="group rounded-lg border bg-white shadow-sm"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center justify-between p-5 hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="rounded bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">
            {spec.id}
          </span>
          <div>
            <h3 className="font-bold text-gray-900">{spec.label}</h3>
            <p className="text-sm text-gray-500">{spec.description}</p>
          </div>
        </div>
        {hasDetails && (
          <svg
            className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </summary>

      {hasDetails && (
        <div className="border-t p-5 space-y-6">
          {spec.sections!.map((section) => (
            <div key={section.name}>
              <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                {section.name}
              </h4>

              {section.fields && <FieldTable fields={section.fields} />}
              {section.profileCodes && <ProfileCodeList codes={section.profileCodes} />}
            </div>
          ))}
        </div>
      )}
    </details>
  );
}

/* ─── メインコンポーネント ─── */

export function DataMigrationPage() {
  const data = loadData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {data.documentTitle}
        </h1>
        <p className="mt-2 text-gray-600">{data.description}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
          <span>出典: {data.source}</span>
          <span>|</span>
          <span>バージョン: {data.version}</span>
          <span>|</span>
          <span>最終更新: {data.lastUpdated}</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {data.commonExportSpec.masterDataSpec.items.length}
          </div>
          <div className="text-sm text-gray-500">共通仕様項目数</div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {data.individualExportSpecs.length}
          </div>
          <div className="text-sm text-gray-500">データ種別数</div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">
            {data.individualExportSpecs[0]?.sections?.[1]?.profileCodes?.length ?? 0}
          </div>
          <div className="text-sm text-gray-500">プロファイル種別数</div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">CSV</div>
          <div className="text-sm text-gray-500">ファイル形式</div>
        </div>
      </div>

      {/* Key specs highlight */}
      <div className="rounded-lg border bg-gradient-to-r from-indigo-50 to-blue-50 p-6">
        <h2 className="text-lg font-bold text-indigo-900 mb-3">
          主要仕様ハイライト
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: '文字コード', value: 'UTF-8 (BOMなし)' },
            { label: '改行コード', value: 'LF' },
            { label: '日付形式', value: 'YYYY-MM-DD hh:mm:ss' },
            { label: '区切り文字', value: 'カンマ (RFC 4180)' },
            { label: '囲み文字', value: 'ダブルクォート (Always)' },
            { label: '圧縮', value: '必須 (汎用アルゴリズム)' },
          ].map((h) => (
            <div key={h.label} className="rounded-lg bg-white p-3 shadow-sm border border-indigo-200">
              <div className="text-xs text-gray-500">{h.label}</div>
              <div className="font-bold text-indigo-700">{h.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Common export spec */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="rounded bg-indigo-600 px-2 py-1 text-sm text-white">1</span>
          {data.commonExportSpec.label}
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {data.commonExportSpec.masterDataSpec.label}
            </h3>
            <SpecTable items={data.commonExportSpec.masterDataSpec.items} />
          </div>

          <BinarySection spec={data.commonExportSpec.binaryDataSpec} />
        </div>
      </section>

      {/* Individual export specs */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="rounded bg-indigo-600 px-2 py-1 text-sm text-white">2</span>
          個別エクスポート定義書（例）
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          6種類のデータについて、それぞれのエクスポート定義を規定しています。
          各データ種別をクリックすると詳細を確認できます。
        </p>

        <div className="space-y-4">
          {data.individualExportSpecs.map((spec, i) => (
            <ExportSpecCard
              key={spec.id}
              spec={spec}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
