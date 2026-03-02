import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  title: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length <= 1) return null;

  return (
    <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500" aria-label="パンくずリスト">
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-300" />}
          {index === items.length - 1 ? (
            <span className="text-gray-700 font-medium">{item.title}</span>
          ) : (
            <Link href={item.path} className="hover:text-indigo-600 transition-colors">
              {item.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
