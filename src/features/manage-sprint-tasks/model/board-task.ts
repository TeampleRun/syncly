// 보드 표시용 Task — 엔티티 Task(assigneeId만 보유)에 담당자 표시값을 해석해 붙인 뷰 모델.
// 표시명은 워크스페이스 members의 닉네임을 단일 출처로 삼는다(엔티티는 id만, 여기서 해석).
import type { Task } from '@/entities/side-project/task';
import type { WorkspaceMember } from '@/entities/workspace-member';

export interface AssigneeDisplay {
  name: string;
  avatarLabel: string;
}

export interface BoardTask extends Task {
  /** assigneeId를 members에서 해석한 표시값. 미배정/멤버 없음이면 null */
  assignee: AssigneeDisplay | null;
}

/** members를 userId → member 맵으로 (반복 해석용) */
export function indexMembersById(members: WorkspaceMember[]): Map<string, WorkspaceMember> {
  return new Map(members.map((member) => [member.userId, member]));
}

/** Task + members 맵 → BoardTask (담당자 닉네임/아바타 해석) */
export function toBoardTask(task: Task, membersById: Map<string, WorkspaceMember>): BoardTask {
  const member = task.assigneeId ? membersById.get(task.assigneeId) : undefined;
  return {
    ...task,
    assignee: member ? { name: member.workspaceNickname, avatarLabel: member.avatarLabel } : null,
  };
}
