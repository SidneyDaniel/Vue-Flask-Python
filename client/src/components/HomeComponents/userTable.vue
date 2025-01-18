<script lang="ts">
import { watch, reactive, defineComponent, type PropType, ref, type Ref} from "vue";
import UserToolbar from '@/components/HomeComponents/userToolbar.vue';
// import { exportCSV } from "@primevue/core";
import timezone from '@/service/timezones';

import { FilterMatchMode } from '@primevue/core/api';
import CreateReadUpdateDelete from "@/service/crud";

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

interface EditUser extends User {
  currentUserName?: string; 
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
    const selectedUsers = ref([]) 
    const editUserDialog = ref(false)
    const dt = ref()

    const exportCSV = () => {
        dt.value.exportCSV();
    };

    const TZ = timezone.map((timez) => timez.name)

    const editUserData: Ref<EditUser> = ref({
      username: '',
      password: '',
      roles: [],
      preferences: {timezone: ''},
      created_ts: 0,
      active: false,
      currentUserName: ''
    })

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
    
    const filters = ref<Record<string, any>>({});

    const initFilters = () => {
      filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        roles: { value: [], matchMode: FilterMatchMode.IN },
        username: { operator: 'AND', constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        active: { value: null, matchMode: FilterMatchMode.EQUALS  }
      };
    };

    initFilters();

    return {
        users, filters, selectedUsers, dt , editUserDialog, editUserData, TZ, exportCSV
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
      const month = date.getMonth() + 1
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
    },
    clearProp(){
      this.selectedUsers = [] 
    },
    openEditUser(eUser: User){
      // this.editUserData = {...eUser}
      this.editUserData = JSON.parse(JSON.stringify(eUser))
      this.editUserData.currentUserName = eUser.username
      this.editUserDialog = true;
    },
    async saveEditData(){
      try {
        await new CreateReadUpdateDelete({
          username: this.editUserData.username,
          password: this.editUserData.password,
          roles: this.editUserData.roles,
          preferences: this.editUserData.preferences,
          active: this.editUserData.active,
          currentUserName: this.editUserData.currentUserName, 
        }).updateUser()
      } catch (error) {

      }
      console.log('Edited User Data:');
      console.log('Username: ' + this.editUserData.username);
      console.log('Password: ' + this.editUserData.password);
      console.log('Roles: ' + this.editUserData.roles.join(', '));
      console.log('Timezone: ' + this.editUserData.preferences.timezone);
      console.log('Active Status: ' + this.editUserData.active);
      console.log('Current User: ' + this.editUserData.currentUserName);
      
      console.log('Last Updated: ' + Date.now()); 
    }
  },
  components:{
    UserToolbar
  }
})
</script>

<template>

  <UserToolbar :selected-user-data="selectedUsers" :loading="loading" :error="error" @clear-prop="clearProp"
    @exportCSV="exportCSV" />

  <div class="flex flex-row gap-6 w-full max-w-fit bg-white">
    <DataTable ref="dt" :value="users" removableSort  tableStyle="min-width: 70rem" class="min-h-[70vh]" :filters="filters"
      v-model:selection="selectedUsers" :exportable="true">

      <template #header>
        <div class="flex justify-self-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>

      <template #empty> No User found. </template>

      <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

      <Column field="username" sortable header="Name" style="width: 25%"></Column>

      <Column field="roles" header="Role" style="width: 25%">
        <template #body="{ data }">
          <div style="display: flex; width: fit-content; gap: 0.2rem;">
            <Badge v-for="role in data.roles" :value="formatRole(role)" :severity="selectRoleColor(role)" size="small">
            </Badge>
          </div>
        </template>
      </Column>

      <Column field="preferences" header="Timezone" style="width: 25%">
        <template #body="{ data }">
          <Badge :value="data.preferences?.timezone" severity="contrast" size="small"></Badge>
        </template>
      </Column>

      <Column field="active" header="Status" style="width: 25%" :show-filter-menu="false" dataType="boolean">
        <template #body="{ data }">
          <Tag :value="data.active ? 'Active' : 'Inactive'" :severity="getSeverity(data.active)" />
        </template>
      </Column>

      <Column field="lastUpdate" header="Update At">

      </Column>

      <Column field="created_ts" sortable header="Created At">
        <template #body="{ data }">
          <Tag :value="formatDate(data.created_ts)" severity="info" style="width: 100%;" />
        </template>
      </Column>

      <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>

      <Column :exportable="false" style="min-width: 12rem" header="Edit User">
        <template #body="{data}">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditUser(data)" />
          <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" /> -->
        </template>
      </Column>

    </DataTable>

    <Dialog v-model:visible="editUserDialog" :style="{ width: '450px' }" header="Edit User Detais" :modal="true">
      <div class="flex flex-col gap-3">
        <div class="flex flex-col">
          <label for="name" class="block font-bold mb-3">Username</label>
          <InputText id="name" v-model.trim="editUserData.username" required="true" autofocus
            :value="editUserData.username" />
        </div>

        <div class="flex flex-col">
          <label for="name" class="block font-bold mb-3">Password</label>
          <InputText id="name" v-model.trim="editUserData.password" required="true" autofocus
            :value="editUserData.password" />
        </div>

        <div class="flex flex-col">
          <label class="block font-bold mb-3">Status</label>

          <div class="flex items-center gap-2">
            <RadioButton v-model="editUserData.active" inputId="active" name="status" :value="true" />
            <label for="active">Active</label>
          </div>

          <div class="flex items-center gap-2">
            <RadioButton v-model="editUserData.active" inputId="inactive" name="status" :value="false" />
            <label for="inactive">Inactive</label>
          </div>

        </div>

        <div>
          <label class="block font-bold mb-3">Select Timezone and Role</label>

          <div class="flex gap-2">
            <Select filter v-model="editUserData.preferences.timezone" :options="TZ" placeholder="Select a Timezone" />

            <MultiSelect v-model="editUserData.roles"
              :options="[{ name: 'admin', value: 'admin' }, { name: 'tester', value: 'tester' }, { name: 'manager', value: 'manager' }]"
              optionLabel="name" option-value="value" placeholder="Select Roles" :maxSelectedLabels="3"
              class="w-full" />
          </div>
        </div>

      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="editUserDialog = false" />
        <Button label="Save" icon="pi pi-check" @click="saveEditData" />
      </template>
    </Dialog>
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