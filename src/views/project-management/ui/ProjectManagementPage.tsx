import { ProjectBoard } from '@/features/project-board';

type ProjectManagementPageProps = {
  workspaceId: string;
};

export default function ProjectManagementPage({ workspaceId }: ProjectManagementPageProps) {
  return (
    <div className="bg-brand-surface min-h-full">
      <ProjectBoard workspaceId={workspaceId} />
    </div>
  );
}
