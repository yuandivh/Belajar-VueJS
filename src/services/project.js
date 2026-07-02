import { apiFetch } from "./apiFetch";

export async function getProjects(){
    const res = await apiFetch("/api/projects")
    const data = await res.json();
    if(!res.ok){
        throw new Error ("Failed to fetch projects")
    }
    return data
    console.log(data.data)
}

export async function showProjects(id){
    const res = await apiFetch(`/api/projects/${id}`)
    const data = await res.json();
    if(!res.ok){
        throw new Error ("Failed to fetch project")
    }
    return data
}

export async function createProjects(name,description){
    const res = await apiFetch("/api/projects",{
        method: "POST",
        body: JSON.stringify({
            name: name,
            description: description
        })
    })
    const data = await res.json();
    if(!res.ok){
        throw new Error ("Failed to fetch projects")
    }
    return data
}

export async function updateProjects(id,name,description){
    const res = await apiFetch(`/api/projects/${id}`,{
        method: "PUT",
        body: JSON.stringify({
            name:name,
            description:description
        })
    })
    const data = await res.json();
    if(!res.ok){
        throw new Error (data.message || "Failed to update project")
    }
    return data;
}

export async function deleteProject(id){
    const res = await apiFetch(`/api/projects/${id}`,{
        method: "DELETE"
    })
    const data = await res.json();
    if(!res.ok){
        throw new Error ("Failed to delete project")
    }
    return data
}