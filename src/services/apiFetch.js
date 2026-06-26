import { useRouter } from "vue-router";

const router = useRouter();

const BASE_URL = "http://127.0.0.1:8000";

export async function apiFetch(endpoints, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${endpoints}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if(response.status === 401){
    localStorage.removeItem("token")
    router.push({name: "login"});
  }

  return response;
}
