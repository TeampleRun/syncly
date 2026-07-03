// 팀 유형 카드 데이터 — 도메인 한정 포인트 컬러는 전역 토큰 대신 여기서 매핑 관리한다
import { GraduationCap, Rocket, Store } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TeamCard {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  borderColor: string;
  tagBg: string;
  tagText: string;
  tags: string[];
}

export const teamCards: TeamCard[] = [
  {
    icon: GraduationCap,
    title: '팀 프로젝트',
    description:
      '수업 팀플이나 스터디 그룹에 딱 맞는 구성입니다. 역할 분담부터 일정 관리까지 한 곳에서.',
    gradient: 'linear-gradient(135deg, #8e51ff 0%, #615fff 100%)',
    borderColor: '#ede9fe',
    tagBg: '#ede9fe',
    tagText: '#7008e7',
    tags: ['업무 분담 보드', '회의록', '자료실', '캘린더', '그룹 채팅'],
  },
  {
    icon: Rocket,
    title: '사이드 프로젝트',
    description:
      '빠르게 실행하는 소규모 개발팀을 위한 구성입니다. 칸반과 스프린트로 속도 있게 진행하세요.',
    gradient: 'linear-gradient(135deg, #2b7fff 0%, #00b8db 100%)',
    borderColor: '#dbeafe',
    tagBg: '#dbeafe',
    tagText: '#1447e6',
    tags: ['칸반 보드', '스프린트 관리', '회의록', '채팅', '진행률 차트'],
  },
  {
    icon: Store,
    title: '매장 운영',
    description:
      '매장 직원들과 공지, 스케줄, 업무를 쉽게 공유하세요. 복잡한 기능 없이 꼭 필요한 것만.',
    gradient: 'linear-gradient(135deg, #fe9a00 0%, #ff6900 100%)',
    borderColor: '#fef3c6',
    tagBg: '#fef3c6',
    tagText: '#bb4d00',
    tags: ['공지 게시판', '업무 스케줄', '자료실', '채팅', '캘린더'],
  },
];
