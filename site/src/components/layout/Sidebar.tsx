'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown, Menu, X } from 'lucide-react';
import type { NavItem } from '@/lib/types';

interface SidebarProps {
  navigation: NavItem[];
  siteTitle: string;
}

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
          <Link href="/" className="block text-lg font-bold text-gray-900" onClick={() => setMobileOpen(false)}>
            {siteTitle}
          </Link>
        </div>
        <nav className="p-3">
          {navigation.map((item) => (
            <NavItemComponent
              key={item.path}
              item={item}
              depth={0}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

function NavItemComponent({
  item,
  depth,
  onNavigate,
}: {
  item: NavItem;
  depth: number;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.path;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = pathname.startsWith(item.path) && item.path !== '/';
  const [open, setOpen] = useState(isExpanded);

  const paddingLeft = depth * 12 + 8;

  return (
    <div>
      <div className="flex items-center">
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-400 hover:text-gray-600"
          >
            {open ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        <Link
          href={item.path}
          onClick={onNavigate}
          className={`block flex-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
            isActive
              ? 'bg-indigo-50 font-medium text-indigo-700'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          style={{ paddingLeft: hasChildren ? 0 : paddingLeft + 24 }}
        >
          {item.title}
        </Link>
      </div>

      {hasChildren && open && (
        <div className="ml-3">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.path}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
