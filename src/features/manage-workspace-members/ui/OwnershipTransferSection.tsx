'use client';

// 소유권 이전 섹션 — owner이고 다른 멤버가 있을 때만 팀 관리 탭에 노출한다.
import { useState } from 'react';
import type { WorkspaceMember } from '@/entities/workspace-member';
import { TransferOwnershipDialog } from './TransferOwnershipDialog';

interface OwnershipTransferSectionProps {
  workspaceId: string;
  otherMembers: WorkspaceMember[];
}

export function OwnershipTransferSection({
  workspaceId,
  otherMembers,
}: OwnershipTransferSectionProps) {
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">소유권 이전</h2>
      <p className="mt-1 text-sm text-slate-500">
        다른 멤버에게 워크스페이스 소유권을 넘길 수 있어요. 이전 후에도 계속 멤버로 남을 수 있어요.
      </p>

      <button
        type="button"
        onClick={() => setShowTransferDialog(true)}
        className="mt-4 h-10 rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500"
      >
        소유권 이전하기
      </button>

      <TransferOwnershipDialog
        workspaceId={workspaceId}
        otherMembers={otherMembers}
        open={showTransferDialog}
        onOpenChange={setShowTransferDialog}
      />
    </section>
  );
}
