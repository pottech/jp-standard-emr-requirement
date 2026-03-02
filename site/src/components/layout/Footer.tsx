import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-6 py-6">
      <div className="text-center text-xs text-gray-400">
        <p>
          本サイトは厚生労働省が公開した電子カルテ・レセプトコンピュータ標準仕様書等に基づき、情報を整理・公開しています。
        </p>
        <p className="mt-1">
          正式な要件は原本の仕様書をご参照ください。
        </p>
      </div>
    </footer>
  );
}
