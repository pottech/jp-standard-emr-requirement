import fs from 'fs';
import path from 'path';
import type { NavItem, MetadataJson } from './types';

const METADATA_PATH = path.join(process.cwd(), '..', 'docs', 'content', 'metadata.json');

let cachedMetadata: MetadataJson | null = null;

function loadMetadata(): MetadataJson {
  if (cachedMetadata) return cachedMetadata;

  const raw = fs.readFileSync(METADATA_PATH, 'utf-8');
  cachedMetadata = JSON.parse(raw) as MetadataJson;
  return cachedMetadata;
}

/**
 * ナビゲーションデータを返す
 */
export function getNavigation(): NavItem[] {
  const metadata = loadMetadata();
  return metadata.navigation;
}

/**
 * サイトタイトルを返す
 */
export function getSiteTitle(): string {
  const metadata = loadMetadata();
  return metadata.siteTitle;
}

/**
 * サイト説明を返す
 */
export function getSiteDescription(): string {
  const metadata = loadMetadata();
  return metadata.siteDescription;
}

/**
 * パスからパンくずリスト用のデータを生成する
 */
export function getBreadcrumbs(currentPath: string): { title: string; path: string }[] {
  const nav = getNavigation();
  const breadcrumbs: { title: string; path: string }[] = [
    { title: 'トップ', path: '/' },
  ];

  if (currentPath === '/') return breadcrumbs;

  const segments = currentPath.split('/').filter(Boolean);
  let currentItems: NavItem[] = nav;

  for (let i = 0; i < segments.length; i++) {
    const partialPath = '/' + segments.slice(0, i + 1).join('/');

    const found = findNavItem(currentItems, partialPath);
    if (found) {
      breadcrumbs.push({ title: found.title, path: found.path });
      currentItems = found.children || [];
    }
  }

  return breadcrumbs;
}

function findNavItem(items: NavItem[], targetPath: string): NavItem | null {
  for (const item of items) {
    if (item.path === targetPath) return item;
    if (item.children) {
      const found = findNavItem(item.children, targetPath);
      if (found) return found;
    }
  }
  return null;
}
