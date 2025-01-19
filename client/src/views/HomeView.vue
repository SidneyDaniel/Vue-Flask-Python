<script lang="ts">
import { useUsersStore } from '@/stores/userStore';
import { computed, onMounted } from 'vue';
import UserTable from '@/components/HomeComponents/userTable.vue';
import UserCards from '@/components/HomeComponents/userCards.vue';

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

    onMounted(async ()=> {
      await userStore.fetchUser()
    })

    return { user , loading, error, userStore }
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
