import { apiFetch } from "./apiFetch";

export async function getProjects(query){
    const res = await apiFetch(`/api/projects?${query}`)
    const data = await res.json();
    if(!res.ok){
        throw ({
            status: res.status,
            message: data.message || "Failed to fetch projects",
            errors: data.errors
        })
    }
    return data
}

export async function showProjects(projectId){
    const res = await apiFetch(`/api/projects/${projectId}`)
    const data = await res.json();
    if(!res.ok){
        throw ({
            status: res.status,
            message: data.message || "Failed to show projects",
            errors: data.errors
        })
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
        throw ({
            status: res.status,
            message: data.message || "Failed to create projects",
            errors: data.errors
        })
    }
    return data
}

export async function updateProjects(projectId,name,description){
    const res = await apiFetch(`/api/projects/${projectId}`,{
        method: "PUT",
        body: JSON.stringify({
            name:name,
            description:description
        })
    })
    const data = await res.json();
    if(!res.ok){
        throw ({
            status: res.status,
            message: data.message || "Failed to update projects",
            errors: data.errors
        })
    }
    return data;
}

export async function deleteProject(projectId){
    const res = await apiFetch(`/api/projects/${projectId}`,{
        method: "DELETE"
    })
    const data = await res.json();
    if(!res.ok){
        throw ({
            status: res.status,
            message: data.message || "Failed to delete projects",
            errors: data.errors
        })
    }
    return data
}