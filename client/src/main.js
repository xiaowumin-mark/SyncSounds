import "@/assets/main.css"
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'mdui/mdui.css';
import 'mdui';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';
setColorScheme('#B9F399');
const app = createApp(App)

app.use(router)

router.isReady().then(() => app.mount('#app'))

window.host = "http://192.168.1.199:3000"

localStorage.wyCookie = ``