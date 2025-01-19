import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import App from './App.vue'
import router from './router'

import { definePreset } from '@primevue/themes'
import { ToastService } from 'primevue'

const app = createApp(App)

app.use(createPinia())
app.use(ToastService)

const MyPreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
          light: {
            root: {
                background: '{surface.0}',
                color: '{surface.700}'
            },
            subtitle: {
                color: '{surface.500}'
            }
        },
        dark: {
            root: {
                background: '{surface.900}',
                color: '{surface.0}'
            },
            subtitle: {
                color: '{surface.400}'
            }
        }
        }
    }
});

app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: MyPreset,
        options: {
            prefix: 'p',
            darkModeSelector: '.my-app-dark',
            cssLayer: false,
        }
    }
});

app.use(router).mount('#app')