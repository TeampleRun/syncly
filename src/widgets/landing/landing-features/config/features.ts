// 기능 소개 카드 데이터 — PRD의 워크스페이스 구성 요소 7종
import {
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  FolderOpen,
  Megaphone,
  MessageSquare,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  descriptionLines: [string, string];
}

export const featureCards: FeatureCard[] = [
  {
    icon: ClipboardList,
    title: '업무 관리',
    descriptionLines: ['칸반 보드로', '직관적인 업무 분배'],
  },
  {
    icon: Calendar,
    title: '캘린더',
    descriptionLines: ['일정과 마감일을', '한눈에 확인'],
  },
  {
    icon: Megaphone,
    title: '공지',
    descriptionLines: ['주요 내용을 빠르게', '전달하고 고정'],
  },
  {
    icon: FileText,
    title: '회의록',
    descriptionLines: ['회의 내용을 기록하고', '후속 업무로 연결'],
  },
  {
    icon: FolderOpen,
    title: '자료실',
    descriptionLines: ['파일, 링크를 체계적으로', '정리하고 공유'],
  },
  {
    icon: MessageSquare,
    title: '채팅',
    descriptionLines: ['팀원과 실시간으로', '소통하고 협업'],
  },
  {
    icon: BarChart3,
    title: '진행률 차트',
    descriptionLines: ['데이터로 진행 상황을', '한눈에 확인'],
  },
];
