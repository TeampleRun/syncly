import type { Notice } from './notice.types';

export const mockNotices: Notice[] = [
  {
    id: 'notice-1',
    workspaceId: 'test',
    title: '7월 신메뉴 출시 안내',
    authorName: '김민서',
    createdAt: '2025-06-28',
    isPinned: true,
    content:
      "7월 1일부터 여름 한정 '망고 라떼'와 '피치 에이드'가 출시됩니다. 레시피 숙지 부탁드립니다.",
  },
  {
    id: 'notice-2',
    workspaceId: 'test',
    title: '주간 청소 구역 배정',
    authorName: '이준혁',
    createdAt: '2025-06-26',
    isPinned: false,
    content:
      '이번 주 청소 구역 배정표를 확인해주세요. 마감 담당자는 냉장고 하단과 픽업대 주변을 추가로 점검해 주세요.',
  },
  {
    id: 'notice-3',
    workspaceId: 'test',
    title: '유니폼 교체 안내',
    authorName: '김민서',
    createdAt: '2025-06-24',
    isPinned: false,
    content:
      '신규 유니폼이 입고되었습니다. 이번 주 출근 시 기존 유니폼을 반납하고 새 유니폼을 수령해 주세요.',
  },
  {
    id: 'notice-4',
    workspaceId: 'test',
    title: '카드 단말기 교체 완료',
    authorName: '이준혁',
    createdAt: '2025-06-22',
    isPinned: false,
    content:
      '카드 단말기 교체가 완료되었습니다. 결제 오류가 반복되면 매니저에게 바로 공유해 주세요.',
  },
];
