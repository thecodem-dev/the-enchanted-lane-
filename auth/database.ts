export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          language: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string;
          last_name?: string;
          language?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          language?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journey_stamps: {
        Row: {
          user_id: string;
          station_id: string;
          stamped_at: string;
        };
        Insert: {
          user_id: string;
          station_id: string;
          stamped_at?: string;
        };
        Update: {
          user_id?: string;
          station_id?: string;
          stamped_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
