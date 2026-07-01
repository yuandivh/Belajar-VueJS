import { apiFetch } from "./apiFetch";

export async function getUser() {
  const res = await apiFetch("/api/user");
  // console.log("getUser status: ",res.status)
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return data;
}

export async function login(email,password) {
  const res = await apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Log in failed");
  }
  return data;
}

export async function logout(){
    const res = await apiFetch("/api/logout", {
      method: "POST",
    });
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || "Log out failed");
    }
    return data;
}
