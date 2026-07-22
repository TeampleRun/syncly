'use client';

// 워크스페이스 생성 페이지 — 템플릿 선택 후 생성 Dialog로 이어지는 플로우
import Link from 'next/link';
import { useState } from 'react';
import { WORKSPACE_TEMPLATE_ORDER, type WorkspacePurpose } from '@/entities/workspace';
import { CreateWorkspaceDialog } from '@/features/create-workspace';
import TemplateSelectCard from './TemplateSelectCard';

export default function CreateWorkspacePage() {
  const [selectedPurpose, setSelectedPurpose] = useState<WorkspacePurpose | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelect = (purpose: WorkspacePurpose) => {
    setSelectedPurpose(purpose);
    setIsDialogOpen(true);
  };

  return (
    <div
      className="bg-brand-surface flex min-h-screen flex-col items-center justify-center px-6 py-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5">
        <div className="flex w-full flex-col gap-7.5">
          <header className="flex flex-col items-center text-center">
            <h1 className="workspace-page-title">
              어떤 용도로 쓰실 건가요?
            </h1>
            <p className="workspace-page-description mt-2">
              목적에 맞는 템플릿을 선택하면 워크스페이스를 이용할 수 있어요
            </p>
          </header>
          <div className="flex w-full flex-col gap-3.75">
            {WORKSPACE_TEMPLATE_ORDER.map((purpose) => (
              <TemplateSelectCard key={purpose} purpose={purpose} onSelect={handleSelect} />
            ))}
          </div>
        </div>
        <Link
          href="/workspaces"
          className="text-brand-muted hover:text-brand text-sm font-semibold"
        >
          ← 워크스페이스 목록으로
        </Link>
      </div>

      <CreateWorkspaceDialog
        purpose={selectedPurpose}
        open={isDialogOpen && selectedPurpose !== null}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
