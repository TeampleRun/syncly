import type { GenericEnums, GenericTables } from '@/shared/model/supabase.types';

export type TaskRow = GenericTables<'tasks'>;
export type TaskStatusDb = GenericEnums<'task_status'>;
