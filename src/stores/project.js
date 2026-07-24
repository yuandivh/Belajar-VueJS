import { defineStore } from "pinia";
import {
  getProjects,
  deleteProject,
  createProjects,
  updateProjects,
} from "../services/project";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projects: [],
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false,
    },
    filters: {
      search: "",
      page: 1,
    },
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0,
    },
  }),
  actions: {
    async fetchProjects() {
      this.loading.fetch = true;
      const params = new URLSearchParams();
      if (this.filters.search.trim()) {
        params.append("search", this.filters.search);
      }
      if (this.filters.page !== null) {
        params.append("page", this.filters.page);
      }
      try {
        const data = await getProjects(params.toString());
        this.projects = data.data;
        this.pagination.currentPage = data.meta.current_page;
        this.pagination.lastPage = data.meta.last_page;
        this.pagination.perPage = data.meta.per_page;
        this.pagination.total = data.meta.total;
      } catch (error) {
        this.projects = [];
        throw error;
      } finally {
        this.loading.fetch = false;
      }
    },
    async createProject(name, description) {
      this.loading.create = true;
      try {
        const data = await createProjects(name, description);
        this.filterDefault();
        await this.fetchProjects(); // Refresh the project list after creation
      } catch (error) {
        throw error;
      } finally {
        this.loading.create = false;
      }
    },
    async updateProject(projectId, name, description) {
      this.loading.update = true;
      try {
        const data = await updateProjects(projectId, name, description);
        const index = this.projects.findIndex((project) => project.id === projectId);
        if (index !== -1) {
          this.projects[index] = data.data;
        }
        this.filterDefault();
        // await this.fetchProjects(); // If not use updated_at
      } catch (error) {
        throw error;
      } finally {
        this.loading.update = false;
      }
    },
    async deleteProject(projectId) {
      this.loading.delete = true;
      try {
        await deleteProject(projectId);
        this.filterDefault();
        await this.fetchProjects(); // Refresh the project list after deletion
      } catch (error) {
        throw error;
      } finally {
        this.loading.delete = false;
      }
    },
    async changePage(page) {
      this.filters.page = page;
      await this.fetchProjects();
      window.scrollTo({
        top:0,
        behavior:"smooth"
      })
    },
    filterDefault() {
      this.filters.page = 1;
      this.filters.search = "";
    },
  },
  getters: {
    totalProjects: (state) => state.projects.length,
  },
});
