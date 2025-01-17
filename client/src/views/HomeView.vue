<script lang="ts">
import { useUsersStore } from '@/stores/userStore';
import { computed, onMounted } from 'vue';
import UserTable from '@/components/HomeComponents/userTable.vue';
import UserCards from '@/components/HomeComponents/userCards.vue';

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

export default {
  name: 'Home',
  data(){
    return {
      msg: ''
    }
  },
  setup(){
    const userStore = useUsersStore()

    const user = computed(() => userStore.users || [])
    const loading = computed(() => userStore.loading)
    const error = computed(() => userStore.error)

    console.log(user);
    

    onMounted(async ()=> {
      await userStore.fetchUser()
    })

    return { user , loading, error, userStore }
  },
  methods: {
    async getMessage(){
      try {
        const response: Response = await fetch('http://localhost:5001/users')
        const data = await response.json()
        console.log(data);
        // this.msg = response.text()
        this.msg = data
      } catch (error) {
        console.log(error as Error); 
      }
    }
  },
  created(){
    this.getMessage()
  },
  components:{
    UserTable,
    UserCards
  }
}

</script>

<template>
  <main class="flex flex-col justify-center items-center">
    <UserCards :user-data="user" :loading="loading" :error="error"/>
    <UserTable :user-data="user" :loading="loading" :error="error"/>
    
 </main>
</template>
