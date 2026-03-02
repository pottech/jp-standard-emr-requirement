import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ContentData } from './types';

const CONTENT_DIR = path.join(process.cwd(), '..', 'docs', 'content');

/**
 * MDXファイルを読み込み、frontmatterとコンテンツを返す
 */
export function getContent(slug: string): ContentData {
  // slugが'index'の場合はindex.mdxを読む
  // それ以外はslug.mdxまたはslug/index.mdxを試す
  let filePath: string;

  if (slug === 'index') {
    filePath = path.join(CONTENT_DIR, 'index.mdx');
  } else {
    // まずslug.mdxを試す
    const directPath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const indexPath = path.join(CONTENT_DIR, slug, 'index.mdx');

    if (fs.existsSync(directPath)) {
      filePath = directPath;
    } else if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    } else {
      throw new Error(`Content not found for slug: ${slug}`);
    }
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    frontmatter: data,
    content,
  };
}

/**
 * 特定ディレクトリ内の全MDXファイルのスラッグ一覧を返す
 */
export function getContentSlugs(dir: string): string[] {
  const dirPath = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}
