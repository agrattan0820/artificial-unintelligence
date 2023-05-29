export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          code: string
          created_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
        }
      }
      user_rooms: {
        Row: {
          created_at: string | null
          host: boolean
          room_code: string
          user_id: number
        }
        Insert: {
          created_at?: string | null
          host?: boolean
          room_code: string
          user_id: number
        }
        Update: {
          created_at?: string | null
          host?: boolean
          room_code?: string
          user_id?: number
        }
      }
      users: {
        Row: {
          created_at: string | null
          id: number
          nickname: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          nickname: string
        }
        Update: {
          created_at?: string | null
          id?: number
          nickname?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
