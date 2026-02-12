import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import './assets/styles/tokens.css'
import './style.css'
import './assets/styles/brutal.css'
import './assets/styles/nav.css'
import './assets/styles/animations.css'

// 🎨 Easter Egg Console Art
console.log(
  '%c╔═══════════════════════════════════════╗\n' +
  '║                                       ║\n' +
  '║   💜  Built by Pedro                  ║\n' +
  '║       With love to Gabriela ✨        ║\n' +
  '║                                       ║\n' +
  '║   CodeCraft - Where code meets art    ║\n' +
  '║                                       ║\n' +
  '╚═══════════════════════════════════════╝',
  'color: #FF6B6B; font-weight: bold; font-size: 14px; font-family: monospace; text-shadow: 2px 2px 0px #000;'
)

const app = createApp(App)
app.use(router)
app.use(MotionPlugin)
app.mount('#app')
