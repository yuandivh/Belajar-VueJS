import { defineStore } from "pinia";
import { createTask, deleteTask, getTasks, updateTask } from "../services/task";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false,
      loadMore: false,
    },
    filters: {
      page: 1,
      search: "",
      status: "",
    },
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0,
    },
  }),
  actions: {
    async fetchTasks(projectId, append = false) {
      this.tasks = [];
      if (!append) {
        this.loading.fetch = true;
      } else {
        this.loading.loadMore = true;
      }
      const params = new URLSearchParams();
      if(this.filters.search.trim()){
        params.append("search",this.filters.search)
      }
      if (this.filters.page !== null) {
        params.append("page", this.filters.page);
      }
      try {
        const data = await getTasks(projectId, params);

        if (append) {
          this.tasks.push(...data.tasks.data);
        } else {
          this.tasks = data.tasks.data;
        }
        this.pagination.currentPage = data.tasks.current_page;
        this.pagination.lastPage = data.tasks.last_page;
        this.pagination.perPage = data.tasks.per_page;
        this.pagination.total = data.tasks.total;
      } catch (error) {
        this.tasks = [];
        throw error;
      } finally {
        if (!append) {
          this.loading.fetch = false;
        } else {
          this.loading.loadMore = false;
        }
      }
    },
    async createTask(projectId, title, description, status, due_date) {
      this.loading.create = true;
      try {
        const data = await createTask(
          projectId,
          title,
          description,
          status,
          due_date,
        );
        await this.fetchTasks(projectId);
      } catch (error) {
        throw error;
      } finally {
        this.loading.create = false;
      }
    },
    async updateTask(taskId, title, description, status, due_date) {
      this.loading.update = true;
      try {
        const data = await updateTask(
          taskId,
          title,
          description,
          status,
          due_date,
        );
        const index = this.tasks.findIndex((task) => task.id === taskId);
        if (index !== -1) {
          this.tasks[index] = data.data;
        }
        // await this.fetchTasks()  // If not use updated_at
      } catch (error) {
        throw error;
      } finally {
        this.loading.update = false;
      }
    },
    async deleteTask(projectId, taskId) {
      this.loading.delete = true;
      try {
        const data = await deleteTask(taskId);
        await this.fetchTasks(projectId); //Refresh the task list after deletion
      } catch (error) {
        throw error;
      } finally {
        this.loading.delete = false;
      }
    },
    async changePage(projectId, page) {
      ((this.filters.page = page), this.fetchTasks(projectId));
    },
    async loadMoreTasks(projectId) {
      if (this.loading.loadMore) return;
      if (this.pagination.currentPage >= this.pagination.lastPage) return;
      this.filters.page = this.pagination.currentPage + 1;
      await this.fetchTasks(projectId, true);
    },
  },
});
