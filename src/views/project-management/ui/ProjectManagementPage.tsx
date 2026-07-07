import { Plus_Jakarta_Sans } from 'next/font/google';
import { ProjectBoard } from '@/features/project-board';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export default function ProjectManagementPage() {
  return (
    <div className={`${jakarta.className} min-h-full bg-[#f7f8fc]`}>
      <ProjectBoard />
    </div>
  );
}
