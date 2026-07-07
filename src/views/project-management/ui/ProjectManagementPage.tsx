import { Plus_Jakarta_Sans } from 'next/font/google';
import { ProjectBoard } from '@/features/project-board';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

type ProjectManagementPageProps = {
  workspaceId: string;
};

export default function ProjectManagementPage({
  workspaceId,
}: ProjectManagementPageProps) {
  return (
    <div className={`${jakarta.className} bg-brand-surface min-h-full`}>
      <ProjectBoard workspaceId={workspaceId} />
    </div>
  );
}
