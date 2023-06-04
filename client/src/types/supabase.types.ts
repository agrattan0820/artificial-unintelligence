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
      games: {
        Row: {
          completed_at: string | null
          created_at: string | null
          first_question: number | null
          id: number
          room_code: string
          second_question: number | null
          third_question: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          first_question?: number | null
          id?: number
          room_code: string
          second_question?: number | null
          third_question?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          first_question?: number | null
          id?: number
          room_code?: string
          second_question?: number | null
          third_question?: number | null
        }
      }
      generations: {
        Row: {
          created_at: string | null
          game_id: number
          id: number
          image_url: string
          prompt: string
          question_id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          game_id: number
          id?: number
          image_url: string
          prompt: string
          question_id: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          game_id?: number
          id?: number
          image_url?: string
          prompt?: string
          question_id?: number
          user_id?: number
        }
      }
      questions: {
        Row: {
          created_at: string | null
          id: number
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          text: string
        }
        Update: {
          created_at?: string | null
          id?: number
          text?: string
        }
      }
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
          room_code: string
          user_id: number
        }
        Insert: {
          created_at?: string | null
          room_code: string
          user_id: number
        }
        Update: {
          created_at?: string | null
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
      votes: {
        Row: {
          created_at: string | null
          generation_id: number
          id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          generation_id: number
          id?: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          generation_id?: number
          id?: number
          user_id?: number
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
