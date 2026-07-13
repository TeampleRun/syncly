// 스프린트 생성/수정 입력 검증 — 폼과 서버액션이 공유한다.
// 날짜만 검증한다(종료일 ≥ 시작일). 이름 중복은 허용(검사하지 않음).
import { z } from 'zod';

export const sprintInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, '스프린트 이름을 입력해주세요')
      .max(50, '이름은 50자 이내로 입력해주세요'),
    // 'YYYY-MM-DD' — 문자열 사전순 비교가 날짜 순서와 일치한다
    startDate: z.string().min(1, '시작일을 선택해주세요'),
    endDate: z.string().min(1, '종료일을 선택해주세요'),
  })
  .refine((v) => v.startDate <= v.endDate, {
    message: '종료일은 시작일과 같거나 이후여야 합니다',
    path: ['endDate'],
  });

export type SprintInput = z.infer<typeof sprintInputSchema>;
