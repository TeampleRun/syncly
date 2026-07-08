// purpose별 표시 정보 — ERD에 템플릿 테이블이 없으므로 라벨/아이콘/포인트 컬러는 프론트에서 매핑한다
import { GraduationCap, LayoutGrid, ShoppingBag, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { WorkspacePurpose } from '../model/workspace.types';

interface WorkspacePurposeMeta {
  label: string;
  icon: LucideIcon;
  gradient: string;
}

export const WORKSPACE_PURPOSE_META: Record<WorkspacePurpose, WorkspacePurposeMeta> = {
  'team-project': {
    label: '팀 프로젝트',
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #8e51ff 0%, #615fff 100%)',
  },
  'side-project': {
    label: '사이드 프로젝트',
    icon: Zap,
    gradient: 'linear-gradient(135deg, #2b7fff 0%, #00b8db 100%)',
  },
  'store-operation': {
    label: '매장 운영',
    icon: ShoppingBag,
    gradient: 'linear-gradient(135deg, #fe9a00 0%, #ff6900 100%)',
  },
};

// purpose가 매핑에 없을 때(백엔드 연동 후 값 불일치 등) 사용하는 중립 표시 정보
export const FALLBACK_PURPOSE_META: WorkspacePurposeMeta = {
  label: '워크스페이스',
  icon: LayoutGrid,
  gradient: 'linear-gradient(135deg, #7b7fa8 0%, #5b4ee8 100%)',
};
