import React from 'react';
import { getContent } from '@/lib/content';
import { getBreadcrumbs } from '@/lib/navigation';
import { MdxRenderer } from '@/components/MdxRenderer';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TableOfContents } from '@/components/layout/TableOfContents';

interface ContentPageProps {
  slug: string;
  currentPath: string;
}

export function ContentPage({ slug, currentPath }: ContentPageProps) {
  const { content } = getContent(slug);
  const breadcrumbs = getBreadcrumbs(currentPath);

  return (
    <div className="flex gap-8">
      <article className="prose prose-gray prose-lg min-w-0 max-w-none flex-1">
        <Breadcrumb items={breadcrumbs} />
        <MdxRenderer source={content} />
      </article>
      <TableOfContents />
    </div>
  );
}
