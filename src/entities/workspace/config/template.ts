// 워크스페이스 생성 시 보여줄 템플릿(purpose) 상세 정보 — 라벨/아이콘/gradient는 WORKSPACE_PURPOSE_META 참고
import type { WorkspacePurpose } from '../model/workspace.types';

export interface WorkspaceTemplateDetail {
  subtitle: string; // 타깃 사용자 (예: 대학교 팀플, 스터디)
  description: string; // 템플릿 설명
  tags: string[]; // 포함되는 기능
  tagBg: string;
  tagText: string;
  borderColor: string;
}

export const WORKSPACE_TEMPLATE_DETAIL: Record<WorkspacePurpose, WorkspaceTemplateDetail> = {
  'team-project': {
    subtitle: '대학교 팀플, 스터디',
    description:
      '수업 팀플이나 스터디 그룹에 딱 맞는 구성입니다. 역할 분담부터 일정 관리까지 한 곳에서.',
    tags: ['업무 분담 보드', '회의록', '자료실', '캘린더', '그룹 채팅'],
    tagBg: '#ede9fe',
    tagText: '#7008e7',
    borderColor: '#ede9fe',
  },
  'side-project': {
    subtitle: '개발팀, 스타트업 소규모 팀',
    description:
      '빠르게 실행하는 소규모 개발팀을 위한 구성입니다. 칸반과 스프린트로 속도 있게 진행하세요.',
    tags: ['칸반 보드', '스프린트 관리', '회의록', '채팅', '진행률 차트'],
    tagBg: '#dbeafe',
    tagText: '#1447e6',
    borderColor: '#dbeafe',
  },
  'store-operation': {
    subtitle: '카페, 음식점, 소규모 가게',
    description:
      '매장 직원들과 공지, 스케줄, 업무를 쉽게 공유하세요. 복잡한 기능 없이 꼭 필요한 것만.',
    tags: ['공지 게시판', '업무 스케줄', '자료실', '채팅', '캘린더'],
    tagBg: '#fef3c6',
    tagText: '#bb4d00',
    borderColor: '#ffe888',
  },
};

// 선택 화면 카드 렌더 순서
export const WORKSPACE_TEMPLATE_ORDER: WorkspacePurpose[] = [
  'team-project',
  'side-project',
  'store-operation',
];
