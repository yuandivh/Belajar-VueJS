import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import TaskView from "../views/TaskView.vue";
import TestView from "../views/TestView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      guest: true,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path:"/projects/:projectId/tasks",
    name:"tasks",
    component: TaskView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path:"/testview",
    name:"testview",
    component: TestView,
    meta: {
      requiresAuth: true,
    },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    return next({ name: "login" });
  }
  if (to.meta.guest && token) {
    return next({ name: "dashboard" });
  }
  next();
});
