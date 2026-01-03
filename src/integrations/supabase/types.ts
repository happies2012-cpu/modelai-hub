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
      agencies: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["app_status"]
          updated_at: string
          user_id: string
          verified: boolean
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["app_status"]
          updated_at?: string
          user_id: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["app_status"]
          updated_at?: string
          user_id?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: []
      }
      analytics_views: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          viewer_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          viewer_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          viewer_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          agency_id: string | null
          amount: number
          booking_date: string
          client_id: string
          created_at: string
          currency: string
          end_time: string
          event_id: string | null
          id: string
          model_id: string
          notes: string | null
          start_time: string
          status: Database["public"]["Enums"]["app_status"]
          updated_at: string
        }
        Insert: {
          agency_id?: string | null
          amount: number
          booking_date: string
          client_id: string
          created_at?: string
          currency?: string
          end_time: string
          event_id?: string | null
          id?: string
          model_id: string
          notes?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["app_status"]
          updated_at?: string
        }
        Update: {
          agency_id?: string | null
          amount?: number
          booking_date?: string
          client_id?: string
          created_at?: string
          currency?: string
          end_time?: string
          event_id?: string | null
          id?: string
          model_id?: string
          notes?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["app_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          brand_name: string | null
          budget_max: number | null
          budget_min: number | null
          campaign_type: string | null
          city: string | null
          client_id: string | null
          country: string | null
          created_at: string
          description: string | null
          end_date: string | null
          featured: boolean
          id: string
          images: string[] | null
          location: string | null
          slug: string
          start_date: string | null
          status: Database["public"]["Enums"]["app_status"]
          title: string
          updated_at: string
        }
        Insert: {
          brand_name?: string | null
          budget_max?: number | null
          budget_min?: number | null
          campaign_type?: string | null
          city?: string | null
          client_id?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          featured?: boolean
          id?: string
          images?: string[] | null
          location?: string | null
          slug: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["app_status"]
          title: string
          updated_at?: string
        }
        Update: {
          brand_name?: string | null
          budget_max?: number | null
          budget_min?: number | null
          campaign_type?: string | null
          city?: string | null
          client_id?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          featured?: boolean
          id?: string
          images?: string[] | null
          location?: string | null
          slug?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["app_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      collection_items: {
        Row: {
          added_at: string | null
          collection_id: string
          id: string
          model_id: string
        }
        Insert: {
          added_at?: string | null
          collection_id: string
          id?: string
          model_id: string
        }
        Update: {
          added_at?: string | null
          collection_id?: string
          id?: string
          model_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          agency_commission: number | null
          agency_id: string | null
          booking_id: string | null
          created_at: string | null
          id: string
          model_id: string | null
          model_payout: number
          paid_at: string | null
          platform_fee: number
          status: string | null
          total_amount: number
        }
        Insert: {
          agency_commission?: number | null
          agency_id?: string | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          model_id?: string | null
          model_payout: number
          paid_at?: string | null
          platform_fee?: number
          status?: string | null
          total_amount: number
        }
        Update: {
          agency_commission?: number | null
          agency_id?: string | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          model_id?: string | null
          model_payout?: number
          paid_at?: string | null
          platform_fee?: number
          status?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "commissions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          agency_id: string | null
          amount: number
          booking_id: string | null
          client_id: string
          created_at: string | null
          duration_days: number | null
          id: string
          model_id: string
          signed_at: string | null
          signed_by_client: boolean | null
          signed_by_model: boolean | null
          status: string | null
          terms: string | null
          updated_at: string | null
          usage_rights: string | null
        }
        Insert: {
          agency_id?: string | null
          amount: number
          booking_id?: string | null
          client_id: string
          created_at?: string | null
          duration_days?: number | null
          id?: string
          model_id: string
          signed_at?: string | null
          signed_by_client?: boolean | null
          signed_by_model?: boolean | null
          status?: string | null
          terms?: string | null
          updated_at?: string | null
          usage_rights?: string | null
        }
        Update: {
          agency_id?: string | null
          amount?: number
          booking_id?: string | null
          client_id?: string
          created_at?: string | null
          duration_days?: number | null
          id?: string
          model_id?: string
          signed_at?: string | null
          signed_by_client?: boolean | null
          signed_by_model?: boolean | null
          status?: string | null
          terms?: string | null
          updated_at?: string | null
          usage_rights?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          event_type: string | null
          featured: boolean
          id: string
          location: string | null
          required_models: number | null
          start_date: string
          status: Database["public"]["Enums"]["app_status"]
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          event_type?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          required_models?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["app_status"]
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          event_type?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          required_models?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["app_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          model_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          model_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          model_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          subject: string | null
          typing_status: boolean | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          subject?: string | null
          typing_status?: boolean | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          subject?: string | null
          typing_status?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      model_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      model_category_mapping: {
        Row: {
          category_id: string
          created_at: string
          id: string
          model_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          model_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          model_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_category_mapping_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "model_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_category_mapping_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          agency_id: string | null
          available: boolean
          bust_cm: number | null
          created_at: string
          date_of_birth: string | null
          ethnicity: string | null
          experience_years: number | null
          eye_color: string | null
          featured: boolean
          full_name: string
          gender: string | null
          hair_color: string | null
          height_cm: number | null
          hips_cm: number | null
          id: string
          rating: number | null
          shoe_size: string | null
          stage_name: string | null
          status: Database["public"]["Enums"]["app_status"]
          total_bookings: number | null
          updated_at: string
          user_id: string
          verified: boolean
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          agency_id?: string | null
          available?: boolean
          bust_cm?: number | null
          created_at?: string
          date_of_birth?: string | null
          ethnicity?: string | null
          experience_years?: number | null
          eye_color?: string | null
          featured?: boolean
          full_name: string
          gender?: string | null
          hair_color?: string | null
          height_cm?: number | null
          hips_cm?: number | null
          id?: string
          rating?: number | null
          shoe_size?: string | null
          stage_name?: string | null
          status?: Database["public"]["Enums"]["app_status"]
          total_bookings?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          agency_id?: string | null
          available?: boolean
          bust_cm?: number | null
          created_at?: string
          date_of_birth?: string | null
          ethnicity?: string | null
          experience_years?: number | null
          eye_color?: string | null
          featured?: boolean
          full_name?: string
          gender?: string | null
          hair_color?: string | null
          height_cm?: number | null
          hips_cm?: number | null
          id?: string
          rating?: number | null
          shoe_size?: string | null
          stage_name?: string | null
          status?: Database["public"]["Enums"]["app_status"]
          total_bookings?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "models_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string
          id: string
          metadata: Json | null
          payment_method: string | null
          payu_hash: string | null
          payu_txn_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payu_hash?: string | null
          payu_txn_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payu_hash?: string | null
          payu_txn_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_images: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_cover: boolean
          model_id: string
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_cover?: boolean
          model_id: string
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_cover?: boolean
          model_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          instagram: string | null
          location: string | null
          phone: string | null
          twitter: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          instagram?: string | null
          location?: string | null
          phone?: string | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          phone?: string | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "agency" | "model" | "brand"
      app_status:
        | "pending"
        | "active"
        | "inactive"
        | "suspended"
        | "approved"
        | "rejected"
      payment_status: "pending" | "completed" | "failed" | "refunded"
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
      app_role: ["super_admin", "admin", "agency", "model", "brand"],
      app_status: [
        "pending",
        "active",
        "inactive",
        "suspended",
        "approved",
        "rejected",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
    },
  },
} as const
