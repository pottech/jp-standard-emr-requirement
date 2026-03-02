import React from 'react';

interface GlossaryEntryProps {
  term: string;
  reading: string;
  englishTerm?: string;
  source: string;
  children: React.ReactNode;
}

export function GlossaryEntry({ term, reading, englishTerm, source, children }: GlossaryEntryProps) {
  return (
    <div
      className="not-prose my-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      id={`glossary-${encodeURIComponent(term)}`}
      data-term={term}
      data-reading={reading}
    >
      <div className="mb-2 flex flex-wrap items-baseline gap-2">
        <h4 className="text-base font-bold text-gray-900">{term}</h4>
        <span className="text-sm text-gray-400">({reading})</span>
        {englishTerm && (
          <span className="text-sm font-medium text-indigo-600">{englishTerm}</span>
        )}
      </div>
      <div className="mb-2 text-sm leading-relaxed text-gray-700">
        {children}
      </div>
      <div className="text-xs text-gray-400">
        出典: {source}
      </div>
    </div>
  );
}
