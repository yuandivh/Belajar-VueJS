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

export async function showProjects(id){
    const res = await apiFetch(`/api/projects/${id}`)
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
        throw ({
            status: res.status,
            message: data.message || "Failed to update projects",
            errors: data.errors
        })
    }
    return data;
}

export async function deleteProject(id){
    const res = await apiFetch(`/api/projects/${id}`,{
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