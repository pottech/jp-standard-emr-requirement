import { FunctionListPage } from '@/components/FunctionListPage';

export default function EmrFunctionsPage() {
  return <FunctionListPage />;
}

export const metadata = {
  title: '電子カルテ提示対象機能一覧',
  description: '電子カルテシステムに実装された機能を医療機関に提示する際の対象機能一覧',
};
