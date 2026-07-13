// 업무(Task) 도메인 모델 — 워크스페이스가 소유하고, 선택적으로 스프린트에 편입된다.
// status는 진행 상태(대기/진행 중/완료)만 나타낸다.
// 백로그 여부는 status가 아니라 sprintId로 판별한다(sprintId === null → 백로그).
// enum 리터럴은 DB 네이티브 ENUM에서 파생한다(중복 정의 금지) — supabase-convention §6.
import type { GenericEnums } from '@/shared/model/supabase.types';

export type TaskStatus = GenericEnums<'task_status'>;
export type TaskPriority = GenericEnums<'task_priority'>;
export type TaskCategory = GenericEnums<'task_category'>;

interface StatusStyle {
  label: string;
  dot: string;
  bg: string;
  text: string;
}

// 칸반 컬럼/상태 뱃지 스타일
export const TASK_STATUS: Record<TaskStatus, StatusStyle> = {
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
  /** 담당자 신원 — profiles.id(= workspace_members.userId). 쓰기 시 tasks.assignee_id로 매핑된다 */
  userId: string;
  /** 워크스페이스 멤버 표시명 */
  name: string;
  /** 아바타 이니셜(성 한 글자) */
  avatarLabel: string;
}

export interface Task {
  id: string;
  /** 소유 워크스페이스 — Task의 기준(anchor). 백로그·스프린트 무관하게 항상 존재 */
  workspaceId: string;
  /** 편입된 스프린트 id. null이면 백로그(아직 스프린트 미편입) */
  sprintId: string | null;
  title: string;
  point: number;
  status: TaskStatus;
  priority: TaskPriority;
  /** 칸반 카드 태그. 백로그 항목은 아직 미지정일 수 있어 null 허용 */
  category: TaskCategory | null;
  /** 담당자. 미배정(백로그 등) 시 null */
  assignee: TaskAssignee | null;
}
