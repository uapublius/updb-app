import { createApp } from 'vue';
import App from './App.vue';
import "./style/style.scss";
import { registerIcons } from './registerIcons';

let app = createApp(App);

registerIcons(app);

app.mount('#app');
