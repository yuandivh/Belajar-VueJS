import { defineStore } from "pinia";
import { createTask, deleteTask, getTasks, updateTask } from "../services/task";

export const useTaskStore = defineStore("task",{
    state: () => ({
        tasks: [],
        loading: {
            fetch:false,
            create:false,
            update:false,
            delete:false
        },
        filters: {
            page: 1,
            search: "",
            status: ""
        },
        pagination: {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total:0
        }
    }),
    actions: {
        async fetchTasks(projectId){
            this.loading.fetch = true
            this.tasks = []
            try{
                const data = await getTasks(projectId)
                this.tasks = data.data
            }
            catch(error){
                this.tasks = []
                throw error
            }
            finally{
                this.loading.fetch = false
            }
        },
        async createTask(projectId,title,description,status,due_date){
            this.loading.create = true
            try{
                const data = await createTask(projectId,title,description,status,due_date)
                await this.fetchTasks(projectId)
            }catch(error){  
                throw error
            }finally{
                this.loading.create = false
            }
        },
        async updateTask(taskId,title,description,status,due_date){
            this.loading.update = true
            try{
                const data = await updateTask(taskId,title,description,status,due_date)
                const index = this.tasks.findIndex((task)=>task.id===taskId)
                if (index !== -1){
                    this.tasks[index] = data.data
                }
                // await this.fetchTasks()  // If not use updated_at
            }catch(error){
                throw error
            }
            finally{
                this.loading.update = false
            }
        },
        async deleteTask(projectId,taskId){
            this.loading.delete = true
            try{
                const data = await deleteTask(taskId)
                await this.fetchTasks(projectId) //Refresh the task list after deletion
            }catch(error){
                throw error
            }
            finally{
                this.loading.delete = false
            }
        },
        async changePage(page){
            this.filters.page = page,
            this.fetchTasks()
        }
    }
})