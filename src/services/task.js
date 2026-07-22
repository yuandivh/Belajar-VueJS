import { apiFetch } from "./apiFetch";

export async function getTasks(projectId,query){
    const res = await apiFetch(`/api/projects/${projectId}/tasks?${query}`)
    const data = await res.json()
    if(!res.ok){
        throw({
            status:res.status,
            messages:data.messages || "Failed to fetch tasks",
            errors:data.errors
        })
    }
    return data
}

export async function showTask(taskId){
    const res = await apiFetch(`/api/tasks/${taskId}`)
    const data = await res.json()
    if(!res.ok){
        throw({
            status:res.status,
            messages:data.messages || "Failed to fetch tasks",
            errors:data.errors
        })
    }
    return data
}

export async function createTask(projectId,title,description,status,due_date){
    const res = await apiFetch(`/api/projects/${projectId}/tasks`,{
        method: "POST",
        body: JSON.stringify({
            title: title,
            description: description,
            status: status,
            due_date: due_date
        })
    })
    const data = await res.json()
    if(!res.ok){
        throw({
            status: res.status,
            messages: data.messages || "Failed to create task",
            errors: data.errors
        })
    }
    return data
}

export async function updateTask(taskId,title,description,status,due_date){
    const res = await apiFetch(`/api/tasks/${taskId}`,{
        method: "PUT",
        body: JSON.stringify({
            title: title,
            description: description,
            status: status,
            due_date: due_date
        })
    })
    const data = await res.json()
    if(!res.ok){
        throw({
            status: res.status,
            messages: data.messages || "Failed to create task",
            errors: data.errors
        })
    }
    return data
}

export async function deleteTask(taskId){
    const res = await apiFetch(`/api/tasks/${taskId}`,{
        method: "DELETE"
    })
    const data = await res.json()
    if(!res.ok){
        throw({
            status: res.status,
            messages: data.messages || "Failed to delete task",
            errors: data.errors
        })
    }
    return data
}