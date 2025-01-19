<script lang="ts">
import { watch, reactive, defineComponent, type PropType, ref, type Ref} from "vue";

import UserToolbar from '@/components/HomeComponents/userToolbar.vue';
import timezone from '@/service/timezones';
import CreateReadUpdateDelete from "@/service/crud";

import type { User, UserProps } from "@/types/users";

import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from "primevue";

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

    const toast = useToast();

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
        updated_at: user.updated_at,
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
        users, filters, selectedUsers, dt , editUserDialog, editUserData, TZ, exportCSV, toast
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
      this.editUserData = JSON.parse(JSON.stringify(eUser))
      this.editUserData.currentUserName = eUser.username
      this.editUserDialog = true;
    },
    async saveEditData(){
      try {
        const response = await new CreateReadUpdateDelete({
          username: this.editUserData.username,
          password: this.editUserData.password,
          roles: this.editUserData.roles,
          preferences: this.editUserData.preferences,
          active: this.editUserData.active,
          currentUserName: this.editUserData.currentUserName, 
        }).updateUser()

        if (!(response as Response).ok) {throw new Error('Error to edit user')}

        this.toast.add({ severity: 'success', summary: 'User updated sucefully', detail: `User, ${this.editUserData.currentUserName} has been updated!`, life: 3000 });

        this.editUserDialog = false

        return response
      } catch (error) {
        return (error as Error).message
      }
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
    <DataTable ref="dt" :value="users" removableSort tableStyle="max-width: 70rem" class="min-h-[70vh] max-lg:!w-[95vw]"
      :filters="filters" v-model:selection="selectedUsers" :exportable="true" id="dt-responsive-table">
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

      <template #empty>
        <div v-if="loading" class="h-screen w-full flex justify-center items-center">
          <div class="w-20 h-20 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      </template>

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

      <Column field="updated_at" header="Update At" style="width: 25%">
        <template #body="{ data }">
          <Tag :value="data.updated_at ? formatDate(data.updated_at):  'No change'" severity="info" style="width: 100%;" />
        </template>
      </Column>

      <Column field="created_ts" sortable header="Created At" style="width: 25%">
        <template #body="{ data }">
          <Tag :value="formatDate(data.created_ts)" severity="info" style="width: 100%;" />
        </template>
      </Column>

      <Column :exportable="false" style="min-width: 7rem" header="Edit User">
        <template #body="{data}">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditUser(data)" />
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
.p-datatable-header {
    color: var(--p-primary-color) !important;
}

.p-datatable {
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-border-radius-xl);
  padding: 0.3rem;
}


@media (max-width: 1024px) {
    #dt-responsive-table table {
        width: 100% !important;
    }

    #dt-responsive-table table thead {
        display: none !important; 
    }

    #dt-responsive-table table tbody tr td {
      width: 100% !important;
    }

    #dt-responsive-table table tbody {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        align-items: stretch !important;
        min-height: auto !important; 
    }

    #dt-responsive-table table tbody tr {
        border: 1px solid #ccc !important;
        border-radius: 8px !important;
        margin-bottom: 1rem !important;
        background-color: #fff !important;
        padding: 1rem !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }

    #dt-responsive-table table tbody td {
        margin: 0.5rem 0 !important;
    }

    #dt-responsive-table table tbody tr {
        display: table-row !important;
    }

    #dt-responsive-table table tbody td {
        display: block !important;
        margin: 0.5rem 0 !important;
    }
}
</style>