// 템플릿(purpose)별 대시보드 설정 public entry.
// 허용 위젯 목록과 기본 좌표는 같은 소스에서 관리해, 특정 템플릿 안에서
// 함께 추가 가능한 위젯들이 서로 겹치지 않도록 유지한다.
import { validateTemplateWidgetLayouts } from './validate-template-widget-layouts';
export {
  TEMPLATE_WIDGET_LAYOUTS,
  TEMPLATE_WIDGETS,
  getTemplateWidgetLayout,
} from './template-widget-layouts';
import { TEMPLATE_WIDGET_LAYOUTS } from './template-widget-layouts';

if (process.env.NODE_ENV !== 'production') {
  validateTemplateWidgetLayouts(TEMPLATE_WIDGET_LAYOUTS);
}
