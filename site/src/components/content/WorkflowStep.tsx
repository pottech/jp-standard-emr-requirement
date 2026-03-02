import React from 'react';

interface WorkflowStepProps {
  order: number;
  actor: string;
  action: string;
  children: React.ReactNode;
}

export function WorkflowStep({ order, actor, action, children }: WorkflowStepProps) {
  return (
    <div className="not-prose my-4 flex gap-4">
      {/* ステップ番号 */}
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
          {order}
        </div>
        <div className="mt-1 w-px grow bg-gray-200" />
      </div>

      {/* コンテンツ */}
      <div className="pb-6">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {actor}
          </span>
          <h4 className="text-sm font-semibold text-gray-900">{action}</h4>
        </div>
        <div className="text-sm leading-relaxed text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}
