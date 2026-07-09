// 대시보드 위젯 정의 — 렌더(어떻게)와 추가 시 기본 배치(무엇을 어디에)를 한 덩어리로 관리한다.
// 위젯 id(layout.i)로 저장된 레이아웃(WORKSPACE_LAYOUTS)과 조인된다.
import type { ReactNode } from 'react';
import type { LayoutItem } from 'react-grid-layout';

import type { WidgetSize } from '../lib/widget-size';

export interface WidgetRenderContext {
  workspaceId: string;
}

export interface WidgetDefinition {
  /** 위젯을 추가할 때의 기본 배치 + 위젯 id(layout.i) */
  layout: LayoutItem;
  /** 위젯 추가 목록·라벨 표시명 */
  title: string;
  /** 현재 타일 크기(sm/md/lg)를 받아 밀도가 다른 변형을 렌더 */
  render: (size: WidgetSize, context: WidgetRenderContext) => ReactNode;
}
