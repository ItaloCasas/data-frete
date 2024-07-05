import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { vMaska } from "maska/vue"

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

createApp(App)
.directive("maska", vMaska)
.use(router)
.mount('#app');
