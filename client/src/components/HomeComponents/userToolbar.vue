<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import timezone from '@/service/timezones';

interface UserPreferences {
    timezone: string;
}
  
interface UserProps {
    userData: User[], 
    loading: boolean,
    error: string | null
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

export default defineComponent({
    name: 'UserToolBar',
    props:{
        selectedUserData: {
            type: Array as PropType<User[]>,
            required: true
        },
    },
    emits: ['clearProp', 'exportCSV'],
    setup(){
        const deleteUserDialog = ref(false)
        const creationConfirm = ref(false)

        const TZ = timezone.map((timez) => timez.name)

        const newUser = ref({
            username: '',
            password: '',
            roles: [],
            preferences: {timezone: ''},
            created_ts: '',
            active: ''
        })
     
        const userDialog = ref(false)

        return {
            newUser,
            userDialog,
            deleteUserDialog,
            creationConfirm,
            TZ,
        }
    },
    methods:{
        openNew(){
            // this.newUser = {};
            // submitted = false;
            this.userDialog = true;
        },
        closeNew(){
            this.userDialog = false;
        },
        saveNewUser(){
         console.log('New Data',this.newUser.username,this.newUser.roles, this.newUser.preferences.timezone);     
        }, 
         deleteUserData(){
            const IDsToDelete = this.selectedUserData.map(val => (({username: val.username})));
            this.deleteUserDialog = false;
            console.log(IDsToDelete);
            this.clearReceivedPro()
        },
        clearReceivedPro(){
            this.$emit('clearProp')
        },
        exportCsv(){
           this.$emit('exportCSV')
        }
    }
})
</script>

<template>
    <Toolbar class="mb-6 w-full">
        <template #start>
            <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="deleteUserDialog = true"
                :disabled="!selectedUserData || !selectedUserData.length" />
        </template>

        <template #end>
            <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCsv" />
        </template>
    </Toolbar>

    <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="User Details" :modal="true">
        <div class="flex flex-col">
            <div class="flex flex-col">
                <label for="name" class="block font-bold mb-3">Username</label>
                <InputText id="name" v-model.trim="newUser.username" required="true" autofocus />
            </div>

            <div>
                <label class="block font-bold mb-3">Select Timezone and Role</label>

                <div class="flex gap-2">
                    <Select 
                        filter 
                        v-model="newUser.preferences.timezone" 
                        :options="TZ"
                        placeholder="Select a Timezone" 
                    />

                    <MultiSelect v-model="newUser.roles"
                        :options="[{ name: 'admin' }, { name: 'tester' }, { name: 'manager' }]" 
                        optionLabel="name"
                        placeholder="Select Roles" 
                        :maxSelectedLabels="3" 
                        class="w-full"
                    />
                </div>
            </div>

        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="closeNew" />
            <Button label="Save" icon="pi pi-check" @click="saveNewUser" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedUserData.length === 1">Are you sure you want to delete the user <b>{{ selectedUserData[0].username }}</b>?</span>
                <span v-else-if="selectedUserData.length > 1">Are you sure you want to delete all that data?</span>
           </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteUserDialog = false" />
                <Button label="Yes" icon="pi pi-check"  @click="deleteUserData"/>
            </template>
    </Dialog>

</template>