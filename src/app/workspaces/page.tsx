import type { Metadata } from 'next';
import { WorkspacesPage } from '@/views/workspaces';

export const metadata: Metadata = {
  title: '내 워크스페이스',
};

export default function Page() {
  return <WorkspacesPage />;
}
