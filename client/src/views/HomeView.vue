<script lang="ts">
import { useUsersStore } from '@/stores/userStore';
import { computed, onMounted } from 'vue';
import table from '@/components/HomeComponents/table.vue';

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

export default{
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
  }
}

</script>

<template>
  <main>
    <!-- <h1>{{ user }}</h1> -->
      <div v-if="loading">Loading...</div> 
      <div v-if="error">{{ error}}</div>
      <div v-for="users in user" :key="users.id">
        <h1>{{ users.username }}</h1>
      </div>

      <table/>
      
  </main>
</template>
