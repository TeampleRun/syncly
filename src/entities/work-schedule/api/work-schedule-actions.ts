'use server';

// 스케줄 셀과 근무유형 설정 변경을 검증한 뒤 Supabase에 저장하는 서버 액션 모음입니다.
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUserId } from '@/shared/api/supabase/current-user';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { getCurrentWeekRange } from '../lib/work-date';
import type { WorkShiftColor, WorkShiftOption } from '../model/work-schedule.types';

const colorSchema = z.enum(['sky', 'violet', 'amber', 'slate', 'emerald', 'rose']);
// 개발 시드 UUID처럼 RFC 버전 비트가 0인 GUID도 허용한다.
const uuidSchema = z.guid();
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
  message: '시간은 00:00부터 23:59 사이여야 합니다.',
});

type WorkShiftTypeActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

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

function getWorkShiftTypeErrorMessage(error: unknown, fallbackMessage: string): string {
  console.error('[work schedule] 근무 유형 저장 실패:', error);

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  ) {
    return '같은 이름의 근무 유형이 이미 있습니다. 다른 이름을 입력해주세요.';
  }

  return fallbackMessage;
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

export async function createWorkShiftType(
  workspaceId: string,
): Promise<WorkShiftTypeActionResult<{ shift: WorkShiftOption; defaultShiftTypeId: string }>> {
  try {
    const parsedWorkspaceId = uuidSchema.parse(workspaceId);
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc('create_work_shift_type_and_ensure_weekly_entries', {
      p_workspace_id: parsedWorkspaceId,
      p_week_start_date: getCurrentWeekRange().startDate,
    });

    if (error) {
      return {
        ok: false,
        message: getWorkShiftTypeErrorMessage(error, '근무 유형을 추가하지 못했습니다.'),
      };
    }

    const createdShift = data?.[0];
    if (!createdShift) {
      return { ok: false, message: '근무 유형 추가 결과를 확인하지 못했습니다.' };
    }

    revalidateWorkspace(parsedWorkspaceId);

    return {
      ok: true,
      data: {
        shift: {
          id: createdShift.id,
          code: createdShift.code,
          name: createdShift.name,
          startTime: createdShift.start_time?.slice(0, 5) ?? null,
          endTime: createdShift.end_time?.slice(0, 5) ?? null,
          endsNextDay: createdShift.ends_next_day,
          color: createdShift.color as WorkShiftColor,
          isOff: createdShift.is_off,
        },
        defaultShiftTypeId: createdShift.default_shift_type_id,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: getWorkShiftTypeErrorMessage(error, '근무 유형을 추가하지 못했습니다.'),
    };
  }
}

export async function updateWorkShiftType(
  input: z.infer<typeof shiftTypeSchema>,
): Promise<WorkShiftTypeActionResult<undefined>> {
  try {
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

    if (error) {
      return {
        ok: false,
        message: getWorkShiftTypeErrorMessage(error, '근무 유형을 저장하지 못했습니다.'),
      };
    }

    revalidateWorkspace(value.workspaceId);
    return { ok: true, data: undefined };
  } catch (error) {
    return {
      ok: false,
      message: getWorkShiftTypeErrorMessage(error, '근무 유형 입력값이 올바르지 않습니다.'),
    };
  }
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
