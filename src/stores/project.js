import { defineStore } from "pinia";
import { getProjects, deleteProject, createProjects, updateProjects } from "../services/project";

export const useProjectStore = defineStore("project",{
    state: ()=>({
        projects:[],
        loading: false,
        loadingDelete:false,
        loadingCreate:false,
        loadingUpdate:false
    }) ,
    actions:{
        async fetchProjects(){
            this.loading = true;
            try{
                const data = await getProjects();
                this.projects = data.data;
            }catch(error){
                this.projects = [];
                throw error
            }
            finally{
                this.loading = false;
            }
        },
        async createProject(name,description){
            this.loadingCreate = true;
            try{
                const data = await createProjects(name,description);
                this.projects.push(data.data);
            }catch(error){
                throw error
            }finally{
                this.loadingCreate = false;
            }
        },
        async updateProject(id,name,description){
            this.loadingUpdate = true
            try{
                const data = await updateProjects(id,name,description);
                const index = this.projects.findIndex(project => project.id === id)
                if (index !== -1){
                    this.projects[index] = data.data;
                }
            }catch(error){
                throw error
            }finally{
                this.loadingUpdate = false;
            }
        },
        async deleteProject(projectId){
            this.loadingDelete = true;
            try{
                await deleteProject(projectId);
                this.projects = this.projects.filter(project => project.id !== projectId);
            } catch(error){
                throw error
            }finally{
                this.loadingDelete = false;
            }
        }
    },
    getters:{
        totalProjects: (state)=>state.projects.length,
        completedProjects: (state)=>state.projects.filter(project =>project.completed).length,
        pendingProjects: (state)=>state.projects.filter(project =>!project.completed).length,
    }
});