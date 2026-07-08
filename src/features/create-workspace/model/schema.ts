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
