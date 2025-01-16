<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';

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
    name: 'UserCards',
    props:{
        userData: {
            type: Array as PropType<User[]>,
            required: true
        },
        },
        setup(props: UserProps){
            
        },
    }
)
</script>

<template>
    <div class="card">
        <MeterGroup :value="value" labelPosition="start">
            <template #label="{ value }">
                <div class="flex flex-wrap gap-4">
                    <template v-for="val of value" :key="val.label">
                        <Card class="flex-1 border border-surface shadow-none">
                            <template #content>
                                <div class="flex justify-between gap-8">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-surface-500 dark:text-surface-400 text-sm">{{ val.label }}</span>
                                        <span class="font-bold text-lg">{{ val.value }}%</span>
                                    </div>
                                    <span class="w-8 h-8 rounded-full inline-flex justify-center items-center text-center" :style="{ backgroundColor: `${val.color1}`, color: '#ffffff' }">
                                        <i :class="val.icon" />
                                    </span>
                                </div>
                            </template>
                        </Card>
                    </template>
                </div>
            </template>
            <template #meter="slotProps">
                <span :class="slotProps.class" :style="{ background: `linear-gradient(to right, ${slotProps.value.color1}, ${slotProps.value.color2})`, width: slotProps.size }" />
            </template>
            <template #start="{ totalPercent }">
                <div class="flex justify-between mt-4 mb-2 relative">
                    <span>Storage</span>
                    <span :style="{ width: totalPercent + '%' }" class="absolute text-right">{{ totalPercent }}%</span>
                    <span class="font-medium">1TB</span>
                </div>
            </template>
            <template #end>
                <div class="flex justify-between mt-4">
                    <Button label="Manage Storage" outlined size="small" />
                    <Button label="Update Plan" size="small" />
                </div>
            </template>
        </MeterGroup>
    </div>
</template>
