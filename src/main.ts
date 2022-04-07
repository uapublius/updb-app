import { createApp } from 'vue';
import App from './App.vue';
import "./style/app.scss";
import { registerIcons } from './registerIcons';

let app = createApp(App);

registerIcons(app);

app.mount('#app');
