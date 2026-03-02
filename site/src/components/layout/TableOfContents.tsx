'use client';

import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const items: TocItem[] = [];

    elements.forEach((el) => {
      const id = el.id || el.textContent?.replace(/\s+/g, '-').toLowerCase() || '';
      if (!el.id) el.id = id;
      items.push({
        id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    setHeadings(items);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block">
      <div className="sticky top-20 w-56">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <List className="h-3.5 w-3.5" />
          目次
        </div>
        <nav className="space-y-0.5 border-l border-gray-200">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block border-l-2 py-1 text-xs transition-colors ${
                h.level === 3 ? 'pl-6' : 'pl-3'
              } ${
                activeId === h.id
                  ? 'border-indigo-500 font-medium text-indigo-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
