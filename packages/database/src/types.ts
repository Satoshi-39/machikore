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
      admin_boundaries: {
        Row: {
          admin_level: number | null
          city_id: string | null
          country_id: string | null
          created_at: string | null
          geom: unknown
          id: string
          prefecture_id: string | null
        }
        Insert: {
          admin_level?: number | null
          city_id?: string | null
          country_id?: string | null
          created_at?: string | null
          geom?: unknown
          id?: string
          prefecture_id?: string | null
        }
        Update: {
          admin_level?: number | null
          city_id?: string | null
          country_id?: string | null
          created_at?: string | null
          geom?: unknown
          id?: string
          prefecture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_boundaries_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: true
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_boundaries_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_boundaries_prefecture_id_fkey"
            columns: ["prefecture_id"]
            isOneToOne: false
            referencedRelation: "prefectures"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_public_users_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmark_folders: {
        Row: {
          created_at: string
          folder_type: string
          id: string
          name: string
          order_index: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          folder_type?: string
          id?: string
          name: string
          order_index?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
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
          user_id: string
          user_spot_id: string | null
        }
        Insert: {
          created_at?: string
          folder_id?: string | null
          id?: string
          map_id?: string | null
          user_id: string
          user_spot_id?: string | null
        }
        Update: {
          created_at?: string
          folder_id?: string | null
          id?: string
          map_id?: string | null
          user_id?: string
          user_spot_id?: string | null
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
            foreignKeyName: "bookmarks_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_spot_id_fkey"
            columns: ["user_spot_id"]
            isOneToOne: false
            referencedRelation: "user_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          name_translations: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id: string
          is_active?: boolean
          name: string
          name_translations?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          name_translations?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          name_kana: string | null
          name_translations: Json | null
          prefecture_id: string
          tile_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          latitude?: number | null
          longitude?: number | null
          name: string
          name_kana?: string | null
          name_translations?: Json | null
          prefecture_id: string
          tile_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_kana?: string | null
          name_translations?: Json | null
          prefecture_id?: string
          tile_id?: string | null
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
          {
            foreignKeyName: "collection_maps_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          maps_count: number
          name: string
          order_index: number | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          maps_count?: number
          name: string
          order_index?: number | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          maps_count?: number
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
          reply_to_user_id: string | null
          root_id: string | null
          updated_at: string
          user_id: string
          user_spot_id: string | null
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
          reply_to_user_id?: string | null
          root_id?: string | null
          updated_at?: string
          user_id: string
          user_spot_id?: string | null
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
          reply_to_user_id?: string | null
          root_id?: string | null
          updated_at?: string
          user_id?: string
          user_spot_id?: string | null
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
            foreignKeyName: "comments_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
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
            foreignKeyName: "comments_reply_to_user_id_fkey"
            columns: ["reply_to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_spot_id_fkey"
            columns: ["user_spot_id"]
            isOneToOne: false
            referencedRelation: "user_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      continents: {
        Row: {
          created_at: string
          display_order: number
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana: string | null
          name_translations: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana?: string | null
          name_translations?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          name_kana?: string | null
          name_translations?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          continent_id: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana: string | null
          name_translations: Json | null
          updated_at: string
        }
        Insert: {
          continent_id: string
          created_at?: string
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana?: string | null
          name_translations?: Json | null
          updated_at?: string
        }
        Update: {
          continent_id?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          name_kana?: string | null
          name_translations?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "countries_continent_id_fkey"
            columns: ["continent_id"]
            isOneToOne: false
            referencedRelation: "continents"
            referencedColumns: ["id"]
          },
        ]
      }
      deletion_requests: {
        Row: {
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          email: string | null
          id: string
          reason: string | null
          requested_at: string
          scheduled_at: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          reason?: string | null
          requested_at?: string
          scheduled_at?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          reason?: string | null
          requested_at?: string
          scheduled_at?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      featured_category_maps: {
        Row: {
          category_id: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          map_id: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          map_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          map_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_category_maps_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_category_maps_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_category_maps_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_items: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number
          ends_at: string | null
          id: string
          image_url: string
          is_active: boolean
          link_type: Database["public"]["Enums"]["featured_link_type"]
          link_value: string | null
          magazine_id: string | null
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          ends_at?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          link_type?: Database["public"]["Enums"]["featured_link_type"]
          link_value?: string | null
          magazine_id?: string | null
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          ends_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          link_type?: Database["public"]["Enums"]["featured_link_type"]
          link_value?: string | null
          magazine_id?: string | null
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_items_magazine_id_fkey"
            columns: ["magazine_id"]
            isOneToOne: false
            referencedRelation: "magazines"
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
          updated_at: string
          user_spot_id: string
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
          updated_at?: string
          user_spot_id: string
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
          updated_at?: string
          user_spot_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_user_spot_id_fkey"
            columns: ["user_spot_id"]
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
          user_id: string
          user_spot_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          map_id?: string | null
          user_id: string
          user_spot_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          map_id?: string | null
          user_id?: string
          user_spot_id?: string | null
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
            foreignKeyName: "likes_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_spot_id_fkey"
            columns: ["user_spot_id"]
            isOneToOne: false
            referencedRelation: "user_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      machi: {
        Row: {
          city_id: string | null
          city_name: string | null
          city_name_translations: Json | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          name_kana: string | null
          name_translations: Json | null
          osm_id: number | null
          place_type: string | null
          prefecture_id: string
          prefecture_name: string
          prefecture_name_translations: Json | null
          tile_id: string | null
          updated_at: string
        }
        Insert: {
          city_id?: string | null
          city_name?: string | null
          city_name_translations?: Json | null
          created_at?: string
          id: string
          latitude?: number | null
          longitude?: number | null
          name: string
          name_kana?: string | null
          name_translations?: Json | null
          osm_id?: number | null
          place_type?: string | null
          prefecture_id: string
          prefecture_name: string
          prefecture_name_translations?: Json | null
          tile_id?: string | null
          updated_at?: string
        }
        Update: {
          city_id?: string | null
          city_name?: string | null
          city_name_translations?: Json | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_kana?: string | null
          name_translations?: Json | null
          osm_id?: number | null
          place_type?: string | null
          prefecture_id?: string
          prefecture_name?: string
          prefecture_name_translations?: Json | null
          tile_id?: string | null
          updated_at?: string
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
      magazine_maps: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          magazine_id: string
          map_id: string
          section_id: string | null
          source_tag: string | null
          source_type: Database["public"]["Enums"]["featured_source_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          magazine_id: string
          map_id: string
          section_id?: string | null
          source_tag?: string | null
          source_type?: Database["public"]["Enums"]["featured_source_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          magazine_id?: string
          map_id?: string
          section_id?: string | null
          source_tag?: string | null
          source_type?: Database["public"]["Enums"]["featured_source_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "magazine_maps_magazine_id_fkey"
            columns: ["magazine_id"]
            isOneToOne: false
            referencedRelation: "magazines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magazine_maps_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magazine_maps_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magazine_maps_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "magazine_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      magazine_sections: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          magazine_id: string
          name: string
          thumbnail_url: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          magazine_id: string
          name: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          magazine_id?: string
          name?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "magazine_sections_magazine_id_fkey"
            columns: ["magazine_id"]
            isOneToOne: false
            referencedRelation: "magazines"
            referencedColumns: ["id"]
          },
        ]
      }
      magazines: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          published_at: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          published_at?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          published_at?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      map_labels: {
        Row: {
          color: string
          created_at: string
          id: string
          map_id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          map_id: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          map_id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_labels_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_labels_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
            referencedColumns: ["id"]
          },
        ]
      }
      map_tags: {
        Row: {
          created_at: string
          id: string
          map_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          map_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          map_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_tags_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_tags_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      maps: {
        Row: {
          article_intro: Json | null
          article_outro: Json | null
          bookmarks_count: number
          category_id: string | null
          comments_count: number
          created_at: string
          description: string | null
          id: string
          is_article_public: boolean
          is_official: boolean
          is_public: boolean
          language: string | null
          likes_count: number
          name: string
          show_label_chips: boolean | null
          spots_count: number
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_intro?: Json | null
          article_outro?: Json | null
          bookmarks_count?: number
          category_id?: string | null
          comments_count?: number
          created_at?: string
          description?: string | null
          id?: string
          is_article_public?: boolean
          is_official?: boolean
          is_public?: boolean
          language?: string | null
          likes_count?: number
          name: string
          show_label_chips?: boolean | null
          spots_count?: number
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_intro?: Json | null
          article_outro?: Json | null
          bookmarks_count?: number
          category_id?: string | null
          comments_count?: number
          created_at?: string
          description?: string | null
          id?: string
          is_article_public?: boolean
          is_official?: boolean
          is_public?: boolean
          language?: string | null
          likes_count?: number
          name?: string
          show_label_chips?: boolean | null
          spots_count?: number
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maps_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      master_spot_favorites: {
        Row: {
          created_at: string | null
          id: string
          master_spot_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          master_spot_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          master_spot_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_spot_favorites_master_spot_id_fkey"
            columns: ["master_spot_id"]
            isOneToOne: false
            referencedRelation: "master_spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_spot_favorites_user_id_fkey"
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
          favorites_count: number
          google_formatted_address: Json | null
          google_phone_number: string | null
          google_place_id: string | null
          google_rating: number | null
          google_short_address: Json | null
          google_types: string[] | null
          google_user_rating_count: number | null
          google_website_uri: string | null
          id: string
          latitude: number
          longitude: number
          machi_id: string | null
          name: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          favorites_count?: number
          google_formatted_address?: Json | null
          google_phone_number?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_short_address?: Json | null
          google_types?: string[] | null
          google_user_rating_count?: number | null
          google_website_uri?: string | null
          id?: string
          latitude: number
          longitude: number
          machi_id?: string | null
          name: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          favorites_count?: number
          google_formatted_address?: Json | null
          google_phone_number?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_short_address?: Json | null
          google_types?: string[] | null
          google_user_rating_count?: number | null
          google_website_uri?: string | null
          id?: string
          latitude?: number
          longitude?: number
          machi_id?: string | null
          name?: Json
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
          type: string
          user_id: string
          user_spot_id: string | null
        }
        Insert: {
          actor_id?: string | null
          comment_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          map_id?: string | null
          type: string
          user_id: string
          user_spot_id?: string | null
        }
        Update: {
          actor_id?: string | null
          comment_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          map_id?: string | null
          type?: string
          user_id?: string
          user_spot_id?: string | null
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
            foreignKeyName: "notifications_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_spot_id_fkey"
            columns: ["user_spot_id"]
            isOneToOne: false
            referencedRelation: "user_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      prefectures: {
        Row: {
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana: string | null
          name_translations: Json | null
          region_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana?: string | null
          name_translations?: Json | null
          region_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          name_kana?: string | null
          name_translations?: Json | null
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
          country_id: string
          created_at: string
          display_order: number
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana: string | null
          name_translations: Json | null
          updated_at: string
        }
        Insert: {
          country_id: string
          created_at?: string
          display_order: number
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana?: string | null
          name_translations?: Json | null
          updated_at?: string
        }
        Update: {
          country_id?: string
          created_at?: string
          display_order?: number
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          name_kana?: string | null
          name_translations?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_regions_country"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          id: string
          reason: Database["public"]["Enums"]["report_reason"]
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target_type"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["report_reason"]
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target_type"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["report_reason"]
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["report_target_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean
          machi_id: string
          memo: string | null
          scheduled_at: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          machi_id: string
          memo?: string | null
          scheduled_at: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          machi_id?: string
          memo?: string | null
          scheduled_at?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_machi_id_fkey"
            columns: ["machi_id"]
            isOneToOne: false
            referencedRelation: "machi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      search_analytics: {
        Row: {
          age_group: string | null
          country: string | null
          created_at: string
          first_searched_at: string
          gender: string | null
          id: string
          last_searched_at: string
          prefecture: string | null
          query: string
          search_count: number
          search_type: string
          updated_at: string
        }
        Insert: {
          age_group?: string | null
          country?: string | null
          created_at?: string
          first_searched_at?: string
          gender?: string | null
          id?: string
          last_searched_at?: string
          prefecture?: string | null
          query: string
          search_count?: number
          search_type?: string
          updated_at?: string
        }
        Update: {
          age_group?: string | null
          country?: string | null
          created_at?: string
          first_searched_at?: string
          gender?: string | null
          id?: string
          last_searched_at?: string
          prefecture?: string | null
          query?: string
          search_count?: number
          search_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          created_at: string
          id: string
          query: string
          search_type: string
          searched_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          search_type?: string
          searched_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          search_type?: string
          searched_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      spot_shorts: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          file_size_bytes: number | null
          height: number | null
          id: string
          order_index: number | null
          spot_id: string
          thumbnail_url: string | null
          user_id: string
          video_url: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          order_index?: number | null
          spot_id: string
          thumbnail_url?: string | null
          user_id: string
          video_url: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          order_index?: number | null
          spot_id?: string
          thumbnail_url?: string | null
          user_id?: string
          video_url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spot_shorts_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "user_spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spot_shorts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      spot_tags: {
        Row: {
          created_at: string
          id: string
          tag_id: string
          user_spot_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag_id: string
          user_spot_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag_id?: string
          user_spot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spot_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spot_tags_user_spot_id_fkey"
            columns: ["user_spot_id"]
            isOneToOne: false
            referencedRelation: "user_spots"
            referencedColumns: ["id"]
          },
        ]
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
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          name_translations: Json | null
          slug: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_translations?: Json | null
          slug: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_translations?: Json | null
          slug?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      terms_agreements: {
        Row: {
          agreed_at: string
          created_at: string
          id: string
          ip_address: unknown
          privacy_version_id: string
          terms_version_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          agreed_at?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          privacy_version_id: string
          terms_version_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          agreed_at?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          privacy_version_id?: string
          terms_version_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_agreements_privacy_version_id_fkey"
            columns: ["privacy_version_id"]
            isOneToOne: false
            referencedRelation: "current_terms_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_agreements_privacy_version_id_fkey"
            columns: ["privacy_version_id"]
            isOneToOne: false
            referencedRelation: "terms_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_agreements_terms_version_id_fkey"
            columns: ["terms_version_id"]
            isOneToOne: false
            referencedRelation: "current_terms_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_agreements_terms_version_id_fkey"
            columns: ["terms_version_id"]
            isOneToOne: false
            referencedRelation: "terms_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_agreements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_versions: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          effective_at: string
          id: string
          locale: string
          summary: string | null
          type: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          effective_at: string
          id?: string
          locale?: string
          summary?: string | null
          type: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          effective_at?: string
          id?: string
          locale?: string
          summary?: string | null
          type?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_hubs: {
        Row: {
          city_id: string | null
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana: string | null
          name_translations: Json | null
          network: string | null
          operator: string | null
          osm_id: number | null
          osm_type: string | null
          prefecture_id: string
          ref: string | null
          subtype: string | null
          tile_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          city_id?: string | null
          created_at?: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          name_kana?: string | null
          name_translations?: Json | null
          network?: string | null
          operator?: string | null
          osm_id?: number | null
          osm_type?: string | null
          prefecture_id: string
          ref?: string | null
          subtype?: string | null
          tile_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          city_id?: string | null
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          name_kana?: string | null
          name_translations?: Json | null
          network?: string | null
          operator?: string | null
          osm_id?: number | null
          osm_type?: string | null
          prefecture_id?: string
          ref?: string | null
          subtype?: string | null
          tile_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_hubs_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_hubs_prefecture_id_fkey"
            columns: ["prefecture_id"]
            isOneToOne: false
            referencedRelation: "prefectures"
            referencedColumns: ["id"]
          },
        ]
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
      user_preferences: {
        Row: {
          content_languages: string[] | null
          created_at: string
          locale: string
          preferred_categories: string[] | null
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_languages?: string[] | null
          created_at?: string
          locale?: string
          preferred_categories?: string[] | null
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_languages?: string[] | null
          created_at?: string
          locale?: string
          preferred_categories?: string[] | null
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_spots: {
        Row: {
          article_content: Json | null
          bookmarks_count: number
          city_id: string | null
          comments_count: number
          created_at: string
          description: string
          google_formatted_address: Json | null
          google_short_address: Json | null
          id: string
          images_count: number
          is_public: boolean
          label_id: string | null
          language: string | null
          latitude: number
          likes_count: number
          longitude: number
          machi_id: string | null
          map_id: string
          master_spot_id: string | null
          name: Json | null
          order_index: number
          prefecture_id: string | null
          spot_color: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_content?: Json | null
          bookmarks_count?: number
          city_id?: string | null
          comments_count?: number
          created_at?: string
          description: string
          google_formatted_address?: Json | null
          google_short_address?: Json | null
          id?: string
          images_count?: number
          is_public?: boolean
          label_id?: string | null
          language?: string | null
          latitude: number
          likes_count?: number
          longitude: number
          machi_id?: string | null
          map_id: string
          master_spot_id?: string | null
          name?: Json | null
          order_index?: number
          prefecture_id?: string | null
          spot_color?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_content?: Json | null
          bookmarks_count?: number
          city_id?: string | null
          comments_count?: number
          created_at?: string
          description?: string
          google_formatted_address?: Json | null
          google_short_address?: Json | null
          id?: string
          images_count?: number
          is_public?: boolean
          label_id?: string | null
          language?: string | null
          latitude?: number
          likes_count?: number
          longitude?: number
          machi_id?: string | null
          map_id?: string
          master_spot_id?: string | null
          name?: Json | null
          order_index?: number
          prefecture_id?: string | null
          spot_color?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_spots_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_spots_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "map_labels"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "user_spots_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
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
            foreignKeyName: "user_spots_prefecture_id_fkey"
            columns: ["prefecture_id"]
            isOneToOne: false
            referencedRelation: "prefectures"
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
          age_group: string | null
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          deletion_requested_at: string | null
          display_name: string
          email: string
          gender: string | null
          id: string
          is_premium: boolean | null
          prefecture: string | null
          premium_expires_at: string | null
          premium_started_at: string | null
          push_token: string | null
          push_token_updated_at: string | null
          status: string
          suspended_at: string | null
          suspended_reason: string | null
          updated_at: string
          username: string
        }
        Insert: {
          age_group?: string | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          deletion_requested_at?: string | null
          display_name: string
          email: string
          gender?: string | null
          id?: string
          is_premium?: boolean | null
          prefecture?: string | null
          premium_expires_at?: string | null
          premium_started_at?: string | null
          push_token?: string | null
          push_token_updated_at?: string | null
          status?: string
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          age_group?: string | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          deletion_requested_at?: string | null
          display_name?: string
          email?: string
          gender?: string | null
          id?: string
          is_premium?: boolean | null
          prefecture?: string | null
          premium_expires_at?: string | null
          premium_started_at?: string | null
          push_token?: string | null
          push_token_updated_at?: string | null
          status?: string
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      view_history: {
        Row: {
          created_at: string
          id: string
          map_id: string
          updated_at: string
          user_id: string
          view_count: number
          viewed_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          map_id: string
          updated_at?: string
          user_id: string
          view_count?: number
          viewed_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          map_id?: string
          updated_at?: string
          user_id?: string
          view_count?: number
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "view_history_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_history_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      current_terms_versions: {
        Row: {
          content: string | null
          created_at: string | null
          effective_at: string | null
          id: string | null
          locale: string | null
          summary: string | null
          type: string | null
          version: string | null
        }
        Relationships: []
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      maps_public: {
        Row: {
          article_intro: Json | null
          article_outro: Json | null
          bookmarks_count: number | null
          category_id: string | null
          comments_count: number | null
          created_at: string | null
          description: string | null
          id: string | null
          is_article_public: boolean | null
          is_official: boolean | null
          is_public: boolean | null
          language: string | null
          likes_count: number | null
          name: string | null
          show_label_chips: boolean | null
          spots_count: number | null
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          article_intro?: Json | null
          article_outro?: Json | null
          bookmarks_count?: number | null
          category_id?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_article_public?: boolean | null
          is_official?: boolean | null
          is_public?: boolean | null
          language?: string | null
          likes_count?: number | null
          name?: string | null
          show_label_chips?: boolean | null
          spots_count?: never
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          article_intro?: Json | null
          article_outro?: Json | null
          bookmarks_count?: number | null
          category_id?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_article_public?: boolean | null
          is_official?: boolean | null
          is_public?: boolean | null
          language?: string | null
          likes_count?: number | null
          name?: string | null
          show_label_chips?: boolean | null
          spots_count?: never
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maps_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_latest_agreements: {
        Row: {
          agreed_at: string | null
          id: string | null
          privacy_version: string | null
          privacy_version_id: string | null
          terms_version: string | null
          terms_version_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "terms_agreements_privacy_version_id_fkey"
            columns: ["privacy_version_id"]
            isOneToOne: false
            referencedRelation: "current_terms_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_agreements_privacy_version_id_fkey"
            columns: ["privacy_version_id"]
            isOneToOne: false
            referencedRelation: "terms_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_agreements_terms_version_id_fkey"
            columns: ["terms_version_id"]
            isOneToOne: false
            referencedRelation: "current_terms_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_agreements_terms_version_id_fkey"
            columns: ["terms_version_id"]
            isOneToOne: false
            referencedRelation: "terms_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_agreements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      add_search_history: {
        Args: { p_query: string; p_search_type?: string }
        Returns: string
      }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      check_email_has_pending_deletion: {
        Args: { check_email: string }
        Returns: boolean
      }
      clear_push_token: { Args: never; Returns: undefined }
      clear_search_history: {
        Args: { p_search_type?: string }
        Returns: number
      }
      count_images_in_spot: {
        Args: { p_user_spot_id: string }
        Returns: number
      }
      count_user_spots_in_map: {
        Args: { p_map_id: string; p_user_id: string }
        Returns: number
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      expire_premium_subscriptions: { Args: never; Returns: number }
      generate_feed_ad_slots: {
        Args: { p_block_count: number; p_start_position: number }
        Returns: Database["public"]["CompositeTypes"]["mixed_feed_item"][]
        SetofOptions: {
          from: "*"
          to: "mixed_feed_item"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_city_by_coordinate: {
        Args: { lat: number; lng: number }
        Returns: {
          admin_level: number
          city_id: string
          country_id: string
          prefecture_id: string
        }[]
      }
      get_following_mixed_feed:
        | {
            Args: {
              p_map_cursor?: string
              p_map_limit?: number
              p_show_ads?: boolean
              p_spot_cursor?: string
              p_spot_limit?: number
              p_start_position?: number
              p_user_id: string
            }
            Returns: Database["public"]["CompositeTypes"]["mixed_feed_item"][]
            SetofOptions: {
              from: "*"
              to: "mixed_feed_item"
              isOneToOne: false
              isSetofReturn: true
            }
          }
        | {
            Args: {
              p_enable_shorts?: boolean
              p_map_cursor?: string
              p_map_limit?: number
              p_show_ads?: boolean
              p_spot_cursor?: string
              p_spot_limit?: number
              p_start_position?: number
              p_user_id: string
            }
            Returns: Database["public"]["CompositeTypes"]["mixed_feed_item"][]
            SetofOptions: {
              from: "*"
              to: "mixed_feed_item"
              isOneToOne: false
              isSetofReturn: true
            }
          }
      get_mixed_feed:
        | {
            Args: {
              p_current_user_id?: string
              p_map_cursor?: string
              p_map_limit?: number
              p_show_ads?: boolean
              p_spot_cursor?: string
              p_spot_limit?: number
              p_start_position?: number
            }
            Returns: Database["public"]["CompositeTypes"]["mixed_feed_item"][]
            SetofOptions: {
              from: "*"
              to: "mixed_feed_item"
              isOneToOne: false
              isSetofReturn: true
            }
          }
        | {
            Args: {
              p_current_user_id?: string
              p_enable_shorts?: boolean
              p_map_cursor?: string
              p_map_limit?: number
              p_show_ads?: boolean
              p_spot_cursor?: string
              p_spot_limit?: number
              p_start_position?: number
            }
            Returns: Database["public"]["CompositeTypes"]["mixed_feed_item"][]
            SetofOptions: {
              from: "*"
              to: "mixed_feed_item"
              isOneToOne: false
              isSetofReturn: true
            }
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
      get_popular_searches:
        | {
            Args: {
              p_limit?: number
              p_prefecture?: string
              p_search_type?: string
            }
            Returns: {
              last_searched_at: string
              query: string
              search_count: number
            }[]
          }
        | {
            Args: {
              p_country?: string
              p_limit?: number
              p_prefecture?: string
              p_search_type?: string
            }
            Returns: {
              last_searched_at: string
              query: string
              search_count: number
            }[]
          }
      gettransactionid: { Args: never; Returns: unknown }
      is_admin_user: { Args: { check_user_id: string }; Returns: boolean }
      is_user_premium: { Args: { p_user_id: string }; Returns: boolean }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      record_map_view: { Args: { p_map_id: string }; Returns: undefined }
      search_public_maps: {
        Args: {
          date_range?: string
          region_text?: string
          result_limit?: number
          search_query?: string
          sort_by?: string
          tag_ids_filter?: string[]
        }
        Returns: {
          article_intro: Json
          article_outro: Json
          bookmarks_count: number
          category_id: string
          comments_count: number
          created_at: string
          description: string
          id: string
          is_article_public: boolean
          is_official: boolean
          is_public: boolean
          language: string
          likes_count: number
          name: string
          public_spots_count: number
          show_label_chips: boolean
          spots_count: number
          tags: Json
          thumbnail_url: string
          updated_at: string
          user_avatar_url: string
          user_display_name: string
          user_id: string
          user_username: string
        }[]
      }
      search_public_spots: {
        Args: {
          city_id_filter?: string
          date_range?: string
          prefecture_id_filter?: string
          result_limit?: number
          search_query?: string
          sort_by?: string
          tag_ids_filter?: string[]
        }
        Returns: {
          article_content: Json
          city_id: string
          comments_count: number
          created_at: string
          description: string
          google_formatted_address: Json
          google_short_address: Json
          id: string
          image_urls: string[]
          images_count: number
          is_public: boolean
          label_color: string
          label_id: string
          label_name: string
          latitude: number
          likes_count: number
          longitude: number
          machi_id: string
          map_id: string
          map_name: string
          map_public_spots_count: number
          master_spot_google_formatted_address: Json
          master_spot_google_place_id: string
          master_spot_google_short_address: Json
          master_spot_google_types: string[]
          master_spot_id: string
          master_spot_latitude: number
          master_spot_longitude: number
          master_spot_name: Json
          name: Json
          order_index: number
          prefecture_id: string
          spot_color: string
          tags: Json
          updated_at: string
          user_avatar_url: string
          user_display_name: string
          user_id: string
          user_username: string
        }[]
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
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
      update_user_premium_status: {
        Args: {
          p_expires_at?: string
          p_is_premium: boolean
          p_user_id: string
        }
        Returns: undefined
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      featured_link_type: "url" | "magazine"
      featured_source_type: "tag" | "manual"
      report_reason:
        | "spam"
        | "inappropriate"
        | "harassment"
        | "misinformation"
        | "copyright"
        | "other"
      report_status: "pending" | "reviewing" | "resolved" | "dismissed"
      report_target_type: "map" | "spot" | "user" | "comment"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      mixed_feed_item: {
        item_type: string | null
        item_id: string | null
        created_at: string | null
        feed_position: number | null
        ad_slot: string | null
        spot_display_type: string | null
        map_id: string | null
        map_name: string | null
        map_description: string | null
        map_thumbnail_url: string | null
        map_is_public: boolean | null
        map_is_article_public: boolean | null
        map_spots_count: number | null
        map_likes_count: number | null
        map_bookmarks_count: number | null
        map_comments_count: number | null
        map_category_id: string | null
        map_language: string | null
        map_user_id: string | null
        map_user_username: string | null
        map_user_display_name: string | null
        map_user_avatar_url: string | null
        map_tags: Json | null
        map_is_liked: boolean | null
        map_is_bookmarked: boolean | null
        spot_id: string | null
        spot_user_id: string | null
        spot_map_id: string | null
        spot_master_spot_id: string | null
        spot_machi_id: string | null
        spot_description: string | null
        spot_spot_color: string | null
        spot_label_id: string | null
        spot_name: Json | null
        spot_images_count: number | null
        spot_likes_count: number | null
        spot_bookmarks_count: number | null
        spot_comments_count: number | null
        spot_order_index: number | null
        spot_latitude: number | null
        spot_longitude: number | null
        spot_google_formatted_address: Json | null
        spot_google_short_address: Json | null
        spot_is_public: boolean | null
        spot_article_content: Json | null
        spot_master_spot_name: Json | null
        spot_master_spot_latitude: number | null
        spot_master_spot_longitude: number | null
        spot_master_spot_google_place_id: string | null
        spot_master_spot_google_formatted_address: Json | null
        spot_master_spot_google_short_address: Json | null
        spot_master_spot_google_types: string[] | null
        spot_user_username: string | null
        spot_user_display_name: string | null
        spot_user_avatar_url: string | null
        spot_map_name: string | null
        spot_map_is_public: boolean | null
        spot_image_urls: Json | null
        spot_tags: Json | null
        spot_is_liked: boolean | null
        spot_is_bookmarked: boolean | null
        spot_video_url: string | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
      featured_link_type: ["url", "magazine"],
      featured_source_type: ["tag", "manual"],
      report_reason: [
        "spam",
        "inappropriate",
        "harassment",
        "misinformation",
        "copyright",
        "other",
      ],
      report_status: ["pending", "reviewing", "resolved", "dismissed"],
      report_target_type: ["map", "spot", "user", "comment"],
    },
  },
} as const
