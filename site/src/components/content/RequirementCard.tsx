import React from 'react';

interface RequirementCardProps {
  id: string;
  title: string;
  type: '遵守' | '推奨' | '不可' | '参考';
  section: string;
  children: React.ReactNode;
}

const badgeStyles: Record<string, string> = {
  '遵守': 'bg-blue-100 text-blue-800 border-blue-200',
  '推奨': 'bg-green-100 text-green-800 border-green-200',
  '不可': 'bg-red-100 text-red-800 border-red-200',
  '参考': 'bg-gray-100 text-gray-800 border-gray-200',
};

const borderStyles: Record<string, string> = {
  '遵守': 'border-l-blue-500',
  '推奨': 'border-l-green-500',
  '不可': 'border-l-red-500',
  '参考': 'border-l-gray-500',
};

export function RequirementCard({ id, title, type, section, children }: RequirementCardProps) {
  return (
    <div className={`not-prose my-4 rounded-lg border border-gray-200 border-l-4 ${borderStyles[type]} bg-white p-5 shadow-sm`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm text-gray-500">{id}</span>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[type]}`}>
          {type}
        </span>
        <span className="text-xs text-gray-400">Section {section}</span>
      </div>
      <h4 className="mb-2 text-base font-semibold text-gray-900">{title}</h4>
      <div className="text-sm leading-relaxed text-gray-700">
        {children}
      </div>
    </div>
  );
}
