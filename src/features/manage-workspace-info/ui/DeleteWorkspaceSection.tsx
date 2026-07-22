'use client';

// 워크스페이스 삭제 섹션 — owner면 다른 멤버 존재 여부와 무관하게 항상 노출한다.
import { useState } from 'react';
import { DeleteWorkspaceDialog } from './DeleteWorkspaceDialog';

interface DeleteWorkspaceSectionProps {
  workspaceId: string;
  workspaceName: string;
}

export function DeleteWorkspaceSection({
  workspaceId,
  workspaceName,
}: DeleteWorkspaceSectionProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">워크스페이스 삭제</h2>
      <p className="mt-1 text-sm text-slate-500">
        모든 멤버가 워크스페이스에서 제외되고, 업무·일정·공지·자료 등 모든 데이터가 함께 사라지며
        되돌릴 수 없어요.
      </p>

      <button
        type="button"
        onClick={() => setShowDeleteDialog(true)}
        className="mt-4 h-10 rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-500"
      >
        워크스페이스 삭제
      </button>

      <DeleteWorkspaceDialog
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </section>
  );
}
