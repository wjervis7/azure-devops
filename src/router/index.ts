import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/azure",
            name: "azure",
            component: () => import("@/views/AzureView.vue")
        },
        {
            path: "/branches",
            name: "branches",
            component: () => import("@/views/BranchListView.vue")
        },
        {
            path: "/pullrequests",
            name: "pullrequests",
            component: () => import("@/views/PrView.vue")
        },
        {
            path: "/branches/:name",
            name: "branch",
            component: () => import("@/views/BranchView.vue"),
            props: true
        }
    ],
    linkActiveClass: "active"
});

export default router;
