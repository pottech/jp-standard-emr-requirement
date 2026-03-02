'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export function GlossarySearch() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const entries = document.querySelectorAll('[data-term]');
    entries.forEach((entry) => {
      const el = entry as HTMLElement;
      const term = el.dataset.term || '';
      const reading = el.dataset.reading || '';

      if (!query) {
        el.style.display = '';
        return;
      }

      const lowerQuery = query.toLowerCase();
      const matches =
        term.toLowerCase().includes(lowerQuery) ||
        reading.toLowerCase().includes(lowerQuery);

      el.style.display = matches ? '' : 'none';
    });
  }, [query]);

  return (
    <div className="not-prose my-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="用語を検索..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
