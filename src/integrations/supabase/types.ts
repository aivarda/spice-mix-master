export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      inventory_movements: {
        Row: {
          created_at: string | null
          id: string
          movement_type: string
          notes: string | null
          product_id: string | null
          quantity: number
          reference_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          movement_type: string
          notes?: string | null
          product_id?: string | null
          quantity: number
          reference_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          movement_type?: string
          notes?: string | null
          product_id?: string | null
          quantity?: number
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      production_batches: {
        Row: {
          batch_number: string
          completion_date: string | null
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          start_date: string | null
          status: string
          updated_at: string | null
          wastage: number | null
        }
        Insert: {
          batch_number: string
          completion_date?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          start_date?: string | null
          status?: string
          updated_at?: string | null
          wastage?: number | null
        }
        Update: {
          batch_number?: string
          completion_date?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          start_date?: string | null
          status?: string
          updated_at?: string | null
          wastage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "production_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      production_status: {
        Row: {
          adjustments: number
          assigned: number
          category: string
          closing: number
          completed: number
          created_at: string | null
          date: string
          id: string
          min_level: number
          month: string
          name: string
          opening: number
          pending: number
          process: string
          process_stage: string
          status: string
          updated_at: string | null
          wastage: number
        }
        Insert: {
          adjustments?: number
          assigned?: number
          category: string
          closing?: number
          completed?: number
          created_at?: string | null
          date: string
          id?: string
          min_level?: number
          month: string
          name: string
          opening?: number
          pending?: number
          process: string
          process_stage: string
          status?: string
          updated_at?: string | null
          wastage?: number
        }
        Update: {
          adjustments?: number
          assigned?: number
          category?: string
          closing?: number
          completed?: number
          created_at?: string | null
          date?: string
          id?: string
          min_level?: number
          month?: string
          name?: string
          opening?: number
          pending?: number
          process?: string
          process_stage?: string
          status?: string
          updated_at?: string | null
          wastage?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          current_stock: number
          id: string
          min_stock: number
          name: string
          sku: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          current_stock?: number
          id?: string
          min_stock?: number
          name: string
          sku: string
          unit_price?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          current_stock?: number
          id?: string
          min_stock?: number
          name?: string
          sku?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      raw_materials: {
        Row: {
          category: string
          code: string
          created_at: string | null
          current_stock: number
          description: string | null
          id: string
          last_purchase_date: string | null
          min_stock_level: number
          name: string
          status: string
          unit: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          current_stock?: number
          description?: string | null
          id?: string
          last_purchase_date?: string | null
          min_stock_level?: number
          name: string
          status?: string
          unit?: string
          unit_price?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          current_stock?: number
          description?: string | null
          id?: string
          last_purchase_date?: string | null
          min_stock_level?: number
          name?: string
          status?: string
          unit?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          channel_id: string | null
          created_at: string | null
          id: string
          invoice_number: string
          order_number: string
          product_id: string | null
          quantity: number
          sale_date: string | null
          total_amount: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          id?: string
          invoice_number: string
          order_number: string
          product_id?: string | null
          quantity: number
          sale_date?: string | null
          total_amount: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          id?: string
          invoice_number?: string
          order_number?: string
          product_id?: string | null
          quantity?: number
          sale_date?: string | null
          total_amount?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "sales_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_channels: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          aadhaar: string
          address: string
          blood_group: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          staff_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          aadhaar: string
          address: string
          blood_group?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          staff_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          aadhaar?: string
          address?: string
          blood_group?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          staff_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stock_status: {
        Row: {
          adj_plus: number
          category: string
          closing_bal: number
          created_at: string | null
          date: string
          id: string
          min_level: number
          name: string
          opening_bal: number
          purchases: number
          status: string
          updated_at: string | null
          utilised: number
        }
        Insert: {
          adj_plus?: number
          category: string
          closing_bal?: number
          created_at?: string | null
          date: string
          id?: string
          min_level?: number
          name: string
          opening_bal?: number
          purchases?: number
          status?: string
          updated_at?: string | null
          utilised?: number
        }
        Update: {
          adj_plus?: number
          category?: string
          closing_bal?: number
          created_at?: string | null
          date?: string
          id?: string
          min_level?: number
          name?: string
          opening_bal?: number
          purchases?: number
          status?: string
          updated_at?: string | null
          utilised?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
