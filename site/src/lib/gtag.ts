export const GA_ID = 'G-9JTC19NCJR';

// ── ページビュー ──
export function pageview(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_ID, { page_path: url });
}

// ── イベント送信 ──
type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export function event({ action, category, label, value }: GTagEvent) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// ── 便利ヘルパー ──

/** サイドバー・ヘッダーのナビゲーションクリック */
export function trackNavClick(label: string, section?: string) {
  event({
    action: 'nav_click',
    category: 'navigation',
    label: section ? `${section} > ${label}` : label,
  });
}

/** タブ切り替え */
export function trackTabSwitch(tabName: string, context: string) {
  event({
    action: 'tab_switch',
    category: 'engagement',
    label: `${context}: ${tabName}`,
  });
}

/** アコーディオン・セクション展開 */
export function trackExpand(itemLabel: string, context: string) {
  event({
    action: 'expand_section',
    category: 'engagement',
    label: `${context}: ${itemLabel}`,
  });
}

/** ビューモード切替 */
export function trackViewMode(mode: string, context: string) {
  event({
    action: 'view_mode_change',
    category: 'engagement',
    label: `${context}: ${mode}`,
  });
}

/** 外部リンククリック */
export function trackOutboundClick(url: string) {
  event({
    action: 'outbound_click',
    category: 'navigation',
    label: url,
  });
}

/** 用語集・検索の利用 */
export function trackSearch(query: string, context: string) {
  event({
    action: 'search',
    category: 'engagement',
    label: `${context}: ${query}`,
  });
}

// ── グローバル型定義 ──
declare global {
  interface Window {
    gtag: (
      command: string,
      targetOrAction: string,
      params?: Record<string, unknown>,
    ) => void;
    dataLayer: unknown[];
  }
}
