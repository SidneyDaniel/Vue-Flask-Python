<script lang="ts">
import { watch, reactive, defineComponent, type PropType} from "vue";


interface UserPreferences {
    timezone: string;
}
  
interface User {
    id?: string;
    username: string;
    password?: string;
    roles: string[];
    preferences: UserPreferences;
    created_ts: number;
    active: boolean;
}

interface UserProps {
    userData: User[], 
    loading: boolean,
    error: string | null
}

interface TypeOfRole {
   admin: string, 
   manager: string, 
   tester: string
}

export default defineComponent({
  name: 'UserTable',
  props: {
    userData: {
      type: Array as PropType<User[]>,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    error: {
      type: String as PropType<string | null>,
      required: false
    }
  },
  setup(props: UserProps) {
    const users: User[] = reactive([] as User[])

    watch(() => props.userData, (value) => {
      const arrayUsers = value 
      const mappedArray: User[] = arrayUsers.map(user => ({
        username: user.username,
        roles: user.roles.length > 0 ? user.roles : ['none'],
        preferences: user.preferences,
        active: user.active,
        lastUpdate: '',
        created_ts: user.created_ts,
      }))  

      users.splice(0, users.length, ...mappedArray); 
    })
    
    return {
        users
    };
  },
  methods:{
    isActive(date: Date) {
        const today = new Date()
        const twoMontAgo = new Date()
        const lastSignIn = new Date(date)
        twoMontAgo.setMonth(today.getMonth() - 2)
        return lastSignIn >= twoMontAgo
    },
    getSeverity (status: boolean){
      switch (status) {
          case true:
              return 'sucess';

          case false:
              return 'warn';
      }
    },
    formatDate(timestamp: number): string{
      const date = new Date(timestamp * 1000)

      const day = date.getDate()
      const month = date.getMonth()
      const year = date.getFullYear()
      
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
    },
    formatRole(role: String): string{
      switch (role) {
          case 'manager':
              return 'Man';

          case 'tester':
              return 'Test';

          case 'admin':
            return 'Adm';
          default:
            return 'None';
      }
    },
    selectRoleColor(role: String): string{
      switch (role) {
          case 'manager':
              return 'info';

          case 'tester':
              return 'warn';

          case 'admin':
            return 'danger';
          default:
            return 'secondary'
      }

      // <"secondary" | "success" | "info" | "warn" | "danger" | "contrast"> 
    }
  },
})
</script>

<template>
    <div class="flex flex-row gap-6 w-full max-w-fit bg-white">
      <DataTable :value="users" :rows="4" tableStyle="min-width: 70rem">
            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xl font-bold">Users</span>
                </div>
            </template>
            <Column field="username" header="Name" style="width: 25%"></Column>
           
            <Column field="roles" header="Role" style="width: 25%">
              <template #body="{ data }">
                <div style="display: flex; width: fit-content; gap: 0.2rem;">
                  <Badge v-for="role in data.roles" :value="formatRole(role)" :severity="selectRoleColor(role)" size="small"></Badge>
                </div>
              </template>
            </Column>

            <Column field="preferences" header="Timezone" style="width: 25%">
              <template #body="{ data }">
                  <Badge :value="data.preferences.timezone" severity="contrast" size="small"></Badge>
              </template>
            </Column>
            
            <Column field="active" header="Status" style="width: 25%" dataType="boolean">
              <template #body="{ data }">
                    <Tag :value="data.active ? 'Active' : 'Inactive'" :severity="getSeverity(data.active)"  />
              </template>
            </Column>

            <Column field="lastUpdate" header="Update At" >
           
            </Column>
            <Column field="created_ts" header="Created At" >
              <template #body="{ data }">
                    <Tag :value="formatDate(data.created_ts)" severity="info" style="width: 100%;"/>
              </template>
            </Column>

      </DataTable>
    </div>
</template>

<style>
/* .p-datatable-column-title {
    color: var(--p-primary-color);
} */

.p-datatable-header {
    color: var(--p-primary-color) !important;
}

.p-datatable {
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-border-radius-xl);
  padding: 0.3rem;
}

.p-paginator{
  padding: 0.3rem 1rem !important;
}
</style>