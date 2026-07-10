'use client';

// 워크스페이스 정보(이름·설명) 수정 폼입니다.
// 백엔드 연동 전이므로 저장은 로컬 상태를 확정(commit)하는 목업으로 동작합니다.
import { useState, type FormEvent } from 'react';
import type { Workspace } from '@/entities/workspace';

interface WorkspaceInfoFormProps {
  workspace: Workspace;
}

export function WorkspaceInfoForm({ workspace }: WorkspaceInfoFormProps) {
  // committed: 마지막으로 저장된 값. 입력값과 비교해 변경 여부(dirty)를 판단한다.
  const [committedName, setCommittedName] = useState(workspace.name);
  const [committedDescription, setCommittedDescription] = useState(workspace.description ?? '');

  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description ?? '');
  const [isSaved, setIsSaved] = useState(false);

  const isDirty = name !== committedName || description !== committedDescription;
  const canSubmit = name.trim().length > 0 && isDirty;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    // TODO: 백엔드 연동 시 워크스페이스 정보 저장 API 호출로 교체한다.
    const nextName = name.trim();
    setName(nextName);
    setCommittedName(nextName);
    setCommittedDescription(description);
    setIsSaved(true);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">워크스페이스 정보</h2>
      <p className="mt-1 text-sm text-slate-500">워크스페이스 이름과 설명을 수정할 수 있어요.</p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-slate-900">이름</span>
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setIsSaved(false);
            }}
            placeholder="워크스페이스 이름을 입력하세요."
            className="mt-2 h-11 w-full rounded-2xl bg-slate-100 px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-900">설명</span>
          <textarea
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setIsSaved(false);
            }}
            placeholder="워크스페이스를 소개하는 문구를 입력하세요."
            rows={3}
            className="mt-2 min-h-24 w-full resize-none rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-10 rounded-2xl bg-[var(--color-brand)] px-5 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            저장
          </button>
          {isSaved && !isDirty ? (
            <span className="text-sm font-medium text-emerald-600">저장되었습니다.</span>
          ) : null}
        </div>
      </form>
    </section>
  );
}
