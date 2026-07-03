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
  description: string;
}

export const featureCards: FeatureCard[] = [
  { icon: ClipboardList, title: '업무 관리', description: '칸반 보드로 직관적인 업무 분배' },
  { icon: Calendar, title: '캘린더', description: '일정과 마감일을 한눈에' },
  { icon: Megaphone, title: '공지', description: '팀 공지를 놓치지 않게' },
  { icon: FileText, title: '회의록', description: '회의 내용을 간편하게 기록' },
  { icon: FolderOpen, title: '자료실', description: '파일과 링크를 한 곳에' },
  { icon: MessageSquare, title: '채팅', description: '팀원과 바로 소통' },
  { icon: BarChart3, title: '진행률 차트', description: '프로젝트 현황을 시각적으로' },
];
