export interface UserPreferences {
    timezone: string;
}
  
export interface User {
    id?: string;
    username: string;
    password?: string;
    roles: string[];
    preferences: UserPreferences;
    created_ts: number;
    active: boolean;
    updated_at?: number
}

export interface UserProps {
    userData: User[], 
    loading: boolean,
    error: string | null
}

export interface EditUser extends User {
  currentUserName?: string; 
}