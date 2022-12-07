import { createRouter, createWebHistory } from "vue-router";
import WebgisRS from "../views/WebgisRS.vue";

const routes = [
  {
    path: "/",
    name: "WebgisRS",
    component: WebgisRS,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
