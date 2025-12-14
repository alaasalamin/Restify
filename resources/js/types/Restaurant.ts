export interface Restaurant {
    id: number;
    user_id: number;
    name: string;
    address?: string | null;
    map_json?: string | null;
    created_at?: string;
    updated_at?: string;
}
