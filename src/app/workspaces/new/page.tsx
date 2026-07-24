import type { Metadata } from 'next';
import { CreateWorkspacePage } from '@/views/create-workspace';

export const metadata: Metadata = {
  title: '워크스페이스 만들기',
};

export default function Page() {
  return <CreateWorkspacePage />;
}
