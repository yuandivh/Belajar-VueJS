import { defineStore } from "pinia";
import { getProjects, deleteProject, createProjects } from "../services/project";

export const useProjectStore = defineStore("project",{
    state: ()=>({
        projects:[],
        loading: false,
        loadingDelete:false,
        loadingCreate:false
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


    }
});