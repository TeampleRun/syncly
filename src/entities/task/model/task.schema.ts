import { z } from 'zod';

export const taskTitleSchema = z
  .string()
  .trim()
  .min(1, '업무 제목을 입력해주세요')
  .max(100, '업무 제목은 100자 이내로 입력해주세요');

export const taskBoardItemSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['todo', 'in-progress', 'done']),
  sortOrder: z.number().int().min(0),
});

export const updateTaskBoardSchema = z.object({
  workspaceId: z.string().uuid(),
  tasks: z.array(taskBoardItemSchema),
});
