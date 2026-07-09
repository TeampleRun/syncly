// 워크스페이스 생성 입력 검증 — 폼(react-hook-form)과 서버액션이 같은 스키마를 공유한다
import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '워크스페이스 이름을 입력해주세요')
    .max(50, '이름은 50자 이내로 입력해주세요'),
  description: z.string().trim().max(200, '설명은 200자 이내로 입력해주세요').optional(),
});

export type CreateWorkspaceForm = z.infer<typeof createWorkspaceSchema>;

// 서버액션용 — 폼 필드에 더해 purpose까지 재검증한다 (클라이언트 입력을 신뢰하지 않음)
export const createWorkspaceInputSchema = createWorkspaceSchema.extend({
  purpose: z.enum(['team-project', 'side-project', 'store-operation']),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceInputSchema>;
