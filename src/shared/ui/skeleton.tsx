// 데이터 로딩 중 실제 콘텐츠의 자리와 크기를 유지하는 공통 스켈레톤 블록입니다.

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />
  );
}
