import { defineStore } from "pinia";
import { getUser, login, logout, refreshToken } from "../services/auth";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token"),
    loadingLogin: false,
    loadingLogout: false,
    loadingRefresh: false,
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
        throw error;
      }
    },
    async login(email, password) {
      this.loadingLogin = true;
      try {
        const data = await login(email, password);
        this.token = data.token;
        localStorage.setItem("token", data.token);
        console.log("Token stored:", data.token);
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
    async refreshToken() {
      this.loadingRefresh = true;
      try {
        const data = await refreshToken(localStorage.getItem("token"));
        this.token = data.token;
        localStorage.setItem("token", data.token);
      }
      catch(error){
        this.clearAuth();
        throw error;
      }finally{
        this.loadingRefresh = false;
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
