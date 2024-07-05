import { createWebHistory, createRouter } from "vue-router";
import AddCep from "./../components/Add/AddCep.vue";
import ImportCsv from "./../components/Import/ImportCsv.vue";
import ListCep from "../components/List/ListCep.vue";

const routes = [
  {
    path: "/",
    component: AddCep,
  }, {
    path: "/add",
    component: AddCep,
  }, {
    path: "/edit/:id/:origem/:destino",
    component: AddCep,

  }, {
    path: "/import",
    component: ImportCsv,
  }, {
    path: "/list",
    component: ListCep,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;