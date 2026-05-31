export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          avatar: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar?: string;
          email?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      bingos: {
        Row: {
          id: string;
          title: string;
          squares: { id: number; text: string }[];
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          squares: { id: number; text: string }[];
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          squares?: { id: number; text: string }[];
          created_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      completions: {
        Row: {
          id: string;
          bingo_id: string;
          user_id: string;
          square_id: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          bingo_id: string;
          user_id: string;
          square_id: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          bingo_id?: string;
          user_id?: string;
          square_id?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          bingo_id: string;
          square_id: number;
          user_id: string;
          body: string;
          tg_link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bingo_id: string;
          square_id: number;
          user_id: string;
          body: string;
          tg_link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          bingo_id?: string;
          square_id?: number;
          user_id?: string;
          body?: string;
          tg_link?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
