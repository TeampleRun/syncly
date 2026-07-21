// 워크스페이스 모듈 전환 중 실제 화면 구조를 유지하는 페이지별 로딩 스켈레톤입니다.
import { Skeleton } from '@/shared/ui/skeleton';

export type WorkspacePageSkeletonVariant =
  'calendar' | 'chat' | 'dashboard' | 'kanban' | 'list' | 'schedule' | 'settings' | 'sprint';

interface WorkspacePageSkeletonProps {
  /** 대상 모듈의 정보 밀도에 맞춰 선택하는 스켈레톤 형태입니다. */
  variant: WorkspacePageSkeletonVariant;
}

const LIST_ROWS = Array.from({ length: 5 });
const TABLE_ROWS = Array.from({ length: 5 });
const TABLE_COLUMNS = Array.from({ length: 7 });

function PageHeading({ withAction = true }: { withAction?: boolean }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-56" />
      </div>
      {withAction ? <Skeleton className="h-11 w-28" /> : null}
    </div>
  );
}

function ListSkeleton() {
  return (
    <>
      <PageHeading />
      <div className="max-w-4xl space-y-4">
        {LIST_ROWS.map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
          >
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="mt-3 h-4 w-4/5" />
            <Skeleton className="mt-2 h-4 w-1/4" />
          </div>
        ))}
      </div>
    </>
  );
}

function ScheduleSkeleton() {
  return (
    <>
      <PageHeading />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-14 w-28" />
        <Skeleton className="h-14 w-28" />
        <Skeleton className="h-14 w-28" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[160px_repeat(7,minmax(88px,1fr))] border-b border-slate-200 p-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="mx-auto h-5 w-10" />
          ))}
        </div>
        {TABLE_ROWS.map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[160px_repeat(7,minmax(88px,1fr))] items-center border-b border-slate-100 p-5 last:border-b-0"
          >
            <Skeleton className="h-9 w-32" />
            {TABLE_COLUMNS.map((_, columnIndex) => (
              <Skeleton key={columnIndex} className="mx-auto h-10 w-16 rounded-full" />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function KanbanSkeleton() {
  return (
    <>
      <PageHeading />
      <div className="mb-5 flex flex-wrap gap-3">
        <Skeleton className="h-11 w-48" />
        <Skeleton className="h-11 w-28" />
      </div>
      <div className="grid min-w-[900px] grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, columnIndex) => (
          <div key={columnIndex} className="rounded-2xl bg-slate-100/80 p-4">
            <Skeleton className="mb-4 h-5 w-24" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, cardIndex) => (
                <div key={cardIndex} className="rounded-xl border border-slate-200 bg-white p-4">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="mt-4 h-3 w-2/5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <Skeleton className="h-52 xl:col-span-7" />
      <Skeleton className="h-52 xl:col-span-5" />
      <Skeleton className="h-64 xl:col-span-4" />
      <Skeleton className="h-64 xl:col-span-8" />
      <Skeleton className="h-56 xl:col-span-6" />
      <Skeleton className="h-56 xl:col-span-6" />
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <>
      <PageHeading withAction={false} />
      <div className="mb-5 flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
        {Array.from({ length: 42 }).map((_, index) => (
          <div key={index} className="min-h-28 bg-white p-3">
            <Skeleton className="h-4 w-6" />
            {index % 3 === 0 ? <Skeleton className="mt-4 h-5 w-full" /> : null}
          </div>
        ))}
      </div>
    </>
  );
}

function ChatSkeleton() {
  return (
    <>
      <PageHeading withAction={false} />
      <div className="grid min-h-[calc(100vh_-_230px)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.32fr)]">
        <div className="flex h-[min(720px,calc(100dvh_-_230px))] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="flex-1 space-y-6 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={index % 2 ? 'ml-auto w-2/5' : 'w-3/5'}>
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 p-5">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Skeleton className="h-6 w-28" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading withAction={false} />
      <div className="flex gap-3 border-b border-slate-200 pb-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-5 h-11 w-full" />
        <Skeleton className="mt-5 h-5 w-28" />
        <Skeleton className="mt-3 h-28 w-full" />
        <Skeleton className="mt-6 h-11 w-28" />
      </div>
    </div>
  );
}

export function WorkspacePageSkeleton({ variant }: WorkspacePageSkeletonProps) {
  if (variant === 'dashboard') return <DashboardSkeleton />;
  if (variant === 'calendar') return <CalendarSkeleton />;
  if (variant === 'chat') return <ChatSkeleton />;
  if (variant === 'schedule') return <ScheduleSkeleton />;
  if (variant === 'kanban' || variant === 'sprint') return <KanbanSkeleton />;
  if (variant === 'settings') return <SettingsSkeleton />;
  return <ListSkeleton />;
}
