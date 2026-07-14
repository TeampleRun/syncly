export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          event_type: Database["public"]["Enums"]["calendar_event_type"]
          id: string
          starts_at: string
          task_id: string | null
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["calendar_event_type"]
          id?: string
          starts_at: string
          task_id?: string | null
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["calendar_event_type"]
          id?: string
          starts_at?: string
          task_id?: string | null
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_id: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_id?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_id?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_notes: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string
          decisions: string[]
          follow_up_actions: string[]
          id: string
          meeting_at: string
          participants: string[]
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          decisions?: string[]
          follow_up_actions?: string[]
          id?: string
          meeting_at: string
          participants?: string[]
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          decisions?: string[]
          follow_up_actions?: string[]
          id?: string
          meeting_at?: string
          participants?: string[]
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_notes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      module_registry: {
        Row: {
          created_at: string
          default_settings: Json
          description: string | null
          display_name: string
          is_active: boolean
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_settings?: Json
          description?: string | null
          display_name: string
          is_active?: boolean
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_settings?: Json
          description?: string | null
          display_name?: string
          is_active?: boolean
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          real_name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          real_name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          real_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          description: string | null
          id: string
          resource_type: Database["public"]["Enums"]["resource_type"]
          storage_path: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
          url: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          resource_type: Database["public"]["Enums"]["resource_type"]
          storage_path?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          url?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          resource_type?: Database["public"]["Enums"]["resource_type"]
          storage_path?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          url?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      sprints: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sprints_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          category: Database["public"]["Enums"]["task_category"] | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          point: number | null
          priority: Database["public"]["Enums"]["task_priority"]
          sort_order: number
          sprint_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          assignee_id?: string | null
          category?: Database["public"]["Enums"]["task_category"] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          point?: number | null
          priority?: Database["public"]["Enums"]["task_priority"]
          sort_order?: number
          sprint_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          assignee_id?: string | null
          category?: Database["public"]["Enums"]["task_category"] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          point?: number | null
          priority?: Database["public"]["Enums"]["task_priority"]
          sort_order?: number
          sprint_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dashboard_layouts: {
        Row: {
          created_at: string
          layout: Json
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          layout?: Json
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          layout?: Json
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dashboard_layouts_member_fk"
            columns: ["workspace_id", "user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members"
            referencedColumns: ["workspace_id", "user_id"]
          },
          {
            foreignKeyName: "user_dashboard_layouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_dashboard_layouts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      work_schedule_entries: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          shift_type_id: string
          updated_at: string
          user_id: string
          work_date: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          shift_type_id: string
          updated_at?: string
          user_id: string
          work_date: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          shift_type_id?: string
          updated_at?: string
          user_id?: string
          work_date?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_schedule_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_schedule_entries_member_fk"
            columns: ["workspace_id", "user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members"
            referencedColumns: ["workspace_id", "user_id"]
          },
          {
            foreignKeyName: "work_schedule_entries_shift_type_id_fkey"
            columns: ["shift_type_id"]
            isOneToOne: false
            referencedRelation: "work_shift_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_schedule_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_schedule_entries_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      work_shift_types: {
        Row: {
          code: string
          color: string
          created_at: string
          end_time: string | null
          ends_next_day: boolean
          id: string
          is_off: boolean
          name: string
          sort_order: number
          start_time: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          code: string
          color: string
          created_at?: string
          end_time?: string | null
          ends_next_day?: boolean
          id?: string
          is_off?: boolean
          name: string
          sort_order?: number
          start_time?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          code?: string
          color?: string
          created_at?: string
          end_time?: string | null
          ends_next_day?: boolean
          id?: string
          is_off?: boolean
          name?: string
          sort_order?: number
          start_time?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_shift_types_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["member_role"]
          updated_at: string
          user_id: string
          workspace_id: string
          workspace_nickname: string
        }
        Insert: {
          created_at?: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["member_role"]
          updated_at?: string
          user_id: string
          workspace_id: string
          workspace_nickname: string
        }
        Update: {
          created_at?: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["member_role"]
          updated_at?: string
          user_id?: string
          workspace_id?: string
          workspace_nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_modules: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          module_type: string
          settings: Json
          sort_order: number
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          module_type: string
          settings?: Json
          sort_order?: number
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          module_type?: string
          settings?: Json
          sort_order?: number
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_modules_module_type_fkey"
            columns: ["module_type"]
            isOneToOne: false
            referencedRelation: "module_registry"
            referencedColumns: ["type"]
          },
          {
            foreignKeyName: "workspace_modules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          description: string | null
          id: string
          invite_code: string | null
          invite_enabled: boolean
          name: string
          owner_id: string
          purpose: Database["public"]["Enums"]["workspace_purpose"]
          setup_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          invite_code?: string | null
          invite_enabled?: boolean
          name: string
          owner_id: string
          purpose: Database["public"]["Enums"]["workspace_purpose"]
          setup_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          invite_code?: string | null
          invite_enabled?: boolean
          name?: string
          owner_id?: string
          purpose?: Database["public"]["Enums"]["workspace_purpose"]
          setup_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_work_shift_type_and_ensure_weekly_entries: {
        Args: { p_week_start_date: string; p_workspace_id: string }
        Returns: {
          code: string
          color: string
          default_shift_type_id: string
          end_time: string
          ends_next_day: boolean
          id: string
          is_off: boolean
          name: string
          start_time: string
        }[]
      }
      create_workspace: {
        Args: {
          p_description?: string
          p_name: string
          p_purpose: Database["public"]["Enums"]["workspace_purpose"]
        }
        Returns: string
      }
      get_invite_preview: {
        Args: { p_code: string }
        Returns: {
          member_count: number
          name: string
          workspace_id: string
        }[]
      }
      get_my_workspaces: {
        Args: { p_user_id: string }
        Returns: {
          done_task_count: number
          id: string
          member_count: number
          name: string
          progress: number
          purpose: Database["public"]["Enums"]["workspace_purpose"]
          task_count: number
          updated_at: string
        }[]
      }
      get_sprints: {
        Args: { p_workspace_id: string }
        Returns: {
          completed_points: number
          days_left: number
          end_date: string
          id: string
          name: string
          start_date: string
          total_points: number
          workspace_id: string
        }[]
      }
      join_workspace_by_invite_code: {
        Args: { p_code: string }
        Returns: string
      }
      replace_and_delete_work_shift_type: {
        Args: {
          p_deleted_shift_type_id: string
          p_replacement_shift_type_id: string
          p_workspace_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      calendar_event_type: "meeting" | "deadline"
      member_role: "owner" | "member"
      resource_type: "file" | "link"
      task_category: "design" | "frontend" | "backend" | "planning"
      task_priority: "high" | "medium" | "low"
      task_status: "todo" | "in_progress" | "done"
      workspace_purpose: "team_project" | "side_project" | "store_operation"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      calendar_event_type: ["meeting", "deadline"],
      member_role: ["owner", "member"],
      resource_type: ["file", "link"],
      task_category: ["design", "frontend", "backend", "planning"],
      task_priority: ["high", "medium", "low"],
      task_status: ["todo", "in_progress", "done"],
      workspace_purpose: ["team_project", "side_project", "store_operation"],
    },
  },
} as const
