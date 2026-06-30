import { defineStore } from "pinia";
import { getUser, login, logout } from "../services/auth";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token"),
    loadingLogin: false,
    loadingLogout: false,
  }),
  actions: {
    clearAuth() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
    async fetchUser() {
      try {
        this.user = await getUser();
      } catch (error) {
        this.clearAuth();
        router.push({ name: "login" });
        throw error;
      }
    },
    async login(email, password) {
      this.loadingLogin = true;
      try {
        const data = await login(email, password);
        this.token = data.token
        localStorage.setItem("token", data.token);
        await this.fetchUser();
      } finally {
        this.loadingLogin = false;
      }
    },
    async logout() {
      this.loadingLogout = true;
      try {
        await logout();
        this.clearAuth();
      } finally {
        this.loadingLogout = false;
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
