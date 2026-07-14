'use server';

// 스케줄 셀과 근무유형 설정 변경을 검증한 뒤 Supabase에 저장하는 서버 액션 모음입니다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { getCurrentWeekRange } from '../lib/work-date';
import type { WorkShiftColor, WorkShiftOption } from '../model/work-schedule.types';
import { ensureWeeklyWorkScheduleEntries } from './ensure-weekly-work-schedule-entries';

const colorSchema = z.enum(['sky', 'violet', 'amber', 'slate', 'emerald', 'rose']);
// 개발 시드 UUID처럼 RFC 버전 비트가 0인 GUID도 허용한다.
const uuidSchema = z.guid();
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
  message: '시간은 00:00부터 23:59 사이여야 합니다.',
});

const shiftTypeSchema = z
  .object({
    id: uuidSchema,
    workspaceId: uuidSchema,
    name: z.string().trim().min(1).max(40),
    startTime: timeSchema.nullable(),
    endTime: timeSchema.nullable(),
    endsNextDay: z.boolean(),
    color: colorSchema,
    isOff: z.boolean(),
  })
  .superRefine((shift, context) => {
    if (shift.isOff) {
      if (shift.startTime || shift.endTime) {
        context.addIssue({
          code: 'custom',
          message: '휴무 유형에는 근무 시간을 지정할 수 없습니다.',
        });
      }
      return;
    }

    if (!shift.startTime || !shift.endTime) {
      context.addIssue({ code: 'custom', message: '근무 시작과 종료 시간을 입력해주세요.' });
      return;
    }

    if (!shift.endsNextDay && shift.endTime <= shift.startTime) {
      context.addIssue({ code: 'custom', message: '종료 시간은 시작 시간 이후여야 합니다.' });
    }
  });

function revalidateWorkspace(workspaceId: string): void {
  revalidatePath(`/workspaces/${workspaceId}/work-schedule`);
}

export async function saveWorkScheduleEntry(input: {
  workspaceId: string;
  userId: string;
  workDate: string;
  shiftTypeId: string;
}): Promise<void> {
  const value = z
    .object({
      workspaceId: uuidSchema,
      userId: uuidSchema,
      workDate: z.string().date(),
      shiftTypeId: uuidSchema,
    })
    .parse(input);
  const supabase = await createSupabaseServerClient();
  const updateExistingEntry = () =>
    supabase
      .from('work_schedule_entries')
      .update({ shift_type_id: value.shiftTypeId })
      .eq('workspace_id', value.workspaceId)
      .eq('user_id', value.userId)
      .eq('work_date', value.workDate)
      .select('id')
      .maybeSingle();

  const { data: updatedEntry, error: updateError } = await updateExistingEntry();

  if (updateError) throw new Error(`근무 스케줄 저장에 실패했습니다: ${updateError.message}`);

  if (!updatedEntry) {
    const { error: insertError } = await supabase.from('work_schedule_entries').insert({
      workspace_id: value.workspaceId,
      user_id: value.userId,
      work_date: value.workDate,
      shift_type_id: value.shiftTypeId,
      created_by: await getCurrentUserId(),
    });

    if (insertError?.code === '23505') {
      const { data: retriedEntry, error: retryError } = await updateExistingEntry();
      if (retryError || !retriedEntry) {
        throw new Error(
          `근무 스케줄 저장에 실패했습니다: ${retryError?.message ?? insertError.message}`,
        );
      }
    } else if (insertError) {
      throw new Error(`근무 스케줄 생성에 실패했습니다: ${insertError.message}`);
    }
  }

  revalidateWorkspace(value.workspaceId);
}

