import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RouteTracker } from '@/components/analytics/RouteTracker';
import { getNavigation, getSiteTitle } from '@/lib/navigation';
import { GA_ID } from '@/lib/gtag';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: '電子カルテ標準要件ガイド',
    template: '%s | 電子カルテ標準要件ガイド',
  },
  description: '国が定めた電子カルテ・レセプトコンピュータの標準要件をわかりやすく公開するサイト',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = getNavigation();
  const siteTitle = getSiteTitle();

  return (
    <html lang="ja">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
        <div className="flex h-screen overflow-hidden">
          {/* サイドバー */}
          <Sidebar navigation={navigation} siteTitle={siteTitle} />

          {/* メインエリア */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <Header siteTitle={siteTitle} />
            <main className="flex-1 px-6 py-8 lg:px-10">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
