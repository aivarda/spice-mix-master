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
      inventory_status: {
        Row: {
          created_at: string
          id: string
          initial_qty: number
          month: string
          produced: number
          product_id: string
          remaining: number
          sold: number
          status: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          initial_qty?: number
          month: string
          produced?: number
          product_id: string
          remaining?: number
          sold?: number
          status?: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          initial_qty?: number
          month?: string
          produced?: number
          product_id?: string
          remaining?: number
          sold?: number
          status?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_status_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      production_batches: {
        Row: {
          batch_id: string
          created_at: string
          end_date: string | null
          id: string
          planned_qty: number
          product_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          planned_qty: number
          product_id: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          planned_qty?: number
          product_id?: string
          start_date?: string
          status?: string
          updated_at?: string
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
      products: {
        Row: {
          category: string
          created_at: string
          id: string
          min_stock: number
          name: string
          quantity: number
          sku: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          min_stock?: number
          name: string
          quantity?: number
          sku: string
          unit_price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          min_stock?: number
          name?: string
          quantity?: number
          sku?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      raw_materials: {
        Row: {
          category: string
          code: string
          created_at: string
          current_stock: number
          id: string
          min_stock: number
          name: string
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          current_stock?: number
          id?: string
          min_stock?: number
          name: string
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          current_stock?: number
          id?: string
          min_stock?: number
          name?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          channel_id: string | null
          created_at: string
          date: string
          id: string
          invoice_no: string | null
          order_no: string | null
          product_id: string
          quantity: number
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          channel_id?: string | null
          created_at?: string
          date?: string
          id?: string
          invoice_no?: string | null
          order_no?: string | null
          product_id: string
          quantity: number
          total_amount: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          channel_id?: string | null
          created_at?: string
          date?: string
          id?: string
          invoice_no?: string | null
          order_no?: string | null
          product_id?: string
          quantity?: number
          total_amount?: number
          unit_price?: number
          updated_at?: string
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
          contact_person: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          aadhaar: string | null
          address: string | null
          blood_group: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          staff_id: string
          updated_at: string
        }
        Insert: {
          aadhaar?: string | null
          address?: string | null
          blood_group?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          staff_id: string
          updated_at?: string
        }
        Update: {
          aadhaar?: string | null
          address?: string | null
          blood_group?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          staff_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      stock_purchases: {
        Row: {
          created_at: string
          date: string
          id: string
          po_invoice: string | null
          quantity: number
          raw_material_id: string
          total_amount: number
          unit_price: number
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          po_invoice?: string | null
          quantity: number
          raw_material_id: string
          total_amount: number
          unit_price: number
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          po_invoice?: string | null
          quantity?: number
          raw_material_id?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_purchases_raw_material_id_fkey"
            columns: ["raw_material_id"]
            isOneToOne: false
            referencedRelation: "raw_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_purchases_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_status: {
        Row: {
          adjustment: number
          closing_balance: number
          created_at: string
          id: string
          month: string
          opening_balance: number
          purchases: number
          raw_material_id: string
          status: string
          updated_at: string
          utilized: number
          year: number
        }
        Insert: {
          adjustment?: number
          closing_balance?: number
          created_at?: string
          id?: string
          month: string
          opening_balance?: number
          purchases?: number
          raw_material_id: string
          status?: string
          updated_at?: string
          utilized?: number
          year: number
        }
        Update: {
          adjustment?: number
          closing_balance?: number
          created_at?: string
          id?: string
          month?: string
          opening_balance?: number
          purchases?: number
          raw_material_id?: string
          status?: string
          updated_at?: string
          utilized?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_status_raw_material_id_fkey"
            columns: ["raw_material_id"]
            isOneToOne: false
            referencedRelation: "raw_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_qty: number
          created_at: string
          date_assigned: string
          date_completed: string | null
          id: string
          process: string
          raw_material_id: string
          staff_id: string | null
          task_description: string | null
          task_id: string
          updated_at: string
          wastage_qty: number | null
        }
        Insert: {
          assigned_qty: number
          created_at?: string
          date_assigned?: string
          date_completed?: string | null
          id?: string
          process: string
          raw_material_id: string
          staff_id?: string | null
          task_description?: string | null
          task_id: string
          updated_at?: string
          wastage_qty?: number | null
        }
        Update: {
          assigned_qty?: number
          created_at?: string
          date_assigned?: string
          date_completed?: string | null
          id?: string
          process?: string
          raw_material_id?: string
          staff_id?: string | null
          task_description?: string | null
          task_id?: string
          updated_at?: string
          wastage_qty?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_raw_material_id_fkey"
            columns: ["raw_material_id"]
            isOneToOne: false
            referencedRelation: "raw_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          contact_person: string | null
          created_at: string
          email: string | null
          gstin: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gstin?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gstin?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recalculate_stock_status: {
        Args: {
          month_param: string
          year_param: number
        }
        Returns: undefined
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
