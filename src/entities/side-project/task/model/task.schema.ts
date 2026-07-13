// 업무 생성/수정 입력 검증 — 폼과 서버액션이 같은 스키마를 공유한다(클라이언트 입력을 신뢰하지 않음).
// enum 값은 자동 생성 Constants에서 파생한다(값 추가 시 컴파일로 누락 감지) — supabase-convention §3.
import { z } from 'zod';
import { Constants } from '@/shared/model/database.types'; // 예외: Constants만 직접 import 허용

export const taskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  point: z.number().int('포인트는 정수여야 합니다').min(0, '포인트는 0 이상이어야 합니다'),
  category: z.enum(Constants.public.Enums.task_category).nullable(),
  priority: z.enum(Constants.public.Enums.task_priority),
  // 담당자 profiles.id. 미배정이면 null. (실 member api 전까지 피커가 비어 사실상 null)
  assigneeId: z.string().uuid().nullable(),
});

export type TaskInput = z.infer<typeof taskInputSchema>;
