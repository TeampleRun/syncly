// 업무(Task) 도메인 모델 — 스프린트 애그리거트의 구성 단위.
// 칸반(대기/진행 중/완료)과 백로그(status:'backlog')가 모두 같은 Task이며, UI에서 status로 필터링한다.
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'design' | 'frontend' | 'backend' | 'planning';

interface StatusStyle {
  label: string;
  dot: string;
  bg: string;
  text: string;
}

// 칸반 컬럼/상태 뱃지 스타일
export const TASK_STATUS: Record<TaskStatus, StatusStyle> = {
  backlog: { label: '백로그', dot: '#d1d5dc', bg: '#f3f4f6', text: '#6a7282' },
  todo: { label: '대기', dot: '#d1d5dc', bg: '#f3f4f6', text: '#6a7282' },
  in_progress: { label: '진행 중', dot: '#2b7fff', bg: '#e0e7ff', text: '#432dd7' },
  done: { label: '완료', dot: '#22c55e', bg: '#dcfce7', text: '#16a34a' },
};

// 우선순위 뱃지 색 (Figma 지정값)
export const TASK_PRIORITY: Record<TaskPriority, { label: string; color: string }> = {
  high: { label: '높음', color: '#ff6467' },
  medium: { label: '보통', color: '#ffb900' },
  low: { label: '낮음', color: '#d1d5dc' },
};

// 카테고리 태그 스타일 — 색상은 잠정값(스프린트 보드 UI 구축 시 Figma로 확정)
export const TASK_CATEGORY: Record<TaskCategory, { label: string; bg: string; text: string }> = {
  design: { label: 'Design', bg: '#f3e8ff', text: '#7e22ce' },
  frontend: { label: 'Frontend', bg: '#dbeafe', text: '#1d4ed8' },
  backend: { label: 'Backend', bg: '#dcfce7', text: '#15803d' },
  planning: { label: '기획', bg: '#fef3c7', text: '#b45309' },
};

export interface TaskAssignee {
  /** 워크스페이스 멤버 표시명 */
  name: string;
  /** 아바타 이니셜(성 한 글자) */
  avatarLabel: string;
}

export interface Task {
  id: string;
  title: string;
  point: number;
  status: TaskStatus;
  priority: TaskPriority;
  /** 칸반 카드 태그. 백로그 항목은 아직 미지정일 수 있어 null 허용 */
  category: TaskCategory | null;
  /** 담당자. 미배정(백로그 등) 시 null */
  assignee: TaskAssignee | null;
}