export async function createWorkShiftType(workspaceId: string): Promise<{
  shift: WorkShiftOption;
  defaultShiftTypeId: string;
}> {
  const parsedWorkspaceId = uuidSchema.parse(workspaceId);
  const supabase = await createSupabaseServerClient();
  const { data: lastShift, error: sortOrderError } = await supabase
    .from('work_shift_types')
    .select('sort_order')
    .eq('workspace_id', parsedWorkspaceId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sortOrderError)
    throw new Error(`근무 유형 순서 조회에 실패했습니다: ${sortOrderError.message}`);

  const { data, error } = await supabase
    .from('work_shift_types')
    .insert({
      workspace_id: parsedWorkspaceId,
      code: `custom-${crypto.randomUUID()}`,
      name: '새 근무',
      start_time: '09:00',
      end_time: '18:00',
      ends_next_day: false,
      color: 'emerald',
      is_off: false,
      sort_order: (lastShift?.sort_order ?? -1) + 1,
    })
    .select('id, code, name, start_time, end_time, ends_next_day, color, is_off')
    .single();

  if (error) throw new Error(`근무 유형 추가에 실패했습니다: ${error.message}`);

  // 서버가 실제로 선택한 기본 근무유형을 반환해 화면의 누락 셀도 같은 값으로 채운다.
  const defaultShift = await ensureWeeklyWorkScheduleEntries(
    parsedWorkspaceId,
    getCurrentWeekRange().startDate,
  );

  if (!defaultShift) {
    throw new Error('기본 근무유형을 확인하지 못했습니다.');
  }

  revalidateWorkspace(parsedWorkspaceId);

  return {
    shift: {
      id: data.id,
      code: data.code,
      name: data.name,
      startTime: data.start_time?.slice(0, 5) ?? null,
      endTime: data.end_time?.slice(0, 5) ?? null,
      endsNextDay: data.ends_next_day,
      color: data.color as WorkShiftColor,
      isOff: data.is_off,
    },
    defaultShiftTypeId: defaultShift.id,
  };
}

export async function updateWorkShiftType(input: z.infer<typeof shiftTypeSchema>): Promise<void> {
  const value = shiftTypeSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('work_shift_types')
    .update({
      name: value.name,
      start_time: value.startTime,
      end_time: value.endTime,
      ends_next_day: value.endsNextDay,
      color: value.color,
      is_off: value.isOff,
    })
    .eq('id', value.id)
    .eq('workspace_id', value.workspaceId);

  if (error) throw new Error(`근무 유형 저장에 실패했습니다: ${error.message}`);
  revalidateWorkspace(value.workspaceId);
}

export async function reorderWorkShiftTypes(input: {
  workspaceId: string;
  shiftTypeIds: string[];
}): Promise<void> {
  const value = z
    .object({ workspaceId: uuidSchema, shiftTypeIds: z.array(uuidSchema).min(1) })
    .parse(input);
  const supabase = await createSupabaseServerClient();
  const results = await Promise.all(
    value.shiftTypeIds.map((id, sortOrder) =>
      supabase
        .from('work_shift_types')
        .update({ sort_order: sortOrder })
        .eq('id', id)
        .eq('workspace_id', value.workspaceId),
    ),
  );
  const failed = results.find(({ error }) => error);
  if (failed?.error) throw new Error(`근무 유형 순서 저장에 실패했습니다: ${failed.error.message}`);
  revalidateWorkspace(value.workspaceId);
}

export async function replaceAndDeleteWorkShiftType(input: {
  workspaceId: string;
  deletedShiftTypeId: string;
  replacementShiftTypeId: string;
}): Promise<void> {
  const value = z
    .object({
      workspaceId: uuidSchema,
      deletedShiftTypeId: uuidSchema,
      replacementShiftTypeId: uuidSchema,
    })
    .refine((data) => data.deletedShiftTypeId !== data.replacementShiftTypeId)
    .parse(input);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc('replace_and_delete_work_shift_type', {
    p_workspace_id: value.workspaceId,
    p_deleted_shift_type_id: value.deletedShiftTypeId,
    p_replacement_shift_type_id: value.replacementShiftTypeId,
  });

  if (error) throw new Error(`근무 유형 삭제에 실패했습니다: ${error.message}`);
  revalidateWorkspace(value.workspaceId);
}
