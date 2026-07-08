// KPI 통계 카드 — 라벨/수치/단위를 표시하는 도메인 무관 표현 컴포넌트
import { WidgetCard } from './widget-card';

export interface Stat {
  id: string;
  label: string;
  value: number;
  unit: string;
  /** 수치 강조 색상 */
  color: string;
}

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <WidgetCard className="justify-between">
      <p className="text-brand-muted text-xs">{stat.label}</p>
      <p className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold" style={{ color: stat.color }}>
          {stat.value}
        </span>
        <span className="text-brand-muted text-xs">{stat.unit}</span>
      </p>
    </WidgetCard>
  );
}
