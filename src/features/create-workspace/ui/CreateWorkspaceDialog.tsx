'use client';

// 워크스페이스 생성 Dialog — 선택된 템플릿 요약 + 이름/설명 입력 후 서버액션으로 생성
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  WORKSPACE_PURPOSE_META,
  WORKSPACE_TEMPLATE_DETAIL,
  createWorkspace,
  type WorkspacePurpose,
} from '@/entities/workspace';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { createWorkspaceSchema, type CreateWorkspaceForm } from '../model/schema';

interface CreateWorkspaceDialogProps {
  purpose: WorkspacePurpose | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INPUT_CLASS =
  'bg-brand-secondary text-brand-ink placeholder:text-brand-ink/50 h-11 w-full rounded-[18px] border-2 border-transparent px-4.5 text-sm transition-colors focus-visible:border-brand focus-visible:ring-0';

export default function CreateWorkspaceDialog({
  purpose,
  open,
  onOpenChange,
}: CreateWorkspaceDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: '', description: '' },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const onSubmit = async (values: CreateWorkspaceForm) => {
    if (!purpose) return;
    setIsSubmitting(true);
    try {
      await createWorkspace({ name: values.name, description: values.description, purpose });
      // 새 워크스페이스가 목록에 반영되도록 캐시 무효화 후 이동
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      router.push('/workspaces');
      // 성공 시 페이지 이동으로 언마운트되므로 isSubmitting을 리셋하지 않는다(버튼 깜빡임 방지)
    } catch (error) {
      // TODO: 실패 알림 UI(toast 등) 추가
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const meta = purpose ? WORKSPACE_PURPOSE_META[purpose] : null;
  const detail = purpose ? WORKSPACE_TEMPLATE_DETAIL[purpose] : null;
  const PurposeIcon = meta?.icon;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          // 기본 포커스(닫기 버튼) 대신 이름 입력으로 포커스를 보낸다
          event.preventDefault();
          setFocus('name');
        }}
        className="border-brand/10 gap-0 rounded-[16px] bg-white p-8.25 sm:max-w-[512px]"
      >
        {meta && detail && PurposeIcon ? (
          <>
            <div className="flex items-center gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-[18px]"
                style={{ backgroundImage: meta.gradient }}
              >
                <PurposeIcon className="size-5 text-white" aria-hidden />
              </div>
              <div className="flex min-w-0 flex-col">
                <DialogTitle className="text-brand-ink text-xl leading-[30px] font-bold">
                  {meta.label}
                </DialogTitle>
                <DialogDescription className="text-brand-muted text-xs leading-4">
                  선택된 템플릿
                </DialogDescription>
              </div>
            </div>

            <div className="bg-brand-secondary mt-6 rounded-[18px] p-3">
              <p className="text-brand-muted text-xs leading-4 font-semibold">포함되는 기능</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {detail.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-[13px] leading-4 font-semibold"
                    style={{ backgroundColor: detail.tagBg, color: detail.tagText }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="workspace-name" className="text-brand-ink text-sm font-semibold">
                  워크스페이스 이름 <span className="text-brand">*</span>
                </Label>
                <Input
                  id="workspace-name"
                  placeholder="예: 캡스톤 디자인 팀"
                  autoComplete="off"
                  className={INPUT_CLASS}
                  aria-invalid={Boolean(errors.name)}
                  {...register('name')}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="workspace-description"
                  className="text-brand-ink text-sm font-semibold"
                >
                  설명 (선택)
                </Label>
                <Textarea
                  id="workspace-description"
                  placeholder="워크스페이스에 대해 간단히 설명해주세요"
                  className={`${INPUT_CLASS} h-[84px] resize-none py-3`}
                  aria-invalid={Boolean(errors.description)}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand mt-2 rounded-[18px] py-3 text-base font-semibold text-white transition-opacity disabled:opacity-60"
              >
                {isSubmitting ? '만드는 중...' : '워크스페이스 만들기'}
              </button>
            </form>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
