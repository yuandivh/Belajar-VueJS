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
    error:null
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
        this.error = error.message || "Failed to fetch projects";
      } finally {
        this.loading.fetch = false;
      }
    },
    async createProject(name, description) {
      this.loading.create = true;
      this.error = null;
      try {
        const data = await createProjects(name, description);
        await this.fetchProjects(); // Refresh the project list after creation
        // this.projects.unshift(data.data);
      } catch (error) {
        this.error = error.message || "Failed to create project";
        throw error;
      } finally {
        this.loading.create = false;
      }
    },
    async updateProject(id, name, description) {
      this.loading.update = true;
      this.error = null;
      try {
        const data = await updateProjects(id, name, description);
        const index = this.projects.findIndex((project) => project.id === id);
        if (index !== -1) {
          this.projects[index] = data.data;
        }
      } catch (error) {
        this.error = error.message || "Failed to update project";
        throw error;
      } finally {
        this.loading.update = false;
      }
    },
    async deleteProject(projectId) {
      this.loading.delete = true;
      this.error = null;
      try {
        await deleteProject(projectId);
        await this.fetchProjects(); // Refresh the project list after deletion
        // this.projects = this.projects.filter(
        //   (project) => project.id !== projectId,
        // );
      } catch (error) {
        this.error = error.message || "Failed to delete project";
        throw error;
      } finally {
        this.loading.delete = false;
      }
    },
    async changePage(page) {
      this.filters.page = page;
      await this.fetchProjects();
    },
  },
  getters: {
    totalProjects: (state) => state.projects.length,
  },
});
