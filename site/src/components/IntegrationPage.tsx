import fs from 'fs';
import path from 'path';

/* ─── 型定義 ─── */
interface InterfaceSpec {
  name: string;
  version: string;
  purpose: string;
}

interface Requirement {
  id: string;
  title: string;
  type: string;
  interfaces: InterfaceSpec[];
  notes?: string;
  transitionalMeasure?: string;
}

interface RecommendedRequirement {
  id: string;
  title: string;
  type: string;
  description: string;
}

interface ApiSection {
  label: string;
  description?: string;
  status?: string;
  requirements?: Requirement[];
  recommendedRequirements?: RecommendedRequirement[];
}

interface SystemApiSpecs {
  medicalDxServices: ApiSection;
  externalSystems?: ApiSection;
  departmentSystems?: ApiSection;
  efficiencyServices?: ApiSection;
}

interface SystemSpec {
  label: string;
  apiSpecs: SystemApiSpecs;
}

interface FutureExpansion {
  label: string;
  currentServices: string[];
  plannedServices: string[];
}

interface IntegrationData {
  documentTitle: string;
  description: string;
  version: string;
  lastUpdated: string;
  emr: SystemSpec;
  rececom: SystemSpec;
  futureExpansion: FutureExpansion;
}

/* ─── データ読み込み ─── */
function loadData(): IntegrationData {
  const filePath = path.join(process.cwd(), '..', 'docs', 'data', 'system-integration.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/* ─── サブコンポーネント ─── */

function RequirementCard({ req }: { req: Requirement }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">
          {req.type}
        </span>
        <span className="font-mono text-sm text-gray-500">{req.id}</span>
        <h4 className="font-bold text-gray-900">{req.title}</h4>
      </div>

      {/* Interface versions table */}
      {req.interfaces && req.interfaces.length > 0 && (
        <div className="overflow-hidden rounded border mb-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                  仕様書名
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                  バージョン
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                  用途
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {req.interfaces.map((iface, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {iface.name}
                  </td>
                  <td className="px-4 py-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {iface.version}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{iface.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transitional measure */}
      {req.transitionalMeasure && (
        <div className="rounded bg-amber-50 border border-amber-200 p-3 text-sm">
          <span className="font-bold text-amber-800">経過措置: </span>
          <span className="text-amber-700">{req.transitionalMeasure}</span>
        </div>
      )}

      {req.notes && (
        <p className="mt-2 text-sm text-gray-500">{req.notes}</p>
      )}
    </div>
  );
}

function RecommendedCard({ req }: { req: RecommendedRequirement }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
          {req.type}
        </span>
        <span className="font-mono text-sm text-gray-500">{req.id}</span>
        <h4 className="font-bold text-gray-900">{req.title}</h4>
      </div>
      <p className="text-sm text-gray-700">{req.description}</p>
    </div>
  );
}

function FutureSectionCard({ section }: { section: ApiSection }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 mb-4">
      <h3 className="font-bold text-gray-700">{section.label}</h3>
      {section.description && (
        <p className="text-sm text-gray-500 mt-1">{section.description}</p>
      )}
      {section.status && (
        <p className="mt-2 text-sm text-amber-600 font-medium">
          {section.status}
        </p>
      )}
    </div>
  );
}

function ApiSpecSection({
  specs,
  chapterLabel,
  chapterColor,
  chapterNumber,
}: {
  specs: SystemApiSpecs;
  chapterLabel: string;
  chapterColor: string;
  chapterNumber: string;
}) {
  const bgClass = chapterColor === 'indigo' ? 'bg-indigo-600' : 'bg-teal-600';

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className={`rounded ${bgClass} px-2 py-1 text-sm text-white`}>
          {chapterNumber}
        </span>
        {chapterLabel}のAPI仕様
      </h2>

      {/* Medical DX services - mandatory */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          {specs.medicalDxServices.label}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {specs.medicalDxServices.description}
        </p>

        {specs.medicalDxServices.requirements?.map((req) => (
          <RequirementCard key={req.id} req={req} />
        ))}

        {specs.medicalDxServices.recommendedRequirements?.map((req) => (
          <RecommendedCard key={req.id} req={req} />
        ))}
      </div>

      {/* Future / placeholder sections */}
      {[
        specs.externalSystems,
        specs.departmentSystems,
        specs.efficiencyServices,
      ].map(
        (section) =>
          section && <FutureSectionCard key={section.label} section={section} />
      )}
    </section>
  );
}

/* ─── メインコンポーネント ─── */

export function IntegrationPage() {
  const data = loadData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          システム連携・API仕様
        </h1>
        <p className="mt-2 text-gray-600">{data.description}</p>
      </div>

      {/* Connection diagram overview */}
      <div className="rounded-lg border bg-gradient-to-r from-indigo-50 to-blue-50 p-6">
        <h2 className="text-lg font-bold text-indigo-900 mb-4">
          接続サービス概要
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.futureExpansion.currentServices.map((s) => (
            <div
              key={s}
              className="rounded-lg bg-white p-3 text-center text-sm font-medium shadow-sm border border-indigo-200"
            >
              <div className="text-indigo-700">{s}</div>
              <div className="text-xs text-green-600 mt-1">接続対象</div>
            </div>
          ))}
        </div>
      </div>

      {/* EMR section */}
      <ApiSpecSection
        specs={data.emr.apiSpecs}
        chapterLabel={data.emr.label}
        chapterColor="indigo"
        chapterNumber="第1章"
      />

      {/* Rececom section */}
      <ApiSpecSection
        specs={data.rececom.apiSpecs}
        chapterLabel={data.rececom.label}
        chapterColor="teal"
        chapterNumber="第2章"
      />

      {/* Future expansion */}
      <section className="rounded-lg border bg-gradient-to-b from-gray-50 to-white p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          今後の接続対象拡大予定
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          初版では以下のサービスが接続対象。今後、定期改定により段階的に拡大予定。
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-green-700 mb-2">
              現在の接続対象
            </h3>
            <ul className="space-y-1">
              {data.futureExpansion.currentServices.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-700 mb-2">
              今後の接続対象（予定）
            </h3>
            <ul className="space-y-1">
              {data.futureExpansion.plannedServices.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
