// 템플릿 선택 카드 데이터 — 도메인 한정 포인트 컬러는 전역 토큰 대신 여기서 매핑 관리한다
import { GraduationCap, Rocket, Store } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TemplateItem {
  id: 'team_project' | 'side_project' | 'store';
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  stepDescription: string;
  fullDescription: string;
  gradient: string;
  borderColor: string;
  tagBg: string;
  tagText: string;
  tags: string[];
}

export const templateItems: TemplateItem[] = [
  {
    id: 'team_project',
    icon: GraduationCap,
    title: '팀 프로젝트',
    shortDescription: '대학교 팀플이나 스터디 그룹에 딱 맞는 구성',
    stepDescription: '대학교 팀플, 스터디',
    fullDescription:
      '대학교 팀플이나 스터디 그룹에 딱 맞는 구성. 역할 분담부터 일정 관리까지 한 곳에서!',
    gradient: 'linear-gradient(135deg, #8e51ff 0%, #615fff 100%)',
    borderColor: '#ede9fe',
    tagBg: '#ede9fe',
    tagText: '#7008e7',
    tags: ['업무 분담 보드', '회의록', '자료실', '캘린더', '그룹 채팅'],
  },
  {
    id: 'side_project',
    icon: Rocket,
    title: '사이드 프로젝트',
    shortDescription: '빠르게 실행하는 소규모 개발팀을 위한 구성',
    stepDescription: '개발팀, 스타트업 소규모 팀',
    fullDescription:
      '빠르게 실행하는 소규모 개발팀을 위한 구성. 칸반과 스프린트로 속도 있게 진행하세요!',
    gradient: 'linear-gradient(135deg, #2b7fff 0%, #00b8db 100%)',
    borderColor: '#dbeafe',
    tagBg: '#dbeafe',
    tagText: '#1447e6',
    tags: ['칸반 보드', '스프린트 관리', '회의록', '채팅', '진행률 차트'],
  },
  {
    id: 'store',
    icon: Store,
    title: '매장 운영',
    shortDescription: '직원들과 스케줄, 업무를 쉽게 공유하세요',
    stepDescription: '카페, 음식점, 소규모 가게',
    fullDescription:
      '매장 직원들과 공지, 스케줄, 업무를 쉽게 공유하세요. 복잡한 기능 없이 꼭 필요한 것만!',
    gradient: 'linear-gradient(135deg, #fe9a00 0%, #ff6900 100%)',
    borderColor: '#ffe888',
    tagBg: '#fef3c6',
    tagText: '#bb4d00',
    tags: ['공지 게시판', '업무 스케줄', '자료실', '채팅', '캘린더'],
  },
];
