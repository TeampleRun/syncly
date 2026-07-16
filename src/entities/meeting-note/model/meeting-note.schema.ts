import { z } from 'zod';

export const meetingNoteTitleSchema = z
  .string()
  .trim()
  .min(1, '회의 제목을 입력해주세요.')
  .max(120, '회의 제목은 120자 이내로 입력해주세요.');

export const meetingDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '회의 날짜 형식이 올바르지 않습니다.');

// 결정사항·후속 업무는 빈 줄을 제거한 문자열 배열로 정규화한다.
const contentLinesSchema = z.array(z.string().trim().min(1)).default([]);

// 생성·수정 공통 입력. workspaceId만 생성 액션에서 추가로 검증한다.
export const meetingNoteContentSchema = z.object({
  title: meetingNoteTitleSchema,
  meetingDate: meetingDateSchema,
  participantIds: z.array(z.guid()).default([]),
  decisions: contentLinesSchema,
  followUpActions: contentLinesSchema,
});

export type MeetingNoteContentInput = z.infer<typeof meetingNoteContentSchema>;
