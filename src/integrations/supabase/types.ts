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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          category: string
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          phone_primary: string | null
          phone_secondary: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone_primary?: string | null
          phone_secondary?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone_primary?: string | null
          phone_secondary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          country: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          mobile: string | null
          name: string
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          mobile?: string | null
          name: string
        }
        Update: {
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          mobile?: string | null
          name?: string
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          content: string | null
          created_at: string
          id: string
          section_key: string
          section_type: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          section_key: string
          section_type?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          section_key?: string
          section_type?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          role: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          role?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          role?: string | null
          username?: string | null
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          canonical_url: string | null
          created_at: string
          description: string | null
          id: string
          json_ld: Json | null
          keywords: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          og_type: string | null
          page_slug: string | null
          page_type: string
          robots_follow: boolean | null
          robots_index: boolean | null
          title: string | null
          twitter_card: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          json_ld?: Json | null
          keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          page_slug?: string | null
          page_type: string
          robots_follow?: boolean | null
          robots_index?: boolean | null
          title?: string | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          json_ld?: Json | null
          keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          page_slug?: string | null
          page_type?: string
          robots_follow?: boolean | null
          robots_index?: boolean | null
          title?: string | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skills_entries: {
        Row: {
          color_class: string
          created_at: string
          icon_name: string
          id: string
          skills: string[]
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          color_class: string
          created_at?: string
          icon_name: string
          id?: string
          skills: string[]
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          color_class?: string
          created_at?: string
          icon_name?: string
          id?: string
          skills?: string[]
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          icon: string
          id: string
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      stats_entries: {
        Row: {
          color_class: string
          created_at: string
          description: string
          icon_name: string
          id: string
          label: string
          number: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color_class: string
          created_at?: string
          description: string
          icon_name: string
          id?: string
          label: string
          number: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color_class?: string
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          label?: string
          number?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      work_experiences: {
        Row: {
          achievements: string[]
          company: string
          created_at: string
          description: string | null
          id: string
          period: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          achievements?: string[]
          company: string
          created_at?: string
          description?: string | null
          id?: string
          period: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          achievements?: string[]
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          period?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_specific_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
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
