export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    public: {
        Tables: {
            coins: {
                Row: {
                    amount: number | null;
                    event_name: string | null;
                    id: number;
                    operator: string;
                    reason: string | null;
                    timestamp: string;
                    user_id: string;
                };
                Insert: {
                    amount?: number | null;
                    event_name?: string | null;
                    id?: never;
                    operator: string;
                    reason?: string | null;
                    timestamp?: string;
                    user_id: string;
                };
                Update: {
                    amount?: number | null;
                    event_name?: string | null;
                    id?: never;
                    operator?: string;
                    reason?: string | null;
                    timestamp?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'coins_event_name_fkey';
                        columns: ['event_name'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['event_name'];
                    },
                    {
                        foreignKeyName: 'coins_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['user_id'];
                    },
                ];
            };
            events: {
                Row: {
                    event_name: string;
                    id: number;
                    timestamp: string;
                };
                Insert: {
                    event_name: string;
                    id?: never;
                    timestamp: string;
                };
                Update: {
                    event_name?: string;
                    id?: never;
                    timestamp?: string;
                };
                Relationships: [];
            };
            levels: {
                Row: {
                    guild_id: string;
                    id: string;
                    level: number;
                    user_id: string;
                    xp: number;
                };
                Insert: {
                    guild_id: string;
                    id?: string;
                    level: number;
                    user_id: string;
                    xp: number;
                };
                Update: {
                    guild_id?: string;
                    id?: string;
                    level?: number;
                    user_id?: string;
                    xp?: number;
                };
                Relationships: [];
            };
            users: {
                Row: {
                    id: number;
                    user_id: string;
                    username: string;
                };
                Insert: {
                    id?: never;
                    user_id: string;
                    username: string;
                };
                Update: {
                    id?: never;
                    user_id?: string;
                    username?: string;
                };
                Relationships: [];
            };
            voice_levels: {
                Row: {
                    guild_id: string;
                    id: string;
                    level: string;
                    time_spent: string;
                    user_id: string;
                    xp: string;
                };
                Insert: {
                    guild_id: string;
                    id?: string;
                    level: string;
                    time_spent: string;
                    user_id: string;
                    xp: string;
                };
                Update: {
                    guild_id?: string;
                    id?: string;
                    level?: string;
                    time_spent?: string;
                    user_id?: string;
                    xp?: string;
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
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
      ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
      ? PublicSchema['Enums'][PublicEnumNameOrOptions]
      : never;
