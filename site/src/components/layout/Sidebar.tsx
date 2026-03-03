'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  FileText,
  Calculator,
  Pill,
  ShieldCheck,
  Mail,
  Accessibility,
  ClipboardCheck,
  GitCompareArrows,
  BookOpen,
} from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { trackNavClick } from '@/lib/gtag';

interface SidebarProps {
  navigation: NavItem[];
  siteTitle: string;
}

const sectionIcons: Record<string, React.ElementType> = {
  '/': Home,
  '/emr': FileText,
  '/rececom': Calculator,
  '/e-prescription': Pill,
  '/qualification': ShieldCheck,
  '/opinion-letter': Mail,
  '/accessibility': Accessibility,
  '/compliance-check': ClipboardCheck,
  '/comparison': GitCompareArrows,
  '/glossary': BookOpen,
};

export function Sidebar({ navigation, siteTitle }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* モバイルメニューボタン */}
      <button
        className="fixed left-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-sm lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="メニューを開く"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* オーバーレイ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 shrink-0 overflow-y-auto border-r border-gray-200 bg-white transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-gray-200 px-5 py-4">
          <Link
            href="/"
            className="block text-lg font-bold text-gray-900"
            onClick={() => {
              setMobileOpen(false);
              trackNavClick(siteTitle, 'header');
            }}
          >
            {siteTitle}
          </Link>
        </div>
        <nav className="px-3 py-2">
          {navigation.map((item) => (
            <SidebarSection
              key={item.path}
              item={item}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarSection({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.path;
  const isSectionActive =
    item.path !== '/' && pathname.startsWith(item.path);
  const Icon = sectionIcons[item.path];

  // トップページリンク（子なし・アイコンなし）
  if (item.path === '/') {
    return (
      <div className="mb-1">
        <Link
          href="/"
          onClick={() => {
            onNavigate();
            trackNavClick(item.title);
          }}
          className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
            isActive
              ? 'bg-indigo-50 font-medium text-indigo-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <span>{item.title}</span>
        </Link>
      </div>
    );
  }

  // セクション（子あり or 子なし）
  return (
    <div className="mt-4 first:mt-2">
      {/* セクション見出し */}
      <Link
        href={item.path}
        onClick={() => {
          onNavigate();
          trackNavClick(item.title);
        }}
        className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-indigo-50 text-indigo-700'
            : isSectionActive
              ? 'text-indigo-600'
              : 'text-gray-800 hover:bg-gray-50'
        }`}
      >
        {Icon && (
          <Icon
            className={`h-4 w-4 shrink-0 ${
              isActive || isSectionActive
                ? 'text-indigo-500'
                : 'text-gray-400'
            }`}
          />
        )}
        <span>{item.title}</span>
      </Link>

      {/* 子ページ一覧（常に展開） */}
      {hasChildren && (
        <div className="ml-4 mt-0.5 border-l border-gray-200 pl-2">
          {item.children!
            .filter(
              (child) => child.path !== item.path // 親と同じパスの「概要」は除外
            )
            .map((child) => {
              const childActive = pathname === child.path;
              return (
                <Link
                  key={child.path}
                  href={child.path}
                  onClick={() => {
                    onNavigate();
                    trackNavClick(child.title, item.title);
                  }}
                  className={`block rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                    childActive
                      ? 'bg-indigo-50 font-medium text-indigo-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  {child.title}
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}
