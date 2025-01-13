import {defineStore } from "pinia";

interface UserPreferences {
    timezone: string;
}
  
interface User {
    id: string;
    username: string;
    password: string;
    roles: string[];
    preferences: UserPreferences;
    created_ts: number;
    active: boolean;
}
  
export const useUsersStore = defineStore('userStore', {
    state: () => ({
      users: [] as User[],
      loading: false,
      error: null as string | null
    }),
    actions: {
      async fetchUser() {
        if (this.users.length > 0) return

        this.loading = true
        this.error = null
        try {
          const response: Response = await fetch('http://localhost:5001/users')
          
          const data = await response.json()
          
          if (!response.ok) {throw new Error('Erro ao buscar dados')}
          
          this.users = data
          return this.users
        } catch (error) {
          this.error = (error as Error).message
        } finally {
          this.loading = false
        }
      }
    }
  })
