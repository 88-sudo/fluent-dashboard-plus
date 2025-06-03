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
      contacts: {
        Row: {
          CONTACT_DATE: string | null
          CONTACT_ID: number
          CUSTOMER_ID: number | null
          DEPARTMENT: string | null
          EMAIL: string | null
          IS_EXECUTIVE: string | null
          IS_KEYMAN: string | null
          NAME: string | null
          PHONE: string | null
          POSITION: string | null
          PREFERRED_CHANNEL: string | null
        }
        Insert: {
          CONTACT_DATE?: string | null
          CONTACT_ID: number
          CUSTOMER_ID?: number | null
          DEPARTMENT?: string | null
          EMAIL?: string | null
          IS_EXECUTIVE?: string | null
          IS_KEYMAN?: string | null
          NAME?: string | null
          PHONE?: string | null
          POSITION?: string | null
          PREFERRED_CHANNEL?: string | null
        }
        Update: {
          CONTACT_DATE?: string | null
          CONTACT_ID?: number
          CUSTOMER_ID?: number | null
          DEPARTMENT?: string | null
          EMAIL?: string | null
          IS_EXECUTIVE?: string | null
          IS_KEYMAN?: string | null
          NAME?: string | null
          PHONE?: string | null
          POSITION?: string | null
          PREFERRED_CHANNEL?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_CUSTOMER_ID_fkey"
            columns: ["CUSTOMER_ID"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["CUSTOMER_ID"]
          },
        ]
      }
      customers: {
        Row: {
          COMPANY_NAME: string | null
          COMPANY_SIZE: string | null
          COMPANY_TYPE: string | null
          COUNTRY: string | null
          CUSTOMER_ID: number
          INDUSTRY_TYPE: string | null
          REG_DATE: string | null
          REGION: string | null
        }
        Insert: {
          COMPANY_NAME?: string | null
          COMPANY_SIZE?: string | null
          COMPANY_TYPE?: string | null
          COUNTRY?: string | null
          CUSTOMER_ID: number
          INDUSTRY_TYPE?: string | null
          REG_DATE?: string | null
          REGION?: string | null
        }
        Update: {
          COMPANY_NAME?: string | null
          COMPANY_SIZE?: string | null
          COMPANY_TYPE?: string | null
          COUNTRY?: string | null
          CUSTOMER_ID?: number
          INDUSTRY_TYPE?: string | null
          REG_DATE?: string | null
          REGION?: string | null
        }
        Relationships: []
      }
      engagements: {
        Row: {
          customer_id: number | null
          engagement_id: number
          last_active_date: string | null
          newsletter_opens: number | null
          site_visits: string | null
          survey_response: string | null
        }
        Insert: {
          customer_id?: number | null
          engagement_id: number
          last_active_date?: string | null
          newsletter_opens?: number | null
          site_visits?: string | null
          survey_response?: string | null
        }
        Update: {
          customer_id?: number | null
          engagement_id?: number
          last_active_date?: string | null
          newsletter_opens?: number | null
          site_visits?: string | null
          survey_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["CUSTOMER_ID"]
          },
        ]
      }
      issues: {
        Row: {
          DESCRIPTION: string | null
          ISSUE_DATE: string | null
          ISSUE_ID: number
          ISSUE_TYPE: string | null
          ORDER_ID: number | null
          RESOLVED_DATE: string | null
          SEVERITY: string | null
          STATUS: string | null
        }
        Insert: {
          DESCRIPTION?: string | null
          ISSUE_DATE?: string | null
          ISSUE_ID: number
          ISSUE_TYPE?: string | null
          ORDER_ID?: number | null
          RESOLVED_DATE?: string | null
          SEVERITY?: string | null
          STATUS?: string | null
        }
        Update: {
          DESCRIPTION?: string | null
          ISSUE_DATE?: string | null
          ISSUE_ID?: number
          ISSUE_TYPE?: string | null
          ORDER_ID?: number | null
          RESOLVED_DATE?: string | null
          SEVERITY?: string | null
          STATUS?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          AMOUNT: number | null
          CONTACT_ID: number | null
          COST: number | null
          DELIVERY_STATUS: string | null
          MARGIN_RATE: number | null
          ORDER_DATE: string | null
          ORDER_ID: number
          PAYMENT_STATUS: string | null
          PRODUCT_ID: string | null
          QUANTITY: number | null
        }
        Insert: {
          AMOUNT?: number | null
          CONTACT_ID?: number | null
          COST?: number | null
          DELIVERY_STATUS?: string | null
          MARGIN_RATE?: number | null
          ORDER_DATE?: string | null
          ORDER_ID: number
          PAYMENT_STATUS?: string | null
          PRODUCT_ID?: string | null
          QUANTITY?: number | null
        }
        Update: {
          AMOUNT?: number | null
          CONTACT_ID?: number | null
          COST?: number | null
          DELIVERY_STATUS?: string | null
          MARGIN_RATE?: number | null
          ORDER_DATE?: string | null
          ORDER_ID?: number
          PAYMENT_STATUS?: string | null
          PRODUCT_ID?: string | null
          QUANTITY?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_CONTACT_ID_fkey"
            columns: ["CONTACT_ID"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["CONTACT_ID"]
          },
          {
            foreignKeyName: "orders_PRODUCT_ID_fkey"
            columns: ["PRODUCT_ID"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["PRODUCT_ID"]
          },
        ]
      }
      predictions: {
        Row: {
          CONTACT_ID: number | null
          PREDICTED_DATE: string | null
          PREDICTED_PRODUCT: string | null
          PREDICTED_QUANTITY: number | null
          PREDICTION_ID: number
        }
        Insert: {
          CONTACT_ID?: number | null
          PREDICTED_DATE?: string | null
          PREDICTED_PRODUCT?: string | null
          PREDICTED_QUANTITY?: number | null
          PREDICTION_ID: number
        }
        Update: {
          CONTACT_ID?: number | null
          PREDICTED_DATE?: string | null
          PREDICTED_PRODUCT?: string | null
          PREDICTED_QUANTITY?: number | null
          PREDICTION_ID?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          CATEGORY: string | null
          INCH: number | null
          MODEL: string | null
          NOTES: string | null
          ORIGINALPRICE: number | null
          PRODUCT_ID: string
          SELLINGPRICE: number | null
        }
        Insert: {
          CATEGORY?: string | null
          INCH?: number | null
          MODEL?: string | null
          NOTES?: string | null
          ORIGINALPRICE?: number | null
          PRODUCT_ID: string
          SELLINGPRICE?: number | null
        }
        Update: {
          CATEGORY?: string | null
          INCH?: number | null
          MODEL?: string | null
          NOTES?: string | null
          ORIGINALPRICE?: number | null
          PRODUCT_ID?: string
          SELLINGPRICE?: number | null
        }
        Relationships: []
      }
      sales_activities: {
        Row: {
          ACTIVITY_DATE: string | null
          ACTIVITY_DETAILS: string | null
          ACTIVITY_ID: number
          ACTIVITY_TYPE: string | null
          CONTACT_ID: number | null
          CUSTOMER_ID: number | null
          OUTCOME: string | null
        }
        Insert: {
          ACTIVITY_DATE?: string | null
          ACTIVITY_DETAILS?: string | null
          ACTIVITY_ID: number
          ACTIVITY_TYPE?: string | null
          CONTACT_ID?: number | null
          CUSTOMER_ID?: number | null
          OUTCOME?: string | null
        }
        Update: {
          ACTIVITY_DATE?: string | null
          ACTIVITY_DETAILS?: string | null
          ACTIVITY_ID?: number
          ACTIVITY_TYPE?: string | null
          CONTACT_ID?: number | null
          CUSTOMER_ID?: number | null
          OUTCOME?: string | null
        }
        Relationships: []
      }
      segments: {
        Row: {
          arr: number | null
          clv: number | null
          company_size: string | null
          CONTACT_ID: number | null
          high_risk_probability: number | null
          predicted_risk_level: string | null
          segment_label: string | null
        }
        Insert: {
          arr?: number | null
          clv?: number | null
          company_size?: string | null
          CONTACT_ID?: number | null
          high_risk_probability?: number | null
          predicted_risk_level?: string | null
          segment_label?: string | null
        }
        Update: {
          arr?: number | null
          clv?: number | null
          company_size?: string | null
          CONTACT_ID?: number | null
          high_risk_probability?: number | null
          predicted_risk_level?: string | null
          segment_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "segments_CONTACT_ID_fkey"
            columns: ["CONTACT_ID"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["CONTACT_ID"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
