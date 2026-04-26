export function IntegrationSpecPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">連携共通仕様・部門システム間API</h1>
        <p className="mt-2 text-gray-600">
          電子カルテと外部システム等の間における個別連携仕様の策定に係る考え方及び共通的な仕様、
          並びに部門システムとの個別インターフェイス仕様例
        </p>
        <p className="mt-1 text-sm text-gray-500">
          出典: 第1章別紙5「連携共通仕様（イメージ）一覧」/ 第1章別紙6「電子カルテ－部門システム間API個別仕様例」
        </p>
      </div>

      {/* Status banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <span className="font-bold">参考資料:</span>{' '}
          本内容は令和7年度にデジタル庁において実施した「病院情報等刷新に向けた協議会」における議論を踏まえ、
          連携仕様の検討に資するための参考資料としてとりまとめたものです。
          今後、関係者のご意見を伺いながら内容を精査し、本標準仕様に規定していくことを想定しています。
        </p>
      </div>

      {/* Section 1: Common Integration Spec */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="rounded bg-indigo-600 px-2 py-1 text-sm text-white">別紙5</span>
          連携共通仕様（イメージ）一覧
        </h2>

        <div className="rounded-lg border bg-white p-6 shadow-sm mb-4">
          <h3 className="font-bold text-gray-800 mb-3">考え方</h3>
          <p className="text-sm text-gray-700 mb-4">
            電子カルテと外部システム等の間における相互運用性、セキュリティ並びに開発及び保守の効率を高めるとともに、
            個別インターフェイスの仕様を統一的に整備することを目的として、
            電子カルテと外部システム等の間における個別連携仕様の策定に係る考え方及び共通的な仕様を規定する。
          </p>
          <p className="text-sm text-gray-700">
            連携共通仕様（イメージ）は、電子カルテと外部システム等との関係性として複数想定されるパターンのうち、
            最も基本的と考えられる一つのパターンを前提とした共通仕様のイメージを記載したもの。
          </p>
        </div>

        {/* Integration pattern overview */}
        <div className="rounded-lg border bg-white p-6 shadow-sm mb-4">
          <h3 className="font-bold text-gray-800 mb-3">連携パターン概要</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <h4 className="font-bold text-indigo-900 text-sm mb-2">I. 認証・認可</h4>
              <p className="text-xs text-indigo-700">外部システムとの接続時の認証・認可の仕組み</p>
            </div>
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <h4 className="font-bold text-indigo-900 text-sm mb-2">II. データ形式</h4>
              <p className="text-xs text-indigo-700">システム間で交換されるデータの形式・エンコーディング</p>
            </div>
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <h4 className="font-bold text-indigo-900 text-sm mb-2">III. API設計</h4>
              <p className="text-xs text-indigo-700">RESTful API設計パターン・エンドポイント構成</p>
            </div>
          </div>
        </div>

        {/* Key specs */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">主要な仕様項目</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">項目</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">仕様</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">備考</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="px-4 py-2 font-medium">通信プロトコル</td><td className="px-4 py-2">HTTPS（TLS 1.2以上）</td><td className="px-4 py-2 text-gray-500">暗号化通信必須</td></tr>
                <tr><td className="px-4 py-2 font-medium">データ形式</td><td className="px-4 py-2">JSON</td><td className="px-4 py-2 text-gray-500">UTF-8エンコーディング</td></tr>
                <tr><td className="px-4 py-2 font-medium">認証方式</td><td className="px-4 py-2">OAuth 2.0 / APIキー</td><td className="px-4 py-2 text-gray-500">連携先システムに応じて選択</td></tr>
                <tr><td className="px-4 py-2 font-medium">API設計</td><td className="px-4 py-2">RESTful API</td><td className="px-4 py-2 text-gray-500">リソース指向設計</td></tr>
                <tr><td className="px-4 py-2 font-medium">バージョニング</td><td className="px-4 py-2">URLパスベース（/v1/）</td><td className="px-4 py-2 text-gray-500">後方互換性確保</td></tr>
                <tr><td className="px-4 py-2 font-medium">エラーハンドリング</td><td className="px-4 py-2">HTTPステータスコード + エラーJSON</td><td className="px-4 py-2 text-gray-500">標準的なエラーレスポンス形式</td></tr>
                <tr><td className="px-4 py-2 font-medium">ページング</td><td className="px-4 py-2">offset/limitパラメータ</td><td className="px-4 py-2 text-gray-500">大量データ取得時</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 2: Department System API */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="rounded bg-teal-600 px-2 py-1 text-sm text-white">別紙6</span>
          電子カルテ－部門システム間API個別仕様例
        </h2>

        <div className="rounded-lg border bg-white p-6 shadow-sm mb-4">
          <h3 className="font-bold text-gray-800 mb-3">位置づけ</h3>
          <p className="text-sm text-gray-700">
            別紙5に示す連携共通仕様（イメージ）に示す事項を前提として策定した場合の、
            個別インターフェイス仕様の例を記載した資料。
            電子カルテと各部門システムとの間における連携項目や名称等を共通化するための
            個別インターフェイスの標準的な仕様を示す。
          </p>
        </div>

        {/* Department systems */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {([
            { name: '検体検査システム', icon: '\u{1F52C}', apis: ['検査オーダ登録', '検査結果取得', '検査状態更新'] },
            { name: '放射線システム', icon: '\u{1F4E1}', apis: ['放射線検査オーダ登録', '検査結果取得', '検査受付'] },
            { name: '薬剤部門システム', icon: '\u{1F48A}', apis: ['処方オーダ登録', '調剤結果取得', '在庫照会'] },
            { name: '給食システム', icon: '\u{1F37D}\uFE0F', apis: ['食事オーダ登録', '食事変更', 'アレルギー情報連携'] },
            { name: 'リハビリシステム', icon: '\u{1F3C3}', apis: ['リハビリオーダ登録', '実施記録取得', '計画書連携'] },
            { name: '医事会計システム', icon: '\u{1F4B0}', apis: ['診療行為登録', '会計情報取得', '保険情報連携'] },
            { name: '看護支援システム', icon: '\u{1F469}\u200D\u2695\uFE0F', apis: ['看護記録連携', 'バイタル情報取得', '指示受け'] },
            { name: '手術管理システム', icon: '\u{1F3E5}', apis: ['手術オーダ登録', '麻酔記録連携', '手術記録取得'] },
            { name: '物品管理システム', icon: '\u{1F4E6}', apis: ['使用物品登録', '在庫照会', '発注連携'] },
          ] as const).map((dept) => (
            <div key={dept.name} className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{dept.icon}</span>
                <h4 className="font-bold text-gray-900">{dept.name}</h4>
              </div>
              <ul className="space-y-1">
                {dept.apis.map((api) => (
                  <li key={api} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                    {api}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Future direction */}
      <section className="rounded-lg border bg-gradient-to-b from-gray-50 to-white p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">今後の方向性</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            今後、標準コード・マスタの策定が進むことで、部門システムごとの標準的なコード、マスタ、
            インターフェイス仕様書及び記録条件仕様定義表が策定される見込み。
          </p>
          <p>
            電子カルテ－外部システム等間における連携に必要な仕様については、策定された標準的なコード等に基づき、
            順次、本標準仕様に規定していく予定。
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>標準コード・マスタの策定及び更新の反映</li>
            <li>連携共通仕様の正式規定</li>
            <li>部門システムごとの個別API仕様の標準化</li>
            <li>業務効率化サービスAPIの整備</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
