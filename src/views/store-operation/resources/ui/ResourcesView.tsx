'use client';

// 매장 운영 워크스페이스의 자료실 화면을 공통 자료실 기능으로 조합합니다.
import { Link, Upload } from 'lucide-react';
import type { ResourceLibraryData } from '@/entities/resource';
import {
  ResourceAddDialog,
  ResourceList,
  useResourceLibraryState,
} from '@/features/manage-resources';

interface ResourcesViewProps {
  workspaceId: string;
  initialData: ResourceLibraryData;
}

export function ResourcesView({ workspaceId, initialData }: ResourcesViewProps) {
  const {
    resources,
    isDialogOpen,
    dialogResourceType,
    openDialog,
    closeDialog,
    addResource,
    openFile,
    isSaving,
  } = useResourceLibraryState({ initialData, workspaceId });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-950">자료실</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openDialog('link')}
            className="flex h-11 items-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-800 hover:bg-slate-200"
          >
            <Link className="h-4 w-4" aria-hidden="true" />
            링크 저장
          </button>
          <button
            type="button"
            onClick={() => openDialog('file')}
            className="flex h-11 items-center gap-2 rounded-2xl bg-[var(--color-brand)] px-4 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            파일 업로드
          </button>
        </div>
      </div>

      <div className="max-w-[790px]">
        <ResourceList resources={resources} onOpenFile={(resource) => void openFile(resource)} />
      </div>

      <ResourceAddDialog
        key={dialogResourceType}
        isOpen={isDialogOpen}
        initialResourceType={dialogResourceType}
        isSaving={isSaving}
        onClose={closeDialog}
        onSubmit={addResource}
      />
    </section>
  );
}
