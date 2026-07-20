'use client';

// 헤더 입력창과 워크스페이스 통합 검색 결과 목록을 렌더링합니다.
import {
  CalendarDays,
  FileText,
  MessageSquare,
  NotebookPen,
  Search,
  SquareCheckBig,
} from 'lucide-react';
import Link from 'next/link';
import { useWorkspaceSearch } from '../model/use-workspace-search';

interface WorkspaceSearchPanelProps {
  workspaceId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const SEARCH_TYPE_LABEL = {
  announcement: '공지',
  resource: '자료실',
  task: '업무',
  chat: '채팅',
  meetingNote: '회의록',
  calendarEvent: '일정',
} as const;

function SearchTypeIcon({ type }: { type: keyof typeof SEARCH_TYPE_LABEL }) {
  const className = 'h-4 w-4 text-slate-400';
  if (type === 'announcement') return <SquareCheckBig className={className} aria-hidden="true" />;
  if (type === 'resource') return <FileText className={className} aria-hidden="true" />;
  if (type === 'chat') return <MessageSquare className={className} aria-hidden="true" />;
  if (type === 'meetingNote') return <NotebookPen className={className} aria-hidden="true" />;
  if (type === 'calendarEvent') return <CalendarDays className={className} aria-hidden="true" />;
  return <SquareCheckBig className={className} aria-hidden="true" />;
}

export function WorkspaceSearchPanel({
  workspaceId,
  isOpen,
  onOpenChange,
}: WorkspaceSearchPanelProps) {
  const { query, setQuery, normalizedQuery, results, isLoading, isError } =
    useWorkspaceSearch(workspaceId);
  const isCurrentQuery = normalizedQuery === query.trim();
  const shouldShowResults = isCurrentQuery && !isLoading && !isError;

  const searchInput = (className: string, autoFocus = false) => (
    <input
      type="search"
      value={query}
      autoFocus={autoFocus}
      onFocus={() => onOpenChange(true)}
      onChange={(event) => {
        setQuery(event.target.value);
        onOpenChange(true);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onOpenChange(false);
      }}
      placeholder="검색..."
      className={className}
      aria-label="워크스페이스 통합 검색"
      aria-autocomplete="list"
      aria-expanded={isOpen}
      aria-controls="workspace-search-results"
      role="combobox"
    />
  );

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="워크스페이스 검색"
        aria-expanded={isOpen}
        onClick={() => onOpenChange(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 sm:hidden"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>

      <label className="hidden h-10 w-60 items-center gap-2 rounded-xl bg-slate-100 px-4 text-slate-400 focus-within:ring-2 focus-within:ring-indigo-200 sm:flex">
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        {searchInput(
          'min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400',
        )}
      </label>

      {isOpen && (
        <div
          id="workspace-search-results"
          className="fixed top-20 right-3 left-3 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:absolute sm:top-12 sm:right-0 sm:left-auto sm:w-[min(24rem,calc(100vw-2rem))]"
        >
          <label className="flex h-12 items-center gap-2 border-b border-slate-100 px-4 text-slate-400 sm:hidden">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            {searchInput(
              'min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400',
              true,
            )}
          </label>
          {query.trim().length < 2 && (
            <p className="px-4 py-4 text-sm text-slate-500">두 글자 이상 입력해 검색하세요.</p>
          )}
          {query.trim().length >= 2 && isLoading && (
            <p className="px-4 py-4 text-sm text-slate-500">검색 중입니다.</p>
          )}
          {query.trim().length >= 2 && !isLoading && isError && (
            <p className="px-4 py-4 text-sm text-rose-600">검색 결과를 불러오지 못했습니다.</p>
          )}
          {normalizedQuery.length >= 2 && !isLoading && !isError && results.length === 0 && (
            <p className="px-4 py-4 text-sm text-slate-500">검색 결과가 없습니다.</p>
          )}
          {shouldShowResults && results.length > 0 && (
            <ul className="max-h-96 overflow-y-auto py-1">
              {results.map((result) => (
                <li key={`${result.type}-${result.id}`}>
                  <Link
                    href={result.href}
                    onClick={() => onOpenChange(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50"
                  >
                    <SearchTypeIcon type={result.type} />
                    <span className="min-w-0 flex-1">
                      <span className="mb-1 flex items-center gap-2">
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-semibold text-indigo-600">
                          {SEARCH_TYPE_LABEL[result.type]}
                        </span>
                        <span className="truncate text-sm font-semibold text-slate-800">
                          {result.title}
                        </span>
                      </span>
                      {result.description && (
                        <span className="block truncate text-xs text-slate-500">
                          {result.description}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
