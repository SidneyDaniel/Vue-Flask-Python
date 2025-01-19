<script lang="ts">
import type { MeterItem } from 'primevue';
import { defineComponent, ref, watch, type PropType } from 'vue';
import type { User, UserProps } from "@/types/users";

export default defineComponent({
    name: 'UserCards',
    props:{
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
        setup(props: UserProps){
            const dataCards = ref<MeterItem[]>([])

            const updateValues = () => {
                const numberOfUsers = props.userData.length
                const numberOfActives = props.userData
                    .map(quantity => quantity.active ? 1 : 0)
                    .reduce((acc, value)=>{
                        if (value) { 
                            acc.trueCount++; 
                        }
                        else { 
                            acc.falseCount++; 
                        }
                        return acc
                }, {trueCount: 0 , falseCount: 0})
                    
                dataCards.value = [
                    { label: 'N° Of Users', color: '#34d399', value: numberOfUsers, icon: 'pi pi-users' },
                    { label: 'Actives', color: '#fbbf24', value: numberOfActives.trueCount, icon: 'pi pi-verified' },
                    { label: 'Inactives', color: '#60a5fa', value: numberOfActives.falseCount, icon: 'pi pi-times-circle' },
                ]
            }
            
            watch(() => props.userData, updateValues, { immediate: true})

            return {dataCards}
        },
    }
)
</script>

<template>
    <div class="card w-full">
        <div class="flex flex-wrap gap-4 mb-6">
            <Card v-for="val of dataCards" :key="val.label" class="flex-1 border border-surface shadow-none">
                <template #content>
                    <div class="flex justify-between gap-8">
                        <div class="flex flex-col gap-1">
                            <span class="text-surface-500 dark:text-surface-400 text-sm">{{ val.label }}</span>
                            <span class="font-bold text-lg">{{ val.value }}</span>
                        </div>
                        <span class="w-8 h-8 rounded-full inline-flex justify-center items-center text-center"
                            :style="{ backgroundColor: `${val.color}`, color: '#ffffff' }">
                            <i :class="val.icon" />
                        </span>
                    </div>
                </template>
            </Card>           
        </div>
    </div>
</template>
