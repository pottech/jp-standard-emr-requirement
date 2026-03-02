import { ContentPage } from '@/components/ContentPage';

export default function HomePage() {
  return <ContentPage slug="index" currentPath="/" />;
}

export const metadata = {
  title: '電子カルテ・レセコン標準仕様ガイド',
};
