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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          id: string
          map_id: string | null
          spot_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          map_id?: string | null
          spot_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          map_id?: string | null
          spot_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kana: string
          prefecture_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          name_kana: string
          prefecture_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kana?: string
          prefecture_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_prefecture_id_fkey"
            columns: ["prefecture_id"]
            isOneToOne: false
            referencedRelation: "prefectures"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          map_id: string | null
          spot_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          map_id?: string | null
          spot_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          map_id?: string | null
          spot_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          followee_id: string
          follower_id: string
          id: string
        }
        Insert: {
          created_at?: string
          followee_id: string
          follower_id: string
          id?: string
        }
        Update: {
          created_at?: string
          followee_id?: string
          follower_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followee_id_fkey"
            columns: ["followee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          cloud_path: string | null
          created_at: string
          file_size: number | null
          height: number | null
          id: string
          local_path: string | null
          order_index: number | null
          spot_id: string
          updated_at: string
          width: number | null
        }
        Insert: {
          cloud_path?: string | null
          created_at?: string
          file_size?: number | null
          height?: number | null
          id?: string
          local_path?: string | null
          order_index?: number | null
          spot_id: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          cloud_path?: string | null
          created_at?: string
          file_size?: number | null
          height?: number | null
          id?: string
          local_path?: string | null
          order_index?: number | null
          spot_id?: string
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spots"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          map_id: string | null
          spot_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          map_id?: string | null
          spot_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          map_id?: string | null
          spot_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      machi: {
        Row: {
          city_id: string | null
          id: string
          latitude: number
          line_name: string
          longitude: number
          name: string
          prefecture: string
          prefecture_id: string
        }
        Insert: {
          city_id?: string | null
          id: string
          latitude: number
          line_name: string
          longitude: number
          name: string
          prefecture: string
          prefecture_id: string
        }
        Update: {
          city_id?: string | null
          id?: string
          latitude?: number
          line_name?: string
          longitude?: number
          name?: string
          prefecture?: string
          prefecture_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "machi_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machi_prefecture_id_fkey"
            columns: ["prefecture_id"]
            isOneToOne: false
            referencedRelation: "prefectures"
            referencedColumns: ["id"]
          },
        ]
      }
      maps: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          is_official: boolean | null
          is_public: boolean | null
          likes_count: number | null
          name: string
          spots_count: number | null
          tags: Json | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          is_official?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          name: string
          spots_count?: number | null
          tags?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          is_official?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          name?: string
          spots_count?: number | null
          tags?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prefectures: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kana: string
          region: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          name_kana: string
          region: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kana?: string
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      spots: {
        Row: {
          address: string | null
          comments_count: number | null
          created_at: string
          id: string
          images_count: number | null
          latitude: number
          likes_count: number | null
          longitude: number
          map_id: string
          memo: string | null
          name: string
          order_index: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          comments_count?: number | null
          created_at?: string
          id?: string
          images_count?: number | null
          latitude: number
          likes_count?: number | null
          longitude: number
          map_id: string
          memo?: string | null
          name: string
          order_index?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          comments_count?: number | null
          created_at?: string
          id?: string
          images_count?: number | null
          latitude?: number
          likes_count?: number | null
          longitude?: number
          map_id?: string
          memo?: string | null
          name?: string
          order_index?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spots_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          is_subscribed: boolean | null
          subscription_expires_at: string | null
          subscription_started_at: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          is_subscribed?: boolean | null
          subscription_expires_at?: string | null
          subscription_started_at?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          is_subscribed?: boolean | null
          subscription_expires_at?: string | null
          subscription_started_at?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string
          id: string
          map_id: string
          memo: string | null
          updated_at: string
          user_id: string
          visited_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          map_id: string
          memo?: string | null
          updated_at?: string
          user_id: string
          visited_at: string
        }
        Update: {
          created_at?: string
          id?: string
          map_id?: string
          memo?: string | null
          updated_at?: string
          user_id?: string
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
