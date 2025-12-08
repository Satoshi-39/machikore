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
      bookmark_folders: {
        Row: {
          color: string | null
          created_at: string
          folder_type: string
          id: string
          name: string
          order_index: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          folder_type?: string
          id?: string
          name: string
          order_index?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          folder_type?: string
          id?: string
          name?: string
          order_index?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          folder_id: string | null
          id: string
          map_id: string | null
          spot_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          folder_id?: string | null
          id?: string
          map_id?: string | null
          spot_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          folder_id?: string | null
          id?: string
          map_id?: string | null
          spot_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "bookmark_folders"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "user_spots"
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
          country_code: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          name_kana: string
          name_translations: Json | null
          prefecture_id: string
          type: string
          updated_at: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          id: string
          latitude?: number | null
          longitude?: number | null
          name: string
          name_kana: string
          name_translations?: Json | null
          prefecture_id: string
          type: string
          updated_at?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_kana?: string
          name_translations?: Json | null
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
      collection_maps: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          map_id: string
          order_index: number | null
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          map_id: string
          order_index?: number | null
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          map_id?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_maps_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_maps_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          maps_count: number | null
          name: string
          order_index: number | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          maps_count?: number | null
          name: string
          order_index?: number | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          maps_count?: number | null
          name?: string
          order_index?: number | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          depth: number
          id: string
          likes_count: number
          map_id: string | null
          parent_id: string | null
          replies_count: number
          root_id: string | null
          spot_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          depth?: number
          id?: string
          likes_count?: number
          map_id?: string | null
          parent_id?: string | null
          replies_count?: number
          root_id?: string | null
          spot_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          depth?: number
          id?: string
          likes_count?: number
          map_id?: string | null
          parent_id?: string | null
          replies_count?: number
          root_id?: string | null
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
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_root_id_fkey"
            columns: ["root_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "user_spots"
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
            referencedRelation: "user_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          map_id: string | null
          master_spot_id: string | null
          spot_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          map_id?: string | null
          master_spot_id?: string | null
          spot_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          map_id?: string | null
          master_spot_id?: string | null
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
            foreignKeyName: "likes_master_spot_id_fkey"
            columns: ["master_spot_id"]
            isOneToOne: false
            referencedRelation: "master_spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "user_spots"
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
          city_name: string | null
          city_name_translations: Json | null
          country_code: string | null
          created_at: string | null
          id: string
          latitude: number
          lines: Json | null
          longitude: number
          name: string
          name_kana: string | null
          name_translations: Json | null
          prefecture_id: string
          prefecture_name: string | null
          prefecture_name_translations: Json | null
          updated_at: string | null
        }
        Insert: {
          city_id?: string | null
          city_name?: string | null
          city_name_translations?: Json | null
          country_code?: string | null
          created_at?: string | null
          id: string
          latitude: number
          lines?: Json | null
          longitude: number
          name: string
          name_kana?: string | null
          name_translations?: Json | null
          prefecture_id: string
          prefecture_name?: string | null
          prefecture_name_translations?: Json | null
          updated_at?: string | null
        }
        Update: {
          city_id?: string | null
          city_name?: string | null
          city_name_translations?: Json | null
          country_code?: string | null
          created_at?: string | null
          id?: string
          latitude?: number
          lines?: Json | null
          longitude?: number
          name?: string
          name_kana?: string | null
          name_translations?: Json | null
          prefecture_id?: string
          prefecture_name?: string | null
          prefecture_name_translations?: Json | null
          updated_at?: string | null
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
          comments_count: number | null
          created_at: string
          description: string | null
          id: string
          is_article_public: boolean | null
          is_default: boolean | null
          is_official: boolean | null
          is_public: boolean | null
          likes_count: number | null
          name: string
          spots_count: number | null
          tags: Json | null
          theme_color: string
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          comments_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_article_public?: boolean | null
          is_default?: boolean | null
          is_official?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          name: string
          spots_count?: number | null
          tags?: Json | null
          theme_color?: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          comments_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_article_public?: boolean | null
          is_default?: boolean | null
          is_official?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          name?: string
          spots_count?: number | null
          tags?: Json | null
          theme_color?: string
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
      master_spots: {
        Row: {
          created_at: string
          google_formatted_address: string | null
          google_phone_number: string | null
          google_place_id: string | null
          google_rating: number | null
          google_types: string[] | null
          google_user_rating_count: number | null
          google_website_uri: string | null
          id: string
          latitude: number
          likes_count: number | null
          longitude: number
          machi_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          google_formatted_address?: string | null
          google_phone_number?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_types?: string[] | null
          google_user_rating_count?: number | null
          google_website_uri?: string | null
          id?: string
          latitude: number
          likes_count?: number | null
          longitude: number
          machi_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          google_formatted_address?: string | null
          google_phone_number?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_types?: string[] | null
          google_user_rating_count?: number | null
          google_website_uri?: string | null
          id?: string
          latitude?: number
          likes_count?: number | null
          longitude?: number
          machi_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_spots_machi_id_fkey"
            columns: ["machi_id"]
            isOneToOne: false
            referencedRelation: "machi"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          comment_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          map_id: string | null
          spot_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          comment_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          map_id?: string | null
          spot_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          comment_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          map_id?: string | null
          spot_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "user_spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
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
          latitude: number | null
          longitude: number | null
          name: string
          name_kana: string
          region_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          latitude?: number | null
          longitude?: number | null
          name: string
          name_kana: string
          region_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_kana?: string
          region_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prefectures_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          name_kana: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order: number
          id: string
          name: string
          name_kana: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          name_kana?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_announcement_reads: {
        Row: {
          announcement_id: string
          id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          announcement_id: string
          id?: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          announcement_id?: string
          id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "system_announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_announcement_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_announcements: {
        Row: {
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          published_at: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_notification_settings: {
        Row: {
          comment_enabled: boolean
          created_at: string
          email_comment_enabled: boolean
          email_enabled: boolean
          email_follow_enabled: boolean
          email_like_enabled: boolean
          email_system_enabled: boolean
          follow_enabled: boolean
          id: string
          like_enabled: boolean
          push_enabled: boolean
          system_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_enabled?: boolean
          created_at?: string
          email_comment_enabled?: boolean
          email_enabled?: boolean
          email_follow_enabled?: boolean
          email_like_enabled?: boolean
          email_system_enabled?: boolean
          follow_enabled?: boolean
          id?: string
          like_enabled?: boolean
          push_enabled?: boolean
          system_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_enabled?: boolean
          created_at?: string
          email_comment_enabled?: boolean
          email_enabled?: boolean
          email_follow_enabled?: boolean
          email_like_enabled?: boolean
          email_system_enabled?: boolean
          follow_enabled?: boolean
          id?: string
          like_enabled?: boolean
          push_enabled?: boolean
          system_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_spots: {
        Row: {
          address: string | null
          article_content: string | null
          comments_count: number | null
          created_at: string
          custom_name: string
          description: string | null
          id: string
          images_count: number | null
          latitude: number | null
          likes_count: number | null
          longitude: number | null
          machi_id: string
          map_id: string
          master_spot_id: string | null
          order_index: number | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          article_content?: string | null
          comments_count?: number | null
          created_at?: string
          custom_name: string
          description?: string | null
          id?: string
          images_count?: number | null
          latitude?: number | null
          likes_count?: number | null
          longitude?: number | null
          machi_id: string
          map_id: string
          master_spot_id?: string | null
          order_index?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          article_content?: string | null
          comments_count?: number | null
          created_at?: string
          custom_name?: string
          description?: string | null
          id?: string
          images_count?: number | null
          latitude?: number | null
          likes_count?: number | null
          longitude?: number | null
          machi_id?: string
          map_id?: string
          master_spot_id?: string | null
          order_index?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_spots_machi_id_fkey"
            columns: ["machi_id"]
            isOneToOne: false
            referencedRelation: "machi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_spots_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_spots_master_spot_id_fkey"
            columns: ["master_spot_id"]
            isOneToOne: false
            referencedRelation: "master_spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_spots_user_id_fkey"
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
          push_token: string | null
          push_token_updated_at: string | null
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
          push_token?: string | null
          push_token_updated_at?: string | null
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
          push_token?: string | null
          push_token_updated_at?: string | null
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
          machi_id: string
          updated_at: string
          user_id: string
          visited_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          machi_id: string
          updated_at?: string
          user_id: string
          visited_at: string
        }
        Update: {
          created_at?: string
          id?: string
          machi_id?: string
          updated_at?: string
          user_id?: string
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_machi_id_fkey"
            columns: ["machi_id"]
            isOneToOne: false
            referencedRelation: "machi"
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
      clear_push_token: { Args: never; Returns: undefined }
      decrement_map_comments_count: {
        Args: { map_id: string }
        Returns: undefined
      }
      decrement_map_likes_count: {
        Args: { map_id: string }
        Returns: undefined
      }
      decrement_map_spots_count: {
        Args: { map_id: string }
        Returns: undefined
      }
      decrement_master_spot_likes_count: {
        Args: { p_master_spot_id: string }
        Returns: undefined
      }
      decrement_spot_comments_count: {
        Args: { spot_id: string }
        Returns: undefined
      }
      decrement_spot_likes_count: {
        Args: { spot_id: string }
        Returns: undefined
      }
      get_notification_settings: {
        Args: never
        Returns: {
          comment_enabled: boolean
          created_at: string
          email_comment_enabled: boolean
          email_enabled: boolean
          email_follow_enabled: boolean
          email_like_enabled: boolean
          email_system_enabled: boolean
          follow_enabled: boolean
          id: string
          like_enabled: boolean
          push_enabled: boolean
          system_enabled: boolean
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_notification_settings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      increment_map_comments_count: {
        Args: { map_id: string }
        Returns: undefined
      }
      increment_map_likes_count: {
        Args: { map_id: string }
        Returns: undefined
      }
      increment_map_spots_count: {
        Args: { map_id: string }
        Returns: undefined
      }
      increment_master_spot_likes_count: {
        Args: { p_master_spot_id: string }
        Returns: undefined
      }
      increment_spot_comments_count: {
        Args: { spot_id: string }
        Returns: undefined
      }
      increment_spot_likes_count: {
        Args: { spot_id: string }
        Returns: undefined
      }
      update_notification_settings: {
        Args: {
          p_comment_enabled?: boolean
          p_email_comment_enabled?: boolean
          p_email_enabled?: boolean
          p_email_follow_enabled?: boolean
          p_email_like_enabled?: boolean
          p_email_system_enabled?: boolean
          p_follow_enabled?: boolean
          p_like_enabled?: boolean
          p_push_enabled?: boolean
          p_system_enabled?: boolean
        }
        Returns: {
          comment_enabled: boolean
          created_at: string
          email_comment_enabled: boolean
          email_enabled: boolean
          email_follow_enabled: boolean
          email_like_enabled: boolean
          email_system_enabled: boolean
          follow_enabled: boolean
          id: string
          like_enabled: boolean
          push_enabled: boolean
          system_enabled: boolean
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_notification_settings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_push_token: { Args: { token: string }; Returns: undefined }
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
