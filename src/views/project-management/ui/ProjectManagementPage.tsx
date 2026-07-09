import { ProjectBoard } from '@/features/project-board';
import { plusJakartaSans } from '@/shared/lib/fonts';

type ProjectManagementPageProps = {
  workspaceId: string;
};

export default function ProjectManagementPage({ workspaceId }: ProjectManagementPageProps) {
  return (
    <div className={`${plusJakartaSans.className} bg-brand-surface min-h-full`}>
      <ProjectBoard workspaceId={workspaceId} />
    </div>
  );
}
