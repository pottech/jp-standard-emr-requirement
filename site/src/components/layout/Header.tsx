import React from 'react';
import { FileText } from 'lucide-react';

interface HeaderProps {
  siteTitle: string;
}

export function Header({ siteTitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex h-14 items-center px-6">
        <div className="flex items-center gap-2 pl-10 lg:pl-0">
          <FileText className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-semibold text-gray-900">{siteTitle}</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs text-gray-400">標準仕様ドキュメント</span>
        </div>
      </div>
    </header>
  );
}
