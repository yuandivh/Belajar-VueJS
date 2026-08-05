import { useAuthStore } from "../stores/auth";
import router from "../router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
let refreshPromise = null;

async function sendRequest(endpoints, options = {}, token = null) {
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
  return response;
}

export async function apiFetch(endpoints, options = {}) {
  const auth = useAuthStore();
  let token = auth.token;
  let response = await sendRequest(endpoints, options, token);

  if (response.status === 401 && !endpoints.includes("/api/refresh")) {
    try {
      if (!refreshPromise) {
        refreshPromise = auth.refreshToken().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      token = auth.token;
      response = await sendRequest(endpoints, options, token);
    } catch (error) {
      auth.clearAuth();
      router.push({
        name: "login",
      });
      throw new Error("Session expired");
    }
  }
  return response;
}
